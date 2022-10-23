module.exports = function (RED) {
    var settings = RED.settings;
    "use strict";

    const ClipApi = require('../src/ClipApi');

    function BridgeConfigNode(config) {
        RED.nodes.createNode(this, config);
        this._config = config;
        const node = this;
        console.log("BridgeConfigNode[" + config.name + "].constructor()")
        console.log(config);

        this.clip = new ClipApi(config.name, config.ip, config.key);
    }

    RED.nodes.registerType("BridgeConfigNode", BridgeConfigNode);

    RED.httpAdmin.get('/BridgeConfigNode/GetDiscoveredBridges', async function (req, res, next) {
        console.log("BridgeConfigNode.get(\"/BridgeConfigNode/GetDiscoveredBridges()\")");
    });

    RED.httpAdmin.get('/BridgeConfigNode/GetHueApplicationKey', async function (req, res, next) {
        console.log("BridgeConfigNode.get(\"/BridgeConfigNode/GetHueApplicationKey()\")");
    });

    RED.httpAdmin.get('/BridgeConfigNode/GetSortedResourceOptions', async function (req, res, next) {
        console.log("BridgeConfigNode.get(\"/BridgeConfigNode/GetSortedResourceOptions()\")");
    });
}
