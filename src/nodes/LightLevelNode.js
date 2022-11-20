ServiceNode = require("./ServiceNode");

class LightLevelNode extends ServiceNode {
    constructor(config) {
        super(config);
        console.log("LightLevelNode[" + this.logid() + "].constructor()");
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

        if (this.resource.item.light) {
            if (this.resource.item.light.light_level!=null) {
                fill = "blue";
                text = ""+this.resource.item.light.light_level;
            }
        }

        this.status({fill: fill, shape: shape, text: text});
    }
}

module.exports = LightLevelNode;
