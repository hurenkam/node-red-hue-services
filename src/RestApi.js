const axios = require('axios');
const https = require('https');
const limiter = require('limiter');

const _error = require('debug')('error').extend('RestApi');
const _warn  = require('debug')('warn').extend('RestApi');
const _info  = require('debug')('info').extend('RestApi');
const _trace = require('debug')('trace').extend('RestApi');

class RestApi {
    #ip;
    #headers;
    #requestQ;
    #timeout;
    #limiter;

    #error;
    #warn;
    #info;
    #trace;

    constructor(name,ip,throttle,headers) {
        this.#limiter = new limiter.RateLimiter(throttle);

        this.#error = _error.extend("["+name+"]");
        this.#warn  = _warn. extend("["+name+"]");
        this.#info  = _info. extend("["+name+"]");
        this.#trace = _trace.extend("["+name+"]");

        this.#info("constructor()");

        this.#ip = ip;
        this.#headers = { "Content-Type": "application/json; charset=utf-8" };
        if (headers) {
            Object.keys(headers).forEach(key => {
                this.#headers[key] = headers[key];
            });
        };

        this.#requestQ = [];
        this.#handleRequest();
        this.#timeout = null;
    }

    destructor() {
        this.#info("destructor()");
        if (this.#timeout) {
            clearTimeout(this.#timeout);
            this.#timeout = null;
        }

        if (this.#requestQ) {
            this.#requestQ.forEach(item => {
                item.resolve = null;
                item.reject = null;
            });
        }
        this.#requestQ = null;
    }

    async #request(url, method="GET", data=null) {
        var realurl = "https://" + this.#ip + url;
        this.#info("_request(" + realurl + ", " + method + ",",data,")");

        var request = {
            "method": method,
            "url": realurl,
            "headers": this.#headers,
            "httpsAgent": new https.Agent({ rejectUnauthorized: false })
        }
        if (data) {
            request["data"] = data;
        }

        return axios(request);
    }

    #handleRequest() {
        if ((this.#requestQ) && (this.#requestQ.length > 0)) {
            this.#info("_handleRequest() pending: " + this.#requestQ.length);
            var local = this;

            var request = this.#requestQ.shift();
            this.#info("_handleRequest() url: " + request.url + " method: " + request.method + " data: " + request.data);
            this.#request(request.url, request.method, request.data)
            .then(async (result) => {
                await local.#limiter.removeTokens(1,()=>{});
                request.resolve(result.data);
                this.#timeout = setTimeout(this.#handleRequest.bind(this), 0);
            })
            .catch((error) => {
                this.#error("_handleRequest(" + request.url + ") error: ");
                this.#error(error);
                var info = {};
                info.error = error;
                info.request = request;
                request.reject(info);

                // back off for a few seconds, just in case we ran into a 429 error.
                local.#timeout = setTimeout(local.#handleRequest.bind(local), 5000);
            });

        } else {
            // if no request was pending, then check again soon
            this.#timeout = setTimeout(this.#handleRequest.bind(this), 100);
        }
    }

    get(url) {
        this.#trace("get(" + url + ")");
        var local = this;

        let promise = new Promise((resolve, reject) => {
            local.#requestQ.push({ url: url, method: "GET", data: null, resolve: resolve, reject: reject });
        });

        return promise;
    }

    put(url, data) {
        this.#trace("put(" + url + ")");
        var local = this;

        let promise = new Promise((resolve, reject) => {
            local.#requestQ.push({ url: url, method: "PUT", data: data, resolve: resolve, reject: reject });
        });

        return promise;
    }

    post(url, data) {
        this.#trace(".post(" + url + ")");
        var local = this;

        let promise = new Promise((resolve, reject) => {
            local.#requestQ.push({ url: url, method: "POST", data: data, resolve: resolve, reject: reject });
        });

        return promise;
    }

    delete(url, data) {
        this.#trace(".delete(" + url + ")");
        var local = this;

        let promise = new Promise((resolve, reject) => {
            local.#requestQ.push({ url: url, method: "DELETE", data: data, resolve: resolve, reject: reject });
        });

        return promise;
    }
}

module.exports = RestApi;
