class MotionSensorUI extends DeviceUI {
    constructor() {
        super("Hue Motion Sensor");
        console.log("MotionSensorUI.constructor()");

        this.config.color = "#E6E0F8";
        this.config.icon = "font-awesome/fa-rss";

        this.models = ["SML001","SML002"];
    }
}
