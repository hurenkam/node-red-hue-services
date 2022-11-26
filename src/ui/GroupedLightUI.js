import { ServiceUI } from "./ServiceUI.js"

export class GroupedLightUI extends ServiceUI {
    constructor() {
        super("Grouped Light","hue services","grouped_light");
        console.log("GroupedLightUI.constructor()");

        this.config.color = "#FFFFA8";
        //this.config.color = "#E7E7AE";
        this.config.icon = "light.svg";
    }

    buildHelp() {
        var help = super.buildHelp();
        help["Inputs"] += "\
The Grouped Light node accepts input. The `msg.payload` content (in JSON format) will be send as a put request to the associated Clip v2 resource url.\n\n\
Please see the Hue CLIP API documentation: \n\n\
https://developers.meethue.com/develop/hue-api-v2";
        help["Outputs"] += "\
The Grouped Light node only has one output. It will listen to Clip v2 events for this service \
and forward them to the output as `msg.payload` which contains the grouped_light events in a \
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
