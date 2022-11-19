ServiceNode = require("./ServiceNode");

class DevicePowerNode extends ServiceNode {
    constructor(config) {
        super(config);
        console.log("DevicePowerNode[" + this.logid() + "].constructor()");
    }
}

module.exports = DevicePowerNode;
