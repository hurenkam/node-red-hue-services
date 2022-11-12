const events = require('events');

class Resource extends events.EventEmitter {
    constructor(item) {
        super();
        this.item = item;
        console.log("Resource["+this.rtype()+","+this.id()+"].constructor()");
        //console.log(item);
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
        console.log("Resource["+this.rtype()+","+this.id()+"].destructor()");
        this.id = null;
    }

    put(data) {
        console.log("Resource["+this.rtype()+","+this.id()+"].put()");
        //console.log(data);
        this.emit('put',data);
    }

    onEvent(event) {
        console.log("Resource["+this.rtype()+","+this.id()+"].onEvent()");
        //console.log(event);
        this.emit('update',event);
    }
}

module.exports = Resource;
