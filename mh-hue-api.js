module.exports = function(RED) {
    var settings = RED.settings;
    const events = require('events');
    const axios = require('axios');
    const https = require('https');
    const EventSource = require('eventsource');

    "use strict";

    function HueApi(config) {
        RED.nodes.createNode(this,config);
        const node = this;

        // throttle to 1 request per 500 ms
        const throttle = 500;

        this.id = config.id;
        this.name = config.name;
        this.host = config.host;
        this.key = config.key;

        this.events = new events.EventEmitter();

        this.subscribe = function(id,callback) {
            console.log("HueApi["+config.name+"]().subscribe() id:", id);
            node.events.on(id,callback);
        }

        this.unsubscribe = function(id) {
            node.events.off(id);
        }

        this.request = async function(url,method="GET",data=null)  {
            console.log("HueApi["+node.name+"].request(" + url + "," + method + "," + data + ")");
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

        this.requestQ = [];
        this.handleRequest = function() {
            if (node.requestQ.length > 0) {
                console.log("HueApi["+node.name+"].handleRequest() pending: " + node.requestQ.length);

                var request = node.requestQ.shift();
                node.request(request.url, request.method, request.data)
                .then(function(result) {
                    request.resolve(result.data);
                })
                .catch((error) => {
                    console.log("HueApi["+node.name+"].handleRequest(" + request.url + ") error: " + error.request.res.statusMessage + " (" + error.request.res.statusCode + ")");
                });

                // if a request was handled, then wait throttle time before handling next request
                setTimeout(node.handleRequest,throttle); 

            } else {

                // if no request was pending, then check again soon
                setTimeout(node.handleRequest,100); 
            }
        }

        this.get = function(url) {
            console.log("HueApi["+node.name+"].get(" + url + ")");
            return new Promise(function(resolve,reject) {
                node.requestQ.push({ url: url, method: "GET", data: null, resolve: resolve, reject: reject });
            });
        }

        this.put = function(url,data) {
            console.log("HueApi["+node.name+"].put(" + url + ")");
            return new Promise(function(resolve,reject) {
                node.requestQ.push({ url: url, method: "PUT", data: data, resolve: resolve, reject: reject });
            });
        }

        const resourceTypesToBeCached = ["device","room","zone"];
        this.cachedServicesById = {}
        this.cachedResourcesById = {}
        this.update = function() {
            console.log("HueApi["+node.name+"].update()");
            node.get("/clip/v2/resource")
            .then(function(response) {
                response.data.forEach((resource) => {
                    if (resourceTypesToBeCached.includes(resource.type)) {
                        node.cachedServicesById[resource.id] = resource.services; 
                        node.cachedResourcesById[resource.id] = resource;
		            }
                    resource["startup"]=true;
                    node.events.emit(resource.id, resource);
                });
            });
        }

        this.getServices = function(url) {
            console.log("HueApi["+node.name+"].getServices(" + url + ")");
            return new Promise(function(resolve,reject) {
                node.requestQ.push({ url: url, method: "GET", data: null, resolve: function(result) {
                    resolve(result.data[0].services);
                }, reject: reject });
            });
        }

        this.getServicesByTypeAndId = function(type,id) {
            if (Object.keys(node.cachedServicesById).includes(id)) {
                console.log("HueApi["+node.name+"].getServicesByTypeAndId(" + type + "," + id + "): returning cached value...");
                return new Promise(function(resolve,reject) {
                    resolve(node.cachedServicesById[id]);
	        });
	    } else {
                console.log("HueApi["+node.name+"].getServicesByTypeAndId(" + type + "," + id + "): not in cache, fetching now...");
                var url = "/clip/v2/resource/"+type+"/"+id;
                return new Promise(function(resolve,reject) {
                    node.requestQ.push({ url: url, method: "GET", data: null, resolve: function(result) {
                        node.cachedServicesById[id] = result.data[0].services; 
                        resolve(result.data[0].services);
                    }, reject: reject });
                });
            }
        }

        var sseURL = "https://" + this.host + "/eventstream/clip/v2";
        this.eventsource = new EventSource(sseURL, {
            headers: { 'hue-application-key': this.key },
            https: { rejectUnauthorized: false },
        });

        this.eventsource.onmessage = function(event) {
            const messages = JSON.parse(event.data);
            messages.forEach((message) => {
                message.data.forEach((item) => {
                    node.events.emit(item.id, item);
                });
            });
        }

        this.on('close', function() {
            console.log("HueApi["+node.name+"].on('close')");
            if (node.eventsource != null) {
                node.eventsource.close();
            };
            node.eventsource = null;
        });

        RED.httpAdmin.get('/mh-hue/bridges', async function(req, res, next)
        {
            console.log("HueApi["+node.name+"].get(\"/mh-hue/bridges()\")");
            console.log(req.query);

            // on error
            res.status(500).send(JSON.stringify(error));
        });

        RED.httpAdmin.get('/mh-hue/options', async function(req, res, next)
        {
            console.log("HueApi["+node.name+"].get(\"/mh-hue/options()\")");
            console.log(req.query);

            var options = [];
            Object.keys(node.cachedResourcesById).forEach(function(key) {
                var service = node.cachedResourcesById[key];

                if (service.type === req.query.type)
                {
                    if (service.type === "device")
                    {
                        if (req.query.models.includes(service.product_data.model_id))
                        {
                            options.push({ 
                                label: service.metadata.name, 
                                value: service.id
                            });
                        }
                    }
                    else if ((service.type === "room") || (service.type === "zone"))
                    {
                        options.push({ 
                            label: service.metadata.name, 
                            value: service.id
                        });
                    }
                    else
                    {
                        console.log ("type " + service.type + "is not yet supported");
                    }
                }
            });
            console.log(options);

            // on success
            res.end(JSON.stringify(Object(options)));
        });

        // Schedule an update immediately, and one 10 seconds later.
        // Assumption is that by than all devices will have subscribed
        // their services and can thus receive an initial update.
        this.update();
        setTimeout(node.update,10000);

        this.handleRequest();
    }

    RED.nodes.registerType("mh-hue-api",HueApi);
}
