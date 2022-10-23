module.exports = function (RED) {
    var settings = RED.settings;
    "use strict";
    var bridges = {};

    const ClipApi = require('../src/ClipApi');

    function BridgeConfigNode(config) {
        RED.nodes.createNode(this, config);
        this._config = config;
        const node = this;
        console.log("BridgeConfigNode[" + config.name + "].constructor()")
        console.log(config);

        this.clip = new ClipApi(config.name, config.ip, config.key);
        bridges[this.id] = { id: this.id, name: config.name, instance: this };
    }

    RED.nodes.registerType("BridgeConfigNode", BridgeConfigNode);

    RED.httpAdmin.get('/BridgeConfigNode/GetDiscoveredBridges', async function (req, res, next) {
        console.log("BridgeConfigNode.get(\"/BridgeConfigNode/GetDiscoveredBridges()\")");
    });

    RED.httpAdmin.get('/BridgeConfigNode/GetHueApplicationKey', async function (req, res, next) {
        console.log("BridgeConfigNode.get(\"/BridgeConfigNode/GetHueApplicationKey()\")");
    });

    RED.httpAdmin.get('/BridgeConfigNode/GetSortedDeviceServices', async function (req, res, next) {
        console.log("BridgeConfigNode.get(\"/BridgeConfigNode/GetSortedDeviceServices()\")");
        var clip = bridges[req.query.bridge_id].instance.clip;
        var services = clip.getSortedDeviceServices(req.query.uuid);
        res.end(JSON.stringify(Object(services)));
    });

    RED.httpAdmin.get('/BridgeConfigNode/GetSortedResourceOptions', async function (req, res, next) {
        console.log("BridgeConfigNode.get(\"/BridgeConfigNode/GetSortedResourceOptions()\")");
        var clip = bridges[req.query.bridge_id].instance.clip;
        var options = clip.getSortedResourceOptions(req.query.type, req.query.models);
        res.end(JSON.stringify(Object(options)));
    });
}
