class Resource {
    constructor(RED,clip,config,rtype=null) {
        console.log("Resource[" + config.name + "].constructor()");
        this.config = config;
        this.clip = clip;
        this.rtype = rtype;
        RED.nodes.createNode(this,config);

        this.services = [];

        if (this.clip) {
            this.clip.once(this.config.uuid, (event) => this.onInitialUpdate(event) ); 
        }

        this.on('input', function(msg) { 
            console.log("Resource["+config.name+"].on('input')");
            this.onInput(msg); 
        });

        this.on('close', function() { 
            console.log("Resource["+config.name+"].on('close')");
            this.onClose(); 
        });
    }

    getStatusFill() {
        return null;
    }

    getStatusText() {
        return null;
    }

    getStatusShape() {
        return null;
    }

    updateStatus() {
        this.status({
            fill:  this.getStatusFill(), 
            shape: this.getStatusShape(), 
            text:  this.getStatusText()
        });
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
                    this.updateStatus();
                });
            });
        }
    }

    onUpdate(resource) {
        //console.log("Resource["+this.config.name+"].onUpdate()");
        //console.log(resource);

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

        this.updateStatus();
    }

    onInput(msg) {
        if ((this.rtype) && (this.config.uuid)) {
            const url = "/clip/v2/resource/" + this.rtype + "/" + this.config.uuid;
            this.clip.put(url,msg.payload);
        }

        if (msg.rids)
        {
            this.services.forEach(service => {
                if (msg.rids.includes(service.rid)) {
                    const url = "/clip/v2/resource/" + service.rtype + "/" + service.rid;
                    this.clip.put(url,msg.payload);
                }
            });
        } else if (msg.rtypes) {
            this.services.forEach(service => {
                if (msg.rtypes.includes(service.rtype)) {
                    const url = "/clip/v2/resource/" + service.rtype + "/" + service.rid;
                    this.clip.put(url,msg.payload);
                }
            });
        } else {
            this.services.forEach(service => {
                const url = "/clip/v2/resource/" + service.rtype + "/" + service.rid;
                this.clip.put(url,msg.payload);
            });
        }
    }

    onClose() {
        this.services = null;
        this.config = null;
        this.clip = null;
    }
}

module.exports = Resource;
