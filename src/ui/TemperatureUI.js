import { ServiceUI } from "./ServiceUI.js"

export class TemperatureUI extends ServiceUI {
    constructor() {
        super("Temperature","hue services","temperature");
        console.log("TemperatureUI.constructor()");

        this.config.color = "#A8FFFF";
        this.config.icon = "font-awesome/fa-thermometer-half";
    }

    buildHelp() {
        var help = super.buildHelp();
        help["Outputs"] += "\
The Temperature node only has one output. It will listen to events for the specified service \
and forward them to the output as `msg.payload` which contains the temperature events in a \
JSON format conform the clip v2 specification.\n\n\
";
        return help;
    }

    onEditPrepare(config) {
        super.onEditPrepare(config);
        $('#node-container-rtype').hide();
    }
}
