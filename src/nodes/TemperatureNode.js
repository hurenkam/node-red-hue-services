ServiceNode = require("./ServiceNode");

class TemperatureNode extends ServiceNode {
    constructor(config) {
        super(config);
        console.log("TemperatureNode[" + this.logid() + "].constructor()");
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
        if ((resource) && (resource.item) && (resource.item.temperature)) {
            if (resource.item.temperature.temperature!=null) {
                fill = "green";
                text = ""+resource.item.temperature.temperature+"c";
            }
        }

        this.status({fill: fill, shape: shape, text: text});
    }
}

module.exports = TemperatureNode;
