ServiceNode = require("./ServiceNode");

class DevicePowerNode extends ServiceNode {
    #info;
    #trace;

    constructor(config) {
        super(config);
        this.#info = require('debug')('info').extend('DevicePowerNode').extend("["+this.logid()+"]");
        this.#trace = require('debug')('trace').extend('DevicePowerNode').extend("["+this.logid()+"]");
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
        if ((resource) && (resource.item()) && (resource.item().power_state) && (resource.item().power_state.battery_level!=null)) {
            fill = (resource.item().power_state.battery_level > 10)? "green" : "red";
            text = resource.item().power_state.battery_level+"%";
        }

        this.status({fill: fill, shape: shape, text: text});
    }
}

module.exports = DevicePowerNode;
