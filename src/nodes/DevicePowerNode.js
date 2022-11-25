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

        if ((this.resource.item.power_state) && (this.resource.item.power_state.battery_level!=null)) {
            fill = (this.resource.item.power_state.battery_level > 10)? "green" : "red";
            text = this.resource.item.power_state.battery_level+"%";
        }

        this.status({fill: fill, shape: shape, text: text});
    }
}

module.exports = DevicePowerNode;
