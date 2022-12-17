ServiceNode = require("./ServiceNode");

class SceneNode extends ServiceNode {
    #info;

    constructor(config) {
        super(config,"scene");
        this.#info = require('debug')('info').extend('SceneNode').extend("["+this.logid()+"]");
        this.#info("constructor()");
    }
}

module.exports = SceneNode;
