ServiceListNode = require("./ServiceListNode");

class DeviceNode extends ServiceListNode {
    constructor(config) {
        console.log("DeviceNode[" + config.name + "].constructor()");
        super(config,"device");
    }

    onStartup() {
        super.onStartup();
        console.log("DeviceNode[" + this.config.name + "].onStartup()");

        var instance = this;
        var power = this.resource.getServicesByType("device_power")[0];
        if (power) {
            this.onPowerUpdate(power.item);
            power.on('update',function(event) {
                instance.onPowerUpdate(event);
            });
        }

        var connectivity = this.resource.getServicesByType("zigbee_connectivity")[0];
        if (connectivity) {
            this.onConnectivityUpdate(connectivity.item);
            connectivity.on('update',function(event) {
                instance.onConnectivityUpdate(event);
            });
        }
    }

    onPowerUpdate(event) {
        console.log("DeviceNode[" + this.config.name + "].onPowerUpdate(",event.power_state,")");
        this.power_state = event.power_state;
        this.updateStatus();
    }

    onConnectivityUpdate(event) {
        console.log("DeviceNode[" + this.config.name + "].onConnectivityUpdate(",event.status,")");
        console.log(event);
        this.zigbee_connectivity = event.status;
        this.updateStatus();
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
}

module.exports = DeviceNode;
