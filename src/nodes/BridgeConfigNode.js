/*
var bridges = {};

const ClipApi = require('../clip/ClipApi');
const BaseNode = require('./BaseNode');
const axios = require('axios');
const https = require('https');

const _error = require('debug')('error').extend('BridgeConfigNode');
const _warn  = require('debug')('warn').extend('BridgeConfigNode');
const _info  = require('debug')('info').extend('BridgeConfigNode');
const _trace = require('debug')('trace').extend('BridgeConfigNode');

class BridgeConfigNode extends BaseNode {
    #onClose;
    #onClipError;
    #clip;

    #error;
    #warn;
    #info;
    #trace;

    static bridges () { return bridges; }

    constructor(config) {
        super(config);
        BaseNode.nodeAPI.nodes.createNode(this, config);

        this.#error = _error.extend("["+this.logid()+"]");
        this.#warn  = _warn. extend("["+this.logid()+"]");
        this.#info  = _info. extend("["+this.logid()+"]");
        this.#trace = _trace.extend("["+this.logid()+"]");

        this.#info("constructor()");
        var instance = this;

        bridges[this.id] = { id: this.id, name: config.name, instance: this };
        this.#clip = this._constructClip(config.ip,config.key,config.name);

        this.#onClose = function() {
            try {
                instance.destructor();
            } catch (error) {
                instance.#error(error.message,error.stack);
            }
        }
        this.on('close', this.#onClose);
    }

    destructor() {
        this._destructClip();
        super.destructor();
    }

    _constructClip(ip,key,name) {
        var instance = this;
        this.#onClipError = function(event) {
            instance.#error("onClipError()",error);
        }

        var clip = new ClipApi(ip,key,name);
        clip.on('error',this.#onClipError);
        return clip;
    }

    _destructClip() {
        this.#clip.destructor();
        this.#clip = null;
    }

    clip() {
        return this.#clip;
    }

    requestStartup(resource) {
        if (this.clip()) {
            this.clip().requestStartup(resource);
        }
    }

    // istanbul ignore next
    static async _axios(request) {
        return axios(request);
    }

    static async DiscoverBridges() {
        _info("DiscoverBridges()");
        var result = [];

        var response = await BridgeConfigNode._axios({
            "method": "GET",
            "url": "https://discovery.meethue.com",
            "headers": { "Content-Type": "application/json; charset=utf-8" },
            "httpsAgent": new https.Agent({ rejectUnauthorized: false })
        });

        const promises = response.data.map(async element => {
            const config = await BridgeConfigNode._axios({
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
        _info("AcquireApplicationKey("+ip+")");
        return new Promise(function (resolve, reject) {
            var id = "BridgeConfig (" + Math.floor((Math.random() * 100) + 1) + ")";
            var request = {
                "method": "POST",
                "url": "https://" + ip + "/api",
                "headers": { "Content-Type": "application/json; charset=utf-8" },
                "data": { "devicetype": id },
                "httpsAgent": new https.Agent({ rejectUnauthorized: false })
            }

            BridgeConfigNode._axios(request)
            .then(function (response) {
                _trace("AcquireApplicationKey("+ip+")", response.data);
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

module.exports = BridgeConfigNode;
*/