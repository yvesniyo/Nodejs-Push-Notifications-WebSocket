class SocketHelper{
    static init(){
        if(SocketHelper.push == null){
            SocketHelper.push = require("./push.js");
        }
    }
    static setWss(wss){
        SocketHelper.init();
        SocketHelper.wss = wss;
    }

    static userJoin(user_type,user_id,ws){
        SocketHelper.init();
        ws.on("message", function(msg){
           SocketHelper.push.onMessage(user_type,user_id,msg);
        });
        ws.on("close", (msg)=>{
            SocketHelper.userClose(user_type,user_id);
        });
        SocketHelper.user = SocketHelper.user || {};
        SocketHelper.user[user_type] = SocketHelper.user[user_type] || {};
        SocketHelper.user[user_type][user_id] = SocketHelper.user[user_type][user_id] || {};
        SocketHelper.user[user_type][user_id].id = user_id;
        SocketHelper.user[user_type][user_id].user_type = user_type;
        SocketHelper.user[user_type][user_id].ws = ws;
        SocketHelper.user[user_type][user_id].status = "online"
        return true
        
    }

    static userClose(user_type,user_id){
        SocketHelper.init();
        SocketHelper.user[user_type][user_id].ws.close();
        SocketHelper.user[user_type][user_id].ws.terminate();
        SocketHelper.user[user_type][user_id].status = "offline";
    }
    static initUsers(){
        SocketHelper.init();
        SocketHelper.user = {
            "phoneClient" : {
                "7" : {
                    id : 7,
                    user_type : 'phoneClient',
                    ws : null,
                    status : "offline",
                },
                "8" : {
                    id : 8,
                    user_type : 'phoneClient',
                    ws : null,
                    status : "offline",
                },
            },
            "phoneAdmin" : {
                "1" : {
                    id : 1,
                    user_type : 'phoneAdmin',
                    ws : null,
                    status : "offline",
                },
            }
        }
    }

    

}

module.exports = SocketHelper;