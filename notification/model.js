class Notification{
    _id;
    _msg;
    _status;
    _from;
    _to;
    _date;
    constructor(id,msg,status,from,to,date){
        this._id = id;
        this._msg = msg;
        this._status = status;
        this._from = from;
        this._to = to;
        this._date = date;
    }
    get id(){
        return this._id;
    }
    get msg(){
        return this._msg;
    }
    get status(){
        return this._status;
    }
    get from(){
        return this._from;
    }
    get to(){
        return this._to;
    }
    get date(){
        return this._date;
    }
}

module.exports = Notification;