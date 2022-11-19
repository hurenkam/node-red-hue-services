ServiceNode = require("./ServiceNode");

class LightLevelNode extends ServiceNode {
    constructor(config) {
        super(config);
        console.log("LightLevelNode[" + this.logid() + "].constructor()");
    }
}

module.exports = LightLevelNode;
