//module.exports = function (RED) {
//    var settings = RED.settings;
//    "use strict";
    var bridges = {};

    const ClipApi = require('../ClipApi');
    const BaseNode = require('./BaseNode');

    class BridgeConfigNode extends BaseNode {
        constructor(config) {
            super(config);
            BaseNode.nodeAPI.nodes.createNode(this, config);
            console.log("BridgeConfigNode[" + config.name + "].constructor()")
            //console.log(config);
    
            this.clip = new ClipApi(config.name, config.ip, config.key);
            bridges[this.id] = { id: this.id, name: config.name, instance: this };
    
            this.on('close', function () {
                console.log("BridgeConfigNode[" + this.config.name + "].on('close')");
                this.clip.destructor();
                this.clip = null;
            });
        }
    }

    //BaseNode.nodeAPI.nodes.registerType("BridgeConfigNode", BridgeConfigNode);

    BaseNode.nodeAPI.httpAdmin.get('/BridgeConfigNode/DiscoverBridges', async function (req, res, next) {
        console.log("BridgeConfigNode.get(\"/BridgeConfigNode/DiscoverBridges()\")");

        var request = {
            "method": "GET",
            "url": "https://discovery.meethue.com",
            "headers": {
                "Content-Type": "application/json; charset=utf-8"
            },
            "httpsAgent": new https.Agent({ rejectUnauthorized: false }),
        };

        var bridges = {};
        axios(request)
        .then(function (response) {
            for (var i = response.data.length - 1; i >= 0; i--) {
                var ipAddress = response.data[i].internalipaddress;
                bridges[ipAddress] = { ip: ipAddress, name: ipAddress };
            }

            res.end(JSON.stringify(Object.values(bridges)));
        })
        .catch(function (error) {
            console.log("BridgeConfigNode[" + node.name + "].get(\"/BridgeConfigNode/DiscoverBridges()\") error: " + error.request.res.statusMessage + " (" + error.request.res.statusCode + ")");
            res.end(JSON.stringify(Object.values(bridges)));

        });
    });

    BaseNode.nodeAPI.httpAdmin.get('/BridgeConfigNode/GetBridgeName', async function (req, res, next) {
        console.log("BridgeConfigNode.get(\"/BridgeConfigNode/GetBridgeName()\")");

        if (!req.query.ip) {
            return res.status(500).send("Missing IP in request.");
        }
        else {
            var request = {
                "method": "GET",
                "url": "https://" + req.query.ip + "/api/config",
                "headers": {
                    "Content-Type": "application/json; charset=utf-8"
                },
                "httpsAgent": new https.Agent({ rejectUnauthorized: false })
            }

            axios(request)
            .then(function (response) {
                res.end(response.data.name);
            })
            .catch(function (error) {
                res.send(error);
            });
        }
    });

    BaseNode.nodeAPI.httpAdmin.get('/BridgeConfigNode/GetHueApplicationKey', async function (req, res, next) {
        console.log("BridgeConfigNode.get(\"/BridgeConfigNode/GetHueApplicationKey()\")");

        if (!req.query.ip) {
            return res.status(500).send("Missing bridge ip.");
        }
        else {
            var request = {
                "method": "POST",
                "url": "http://" + req.query.ip + "/api",
                "headers": {
                    "Content-Type": "application/json; charset=utf-8"
                },
                "data": {
                    "devicetype": "mh-hue (" + Math.floor((Math.random() * 100) + 1) + ")"
                },
                "httpsAgent": new https.Agent({ rejectUnauthorized: false })
            };

            axios(request)
            .then(function (response) {
                var bridge = response.data;
                if (bridge[0].error) {
                    res.end("error");
                }
                else {
                    res.end(JSON.stringify(bridge));
                }
            })
            .catch(function (error) {
                res.status(500).send(error);
            });
        }
    });

    BaseNode.nodeAPI.httpAdmin.get('/BridgeConfigNode/GetBridgeOptions', async function (req, res, next) {
        console.log("BridgeConfigNode.get(\"/BridgeConfigNode/GetBridgeOptions()\")");
        console.log(bridges);
        var options = [];

        Object.keys(bridges).forEach((key) => {
            options.push({ label: bridges[key].name, value: bridges[key].id });
        });
        //options.push({ label: "Add Bridge", value: "_ADD_" });

        res.end(JSON.stringify(Object(options)));
    });

    BaseNode.nodeAPI.httpAdmin.get('/BridgeConfigNode/GetSortedDeviceServices', async function (req, res, next) {
        console.log("BridgeConfigNode.get(\"/BridgeConfigNode/GetSortedDeviceServices()\")");
        var clip = bridges[req.query.bridge_id].instance.clip;
        var services = clip.getSortedDeviceServices(req.query.uuid);
        res.end(JSON.stringify(Object(services)));
    });

    BaseNode.nodeAPI.httpAdmin.get('/BridgeConfigNode/GetSortedResourceOptions', async function (req, res, next) {
        console.log("BridgeConfigNode.get(\"/BridgeConfigNode/GetSortedResourceOptions()\")");
        var clip = bridges[req.query.bridge_id].instance.clip;
        var options = clip.getSortedResourceOptions(req.query.type, req.query.models);
        res.end(JSON.stringify(Object(options)));
    });

    module.exports = BridgeConfigNode;

//}
