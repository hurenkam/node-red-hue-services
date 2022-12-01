class BaseNode {
    static nodeAPI = null;
    #onInput;
    #onClose;

    constructor(config) {
        this.config = config;
        console.log("BaseNode[" + this.logid() + "].constructor()");
        BaseNode.nodeAPI.nodes.createNode(this,config);
        var instance = this;

        this.#onInput = function (msg) {
            try {
                instance.onInput(msg);
            } catch (error) {
                console.log(error);
            }
        }
    
        this.#onClose = function () {
            try {
                instance.destructor();
            } catch (error) {
                console.log(error);
            }
        }
    
        this.on('input', this.#onInput);
        this.on('close', this.#onClose);
    }

    logid() {
        return (this.config)? ((this.config.name)? this.config.name: this.config.id) : "<?>";
    }

    getStatusFill() {
        return null;
    }

    getStatusText() {
        return null;
    }

    getStatusShape() {
        return null;
    }

    updateStatus() {
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
            console.log(error);
        }
    }

    onInput(msg) {
        console.log("BaseNode[" + this.logid() + "].onInput(",msg,")");
    }

    destructor() {
        console.log("BaseNode[" + this.logid() + "].destructor()");
        this.off('input',this.#onInput);
        this.off('close',this.#onClose);
        this.config = null;
    }
}

module.exports = BaseNode;
