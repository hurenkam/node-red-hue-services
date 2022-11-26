import { ServiceUI } from "./ServiceUI.js"

export class RelativeRotaryUI extends ServiceUI {
    constructor() {
        super("Relative Rotary","hue services","relative_rotary");
        console.log("RelativeRotaryUI.constructor()");

        this.config.color = "#E0FFB0";
        this.config.icon = "font-awesome/fa-circle-o-notch";
    }

    buildHelp() {
        var help = super.buildHelp();
        help["Outputs"] += "\
The Relative Rotary node only has one output. It will listen to events for the specified service \
and forward them to the output as `msg.payload` which contains the relative_rotary events in a \
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
