class MotionSensorUI extends DeviceUI {
    constructor() {
        super("Hue Motion Sensor");
        console.log("MotionSensorUI.constructor()");

        this.config.defaults.smart = { value: true }
        this.config.defaults.motiontimeout = { value: 10000 }
        this.config.inputs = 1
        this.config.color = "#E6E0F8";
        this.config.icon = "font-awesome/fa-rss";

        this.models = ["SML001","SML002"];
    }

    build(config) {
        super.build(config);
        console.log("MotionSensorUI.build()");
        console.log(config);
        var template_root = document.getElementById("template-root");
        if (!template_root) {
            console.log("template-root not found.")
            return;
        }

        this.checkboxInput(template_root,"smart","Smart mode",config.smart);        
        this.numberInput(template_root,"motiontimeout","Motion timeout",config.motiontimeout);        
    }
}
