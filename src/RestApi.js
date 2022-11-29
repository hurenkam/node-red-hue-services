const axios = require('axios');
const https = require('https');

class RestApi {
    constructor(name,ip,throttle,headers) {
        this._name = name;
        console.log("RestApi["+this._name+"].constructor()");

        this._ip = ip;
        this._throttle = throttle;
        this._headers = { "Content-Type": "application/json; charset=utf-8" };
        if (headers) {
            Object.keys(headers).forEach(key => {
                this._headers[key] = headers[key];
            });
        };

        this._requestQ = [];
        this._handleRequest();
        this._timeout = null;
    }

    destructor() {
        console.log("RestApi["+this._name+"].destructor()");
        if (this._timeout) {
            clearTimeout(this._timeout);
            this._timeout = null;
        }

        if (this._requestQ) {
            this._requestQ.forEach(item => {
                item.resolve = null;
                item.reject = null;
            });
        }
        this._requestQ = null;
    }

    async _request(url, method="GET", data=null) {
        var realurl = "https://" + this._ip + url;
        console.log("RestApi[" + this._name + "]._request(" + realurl + ", " + method + ",",data,")");

        var request = {
            "method": method,
            "url": realurl,
            "headers": this._headers,
            "httpsAgent": new https.Agent({ rejectUnauthorized: false })
        }
        if (data) {
            request["data"] = data;
        }

        return axios(request);
    }

    _handleRequest() {
        if (this._requestQ.length > 0) {
            console.log("RestApi[" + this._name + "]._handleRequest() pending: " + this._requestQ.length);
            var local = this;

            var request = this._requestQ.shift();
            this._request(request.url, request.method, request.data)
            .then(function (result) {
                request.resolve(result.data);
                //console.log("RestApi[" + local._name + "]._handleRequest(" + request.url + ") result: ", result.data);

                // if a request was handled, then wait throttle time before handling next request
                local._timeout = setTimeout(local._handleRequest.bind(local), local._throttle);
            })
            .catch((error) => {
                if ((error.request) && (error.request.res)) {
                    //console.log("RestApi[" + this._name + "]._handleRequest(" + request.url + ") error: " + error.request.res.statusMessage + " (" + error.request.res.statusCode + ")");
                    request.reject({ statusCode: error.request.res.statusCode, statusMessage: error.request.res.statusMessage });
                } else {
                    console.log("RestApi[" + this._name + "]._handleRequest(" + request.url + ") error: ");
                    console.log(error);
                    request.reject();
                }

                // Wait 5m before handling next request
                local._timeout = setTimeout(local._handleRequest.bind(local), local._throttle + 2000);
            });

        } else {

            // if no request was pending, then check again soon
            this._timeout = setTimeout(this._handleRequest.bind(this), 100);
        }
    }

    get(url) {
        console.log("RestApi[" + this._name + "].get(" + url + ")");
        var local = this;
        return new Promise(function (resolve, reject) {
            local._requestQ.push({ url: url, method: "GET", data: null, resolve: resolve, reject: reject });
        });
    }

    put(url, data) {
        console.log("RestApi[" + this._name + "].put(" + url + ")");
        var local = this;
        return new Promise(function (resolve, reject) {
            local._requestQ.push({ url: url, method: "PUT", data: data, resolve: resolve, reject: reject });
        });
    }

    post(url, data) {
        console.log("RestApi[" + this._name + "].post(" + url + ")");
        var local = this;
        return new Promise(function (resolve, reject) {
            local._requestQ.push({ url: url, method: "POST", data: data, resolve: resolve, reject: reject });
        });
    }

    delete(url, data) {
        console.log("RestApi[" + this._name + "].delete(" + url + ")");
        var local = this;
        return new Promise(function (resolve, reject) {
            local._requestQ.push({ url: url, method: "DELETE", data: data, resolve: resolve, reject: reject });
        });
    }
}

module.exports = RestApi;
