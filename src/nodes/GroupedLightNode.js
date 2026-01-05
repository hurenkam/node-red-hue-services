const base = require("@hurenkam/node-red-hue-base");
const ResourceNode = base.ResourceNode;

class GroupedLightNode extends ResourceNode {
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

        var fill = "grey";
        var shape = "dot";
        var text = "";

        var resource = this.resource();
        if ((resource) && (resource.data()) && (resource.data().on)) {
            if (resource.data().on.on==true) {
                fill = "yellow";

                if (resource.data().dimming) {
                    text = resource.data().dimming.brightness+"%";
                }

            } else if (resource.data().on.on==false) {
                fill = "grey";
                text = "off";
            }
        }

        this.status({fill: fill, shape: shape, text: text});
    }
}

module.exports = GroupedLightNode;
