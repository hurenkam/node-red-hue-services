import { ServiceUI } from "./ServiceUI.js"

export class LightLevelUI extends ServiceUI {
    constructor() {
        super("Light Level","hue services","light_level");
        console.log("LightLevelUI.constructor()");

        this.config.color = "#FFFFC0";
        this.config.icon = "font-awesome/fa-sun-o";
    }

    buildHelp() {
        var help = super.buildHelp();
        help["Outputs"] += "\
The Light Level node only has one output. It will listen to events for the specified service \
and forward them to the output as `msg.payload` which contains the light_level events in a \
JSON format conform the clip v2 specification.\n\n\
";
        return help;
    }

    onEditPrepare(config) {
        super.onEditPrepare(config);
        $('#node-container-rtype').hide();
    }
}
