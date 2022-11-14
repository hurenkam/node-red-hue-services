ServiceListNode = require("./ServiceListNode");

class DeviceNode extends ServiceListNode {
    constructor(config) {
        super(config,"device");
        console.log("DeviceNode[" + this.logid() + "].constructor()");
    }

    onStartup() {
        super.onStartup();
        console.log("DeviceNode[" + this.logid() + "].onStartup()");
        var instance = this;

        this._onPowerUpdate = function(event) {
            try {
                instance.onPowerUpdate(event);
            } catch (error) {
                console.log(error);
            }
        }

        this._onConnectivityUpdate = function(event) {
            try {
                instance.onConnectivityUpdate(event);
            } catch (error) {
                console.log(error);
            }
        }

        var power = this.resource.getServicesByType("device_power")[0];
        var connectivity = this.resource.getServicesByType("zigbee_connectivity")[0];

        if (power) {
            this.onPowerUpdate(power.item);
            power.on('update',this._onPowerUpdate);
        }

        if (connectivity) {
            this.onConnectivityUpdate(connectivity.item);
            connectivity.on('update',this._onConnectivityUpdate);
        }
    }

    onClose() {
        var power = this.resource.getServicesByType("device_power")[0];
        var connectivity = this.resource.getServicesByType("zigbee_connectivity")[0];

        power.off('update',this._onPowerUpdate);
        connectivity.off('update',this._onConnectivityUpdate);

        super.onClose();
    }

    onPowerUpdate(event) {
        console.log("DeviceNode[" + this.logid() + "].onPowerUpdate(",event.power_state,")");
        this.power_state = event.power_state;
        this.updateStatus();
    }

    onConnectivityUpdate(event) {
        console.log("DeviceNode[" + this.logid() + "].onConnectivityUpdate(",event.status,")");
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
