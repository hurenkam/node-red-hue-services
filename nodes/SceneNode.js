module.exports = function(RED) {
    "use strict";

    Resource = require("../src/Resource");

    class SceneNode extends Resource {
        constructor(config) {
            super(RED,RED.nodes.getNode(config.bridge).clip,config,"scene");
            console.log("SceneNode[" + config.name + "].constructor()");
        }
    }

    RED.nodes.registerType("SceneNode",SceneNode);
}
