import { ServiceUI } from "/resources/@hurenkam/node-red-hue-base/ServiceUI.js";

export class CameraMotionUI extends ServiceUI {
    constructor() {
        super("Camera Motion","hue services","camera_motion");
        console.log("CameraMotionUI.constructor()");

        this.config.color = "#FFC0FF";
        this.config.icon = "font-awesome/fa-rss";
    }

    buildHelp() {
        var help = super.buildHelp();
        help["Outputs"] += "\
The CameraMotion node only has one output. It will listen to events for the specified service \
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
