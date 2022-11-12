import { ResourceUI } from "./ResourceUI.js";

export class DeviceUI extends ResourceUI {
    constructor(label="Generic Device",category="hue devices") {
        super(label,category);
        console.log("DeviceUI.constructor()");

        this.config.defaults.multi = { value: false };

        this.rtype = "device";
        this.models = null;
    }

    build(config) {
        super.build(config);
        console.log("DeviceUI.build()");

        var template_root = this.getTemplateRoot();
        if (!template_root) {
            console.log("template-root not found.")
            return;
        }

        this.checkboxInput(template_root,"multi","Seperate outputs",config.multi);        
    }

    onEditSave(config) {
        console.log("DeviceUI.onEditSave()");

        var uuid = $('#node-input-uuid').val();
        var bridge = $('#node-input-bridge').val();
        var multi = $("#node-input-multi").prop('checked');

        if ((uuid) && (bridge))
        { 
            //console.log("DeviceUI.onEditSave() uuid:",uuid," bridge:",bridge);
            $.get("BridgeConfigNode/GetSortedServicesById", { 
                bridge_id: bridge, 
                uuid: uuid,
            })
            .done( function(data) {
                var services = JSON.parse(data);
                //console.log("DeviceUI.onEditSave(): Found",services.length,"services.");
                if (services.length > 0) {
                    config.outputs = services.length;
                    config.outputLabels = [];
                    if (multi) {
                        services.forEach(service => {
                            config.outputLabels.push(service.rtype);
                        });
                    } else {
                        config.outputs = 1;
                    }
                }
            });
        }
        super.onEditSave(config);
    }
}
