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
  bodyParser = require('body-parser');

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
    push.sendUserMessage(user_type, user_id, "Welcome " + user_type);
  }
});
// app.use(function (req, res, next) {
//   if (!req.get('authorization')) {
//     return res.status(403).json({ error: 'No credentials sent!' });
//   }
//   next();
// });
app.use("/", routes);

let PORT = process.env.PORT || 80;
server.listen(PORT, function () {
  console.log(`Server started on port ${PORT} && PORT_SOCKET on ${PORT_SOCKET}:)`);
});

module.exports = {
  DEBUG: DEBUG
}
