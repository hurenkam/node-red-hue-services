ResourceNode = require("./ResourceNode");

class ServiceNode extends ResourceNode {
    constructor(config) {
        super(config,"scene");
        console.log("ServiceNode[" + this.logid() + "].constructor()");
    }
}

module.exports = ServiceNode;
