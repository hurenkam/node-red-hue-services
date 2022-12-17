// ===================
// Manage bridge calls
// ===================

const _error = require('debug')('error').extend('hue');
const _warn  = require('debug')('warn').extend('hue');
const _info  = require('debug')('info').extend('hue');
const _trace = require('debug')('trace').extend('hue');

module.exports = function (RED) {
    const BridgeConfigNode = require('./nodes/BridgeConfigNode');

    RED.httpAdmin.get('/BridgeConfigNode/DiscoverBridges', async function (req, res, next) {
        _info("/DiscoverBridges");
        _trace(req.query);
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
            _error("/DiscoverBridges  Error:",error.message,error.stack);
            res.end(JSON.stringify(Object(options)));
        });
    });
    
    RED.httpAdmin.get('/BridgeConfigNode/AcquireApplicationKey', async function (req, res, next) {
        _info("/AcquireApplicationKey");
        _trace(req.query);
    
        if (!req.query.ip) {
            return res.status(500).send("Missing bridge ip.");
        }
        else {
            BridgeConfigNode.AcquireApplicationKey(req.query.ip)
            .then(function(data) {
                _trace("/AcquireApplicationKey Key:",data);
                res.end(JSON.stringify(Object({ key: data })));
            })
            .catch(function(error) {
                _error("/AcquireApplicationKey Error:",error.message,error.stack);
                res.end(JSON.stringify(Object({ error: error })));
            });
        }
    });
    
    RED.httpAdmin.get('/BridgeConfigNode/GetBridgeOptions', async function (req, res, next) {
        _info("/GetBridgeOptions");
        _trace(req.query);
        var options = [];
    
        Object.keys(BridgeConfigNode.bridges()).forEach((key) => {
            options.push({ label: BridgeConfigNode.bridges()[key].name, value: BridgeConfigNode.bridges()[key].id });
        });
    
        res.end(JSON.stringify(Object(options)));
    });
    
    RED.httpAdmin.get('/BridgeConfigNode/GetSortedResourceOptions', async function (req, res, next) {
        _info("/GetSortedResourceOptions");
        _trace(req.query);
        var clip = BridgeConfigNode.bridges()[req.query.bridge_id].instance.clip();
        var options = clip.getSortedResourceOptions(req.query.type, req.query.models);
        res.end(JSON.stringify(Object(options)));
    });
    
    RED.httpAdmin.get('/BridgeConfigNode/GetSortedTypeOptions', async function (req, res, next) {
        _info("/GetSortedTypeOptions");
        _trace(req.query);
        var clip = BridgeConfigNode.bridges()[req.query.bridge_id].instance.clip();
        var options = clip.getSortedTypeOptions();
        res.end(JSON.stringify(Object(options)));
    });
    
    
    RED.httpAdmin.get('/BridgeConfigNode/GetSortedOwnerOptions', async function (req, res, next) {
        _info("/GetSortedOwnerOptions");
        _trace(req.query);
        var clip = BridgeConfigNode.bridges()[req.query.bridge_id].instance.clip();
        var options = clip.getSortedOwnerOptions(req.query.rtype);
        res.end(JSON.stringify(Object(options)));
    });
    
    RED.httpAdmin.get('/BridgeConfigNode/GetSortedServiceOptions', async function (req, res, next) {
        _info("/GetSortedServiceOptions");
        _trace(req.query);
        var clip = BridgeConfigNode.bridges()[req.query.bridge_id].instance.clip();
        var options = clip.getSortedServiceOptions(req.query.owner,req.query.rtype);
        res.end(JSON.stringify(Object(options)));
    });
    
}