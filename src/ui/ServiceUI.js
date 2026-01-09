/*
import { BaseUI } from "/resources/@hurenkam/node-red-hue-base/BaseUI.js";

export class ServiceUI extends BaseUI {
    constructor(label="Service",category="hue services",rtype="") {
        super(label,category);
        console.log("ServiceUI.constructor(",label,category,rtype,")");

        this.config.defaults.name =       { value:"" };
        this.config.defaults.bridge =     { type: "@hurenkam/node-red-hue-base/BridgeConfigNode", required: true };
        this.config.defaults.rtype =      { value:rtype, required: true };
        this.config.defaults.owner =      { value:"", required: true };
        this.config.defaults.uuid =       { value:"", required: true };
        this.config.defaults.startevent = { value: false };

        this.config.inputs = 1;
        this.config.color = "#EEEEEE";
        this.config.icon = "font-awesome/fa-gears";
    }

    buildHelp() {
        var help = super.buildHelp();
        help["Settings"] += "\
#### Bridge\n\
Select the hue bridge for your device or resource.\n\n\
#### Type\n\
If the node works for multiple types, then you can select a type here. Otherwise \
the field is hidden. \
\n\n\
#### Owner\n\
Here you can either fill in the UUID of the device that offers the service \
or alternately you can select the owner from the available list of devices.\
\n\n\
#### UUID\n\
If the selected owner offers only one service of the (pre)selected type, then \
this field is hidden, and the one choice is automatically selected. \n\n\
If not, then it offers you a choice of either filling in the UUID of the service \
to be selected, or you can select one from the list which is offered. \
\n\n\
#### Send current state event at startup\n\
When this flag is enabled the node will send an event at startup with its initial state.\n\
";
        return help;
    }

    ui() {
        var text = super.ui();
        console.log("ServiceUI.ui()");

        text += this.uiTextInput("bridge","Bridge");
        text += this.uiSelectInput("rtype","Type");
        text += this.uiSelectInput("owner","Owner");
        text += this.uiSelectInput("uuid","UUID");
        text += this.uiCheckboxInput("startevent","Send current state event at startup");
        return text;
    }

    selectText(id) {
        console.log("ServiceUI.selectText()");

        var current = $('#node-input-'+id).val();
        $('#input-select-'+id).empty();
        $('#input-select-'+id).append('<input type="text" id="node-input-'+id+'" style="width: 100%" value="'+current+'" />');

        var button = $("#input-select-"+id+"-search");
        var icon = button.find("i");
        icon.removeClass("fa-pencil");
        icon.addClass("fa-search");
    }

    selectOption(id,url,data) {
        console.log("ServiceUI.selectOption()");
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
            console.log("ServiceUI.selectOption(): failed");

            // Remove the notification
            notification.close();
            RED.notify("unknown error", "error");
        });
    }

    selectType() {
        console.log("ServiceUI.selectType()");
        var bridge_id = $('#node-input-bridge').val();
        var bridge = (bridge_id)? RED.nodes.node(bridge_id): null;

        if ((!bridge_id) || (!bridge)) {
            console.log("ResourceUI.selectResource(): invalid bridge:", bridge_id);
            return;
        }

        this.selectOption(
            "rtype",
            "BridgeConfigNode/GetSortedTypeOptions",
            {
                bridge_id: bridge.id,
            }
        );
    }

    selectOwner() {
        console.log("ServiceUI.selectOwner()");
        var bridge_id = $('#node-input-bridge').val();
        var bridge = (bridge_id)? RED.nodes.node(bridge_id): null;

        if ((!bridge_id) || (!bridge)) {
            console.log("ServiceUI.selectOwner(): invalid bridge:", bridge_id);
            return;
        }

        var rtype = $('#node-input-rtype').val();
        if (!rtype) {
            console.log("ServiceUI.selectOwner(): invalid rtype:", rtype);
            return;
        }

        console.log("ServiceUI.selectOwner()",bridge.id,rtype);
        this.selectOption(
            "owner",
            "BridgeConfigNode/GetSortedOwnerOptions",
            {
                bridge_id: bridge.id,
                rtype: rtype
            }
        );
    }

    selectService() {
        console.log("ServiceUI.selectService()");

        console.log("ServiceUI.selectService()");
        var bridge_id = $('#node-input-bridge').val();
        var bridge = (bridge_id)? RED.nodes.node(bridge_id): null;

        if ((!bridge_id) || (!bridge)) {
            console.log("ServiceUI.selectService(): invalid bridge:", bridge_id);
            return;
        }

        var rtype = $('#node-input-rtype').val();
        if (!rtype) {
            console.log("ServiceUI.selectService(): invalid rtype:", rtype);
            return;
        }

        var owner = $('#node-input-owner').val();
        if (!owner) {
            console.log("ServiceUI.selectService(): invalid owner:", owner);
            return;
        }

        this.selectOption(
            "uuid",
            "BridgeConfigNode/GetSortedServiceOptions",
            {
                bridge_id: bridge.id,
                rtype: rtype,
                owner: owner
            }
        );
    }

    showServiceSelectionIfThereIsChoice() {
        console.log("TemperatureUI[].showServiceSelectionIfThereIsChoice()");

        var bridge = $('#node-input-bridge').val();
        var owner = $('#node-input-owner').val();
        var rtype = $('#node-input-rtype').val();
        
        if ((!bridge) || (!owner) || (owner=="") || (!rtype) || (rtype=="")) return;

        $.get("BridgeConfigNode/GetSortedServiceOptions", {
            bridge_id: bridge,
            rtype: rtype,
            owner: owner
        })
        .done(function(data) {
            var options = JSON.parse(data);
            console.log("Options:",options);
            if (options.length == 1) {
                $('#node-input-uuid').val(options[0].value);
                $('#node-container-uuid').hide();
            } else if (options.length > 1) {
                $('#node-container-uuid').show();
            }
        })
    };

    onEditPrepare(config) {
        super.onEditPrepare(config);
        console.log("ServiceUI.onEditPrepare()",config);
        var instance = this;

        $('#input-select-rtype-search').click(function()
        {
            if($('#input-select-rtype').find(".red-ui-typedInput-container").length > 0) {
                instance.selectText("rtype");
            } else {
                instance.selectType();
            }
        });

        $('#input-select-owner-search').click(function()
        {
            if($('#input-select-owner').find(".red-ui-typedInput-container").length > 0) {
                instance.selectText("owner");
            } else {
                instance.selectOwner();
            }
        });

        $('#input-select-uuid-search').click(function()
        {
            if($('#input-select-uuid').find(".red-ui-typedInput-container").length > 0) {
                instance.selectText("uuid");
            } else {
                instance.selectService();
            }
        });

        $('#node-input-owner').change(function() {
            console.log("TemperatureUI[].onEditPrepare().on('change')");
            instance.showServiceSelectionIfThereIsChoice();
            instance.selectText("uuid");
            instance.selectService();
        });

        $('#node-container-uuid').hide();

        this.showServiceSelectionIfThereIsChoice();
    }
}
*/