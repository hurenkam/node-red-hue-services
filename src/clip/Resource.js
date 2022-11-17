const events = require('events');

class Resource extends events.EventEmitter {
    constructor(item,clip) {
        super();
        this.item = item;
        this.clip = clip;
        console.log("Resource["+this.id()+"].constructor()");

        var instance = this;
        if (this.item.owner) {
            setTimeout(function () {
                if (Object.keys(instance.clip.resources).includes(instance.item.owner.rid)) {
                    instance.onOwnerAvailable(instance.item.owner.rid,instance.clip.resources[instance.item.owner.rid]);
                } else {
                    console.log("Resource[" + instance.id() + "].constructor(): Service "+instance.item.owner.rid+" not yet available.");
                }
            },100);
        }
    }

    id() {
        var id = this.rtype()+"/"+this.rid()
        var name = this.name();
        return id + (name? " ("+name+")":"");
    }

    rid() {
        return this.item.id;
    }

    rtype() {
        return this.item.type;
    }

    name() {
        if ((this.item.metadata) && (this.item.metadata.name))
            return this.item.metadata.name;

        if ((this.owner) && (this.owner.name())) {
            return this.owner.name();
        }

        return null;
    }

    typeName() {
        var result = this.rtype();
        if ((this.item.metadata) && (this.item.metadata.control_id))
            result += this.item.metadata.control_id;
        return result;
    }

    destructor() {
        console.log("Resource["+this.id()+"].destructor()");
        this.removeAllListeners();
        this.clip = null;
        this.item = null;
    }

    get() {
        console.log("Resource["+this.id()+"].get()");
        return clip.get(this.rtype(),this.rid());
    }

    put(data) {
        console.log("Resource["+this.id()+"].put()");
        this.clip.put(this.rtype(),this.rid(), data);
    }

    onOwnerAvailable(rid,service) {
        //console.log("ServiceListResource["+this.id()+"].onServiceAvailable("+rid+")");
        this.owner = service;
    }

    onEvent(event) {
        //console.log("Resource["+this.id()+"].onEvent()");
        this.updateStatus(event);
        this.emit('update',event);
    }

    updateStatus(event) {
        //console.log("Resource["+this.id()+"].updateStatus()");
        const blacklist = ["id", "id_v1", "owner", "type"];

        var instance = this;
        Object.keys(event).forEach((key) => {
            if (!blacklist.includes(key)) {
                instance.item[key] = event[key];
            }
        });
    }
}

module.exports = Resource;
