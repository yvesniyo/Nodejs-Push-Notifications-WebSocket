const push = require("../push"),
    express = require('express'),
    router = express.Router()
    Notification = require("../models/Notification");
router.get("/test",function(req,res,next){
    
})
router.get("/", function (req, res, next) {
    push.broadcast(JSON.stringify({
        id: req.query.id,
        title: req.query.title,
        msg: req.query.msg,
        image: req.query.image,
        biggestImage: req.query.biggestImage == "true" ? true : false,
        smallImage: req.query.smallImage == "true" ? true : false,
        isNotification: true,
    }));
    return res.send("done");
});

router.post("/broadcast", function (req, res, next) {
    push.broadcast(incomingNotification(req));
    return res.send("done");
});
router.post("/broadcast/user_type", function (req, res, next) {
    let user_type = req.body.user_type;
    push.sendMessageToUserType(user_type, incomingNotification(req));
    return res.send("done");
})

router.post("/push/user_type/user_id", function (req, res, next) {
    let user_id = req.body.user_id;
    let user_type = req.body.user_type;
    push.sendUserMessage(user_type, user_id, incomingNotification(req));
    return res.send("done");
})

router.post("/push/json_array",(req,res,next)=>{
    let json_array = JSON.parse(req.body.json);
    let prefix = req.body.type_prefix;
    let msgs = json_array;
    msgs.forEach((msg)=>{
        let user_type = msg.user_type;
        msg.isNotification = true;
        push.sendUserMessage(user_type, msg.user_id, JSON.stringify(msg));
    });
    return res.send("done");
})

function incomingNotification(req) {
    return JSON.stringify({
        id: req.body.id,
        title: req.body.title,
        msg: req.body.msg,
        image: req.body.image,
        biggestImage: req.body.biggestImage == "true" ? true : false,
        smallImage: req.body.smallImage == "true" ? true : false,
        isNotification: true,
    });
}


module.exports = router;
