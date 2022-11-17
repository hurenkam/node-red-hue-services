Resource = require("../clip/Resource");
ServiceListResource = require("../clip/ServiceListResource");
ResourceNode = require("./ResourceNode");

class ServiceListNode extends ResourceNode {
    constructor(config,rtype=null) {
        super(config,rtype);
        console.log("ServiceListNode[" + this.logid() + "].constructor()");
    }

    onStartup() {
        console.log("ServiceListNode[" + this.logid() + "].onStartup()");
        var instance = this;

        // subscribe to events originating from services in the list
        this._onServiceUpdate = function(event) {
            try {
                instance.onServicesUpdate(event);
            } catch (error) {
                console.log(error);
            }
        };

        if ((this.resource.rids) && (this.resource.services)) {
            this.resource.rids.forEach((rid) => {
                instance.resource.services[rid].on('update',instance._onServiceUpdate);
            });
        }

        super.onStartup();
    }

    onClose() {
        var instance = this;
        if ((this.resource.rids) && (this.resource.services)) {
            this.resource.rids.forEach((rid) => {
                instance.resource.services[rid].off('update',instance._onServiceUpdate);
            });
        }

        super.onClose();
    }

    onServicesUpdate(event) {
        var msg = [];
        var index = 0;

        console.log("ServiceListNode.onServicesUpdate() uuid:",this.config.uuid);
        var services = this.clip.getSortedServicesById(this.config.uuid);
        if (services) {

            // Find the service that matches the resource id,
            // and update index and msg accordingly
            while ((index < services.length) && (services[index].rid() != event.id)) {
                if (this.config.multi) msg.push(null);
                index += 1;
            }

            // if resource id was found then send the message
            if (index < services.length) {
                msg.push({ index: index, payload: event });
                this.send(msg);
            }
        }
    }

    onInput(msg) {
        console.log("ServiceListNode[" + this.logid() + "].onInput()");

        if ((this.resource) && (this.resource.rids) && (this.resource.services)) {

            if (msg.rtypes) {
                this.resource.rids.forEach((rid) => {
                    if (msg.rtypes.includes(this.resource.services[rid].rtype())) {
                        this.resource.services[rid].put(msg.payload);
                    }
                });
            }

            if (msg.rids) {
                this.resource.rids.forEach((rid) => {
                    if (msg.rids.includes(rid)) {
                        this.resource.services[rid].put(msg.payload);
                    }
                });
            }

        } else {
            console.log("ServiceListNode[" + this.logid() + "].onInput(): Unable to forward message to services.");
        }

        super.onInput(msg);
    }
}

module.exports = ServiceListNode;
