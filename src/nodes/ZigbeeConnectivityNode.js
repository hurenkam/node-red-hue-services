ServiceNode = require("./ServiceNode");

class ZigbeeConnectivityNode extends ServiceNode {
    constructor(config) {
        super(config);
        console.log("ZigbeeConnectivityNode[" + this.logid() + "].constructor()");
    }
}

module.exports = ZigbeeConnectivityNode;
