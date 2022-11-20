import { ResourceUI } from "./ResourceUI.js"

export class ZoneUI extends ResourceUI {
    constructor() {
        super("Zone");
        console.log("ZoneUI.constructor()");

        this.config.color = "#E7E7AE";
        this.config.inputs = 1;
        this.config.outputs = 1;
        this.config.icon = "light.svg";

        this.rtype = "zone";
    }

    buildHelp() {
        var help = super.buildHelp();
        help["Input"] += "\n\n\
For a Zone you could put `['grouped_light']` in `msg.rtypes`, to indicate you want to \
address its 'grouped_light' service. In the `msg.payload` you can put for instance \
`{ 'on': { 'on': true } }` to switch the zone on (or use `{ 'on': { 'on': false } }` \
to switch the zone off).\n\n\
";
        return help;
    }
}
