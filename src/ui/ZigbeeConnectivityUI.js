import { ServiceUI } from "./ServiceUI.js"

export class ZigbeeConnectivityUI extends ServiceUI {
    constructor() {
        super("Connectivity","hue services","zigbee_connectivity");
        console.log("ZigbeeConnectivityUI.constructor()");

        this.config.color = "#A8FFA8";
        this.config.icon = "font-awesome/fa-sitemap";
    }

    onEditPrepare(config) {
        super.onEditPrepare(config);
        $('#node-container-rtype').hide();
    }
}
