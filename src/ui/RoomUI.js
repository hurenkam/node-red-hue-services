import { ResourceUI } from "./ResourceUI.js"

export class RoomUI extends ResourceUI {
    constructor() {
        super("Room");
        console.log("RoomUI.constructor()");

        this.config.color = "#D7D7A0";
        this.config.inputs = 1;
        this.config.outputs = 1;
        this.config.icon = "light.svg";

        this.rtype = "room";
    }

    buildHelp() {
        var help = super.buildHelp();
        help["Input"] += "\n\n\
For a Room you could put `['grouped_light']` in `msg.rtypes`, to indicate you want to \
address its 'grouped_light' service. In the `msg.payload` you can put for instance \
`{ 'on': { 'on': true } }` to switch the room on (or use `{ 'on': { 'on': false } }` \
to switch the room off).\n\n\
";
        return help;
    }
}
