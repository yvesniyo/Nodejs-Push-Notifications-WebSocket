const express = require("express"),
  http = require("http"),
  WebSocket = require("ws"),
  app = express(),
  url = require("url"),
  push = require("./push.js"),
  socketHelper = require("./socketHelper.js"),
  querystring = require("querystring"),
  routes = require('./routes/index'),
  server = http.createServer(app),
  PORT_SOCKET = 8999,
  DEBUG = false,
  logs = require("./logger/index"),
  webSocket = new WebSocket.Server({ server: server, port: PORT_SOCKET }),
  cors = require('cors'),
  bodyParser = require('body-parser'),
  UserModel = require("./models/User"),
  UserTypesModel = require("./models/UserTypes");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

webSocket.on("connection", function (ws, req, client) {
  req.query = querystring.parse(url.parse(req.url).query);
  let user_id = req.query.id;
  let user_type = req.query.user_type;
  socketHelper.setWss(webSocket);
  let joins = socketHelper.userJoin(user_type, user_id, ws);
  if (!joins) {
    ws.close();
    ws.terminate();
  } else {
    let not = new Notification();
    Notification.findAll({
      where: { status: "unseen", user_type: user_type, user_id: user_id },
    }).then((notifications) => {
      let msg = {
        reason: "retriveUnseen",
        counts: notifications.length,
        rows: notifications,
        user_type: user_type,
        user_id: user_id
      }
      push.sendUnseenNotification(user_type, user_id, JSON.stringify(msg));
    })

  }
});
function init_users_on_sockets() {
  UserModel.findAll({}, {}).then((users) => {
    console.log(JSON.stringify(users))
    let types = {};
    users.forEach(async (user) => {
      let user_outside_id = user.user_outside_id;
      let user_type_id = user.user_type_id;
      if (types[`${user_type_id}`] == undefined) {
        try {
          let user_type = await UserTypesModel.findOne({ where: { id: user_type_id } });
          if (user_type) {
            types[`${user_type_id}`] = {
              "user_type": user_type.name
            }
            socketHelper.userJoin(types[`${user_type_id}`]["user_type"], user_outside_id, null)
          }

        } catch (error) {
          console.log(error);
        }
      } else {
        socketHelper.userJoin(types[`${user_type_id}`]["user_type"], user_id, ws)
      }

    })
  })
  //socketHelper.userJoin(user_type, user_id, ws)
}
init_users_on_sockets();
app.use("/", routes);

let PORT = process.env.PORT || 8080;
server.listen(PORT, function () {
  console.log(`Server started on port ${PORT} && PORT_SOCKET on ${PORT_SOCKET}:)`);
});

module.exports = {
  DEBUG: DEBUG
}
