import { ServiceUI } from "./ServiceUI.js"

export class ZigbeeConnectivityUI extends ServiceUI {
    constructor() {
        super("Zigbee Connectivity","hue services","zigbee_connectivity");
        console.log("ZigbeeConnectivityUI.constructor()");

        this.config.color = "#A8FFA8";
        this.config.icon = "font-awesome/fa-sitemap";
    }

    buildHelp() {
        var help = super.buildHelp();
        help["Outputs"] += "\
The Zigbee Connectivity node only has one output. It will listen to events for the specified service \
and forward them to the output as `msg.payload` which contains the zigbee_connectivity events in a \
JSON format conform the clip v2 specification.\n\n\
";
        return help;
    }

    onEditPrepare(config) {
        super.onEditPrepare(config);
        $('#node-container-rtype').hide();
    }
}
