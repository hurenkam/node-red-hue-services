module.exports = function (RED) {
    var settings = RED.settings;
    "use strict";
    var bridges = {};

    const ClipApi = require('../src/ClipApi');

    class BridgeConfigNode {
        constructor(config) {
            RED.nodes.createNode(this, config);
            this._config = config;
            console.log("BridgeConfigNode[" + config.name + "].constructor()")
            console.log(config);
    
            this.clip = new ClipApi(config.name, config.ip, config.key);
            bridges[this.id] = { id: this.id, name: config.name, instance: this };
    
            this.on('close', function () {
                console.log("BridgeConfigNode[" + this._config.name + "].on('close')");
                this.clip.destructor();
                this.clip = null;
            });
        }

        getHueApplicationKey() {
            console.log("BridgeConfigNode[" + this._config.name + "].getHueApplicationKey()");
        }
    }

    RED.nodes.registerType("BridgeConfigNode", BridgeConfigNode);

    RED.httpAdmin.get('/BridgeConfigNode/DiscoverBridges', async function (req, res, next) {
        console.log("BridgeConfigNode.get(\"/BridgeConfigNode/DiscoverBridges()\")");
    });

    RED.httpAdmin.get('/BridgeConfigNode/GetHueApplicationKey', async function (req, res, next) {
        console.log("BridgeConfigNode.get(\"/BridgeConfigNode/GetHueApplicationKey()\")");
        var bridge = bridges[req.query.bridge_id].instance;
        var key = bridge.getHueApplicationKey();
        res.end(JSON.stringigy(Object(key)));
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
