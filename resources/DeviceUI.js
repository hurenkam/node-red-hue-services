import { BaseUI } from "./BaseUI.js";

export class DeviceUI extends BaseUI {
    constructor(label="Generic Device",category="hue devices") {
        super(label,category);
        console.log("DeviceUI.constructor()");
        var instance = this;

        this.config.defaults.name =     { value:"" };
        this.config.defaults.bridge =   { type: "BridgeConfigNode", required: true };
        this.config.defaults.uuid =     { value:"", required: true };
        this.config.defaults.multi =    { value: false };
        this.config.defaults.outputs =  { value: 1 };

        this.config.inputs = 0;

        this.rtype = "device";
        this.models = null;
    }

    build(config) {
        super.build(config);
        console.log("DeviceUI.build()");

        var template_root = document.getElementById("template-root");
        if (!template_root) {
            console.log("template-root not found.")
            return;
        }

        this.selectInput(template_root,"bridge","Bridge",config.bridge);
        this.selectInput(template_root,"uuid","UUID",config.uuid);
        this.checkboxInput(template_root,"multi","Seperate outputs",config.multi);        
    }

    selectText(id) {
        console.log("DeviceUI.selectText()");
    
        var current = $('#node-input-'+id).val();
        $('#input-select-'+id).empty();
        $('#input-select-'+id).append('<input type="text" id="node-input-'+id+'" style="width: 100%" value="'+current+'" />');
    
        var button = $("#input-select-"+id+"-search");
        var icon = button.find("i");
        icon.removeClass("fa-pencil");
        icon.addClass("fa-search");
    }

    selectOption(id,url,data) {
        console.log("DeviceUI.selectOption()");
        var current = $('#node-input-'+id).val();
        var notification = RED.notify("Searching for options...", { 
            type: "compact", modal: true, fixed: true 
        });

        $.get(url, data)
        .done( function(data) {
            var options = JSON.parse(data);
    
            if(options.length <= 0)
            {
                notification.close();
                RED.notify("No options found.", { type: "error" });
                return false;
            }
    
            $("#node-input-"+id).typedInput({
                types: [
                    {
                        value: current,
                        options: options
                    }
                ]
            });
    
            var button = $("#input-select-"+id+"-search");
            var icon = button.find("i");
            icon.removeClass("fa-search");
            icon.addClass("fa-pencil");
    
            // Remove the notification
            notification.close();
        })
        .fail(function()
        {
            console.log("DeviceUI.selectOption(): failed");
    
            // Remove the notification
            notification.close();
            RED.notify("unknown error", "error");
        });
    }

    selectResource() {
        console.log("DeviceUI.selectResource()");
        var bridge_id = $('#node-input-bridge').val();
        if(!bridge_id) { 
            console.log("DeviceUI.selectResource() invalid bridge_id:", bridge_id);
            return;
        }

        var bridge = RED.nodes.node(bridge_id);
        if(!bridge) { 
            console.log("DeviceUI.selectResource(): invalid bridge:", bridge);
            return;
        }

        this.selectOption(
            "uuid",
            "BridgeConfigNode/GetSortedResourceOptions",
            {
                type: this.rtype,
                bridge_id: bridge.id,
                models: this.models
            }
        );
    }

    selectBridge() {
        console.log("DeviceUI.selectBridge()");
        this.selectOption(
            "bridge",
            "BridgeConfigNode/GetBridgeOptions",
            {}
        );
    }

    onEditPrepare(config) {
        super.onEditPrepare(config);
        console.log("DeviceUI.onEditPrepare()");

        var instance = this;
        $('#input-select-uuid-search').click(function()
        {
            if($('#input-select-uuid').find(".red-ui-typedInput-container").length > 0) {
                instance.selectText("uuid");
            } else {
                instance.selectResource();
            }
        });
        instance.selectResource();

        $('#input-select-bridge-search').click(function()
        {
            if($('#input-select-bridge').find(".red-ui-typedInput-container").length > 0) {
                instance.selectText("bridge");
            } else {
                instance.selectBridge();
            }
        });
        instance.selectBridge();
    }

    onEditSave(config) {
        console.log("DeviceUI.onEditSave()");

        var uuid = $('#node-input-uuid').val();
        var bridge = $('#node-input-bridge').val();
        var multi = $("#node-input-multi").prop('checked');

        if ((uuid) && (bridge))
        { 
            //console.log("DeviceUI.onEditSave() uuid:",uuid," bridge:",bridge);
            $.get("BridgeConfigNode/GetSortedDeviceServices", { 
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
