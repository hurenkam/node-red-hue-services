import { ServiceUI } from "./ServiceUI.js"

export class DevicePowerUI extends ServiceUI {
    constructor() {
        super("Device Power","hue services","device_power");
        console.log("DevicePowerUI.constructor()");

        this.config.color = "#B0E0FF";
        this.config.icon = "font-awesome/fa-battery-three-quarters";
    }

    buildHelp() {
        var help = super.buildHelp();
        help["Outputs"] += "\
The Device Power node only has one output. It will listen to events for the specified service \
and forward them to the output as `msg.payload` which contains the device_power events in a \
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
