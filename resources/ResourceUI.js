import { BaseUI } from "./BaseUI.js";

export class ResourceUI extends BaseUI {
    constructor(label="Resource",category="hue resources") {
        super(label,category);
        console.log("ResourceUI.constructor()");

        this.config.defaults.name =     { value:"" };
        this.config.defaults.bridge =   { type: "BridgeConfigNode", required: true };
        this.config.defaults.uuid =     { value:"", required: true };

        this.config.inputs = 1;
        this.config.color = "#EEEEEE";
        this.config.icon = "font-awesome/fa-gears";

        this.rtype = null;
        this.models = null;
    }

    build(config) {
        super.build(config);
        console.log("ResourceUI.build()");

        var template_root = this.getTemplateRoot();
        if (!template_root) {
            console.log("template-root not found.")
            return;
        }

        this.selectInput(template_root,"bridge","Bridge",config.bridge);
        this.selectInput(template_root,"uuid","UUID",config.uuid);
    }

    selectText(id) {
        console.log("ResourceUI.selectText()");

        var current = $('#node-input-'+id).val();
        $('#input-select-'+id).empty();
        $('#input-select-'+id).append('<input type="text" id="node-input-'+id+'" style="width: 100%" value="'+current+'" />');

        var button = $("#input-select-"+id+"-search");
        var icon = button.find("i");
        icon.removeClass("fa-pencil");
        icon.addClass("fa-search");
    }

    selectOption(id,url,data) {
        console.log("ResourceUI.selectOption()");
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
            console.log("ResourceUI.selectOption(): failed");

            // Remove the notification
            notification.close();
            RED.notify("unknown error", "error");
        });
    }

    selectResource() {
        console.log("ResourceUI.selectResource()");
        var bridge_id = $('#node-input-bridge').val();
        if(!bridge_id) {
            console.log("ResourceUI.selectResource() invalid bridge_id:", bridge_id);
            return;
        }

        var bridge = RED.nodes.node(bridge_id);
        if(!bridge) {
            console.log("ResourceUI.selectResource(): invalid bridge:", bridge);
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
        console.log("ResourceUI.selectBridge()");
        this.selectOption(
            "bridge",
            "BridgeConfigNode/GetBridgeOptions",
            {}
        );
    }

    onEditPrepare(config) {
        super.onEditPrepare(config);
        console.log("ResourceUI.onEditPrepare()");

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
}
