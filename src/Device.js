Resource = require("./Resource");

class Device extends Resource {
    constructor(RED,clip,config) {
        super(RED,clip,config,"device");
        console.log("Device[" + config.name + "].constructor()");

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

    onUpdate(resource) {
        //console.log("Device[" + this.config.name + "].onUpdate()");
        //console.log(resource);

        if (resource.type === "zigbee_connectivity") {
            this.zigbee_connectivity = resource.status;
        }

        if (resource.type === "device_power") {
            this.power_state = resource.power_state;
        }

        super.onUpdate(resource);
    }
}

module.exports = Device;
