Resource = require("../clip/Resource");
ServiceListResource = require("../clip/ServiceListResource");
BaseNode = require("./BaseNode");

class ResourceNode extends BaseNode {
    constructor(config,rtype=null) {
        console.log("ResourceNode[" + config.name + "].constructor()");
        super(config);
        this.config = config;
        this.rtype = rtype;

        var instance = this;
        this.clip = BaseNode.nodeAPI.nodes.getNode(config.bridge).clip;
        //this.clip.on('started',() => {
        //    instance.onClipStarted();
        //});
        setTimeout(()=> {
            instance.onClipStarted();
        },5000);
    }

    onClipStarted() {
        console.log("ResourceNode[" + this.config.name + "].onStartup()");
        this.resource = this.clip.resources[this.config.uuid];
        this.onStartup();
    }

    onStartup() {
        console.log("ResourceNode[" + this.config.name + "].onStartup()");

        var instance = this;
        this.resource.on('update',function (event) {
            instance.onUpdate(event);
        });

        if ((this.resource.rids) && (this.resource.services)) {
            this.resource.rids.forEach((rid) => {
                instance.resource.services[rid].on('update',function (event) {
                    instance.onUpdate(event);
                });
            });
        }

        this.updateStatus();
    }

    onUpdate(event) {
        console.log("ResourceNode["+this.config.name+"].onUpdate()");
        //console.log(event);

        this.onServicesUpdate(event);
        this.updateStatus();
    }

    onServicesUpdate(event) {
        var msg = [];
        var index = 0;

        // Find the service that matches the resource id,
        // and update index and msg accordingly
        if ((this.resource.rids) && (this.resource.services)) {
            while ((index < this.resource.rids.length) && (this.resource.rids[index] != event.id)) {
                if (this.config.multi) msg.push(null);
                index += 1;
            }

            // if resource id was found then send the message
            if (index < this.resource.rids.length) {
                msg.push({ index: index, payload: event });
                this.send(msg);
            }
        }
    }

    onInput(msg) {
        console.log("ResourceNode[" + this.config.name + "].onInput()");
        //console.log(msg);

        if (msg.rtypes) {
            if ((this.resource) && (msg.rtypes.includes(this.resource.rtype()))) {
                this.resource.put(msg.payload);
            }

            if ((this.resource) && (this.resource.rids) && (this.resource.rids.length > 0)) {
                this.resource.rids.forEach((rid) => {
                    if (this.resource.services[rid]) {
                        this.resource.services[rid].put(msg.payload);
                    } else {
                        console.log("ResourceNode[" + this.config.name + "].onInput(): Unable to forward message to services.");
                    }
                });
            }
        }

        if (msg.rids) {
            if ((this.resource) && (msg.rids.includes(this.resource.rid()))) {
                this.resource.put(msg.payload);
            }

            if ((this.resource) && (this.resource.rids) && (this.resource.services)) {
                this.resource.rids.forEach((rid) => {
                    if (msg.rids.includes(rid)) {
                        this.resource.services[rid].put(msg.payload);
                    }
                });
            }
        }
        super.onInput(msg);
    }

    onClose() {
        this.clip = null;
        this.config = null;
        this.rtype = null;
        super.onClose();
    }
}

module.exports = ResourceNode;
