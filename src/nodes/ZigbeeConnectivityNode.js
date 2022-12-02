ResourceNode = require("./ResourceNode");

class ZigbeeConnectivityNode extends ResourceNode {
    #info;
    #trace;

    constructor(config) {
        super(config);
        this.#info = require('debug')('info').extend('ZigbeeConnectivityNode').extend("["+this.logid()+"]");
        this.#trace = require('debug')('trace').extend('ZigbeeConnectivityNode').extend("["+this.logid()+"]");
        this.#info("constructor()");
    }

    onUpdate(event) {
        this.#trace("onUpdate()");
        this.updateStatus();
        super.onUpdate(event);
    }

    updateStatus() {
        this.#trace("updateStatus()");
        super.updateStatus();

        var fill = "grey";
        var shape = "dot";
        var text = "";

        var resource = this.resource();
        if ((resource) && (resource.item) && (resource.item.status!=null)) {
            fill = (resource.item.status == "connected")? "green": "red";
            text = resource.item.status;
        }

        this.status({fill: fill, shape: shape, text: text});
    }
}

module.exports = ZigbeeConnectivityNode;
