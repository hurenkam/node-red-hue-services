BaseNode = require("./BaseNode");

class SceneCyclerNode extends BaseNode {
    constructor(config) {
        super(config);
        console.log("SceneCyclerNode[" + this.logid() + "].constructor()");
        //console.log(this.wires)
        
        this.scenes = [];
        this.current = 0;

        this.wires.forEach(output => {
            output.forEach(id => {
                //console.log(id);
                var node = BaseNode.nodeAPI.nodes.getNode(id);
                if ((node) && (node.config)) {
                    var name = node.config.name;
                    var type = node.type;
                    var bridge = node.config.bridge;
                    var uuid = node.config.uuid;
                    console.log(name,type,bridge,uuid);
                    if (type == "SceneNode") {
                        this.scenes.push({ name: name, bridge: node.config.bridge, uuid: node.config.uuid })
                    }
                }
            });
        });
    }

    onInput(msg) {
        //console.log("SceneCyclerNode[" + this.logid() + "].onInput()");
        this.selectNextScene();
    }

    selectNextScene() {
        //console.log("SceneCyclerNode[" + this.logid() + "].selectNextScene()");
        if (this.scenes.length > 0) {
            var scene = this.scenes[this.current];
            console.log("SceneCycler[" + this.logid() + "].selectNextScene():",this.current);

            this.send({ 
                rids: [scene.uuid], 
                payload: { 
                    recall: { action:"active", status:"active" } 
                } 
            });

            this.current += 1;
            if (this.current >= this.scenes.length) {
                this.current = 0;
            }
        }
    }
}

module.exports = SceneCyclerNode;
