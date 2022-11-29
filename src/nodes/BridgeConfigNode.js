var bridges = {};

const ClipApi = require('../clip/ClipApi');
const BaseNode = require('./BaseNode');
const axios = require('axios');
const https = require('https');
const { resourceLimits } = require('worker_threads');

class BridgeConfigNode extends BaseNode {
    #onClose;
    #onClipError;
    #clip;

    constructor(config) {
        super(config);
        BaseNode.nodeAPI.nodes.createNode(this, config);
        console.log("BridgeConfigNode[" + this.logid() + "].constructor()")
        var instance = this;

        bridges[this.id] = { id: this.id, name: config.name, instance: this };
        this.#initClip();

        this.#onClose = function() {
            try {
                instance.destructor();
            } catch (error) {
                console.log(error);
                if (error.statusCode == 429) {
                    instance.#uninitClip();
                    instance.#initClip();
                }
            }
        }
        this.on('close', this.#onClose);
    }

    destructor() {
        this.#uninitClip();
        super.destructor();
    }

    #initClip() {
        var instance = this;
        this.#onClipError = function(event) {
            try {
                instance.onClipError(event);
            } catch (error) {
                console.log(error);
            }
        }

        this.#clip = new ClipApi(this.config.ip,this.config.key,this.config.name);
        this.#clip.on('error',this.#onClipError);
    }

    #uninitClip() {
        this.#clip.destructor();
        this.#clip = null;
    }

    onClipError(error) {
        console.log("BridgeConfigNode[" + this.logid() + "].onClipError()",error);
    }

    getClip(caller) {
        console.log("BridgeConfigNode[" + this.logid() + "].getClip()",caller.constructor.name);
        return this.#clip;
    }

    static async DiscoverBridges() {
        console.log("BridgeConfigNode.DiscoverBridges()");
        var result = [];

        var response = await axios({
            "method": "GET",
            "url": "https://discovery.meethue.com",
            "headers": { "Content-Type": "application/json; charset=utf-8" },
            "httpsAgent": new https.Agent({ rejectUnauthorized: false })
        });

        const promises = response.data.map(async element => {
            const config = await axios({
                "method": "GET",
                "url": "https://" + element.internalipaddress + "/api/config",
                "headers": { "Content-Type": "application/json; charset=utf-8" },
                "httpsAgent": new https.Agent({ rejectUnauthorized: false })
            });
            config.data.internalipaddress = element.internalipaddress;
            return config
        });
        const configs = await Promise.all(promises);

        configs.forEach((config) => {
            result.push(config.data);
        });

        return result;
    }

    static async AcquireApplicationKey(ip) {
        console.log("BridgeConfigNode.AcquireApplicationKey("+ip+")");
        return new Promise(function (resolve, reject) {
            var id = "BridgeConfig (" + Math.floor((Math.random() * 100) + 1) + ")";
            var request = {
                "method": "POST",
                "url": "http://" + ip + "/api",
                "headers": { "Content-Type": "application/json; charset=utf-8" },
                "data": { "devicetype": id },
                "httpsAgent": new https.Agent({ rejectUnauthorized: false })
            }

            axios(request)
            .then(function (response) {
                console.log("BridgeConfigNode.AcquireApplicationKey("+ip+")", response.data);
                if (Object.keys(response.data[0]).includes("success")) {
                    resolve(response.data[0].success.username);
                } else {
                    reject(response.data[0].error);
                }
            })
            .catch(function (error) {
                reject(error);
            });
        });
    }
}

BaseNode.nodeAPI.httpAdmin.get('/BridgeConfigNode/DiscoverBridges', async function (req, res, next) {
    console.log("BridgeConfigNode/DiscoverBridges");
    var options = [];

    BridgeConfigNode.DiscoverBridges()
    .then(function(data) {
        if (data) {
            data.forEach((element) => {
                options.push({ label: element.name, value: element.internalipaddress })
            });
        }
        res.end(JSON.stringify(Object(options)));
    })
    .catch(function(error) {
        console.log("BridgeConfigNode/DiscoverBridges  Error:",error);
        res.end(JSON.stringify(Object(options)));
    });
});

BaseNode.nodeAPI.httpAdmin.get('/BridgeConfigNode/AcquireApplicationKey', async function (req, res, next) {
    console.log("/BridgeConfigNode/AcquireApplicationKey");

    if (!req.query.ip) {
        return res.status(500).send("Missing bridge ip.");
    }
    else {
        BridgeConfigNode.AcquireApplicationKey(req.query.ip)
        .then(function(data) {
            console.log("BridgeConfigNode.constructor()  Key:",data);
            res.end(JSON.stringify(Object({ key: data })));
        })
        .catch(function(error) {
            console.log("BridgeConfigNode.constructor()  Error:",error);
            res.end(JSON.stringify(Object({ error: error })));
        });
    }
});

BaseNode.nodeAPI.httpAdmin.get('/BridgeConfigNode/GetBridgeOptions', async function (req, res, next) {
    console.log("/BridgeConfigNode/GetBridgeOptions");
    var options = [];

    Object.keys(bridges).forEach((key) => {
        options.push({ label: bridges[key].name, value: bridges[key].id });
    });

    res.end(JSON.stringify(Object(options)));
});

BaseNode.nodeAPI.httpAdmin.get('/BridgeConfigNode/GetSortedServicesById', async function (req, res, next) {
    console.log("/BridgeConfigNode/GetSortedServicesById");
    var clip = bridges[req.query.bridge_id].instance.getClip(this);
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
    console.log("/BridgeConfigNode/GetSortedResourceOptions");
    var clip = bridges[req.query.bridge_id].instance.getClip(this);
    var options = clip.getSortedResourceOptions(req.query.type, req.query.models);
    res.end(JSON.stringify(Object(options)));
});

BaseNode.nodeAPI.httpAdmin.get('/BridgeConfigNode/GetSortedTypeOptions', async function (req, res, next) {
    console.log("BridgeConfigNode/GetSortedTypeOptions");
    var clip = bridges[req.query.bridge_id].instance.getClip(this);
    var options = clip.getSortedTypeOptions();
    res.end(JSON.stringify(Object(options)));
});


BaseNode.nodeAPI.httpAdmin.get('/BridgeConfigNode/GetSortedOwnerOptions', async function (req, res, next) {
    console.log("/BridgeConfigNode/GetSortedOwnerOptions");
    var clip = bridges[req.query.bridge_id].instance.getClip(this);
    var options = clip.getSortedOwnerOptions(req.query.rtype);
    res.end(JSON.stringify(Object(options)));
});

BaseNode.nodeAPI.httpAdmin.get('/BridgeConfigNode/GetSortedServiceOptions', async function (req, res, next) {
    console.log("/BridgeConfigNode/GetSortedServiceOptions");
    console.log(req.query);
    var clip = bridges[req.query.bridge_id].instance.getClip(this);
    var options = clip.getSortedServiceOptions(req.query.owner,req.query.rtype);
    res.end(JSON.stringify(Object(options)));
});

module.exports = BridgeConfigNode;
