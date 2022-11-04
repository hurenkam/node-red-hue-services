class WallSwitchModuleUI extends DeviceUI {
    constructor() {
        super("Hue Wall Switch Module");
        console.log("WallSwitchModuleUI.constructor()");

        this.models = ["RDM001","RDM004"];
    }
}
