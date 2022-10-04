module.exports = function(RED) {
    var settings = RED.settings;
    const events = require('events');
    const axios = require('axios');
    const https = require('https');

    "use strict";

    function HueApi(config) {
        RED.nodes.createNode(this,config);
        const node = this;

        this.id = config.id;
        this.name = config.name;
        this.host = config.host;
        this.key = config.key;

        this.events = new events.EventEmitter();

        this.subscribe = function(id,callback) {
            console.log("HueApi["+config.name+"]().subscribe() id:", id);
            this.events.on(id,callback);
        }

        this.unsubscribe = function(id) {
            this.events.off(id);
        }

        this.request = function(url,method="GET",data=null)  {
            var realurl = "https://" + config.host + url;
            var request = {
                "method": method,
                "url": realurl,
                "headers": {
                    "Content-Type": "application/json; charset=utf-8",
                    "hue-application-key": node.key
                },
                "httpsAgent": new https.Agent({ rejectUnauthorized: false })
            }
            if (data) {
                request["data"] = data;
            }
            return axios(request);
        }

        this.update = function() {
            this.request("/clip/v2/resource")
            .then(function(response)
            {
                response.data.data.forEach((resource) => {
                    node.events.emit(resource.id, resource);
                });
            });
        }

        this.del = async function(url) {
            const promise = this.request(url,"DELETE");
            var result = await promise;
            return result.data;
        }

        this.get = async function(url) {
            const promise = this.request(url,"GET");
            var result = await promise;
            return result.data;
        }

        this.post = async function(url,data) {
            const promise = this.request(url,"POST",data);
            var result = await promise;
            return result.data;
        }

        this.put = async function(url,data) {
            const promise = this.request(url,"PUT",data);
            var result = await promise;
            return result.data;
        }

        this.update();
    }

    RED.nodes.registerType("mh-hue-api",HueApi);
}

