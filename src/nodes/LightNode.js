ServiceNode = require("./ServiceNode");

class LightNode extends ServiceNode {
    constructor(config) {
        super(config);
        console.log("LightNode[" + this.logid() + "].constructor()");
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

        if (this.resource.item.on) {
            if (this.resource.item.on.on==true) {
                fill = "yellow";

                if (this.resource.item.dimming) {
                    text = this.resource.item.dimming.brightness+"%";
                }

            } else if (this.resource.item.on.on==false) {
                fill = "grey";
                text = "off";
            }
        }

        this.status({fill: fill, shape: shape, text: text});
     }
}

module.exports = LightNode;
