import { ServiceUI } from "./ServiceUI.js"

export class MotionUI extends ServiceUI {
    constructor() {
        super("Motion","hue services","motion");
        console.log("MotionUI.constructor()");

        this.config.color = "#FFC0FF";
        this.config.icon = "font-awesome/fa-rss";
    }

    buildHelp() {
        var help = super.buildHelp();
        help["Outputs"] += "\
The Motion node only has one output. It will listen to events for the specified service \
and forward them to the output as `msg.payload` which contains the motion events in a \
JSON format conform the clip v2 specification.\n\n\
Please see the Hue CLIP API documentation: \n\n\
https://developers.meethue.com/develop/hue-api-v2";
        return help;
    }

    onEditPrepare(config) {
        super.onEditPrepare(config);
        $('#node-container-rtype').hide();
    }
}
