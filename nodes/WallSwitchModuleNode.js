module.exports = function(RED) {
    "use strict";

    const WallSwitchModule = require('../src/WallSwitchModule');

    class WallSwitchModuleNode extends WallSwitchModule {
        constructor(config) {
            super(RED, RED.nodes.getNode(config.bridge).clip, config);
            console.log("WallSwitchModuleNode[" + config.name + "].constructor()");
        }
    }

    RED.nodes.registerType("WallSwitchModuleNode",WallSwitchModuleNode);
}
