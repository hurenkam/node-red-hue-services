module.exports = function(RED) {
    "use strict";

    class SceneNode {
        constructor(config) {
            console.log("SceneNode["+ config.name +"].constructor()");
            RED.nodes.createNode(this,config);

            this.config = config;
            this.clip = RED.nodes.getNode(config.bridge).clip;
            this.url = "/clip/v2/resource/scene/" + config.uuid;

            this.clip.on(config.uuid, (event) => {
                console.log("SceneNode["+config.name+"].clip.on(" + config.uuid + ")");
                //console.log(event);
                this.onUpdate(event.resource);
                this.updateStatus();
            });

            this.on('input', function(msg) {
                console.log("SceneNode["+ this.config.name +"].on('input') msg.payload:");
                console.log(msg.payload);
                this.clip.put(this.url,msg.payload);
            });
        }

        onUpdate(resource) {
            console.log("SceneNode["+ this.config.name +"].onUpdate()");
            //console.log(resource);

            if ((!resource.startup) || (resource.startup === false)) {
                this.send({ payload: resource });
            }
        }

        updateStatus() {
            console.log("SceneNode["+ this.config.name +"].updateStatus()");
        }
    }

    RED.nodes.registerType("SceneNode",SceneNode);
}

