ResourceNode = require("./ResourceNode");

class SceneNode extends ResourceNode {
    constructor(config) {
        super(config,"scene");
        console.log("SceneNode[" + config.name + "].constructor()");
    }
}

module.exports = SceneNode;
