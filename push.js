var WebSocket = require("ws"),
    logs = require("./logger/index"),
    notification = require("./notification/model"),
    SocketHelper = require("./socketHelper");
class Push {

    static onMessage(user_type, user_id, msg) {
        logs.logI(`userOnMessage, ${user_type}, ${user_id}, ${msg}`)
        if (SocketHelper.user == null) return;
        this.sendMessageToUserType(user_type, "Message Group =" + msg);
    }
    static onClose(user_type, user_id) {
        SocketHelper.user[user_type][user_id].ws.close();
        SocketHelper.user[user_type][user_id].ws.terminate();
        SocketHelper.user[user_type][user_id].status = "offline";
    }

    static sendMessageToUserType(user_type, msg) {
        if (!SocketHelper.user || !SocketHelper.user[user_type]) return;
        let users = SocketHelper.user[user_type];
        Object.keys(users).forEach(user_id => {
            this.sendUserMessage(user_type, user_id, msg);
        });
    }

    static sendUserMessage(user_type, user_id, msg) {
        if (SocketHelper.user == null) return;
        let Notification = new notification(1,msg,"unsent","uknown",user_id,new Date());
        logs.logI(`sendUserMessage, ${user_type}, ${user_id}, ${msg}`)
        SocketHelper.user[user_type][user_id].ws.send(msg);
        // console.log(Notification);
    }

    static broadcast(msg) {
        if (SocketHelper.user == null) return;
        Object.keys(SocketHelper.user).forEach(user_type => {
            Object.keys(SocketHelper.user[user_type]).forEach(user_id => {
                this.sendUserMessage(user_type, user_id, msg);
            });
        });
    }
}

module.exports = Push;
