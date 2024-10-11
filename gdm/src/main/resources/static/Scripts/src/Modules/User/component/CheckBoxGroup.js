define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    'dojo/_base/array',
    "dojo/dom-style",

    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",

    "dijit/form/CheckBox",
    "dojo/text!./CheckBoxGroup.html"
], function (declare, lang, array, domStyle, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, CheckBox, template) {

    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {

        templateString: template,

        baseClass: 'checkBoxGroup',

        widgetsInTemplate: true,

        groupTitle: null,

        //data需要有name & type & checked 三个属性
        data: null,

        //默认3列
        column: 3,

        postCreate: function () {
            this.inherited(arguments);

            //所有的checkBox集合 
            this.checkBoxes = [];

            if (this.data != null && this.data.length > 0) {

                this.titleNode.innerHTML = this.groupTitle;

                var table = document.createElement("table");

                table.cellSpacing = 10;

                for (var i = 0; i < this.data.length / this.column; i++) {

                    var tr = document.createElement("tr");

                    for (var j = this.column * i; j < this.column * i + this.column; j++) {

                        if (this.data[j]) {

                            var td1 = document.createElement("td");

                            var checkBox = new CheckBox({
                                name: 'checkBox',
                                checked: this.data[j].checked,
                                type: this.data[j].type
                            });

                            checkBox.focusNode.style.cursor = 'pointer';

                            this.checkBoxes.push(checkBox);
                            td1.appendChild(checkBox.domNode);

                            var td2 = document.createElement("td");
                            var label = document.createElement("label");
                            label.innerHTML = this.data[j].name;
                            td2.appendChild(label);

                            tr.appendChild(td1);
                            tr.appendChild(td2);

                            table.appendChild(tr);
                        }
                    }
                }
                this.containerNode.appendChild(table);
            }
        },

        startup: function () {
            this.inherited(arguments);
        },

        getCheckedItems: function () {
            var items = [];

            array.forEach(this.checkBoxes, function (item) {
                if (item.checked) {
                    items.push(item.type);
                }
            });

            return items;
        }
    });
});