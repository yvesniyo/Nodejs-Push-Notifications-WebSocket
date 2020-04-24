var WebSocket = require("ws"),
    logs = require("./logger/index"),
    SocketHelper = require("./socketHelper")
    NotificationsModel = require("./models/Notification");
class Push {

    static async onMessage(user_type, user_id, msg) {
        logs.logI(`userOnMessage, ${user_type}, ${user_id}, ${msg}`)
        if (SocketHelper.user == null) return;
        if (this.isJson(msg)) {
            let income = JSON.parse(msg);
            if (income.type == "seen") {
                let uuid = income.uuid;
                try {
                    await NotificationsModel.update({ "status": "seen" }, { where: { uuid: uuid } });
                    msg = {
                        type: "seeing",
                        message: "ok",
                    }
                    Push.sendUserMessage(user_type, user_id, JSON.stringify(msg));
                } catch (error) {
                    console.log(error)
                }

            } else if (income.type == "retriveUnseen") {

                NotificationsModel.findAll({
                    where: { status: "unseen" }
                }).then((rows) => {
                    msg = {
                        type: "retriveUnseen",
                        counts: rows.length,
                        rows: rows,
                        user_type: user_type,
                        user_id: user_id
                    }
                    Push.sendUserMessage(user_type, user_id, JSON.stringify(msg));
                })
            }

        }
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
    static isJson(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }
    static uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    static async sendUnseenNotification(user_type, user_id, msg){
        let res = {
            "status": 200,
            "type": "notification",
            "data": JSON.parse(msg),
        }
        res = JSON.stringify(res)
        SocketHelper.user[user_type][user_id].ws.send(res);
    }

    static async sendUserMessage(user_type, user_id, msg) {
        let reason;
        if (this.isJson(msg)) {
            msg = JSON.parse(msg);
            reason = msg['reason'];
            if (msg.isNotification == true) {
                msg["user_type"] = user_type;
                msg["user_id"] = user_id;
                msg["uuid"] = this.uuidv4();
                try {
                    delete msg.id;
                    if(msg["others"] !== undefined){
                        msg["others"] = JSON.stringify(msg["others"]);
                    }
                    let notification = await NotificationsModel.create(msg);
                    
                    msg = notification;
                } catch (error) {
                    console.log(error)
                }

            }
            msg = JSON.stringify(msg);

            try {
                msg = JSON.parse(msg);
                let res = {
                    "status": 200,
                    "type": "notification",
                    "data": {
                        "reason": reason ,
                        "row": msg
                    },
                }
                if(!res["data"]["reason"]){
                    res["data"]["reason"] = "none";
                }
                res = JSON.stringify(res)
                SocketHelper.user[user_type][user_id].ws.send(res);
            } catch (error) {
    
            }
        }else{
            SocketHelper.user[user_type][user_id].ws.send(msg);
        }
        

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
