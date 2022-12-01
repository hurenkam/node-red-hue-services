ServiceNode = require("./ServiceNode");

class DevicePowerNode extends ServiceNode {
    constructor(config) {
        super(config);
        console.log("DevicePowerNode[" + this.logid() + "].constructor()");
    }

    onUpdate(event) {
        this.updateStatus();
        super.onUpdate(event);
    }

    updateStatus() {
        super.updateStatus();

        var fill = "grey";
        var shape = "dot";
        var text = "";

        var resource = this.resource();
        if ((resource) && (resource.item()) && (resource.item().power_state) && (resource.item().power_state.battery_level!=null)) {
            fill = (resource.item().power_state.battery_level > 10)? "green" : "red";
            text = resource.item().power_state.battery_level+"%";
        }

        this.status({fill: fill, shape: shape, text: text});
    }
}

module.exports = DevicePowerNode;
