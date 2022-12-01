ResourceNode = require("./ResourceNode");

class ServiceNode extends ResourceNode {
    #info;

    constructor(config) {
        super(config);
        this.#info = require('debug')('info').extend('ServiceNode').extend("["+this.logid()+"]");
        this.#info("constructor()");
    }
}

module.exports = ServiceNode;
