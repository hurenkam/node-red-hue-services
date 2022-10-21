module.exports = function(RED) {
    "use strict";

    const DimmerSwitch = require('./src/DimmerSwitch');

    function DimmerSwitchNode(config) {
        RED.nodes.createNode(this,config);
        this.base = new DimmerSwitch(this,config,RED.nodes.getNode(config.bridge));
        const node = this;

        this.on('input', function(msg) { 
            node.base.onInput(msg); 
        });

        this.on('close', function() { 
            node.base.onClose(); 
        });
    }

    RED.nodes.registerType("mh-hue-dimmer-switch",DimmerSwitchNode);
}
