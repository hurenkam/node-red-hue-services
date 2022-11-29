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

        var resource = this.getResource(this.config.uuid);
        if ((resource) && (resource.item) && (resource.item.motion)) {
            if (resource.item.motion.motion!=null) {
                fill = (resource.item.motion.motion==true)? "blue" : "grey";
                text = (resource.item.motion.motion==true)? "motion" : "no motion";
            }
        }

        this.status({fill: fill, shape: shape, text: text});
    }
}

module.exports = MotionNode;
