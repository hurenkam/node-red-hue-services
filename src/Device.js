class Device {
    constructor(RED,clip,config) {
        console.log("Device[" + config.name + "].constructor()");
        this.config = config;
        this.clip = clip;
        RED.nodes.createNode(this,config);

        this.services = [];

        this.power_state = null;
        this.zigbee_connectivity = null;

        this.clip.once(this.config.uuid, (event) => {
            console.log("Device["+config.name+"].once(" + this.config.uuid + ")");
            console.log(event);

            this.services = event.resource.services;
            this.services.forEach((service) => {
                this.clip.on(service.rid, (event) => {
                    //console.log("Device["+config.name+"].on(" + service.rid + ")");
                    //console.log(event);
                    this.onUpdate(event.resource);
                    this.updateStatus();
                });
            });
        })

        const local = this;
        this.on('input', function(msg) { 
            local.onInput(msg); 
        });

        this.on('close', function() { 
            local.onClose(); 
        });
    }

    getStatusFill() {
        if (this.power_state!=null) {
            if (this.power_state.battery_state === "normal") {
                return "green";
            } else {
                return "red";
            }
        }

        return "grey";
    }

    getStatusText() {
        if (this.power_state!=null) {
            return this.power_state.battery_level + "%";
        }

        return "";
    }

    getStatusShape() {
        if (this.zigbee_connectivity==="connected") {
            return "dot";
        }

        return "ring";
    }

    updateStatus() {
        //console.log("Device[" + this.config.name + "].updateStatus()");
        
        this.status({
            fill:  this.getStatusFill(), 
            shape: this.getStatusShape(), 
            text:  this.getStatusText()
        });
    }

    onUpdate(resource) {
        //console.log("Device[" + this.config.name + "].onUpdate()");
        //console.log(resource);

        if ((!resource.startup) || (resource.startup === false)) {
            var msg = [];
            var index = 0;

            // Find the service that matches the resource id,
            // and update index and msg accordingly
            while ((index < this.services.length) && (this.services[index].rid != resource.id)) {
                if (this.multi) msg.push(null);
                index += 1;
            }

            // if resource id was found then send the message
            if (index < this.services.length) {
                msg.push({ index: index, payload: resource });
                this.send(msg);
            }
        }

        if (resource.type === "zigbee_connectivity") {
            this.zigbee_connectivity = resource.status;
        }

        if (resource.type === "device_power") {
            this.power_state = resource.power_state;
        }
    }

    onInput(msg) {
        //console.log("Device["+this.name+"].onInput()");
        //console.log(msg);

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
        //console.log("Device["+this.name+"].onClose()");
        this.config = null;
        this.clip = null;
        this.services = null;
    }
}

module.exports = Device;
