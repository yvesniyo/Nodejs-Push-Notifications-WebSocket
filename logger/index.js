
class logs{
    static DEBUG(){
        if(!logs.DEBUG){
            logs.DEBUG = require("../index").DEBUG
        }
        return logs.DEBUG;
    }
    static logE(msg){
        if(logs.DEBUG()) console.error(msg);
    }
    
    static logD(msg){
        if(logs.DEBUG()) console.debug(msg);
    }
    
    static logW(msg){
        if(logs.DEBUG()) console.warn(msg);
    }
    
    static logI(msg){
        if(logs.DEBUG()) console.info(msg);
    }
    
    static logL(msg){
        if(logs.DEBUG()) console.log(msg);
    }
    
}

module.exports = logs;