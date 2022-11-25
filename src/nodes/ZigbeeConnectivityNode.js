ServiceNode = require("./ServiceNode");

class ZigbeeConnectivityNode extends ServiceNode {
    constructor(config) {
        super(config);
        console.log("ZigbeeConnectivityNode[" + this.logid() + "].constructor()");
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

        console.log("ZigbeeConnectivityNode[" + this.logid() + "].updateStatus()");
        console.log(this.resource.item);
        if (this.resource.item.status!=null) {
            fill = (this.resource.item.status == "connected")? "green": "red";
            text = this.resource.item.status;
        }

        this.status({fill: fill, shape: shape, text: text});
    }
}

module.exports = ZigbeeConnectivityNode;
