import { ServiceUI } from "./ServiceUI.js"

export class ContactUI extends ServiceUI {
    constructor() {
        super("Contact","hue services","contact");
        console.log("ContactUI.constructor()");

        this.config.color = "#FFD8FF";
        this.config.icon = "font-awesome/fa-step-forward";
    }

    buildHelp() {
        var help = super.buildHelp();
        help["Outputs"] += "\
The Contact node only has one output. It will listen to events for the specified service \
and forward them to the output as `msg.payload` which contains the contact events in a \
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
