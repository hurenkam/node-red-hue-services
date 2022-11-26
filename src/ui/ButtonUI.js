import { ServiceUI } from "./ServiceUI.js"

export class ButtonUI extends ServiceUI {
    constructor() {
        super("Button","hue services","button");
        console.log("ButtonUI.constructor()");

        this.config.color = "#B0FFE0";
        this.config.icon = "font-awesome/fa-circle";
    }

    buildHelp() {
        var help = super.buildHelp();
        help["Outputs"] += "\
The Button node only has one output. It will listen to events for the specified service \
and forward them to the output as `msg.payload` which contains the button events in a \
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
