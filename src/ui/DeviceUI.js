import { ResourceUI } from "./ResourceUI.js";

export class DeviceUI extends ResourceUI {
    constructor(label="Generic Device",category="hue devices") {
        super(label,category);
        console.log("DeviceUI.constructor():",this.constructor.name);

        this.config.defaults.multi = { value: false };

        this.rtype = "device";
        this.models = null;
    }

    buildHelp() {
        var help = super.buildHelp();
        help["Settings"] += "\
#### Seperate outputs\n\
Select this if you wish to have a seperate output for each service the device offers.\n\n\
";
        help["Input"] = "\
If you wish to address the resource itself, or one of the services it owns, you need to \
address them specifically either by adding the resource id to the `msg.rids` list (formatted \
as JSON), or adding the resource type to the `msg.rtypes` list (formatted as JSON).\n\
The content of `msg.payload` will then be forwarded as a 'put' request to the clip v2 url \
for the resource.\n\n\
";
        help['Outputs'] = "\
All events pertaining to either the device or one of its resources will be monitored and passed \
as `msg.payload` to the output (this is formatted as a json object). See the clip v2 specification \
as to what exactly that output will be for the specific services you are interested in.\n\n\
If you have selected *Seperate outputs* then you will see that the device and each of its \
services has a seperate output. Note that the labels on the outputs are automatically set \
to enumerate the type of the resource.\n\n\
";
        help['Details'] = "\
For more detailed information regarding the content of the `msg.payload`, either for incoming \
or outgoing messages, please see the Hue CLIP API documentation: \n\n\
https://developers.meethue.com/develop/hue-api-v2 \
";
        return help;
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

    updateOutputs(config) {
        var uuid = $('#node-input-uuid').val();
        var bridge = $('#node-input-bridge').val();
        var multi = $("#node-input-multi").prop('checked');
        console.log("DeviceUI.updateOutputs()",config)

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
                            config.outputLabels.push(service.label);
                        });
                    } else {
                        config.outputs = 1;
                    }
                }
            });
        }
    }

    onEditPrepare(config) {
        this.updateOutputs(config);
        super.onEditPrepare(config);
    }

    onEditSave(config) {
        console.log("DeviceUI.onEditSave()");
        this.updateOutputs(config);
        super.onEditSave(config);
    }
}
