const axios = require('axios');
const https = require('https');
const limiter = require('limiter');

class RestApi {
    constructor(name,ip,throttle,headers) {
        this._name = name;
        this.limiter = new limiter.RateLimiter({ tokensPerInterval: 3, interval: "second" });

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
            .then(async (result) => {
                await local.limiter.removeTokens(1,()=>{});
                request.resolve(result.data);
                this._timeout = setTimeout(this._handleRequest.bind(this), 0);
            })
            .catch((error) => {
                console.log("RestApi[" + this._name + "]._handleRequest(" + request.url + ") error: ");
                console.log(error);
                request.reject();

                // back off for a few seconds, just in case we ran into a 429 error.
                local._timeout = setTimeout(local._handleRequest.bind(local), 5000);
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
