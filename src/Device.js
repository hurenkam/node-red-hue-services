Resource = require("./Resource");

class Device extends Resource {
    constructor(RED,clip,config) {
        super(RED,clip,config);
        console.log("Device[" + config.name + "].constructor()");

        this.services = [];

        this.power_state = null;
        this.zigbee_connectivity = null;
    }

    getStatusFill() {
        if (this.power_state!=null) {
            if (this.power_state.battery_state === "normal") {
                return "green";
            } else {
                return "red";
            }
        }
        return super.getStatusFill();
    }

    getStatusText() {
        if (this.power_state!=null) {
            return this.power_state.battery_level + "%";
        }
        return super.getStatusText();
    }

    getStatusShape() {
        if (this.zigbee_connectivity==="connected") {
            return "dot";
        }
        return super.getStatusShape();
    }

    onInitialUpdate(event) {
        super.onInitialUpdate(event);

        this.services = this.clip.getSortedDeviceServices(this.config.uuid);

        this.services.forEach((service) => {
            this.clip.on(service.rid, (event) => {
                //console.log("Device["+config.name+"].clip.on(" + service.rid + ")");
                //console.log(event);
                this.onUpdate(event.resource);
                this.updateStatus();
            });
        });
    }

    onUpdate(resource) {
        //console.log("Device[" + this.config.name + "].onUpdate()");
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

        if (resource.type === "zigbee_connectivity") {
            this.zigbee_connectivity = resource.status;
        }

        if (resource.type === "device_power") {
            this.power_state = resource.power_state;
        }

        super.onUpdate(resource);
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

        super.onInput(msg);
    }

    onClose() {
        //console.log("Device["+this.name+"].onClose()");
        this.services = null;
        super.onClose();
    }
}

module.exports = Device;
