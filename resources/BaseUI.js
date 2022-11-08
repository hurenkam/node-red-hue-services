export class BaseUI {
    constructor(label="Base", category="base") {
        console.log("BaseUI.constructor()");

        var instance = this;
        this.config = {
            category: category,
            defaults: {
                name:      { value:"" },
            },
            inputs: 1,
            outputs: 1,
            label: function() {
                return this.name||label;
            },
            paletteLabel: label,
            oneditprepare: function() { instance.onEditPrepare(this) },
            oneditsave:    function() { instance.onEditSave(this) },
            oneditcancel:  function() { instance.onEditCancel(this) },
        }

        //console.log(this.config)
    }

    textInput(parent,id,label,value) {
        console.log("BaseUI.textInput("+id+")");
        var item = document.createElement("div");
        item.setAttribute("class","form-row");
        item.setAttribute("id","node-container-" + id);
        item.innerHTML = '\
            <label for="node-input-'+ id +'"><i class="fa fa-tag"></i> '+ label +'</label>\
            <input type="text" id="node-input-'+ id +'" value="'+ value +'">';
        parent.appendChild(item);
    }

    numberInput(parent,id,label,value) {
        console.log("BaseUI.textInput("+id+")");
        var item = document.createElement("div");
        item.setAttribute("class","form-row");
        item.setAttribute("id","node-container-" + id);
        item.innerHTML = '\
            <label for="node-input-'+ id +'"><i class="fa fa-tag"></i> '+ label +'</label>\
            <input type="number" id="node-input-'+ id +'" value="'+ value +'">';
        parent.appendChild(item);
    }

    jsonInput(parent,id,label,value) {
        console.log("BaseUI.jsonInput("+id+")");
        var item = document.createElement("div");
        item.setAttribute("class","form-row");
        item.setAttribute("id","node-container-" + id);
        item.innerHTML = '\
            <label for="node-input-'+id+'">\
                <i class="fa fa-tab"></i>'+label+'\
            </label>\
            <input id="node-input-'+id+'" type="text">\
        ';
        parent.appendChild(item);

        var input = $(item).find("input");
        input.typedInput({
            type:"json",
            types:["json"]
        });
        input.typedInput("value",value);

    }

    checkboxInput(parent,id,label,value) {
        console.log("BaseUI.checkboxInput("+id+")");
        var item = document.createElement("div");
        item.setAttribute("class","form-row");
        item.setAttribute("id","node-container-" + id);
        item.innerHTML = '\
            <div style="display: inline-flex; width: calc(100% - 105px)">\
                <div id="input-select-'+ id +'" style="flex-grow: 1;">\
                    <input type="checkbox" id="node-input-'+ id +'" style="flex: 15px;"' + (value? ' checked="true"': '') + '">\
                </div>\
                <span style="width: 100%; margin-left: 10px;">\
                    '+ label +'\
                </span>\
            </div>';
        parent.appendChild(item);
    }

    selectInput(parent,id,label,value) {
        console.log("BaseUI.selectInput("+id+")");
        var item = document.createElement("div");
        item.setAttribute("class","form-row");
        item.setAttribute("id","node-container-" + id);
        item.innerHTML = '\
            <label for="node-input-'+ id +'"><i class="fa fa-tag"></i> '+ label +'</label>\
            <div style="display: inline-flex; width: calc(100% - 105px)">\
                <div id="input-select-'+ id +'" style="flex-grow: 1;">\
                    <input type="text" id="node-input-'+ id +'" style="width: 100%" value="' + value + '">\
                </div>\
                <button id="input-select-'+ id +'-search" type="button" class="red-ui-button" style="margin-left: 10px;">\
                    <i class="fa fa-search"></i>\
                </button>\
            </div>';
        parent.appendChild(item);
    }

    getTemplateRoot() {
        return document.getElementById(this.constructor.name);
    }

    build(config) {
        console.log("BaseUI.build()");
        var template_root = this.getTemplateRoot();
        if (!template_root) {
            console.log("template-root not found.")
            return;
        }

        this.textInput(template_root,"name","Name",config.name);
    }
        
    onEditPrepare(config) {
        console.log("BaseUI.onEditPrepare()");
        this.build(config);
    }

    onEditSave(config) {
        console.log("BaseUI.onEditSave()");
    }

    onEditCancel(config) {
        console.log("BaseUI.onEditCancel()");
    }
}
