ServiceNode = require("./ServiceNode");

class MotionNode extends ServiceNode {
    constructor(config) {
        super(config);
        console.log("MotionNode[" + this.logid() + "].constructor()");
    }
}

module.exports = MotionNode;
