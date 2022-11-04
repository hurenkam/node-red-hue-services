class RoomUI extends DeviceUI {
    constructor() {
        super("Room");
        console.log("RoomUI.constructor()");

        this.config.color = "#D7D7A0";
        this.config.inputs = 1;
        this.config.outputs = 1;
        this.config.icon = "light.svg";

        this.rtype = "room";
        this.models = null;
    }
}
