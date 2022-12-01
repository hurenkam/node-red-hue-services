ServiceNode = require("./ServiceNode");

class GroupedLightNode extends ServiceNode {
    #info;
    #trace;

    constructor(config) {
        super(config);
        this.#info = require('debug')('info').extend('GroupedLightNode').extend("["+this.logid()+"]");
        this.#trace = require('debug')('trace').extend('GroupedLightNode').extend("["+this.logid()+"]");
        this.#info("constructor()");
    }

    onUpdate(event) {
        this.#trace("onUpdate(",event,")");
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
        if ((resource) && (resource.item()) && (resource.item().on)) {
            if (resource.item().on.on==true) {
                fill = "yellow";

                if (resource.item().dimming) {
                    text = resource.item().dimming.brightness+"%";
                }

            } else if (resource.item().on.on==false) {
                fill = "grey";
                text = "off";
            }
        }

        this.status({fill: fill, shape: shape, text: text});
    }
}

module.exports = GroupedLightNode;
