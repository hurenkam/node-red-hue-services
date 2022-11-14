class BaseNode {
    static nodeAPI = null;

    constructor(config) {
        this.config = config;
        console.log("BaseNode[" + this.logid() + "].constructor()");
        BaseNode.nodeAPI.nodes.createNode(this,config);
        var instance = this;

        this._onInput = function (msg) {
            try {
                instance.onInput(msg);
            } catch (error) {
                console.log(error);
            }
        }
    
        this._onClose = function () {
            try {
                instance.onClose();
            } catch (error) {
                console.log(error);
            }
        }
    
        this.on('input', this._onInput);
        this.on('close', this._onClose);
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
        //console.log("BaseNode[" + this.logid() + "].onInput(",msg,")");
    }

    onClose() {
        console.log("BaseNode[" + this.logid() + "].onClose()");
        this.off('input',this._onInput);
        this.off('close',this._onClose);
        //this.config = null;
    }
}

module.exports = BaseNode;
