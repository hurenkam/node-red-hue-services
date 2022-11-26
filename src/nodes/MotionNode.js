ServiceNode = require("./ServiceNode");

class MotionNode extends ServiceNode {
    constructor(config) {
        super(config);
        console.log("MotionNode[" + this.logid() + "].constructor()");
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

        if (this.resource.item.motion) {
            if (this.resource.item.motion.motion!=null) {
                fill = (this.resource.item.motion.motion==true)? "blue" : "grey";
                text = (this.resource.item.motion.motion==true)? "motion" : "no motion";
            }
        }

        this.status({fill: fill, shape: shape, text: text});
    }
}

module.exports = MotionNode;
