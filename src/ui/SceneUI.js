import { ResourceUI } from "./ResourceUI.js"

export class SceneUI extends ResourceUI {
    constructor() {
        super("Scene");
        console.log("SceneUI.constructor()");

        this.config.color = "#FFCCCC";
        this.config.inputs = 1;
        this.config.outputs = 1;
        this.config.icon = "font-awesome/fa-tachometer";

        this.rtype = "scene";
    }

    buildHelp() {
        var help = super.buildHelp();
        help["Input"] = "\
If you wish to send input to the scene, you need to address the scene specifically either by \
adding its resource id to the `msg.rids` list (formatted as JSON), or adding the 'scene' type \
to the `msg.rtypes` list (formatted as JSON).\n\
The content of `msg.payload` will then be forwarded as a 'put' request to the clip v2 url \
for the scene.\n\n\
";
        return help;
    }
}
