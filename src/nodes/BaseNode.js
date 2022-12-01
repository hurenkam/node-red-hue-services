const _error = require('debug')('error').extend('BaseNode');
const _warn  = require('debug')('warn').extend('BaseNode');
const _info  = require('debug')('info').extend('BaseNode');
const _trace = require('debug')('trace').extend('BaseNode');

class BaseNode {
    static nodeAPI = null;
    #onInput;
    #onClose;

    #error;
    #warn;
    #info;
    #trace;

    constructor(config) {
        this.config = config;

        this.#error = _error.extend("["+this.logid()+"]");
        this.#warn  = _warn. extend("["+this.logid()+"]");
        this.#info  = _info. extend("["+this.logid()+"]");
        this.#trace = _trace.extend("["+this.logid()+"]");

        this.#info("constructor()");
        BaseNode.nodeAPI.nodes.createNode(this,config);
        var instance = this;

        this.#onInput = function (msg) {
            try {
                instance.onInput(msg);
            } catch (error) {
                this.#error(error);
            }
        }
    
        this.#onClose = function () {
            try {
                instance.destructor();
            } catch (error) {
                this.#error(error);
            }
        }
    
        this.on('input', this.#onInput);
        this.on('close', this.#onClose);
    }

    logid() {
        return (this.config)? ((this.config.name)? this.config.name: this.config.id) : "<?>";
    }

    getStatusFill() {
        this.#trace("getStatusFill()");
        return null;
    }

    getStatusText() {
        this.#trace("getStatusText()");
        return null;
    }

    getStatusShape() {
        this.#trace("getStatusShape()");
        return null;
    }

    updateStatus() {
        this.#trace("updateStatus()");
        try {
            var fill =  this.getStatusFill();
            var shape = this.getStatusShape();
            var text =  this.getStatusText();

            if ((shape) && (!fill)) fill = "grey";
            if ((fill) && (!shape)) shape = "dot";

            this.status({
                fill:  fill,
                shape: shape,
                text:  text
            });
        } catch (error) {
            this.#error(error);
        }
    }

    onInput(msg) {
        this.#trace("onInput(",msg,")");
    }

    destructor() {
        this.#info("destructor()");
        this.off('input',this.#onInput);
        this.off('close',this.#onClose);
        this.config = null;
    }
}

module.exports = BaseNode;
