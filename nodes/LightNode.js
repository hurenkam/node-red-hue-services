module.exports = function(RED) {
    "use strict";

    const Light = require('../src/Light');

    class LightNode extends Light {
        constructor(config) {
            super(RED, RED.nodes.getNode(config.bridge).clip, config);
            console.log("LightNode[" + config.name + "].constructor()");
        }
    }
    
    RED.nodes.registerType("LightNode",LightNode);
}
