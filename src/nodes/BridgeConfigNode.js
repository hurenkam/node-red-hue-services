var bridges = {};

const ClipApi = require('../clip/ClipApi');
const BaseNode = require('./BaseNode');

class BridgeConfigNode extends BaseNode {
    constructor(config) {
        super(config);
        BaseNode.nodeAPI.nodes.createNode(this, config);
        console.log("BridgeConfigNode[" + this.logid() + "].constructor()")

        this.clip = new ClipApi(config.ip,config.key,config.name);
        bridges[this.id] = { id: this.id, name: config.name, instance: this };

        this.on('close', function () {
            console.log("BridgeConfigNode[" + this.logid() + "].on('close')");

            this.clip.destructor();
            this.clip = null;
        });
    }
}
/*
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
*/
BaseNode.nodeAPI.httpAdmin.get('/BridgeConfigNode/GetBridgeOptions', async function (req, res, next) {
    console.log("BridgeConfigNode.get(\"/BridgeConfigNode/GetBridgeOptions()\")");
    var options = [];

    Object.keys(bridges).forEach((key) => {
        options.push({ label: bridges[key].name, value: bridges[key].id });
    });

    res.end(JSON.stringify(Object(options)));
});

BaseNode.nodeAPI.httpAdmin.get('/BridgeConfigNode/GetSortedServicesById', async function (req, res, next) {
    console.log("BridgeConfigNode.get(\"/BridgeConfigNode/GetSortedServicesById()\")");
    var clip = bridges[req.query.bridge_id].instance.clip;
    var services = clip.getSortedServicesById(req.query.uuid,req.query.rtype);
    var options = [];
    services.forEach((service) => {
        options.push({ 
            value: service.rid(), 
            label: service.typeName() 
        });
    });
    res.end(JSON.stringify(Object(options)));
});

BaseNode.nodeAPI.httpAdmin.get('/BridgeConfigNode/GetSortedResourceOptions', async function (req, res, next) {
    console.log("BridgeConfigNode.get(\"/BridgeConfigNode/GetSortedResourceOptions()\")");
    var clip = bridges[req.query.bridge_id].instance.clip;
    var options = clip.getSortedResourceOptions(req.query.type, req.query.models);
    res.end(JSON.stringify(Object(options)));
});

BaseNode.nodeAPI.httpAdmin.get('/BridgeConfigNode/GetSortedTypeOptions', async function (req, res, next) {
    console.log("BridgeConfigNode.get(\"/BridgeConfigNode/GetSortedTypeOptions()\")");
    var clip = bridges[req.query.bridge_id].instance.clip;
    var options = clip.getSortedTypeOptions();
    res.end(JSON.stringify(Object(options)));
});


BaseNode.nodeAPI.httpAdmin.get('/BridgeConfigNode/GetSortedOwnerOptions', async function (req, res, next) {
    console.log("BridgeConfigNode.get(\"/BridgeConfigNode/GetSortedOwnerOptions()\")");
    var clip = bridges[req.query.bridge_id].instance.clip;
    var options = clip.getSortedOwnerOptions(req.query.rtype);
    res.end(JSON.stringify(Object(options)));
});

BaseNode.nodeAPI.httpAdmin.get('/BridgeConfigNode/GetSortedServiceOptions', async function (req, res, next) {
    console.log("BridgeConfigNode.get(\"/BridgeConfigNode/GetSortedServiceOptions()\")");
    console.log(req.query);
    var clip = bridges[req.query.bridge_id].instance.clip;
    var options = clip.getSortedServiceOptions(req.query.owner,req.query.rtype);
    res.end(JSON.stringify(Object(options)));
});

module.exports = BridgeConfigNode;
