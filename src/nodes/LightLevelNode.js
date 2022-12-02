ResourceNode = require("./ResourceNode");

class LightLevelNode extends ResourceNode {
    #info;
    #trace;

    constructor(config) {
        super(config);
        this.#info = require('debug')('info').extend('LightLevelNode').extend("["+this.logid()+"]");
        this.#trace = require('debug')('trace').extend('LightLevelNode').extend("["+this.logid()+"]");
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
        if ((resource) && (resource.item()) && (resource.item().light)) {
            if (resource.item().light.light_level!=null) {
                fill = "green";
                text = ""+resource.item().light.light_level;
            }
        }

        this.status({fill: fill, shape: shape, text: text});
    }
}

module.exports = LightLevelNode;
