const events = require('events');

class Resource extends events.EventEmitter {
    constructor(item) {
        super();
        this.item = item;
        //console.log("Resource["+this.rtype()+","+this.id()+"].constructor()");
    }

    id() {
        return (this.item.name? this.item.name : ((this.item.metadata) && (this.item.metadata.name))? this.item.metadata.name : this.item.id);
    }

    rid() {
        return this.item.id;
    }

    rtype() {
        return this.item.type;
    }

    name() {
        return (this.item.name? this.item.name : ((this.item.metadata) && (this.item.metadata.name))? this.item.metadata.name : null);
    }

    destructor() {
        //console.log("Resource["+this.rtype()+","+this.id()+"].destructor()");
        this.removeAllListeners();
        this.id = null;
    }

    put(data) {
        console.log("Resource["+this.rtype()+","+this.id()+"].put()");
        //console.log(data);
        this.emit('put',data);
    }

    onEvent(event) {
        //console.log("Resource["+this.rtype()+","+this.id()+"].onEvent()");
        this.updateStatus(event);
        this.emit('update',event);
    }

    updateStatus(event) {
        //console.log("Resource["+this.rtype()+","+this.id()+"].updateStatus()");
        const blacklist = ["id", "id_v1", "owner", "type"];

        var instance = this;
        Object.keys(event).forEach((key) => {
            if (!blacklist.includes(key)) {
                //console.log(key+":",event[key]);
                instance.item[key] = event[key];
            }
        });
    }
}

module.exports = Resource;
