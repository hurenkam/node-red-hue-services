module.exports = function(RED) {
    var settings = RED.settings;
    const events = require('events');
    const axios = require('axios');
    const https = require('https');
    const EventSource = require('eventsource');

    "use strict";
    var bridges = {};

    function HueApi(config) {
        RED.nodes.createNode(this,config);
        const node = this;

        // throttle to 1 request per 500 ms
        const throttle = 500;

        this.id = config.id;
        this.name = config.name;
        this.host = config.ip;
        this.key = config.key;

        bridges[this.id] = { id: this.id, name: this.name, instance: this };
        console.log("HueApi() Registered bridges:")
        console.log(bridges);

        this.events = new events.EventEmitter();

        this.subscribe = function(id,callback) {
            console.log("HueApi["+config.name+"]().subscribe() id:", id);
            node.events.on(id,callback);
        }

        this.unsubscribe = function(id) {
            node.events.off(id);
        }

        this.request = async function(url,method="GET",data=null)  {
            var realurl = "https://" + node.host + url;
            console.log("HueApi["+node.name+"].request(" + realurl + "," + method + "," + data + ")");

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
                    //console.log(error.request);
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

        const resourceTypesToBeCached = ["device","room","zone","scene"];
        this.registeredBridgesByIP = {}

        this.addBridge = function (name, ip, key, resources = {}) {
            if (!(ip in Object.keys(node.registeredBridgesByIP))) {
                node.registeredBridgesByIP[ip] = { name: name, ip: ip, key: key, resources: resources };
            }
        }

        this.updateBridgeResources = function(ip) {
            if (!(ip in Object.keys(node.registeredBridgesByIP)))
                return
            
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

        this.updateBridgeResource = function(ip, resource) {
            if (!(ip in Object.keys(node.registeredBridgesByIP)))
                return

            var bridge = node.registeredBridgesByIP[ip];

            if (!(resource.id in Object.keys(bridge.resources))) {
                bridge.resources[resource.id] = resource;
            } else {
                console.log("HueApi.updateBridgeResource(" + ip + "," + resource.id +"):  update of existing resource not yet supported.");
            }
        }

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

        // Schedule an update immediately, and one 10 seconds later.
        // Assumption is that by than all devices will have subscribed
        // their services and can thus receive an initial update.
        this.update();
        setTimeout(node.update,10000);

        this.handleRequest();
    }

    RED.nodes.registerType("mh-hue-api",HueApi);


    RED.httpAdmin.get('/mh-hue/getbridges', async function(req, res, next)
    {
        console.log("HueApi.get(\"/mh-hue/getbridges()\")");
        //console.log(req.query);

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
        .then(function(response)
        {
            for (var i = response.data.length - 1; i >= 0; i--)
            {
                var ipAddress = response.data[i].internalipaddress;
                bridges[ipAddress] = { ip: ipAddress, name: ipAddress };
            }

            res.end(JSON.stringify(Object.values(bridges)));
        })
        .catch(function(error) {
            console.log("HueApi["+node.name+"].get(\"/mh-hue/getbridges()\") error: " + error.request.res.statusMessage + " (" + error.request.res.statusCode + ")");
            //console.log("HueApi["+node.name+"].get(\"/mh-hue/getbridges()\") error:");
            //console.log(error);
            //res.send(error);
            res.end(JSON.stringify(Object.values(bridges)));
        });
    });

    RED.httpAdmin.get('/mh-hue/getbridgename', function(req, res, next)
    {
        console.log("HueApi.get(\"/mh-hue/getbridgename()\")");
        //console.log(req.query);

        if(!req.query.ip)
        {
            return res.status(500).send("Missing IP in request.");
        }
        else
        {
            var request = {
                "method": "GET",
                "url": "https://" + req.query.ip + "/api/config",
                "headers": { 
                    "Content-Type": "application/json; charset=utf-8" 
                },
                "httpsAgent": new https.Agent({ rejectUnauthorized: false })
            }

            axios(request)
            .then(function(response)
            {
                res.end(response.data.name);
            })
            .catch(function(error) {
                res.send(error);
            });
        }
    });

    RED.httpAdmin.get('/mh-hue/registerbridge', function(req, rescope, next)
    {
        console.log("HueApi.get(\"/mh-hue/registerbridge()\")");

        if(!req.query.ip)
        {
            return rescope.status(500).send("Missing bridge ip.");
        }
        else
        {
            var request = {
                "method": "POST",
                "url": "http://"+req.query.ip+"/api",
                "headers": {
                    "Content-Type": "application/json; charset=utf-8"
                },
                "data": {
                    "devicetype": "mh-hue (" + Math.floor((Math.random() * 100) + 1) + ")"
                },
                "httpsAgent": new https.Agent({ rejectUnauthorized: false })
            };

            axios(request)
            .then(function(response)
            {
                var bridge = response.data;
                if(bridge[0].error)
                {
                    rescope.end("error");
                }
                else
                {
                    rescope.end(JSON.stringify(bridge));
                }
            })
            .catch(function(error) {
                rescope.status(500).send(error);
            });
        }
    });

    RED.httpAdmin.get('/mh-hue/options', async function(req, res, next)
    {
        var bridge = bridges[req.query.bridge_id].instance;
        console.log("HueApi["+bridge.name+"].get(\"/mh-hue/options()\")");
        console.log(req.query);

        var options = [];
        Object.keys(bridge.cachedResourcesById).forEach(function(key) {
            var service = bridge.cachedResourcesById[key];

            if (service.type === req.query.type)
            {
                if (service.type === "device")
                {
                    if (!(req.query.models) || (req.query.models.includes(service.product_data.model_id)))
                    {
                        options.push({ 
                            label: service.metadata.name, 
                            value: service.id
                        });
                    }
                }
                else if ( (service.type === "room") 
                       || (service.type === "zone") 
                       || (service.type === "scene") )
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

        //console.log(options);

        // on success
        res.end(JSON.stringify(Object(options)));
    });

    RED.httpAdmin.get('/mh-hue/deviceservices', async function(req, res, next)
    {
        var bridge = bridges[req.query.bridge_id].instance;
        console.log("HueApi["+bridge.name+"].get(\"/mh-hue/deviceservices()\")");
        console.log(req.query);

        var services = bridge.cachedResourcesById[req.query.uuid].services;

        // on success
        res.end(JSON.stringify(Object(services)));
    });
}
