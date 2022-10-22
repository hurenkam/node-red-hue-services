class Device {
    constructor(node,config,bridge) {
        this.name = config.name;
        //console.log("Device["+this.name+"].constructor()");
        this.node = node;
        this.config = config;
        this.uuid = config.uuid;
        this.multi = config.multi;
        this.services = [];
        this.bridge = bridge;
        this.url = "/clip/v2/resource/device/" + this.uuid;

        this.power_state = null;
        this.zigbee_connectivity = null;
        //console.log(this);

        setTimeout(() => {
            //console.log("Device["+this.name+"].constructor.onTimeout()");
            //console.log(this);
            this.services = this.bridge.getSortedDeviceServices(this.uuid);
            this.services.forEach(service => {
                this.bridge.subscribe(service.rid,this.onUpdate.bind(this));
            });
        }, 5000);
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
        this.node.status({
            fill:  this.getStatusFill(), 
            shape: this.getStatusShape(), 
            text:  this.getStatusText()
        });
    }

    onUpdate(resource) {
        //console.log("Device["+this.name+"].onUpdate()");
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
                this.node.send(msg);
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
                    this.bridge.put(url,msg.payload);
                }
            });
        } else if (msg.rtypes) {
            this.services.forEach(service => {
                if (msg.rtypes.includes(service.rtype)) {
                    const url = "/clip/v2/resource/" + service.rtype + "/" + service.rid;
                    this.bridge.put(url,msg.payload);
                }
            });
        } else {
            this.services.forEach(service => {
                const url = "/clip/v2/resource/" + service.rtype + "/" + service.rid;
                this.bridge.put(url,msg.payload);
            });
        }
    }

    onClose() {
        //console.log("Device["+this.name+"].onClose()");
        this.node = null;
        this.config = null;
        this.services = null;
        this.bridge = null;
    }
}

module.exports = Device;
