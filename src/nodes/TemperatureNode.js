ServiceNode = require("./ServiceNode");

class TemperatureNode extends ServiceNode {
    constructor(config) {
        super(config);
        console.log("TemperatureNode[" + this.logid() + "].constructor()");
    }
}

module.exports = TemperatureNode;
