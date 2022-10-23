module.exports = function(RED) {
    "use strict";

    const DimmerSwitch = require('../src/DimmerSwitch');

    class DimmerSwitchNode extends DimmerSwitch {
        constructor(config) {
            super(RED, RED.nodes.getNode(config.bridge).clip, config);
            console.log("DimmerSwitchNode[" + config.name + "].constructor()");
        }
    }

    RED.nodes.registerType("mh-hue-dimmer-switch",DimmerSwitchNode);
}
