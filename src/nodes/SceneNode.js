ResourceNode = require("./ResourceNode");

class SceneNode extends ResourceNode {
    constructor(config) {
        super(config,"scene");
        console.log("SceneNode[" + this.logid() + "].constructor()");
    }
}

module.exports = SceneNode;
