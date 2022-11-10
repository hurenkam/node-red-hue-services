BaseNode = require("./BaseNode");

class ResourceNode extends BaseNode {
    constructor(config,rtype=null) {
        super(config);
        console.log("ResourceNode[" + config.name + "].constructor()");
        this.config = config;
        this.clip =  BaseNode.nodeAPI.nodes.getNode(config.bridge).clip;
        this.rtype = rtype;

        this.services = [];

        if (this.clip) {
            this.clip.once(this.config.uuid, (event) => this.onInitialUpdate(event) ); 
        }
    }

    onInitialUpdate(event) {
        console.log("Resource["+this.config.name+"].onInitialUpdate(" + this.config.uuid + ")");
        console.log(event);

        this.services = this.clip.getSortedDeviceServices(this.config.uuid,this.rtype);
        console.log(this.services)

        if (this.services) {
            this.services.forEach((service) => {
                this.clip.on(service.rid, (event) => {
                    //console.log("Resource["+this.config.name+"].clip.on(" + service.rid + ")");
                    //console.log(event);
                    this.onUpdate(event.resource);
                });
            });
        }
    }

    onUpdate(resource) {
        //console.log("Resource["+this.config.name+"].onUpdate()");
        //console.log(resource);

        this.onServicesUpdate(resource);
        this.updateStatus();
    }

    onServicesUpdate(resource) {
        var msg = [];
        var index = 0;

        // Find the service that matches the resource id,
        // and update index and msg accordingly
        if (this.services) {
            while ((index < this.services.length) && (this.services[index].rid != resource.id)) {
                if (this.config.multi) msg.push(null);
                index += 1;
            }

            // if resource id was found then send the message
            if (index < this.services.length) {
                msg.push({ index: index, payload: resource });
                this.send(msg);
            }
        }

    }

    onInput(msg) {
        if (msg.rids) {
            if (msg.rids.includes(this.uuid) && (this.config.rtype)) {
                const url = "/clip/v2/resource/" + this.rtype + "/" + this.config.uuid;
                this.clip.put(url,msg.payload);
            }

            this.services.forEach(service => {
                if (msg.rids.includes(service.rid)) {
                    const url = "/clip/v2/resource/" + service.rtype + "/" + service.rid;
                    this.clip.put(url,msg.payload);
                }
            });
        }

        if (msg.rtypes) {
            if (msg.rtypes.includes(this.rtype) && (this.config.uuid)) {
                const url = "/clip/v2/resource/" + this.rtype + "/" + this.config.uuid;
                this.clip.put(url,msg.payload);
            }

            this.services.forEach(service => {
                if (msg.rtypes.includes(service.rtype)) {
                    const url = "/clip/v2/resource/" + service.rtype + "/" + service.rid;
                    this.clip.put(url,msg.payload);
                }
            });
        }

        super.onInput(msg);
    }

    onClose() {
        this.services = null;
        this.clip = null;
        super.onClose();
    }
}

module.exports = ResourceNode;
