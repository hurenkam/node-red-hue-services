const base = require("@hurenkam/node-red-hue-base");
const ResourceNode = base.ResourceNode;

class SceneNode extends ResourceNode {
    #info;

    constructor(config) {
        super(config,"scene");
        this.#info = require('debug')('info').extend('SceneNode').extend("["+this.logid()+"]");
        this.#info("constructor()");
    }
}

module.exports = SceneNode;
