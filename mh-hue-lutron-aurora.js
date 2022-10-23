module.exports = function(RED) {
    "use strict";

    const LutronAurora = require('./src/LutronAurora');

    class LutronAuroraNode extends LutronAurora {
        constructor(config) {
            super(RED, RED.nodes.getNode(config.bridge).clip, config);
            console.log("LutronAuroraNode[" + config.name + "].constructor()");
        }
    }

    RED.nodes.registerType("mh-hue-lutron-aurora",LutronAuroraNode);
}
