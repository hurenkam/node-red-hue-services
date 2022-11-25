import { DeviceUI } from "./DeviceUI.js"

export class LampUI extends DeviceUI {
    constructor() {
        super("Lamp");
        console.log("LampUI.constructor()");

        this.config.inputs = 1;
        this.config.outputs = 1;
        this.config.color = "#FDF0C2";
        this.config.icon = "light.svg";

        this.models = [
            "440400982842",       // Hue play
            "ICZB-IW11D",         // Hue white light (iCasa)
            "LCA006",             // Hue color lamp
            "LCG002",             // Hue color spot
            "LCO005",             // Hue lightguide bulb
            "LCT001",             // Hue color lamp
            "LLC001",             // LivingColors
            "LLC020",             // Hue go
            "LOM001",             // Hue Smart plug
            "LST001","LST002",    // Light strip
            "LTA001",             // Hue ambiance lamp
            "LTW001","LTW013",    // Hue ambiance spot
            "LWA004",             // Hue fillament bulb
            "LWB001",             // LivingWhites bulb
            "LWB006",             // Hue white lamp
            "LWL001",             // LivingWhites plug
            "LWL003",             // Luminaire
            "LWO001"              // Hue fillament bulb
        ];
    }

    buildHelp() {
        var help = super.buildHelp();
        help["Input"] += "\n\n\
For a Lamp you can put `['light']` in `msg.rtypes`, to indicate you want to \
address its 'light' service. In the `msg.payload` you can put for instance \
`{ 'on': { 'on': true } }` to switch the light on (or use `{ 'on': { 'on': false } }` \
to switch the light off).\n\n\
";
        return help;
    }
}
