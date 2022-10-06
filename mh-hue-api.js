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

		// if a request was handled, then wait for at least 1000ms before handling next request
                setTimeout(node.handleRequest,1000); 

	    } else {

		// if no request was pending, then wait 100ms before checking again
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

        this.update = function() {
            console.log("HueApi["+node.name+"].update()");
            this.get("/clip/v2/resource")
            .then(function(response)
            {
                response.data.forEach((resource) => {
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

        this.update();
        setTimeout(node.handleRequest,1000); 
    }

    RED.nodes.registerType("mh-hue-api",HueApi);
}

