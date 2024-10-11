/**
* User: chengbin
* Date: 13-4-1
*/
define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/Evented",
    "dojo/aspect",
    "dojo/on",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dojo/store/Memory",
    "dijit/_WidgetBase",
    'dijit/_TemplatedMixin',
    "dijit/_WidgetsInTemplateMixin",
    "dojo/text!./TypeCheckPane.html"
], function (declare, lang, Evented, aspect, on, domStyle, domConstruct, Memory, 
               _WidgetBase,_TemplatedMixin, _WidgetsInTemplateMixin, template) {

    return declare([_WidgetBase,_TemplatedMixin, _WidgetsInTemplateMixin, Evented], {

        templateString: template,

        widgetsInTemplate: true,

        postCreate: function () {
            this.inherited(arguments);
        },

        startup: function () {
            this.inherited(arguments);
        },

        getCheckedTypes: function () {
            var getCheckedTypes = [];
            if (this.checkNode1.get("checked")) {
                getCheckedTypes.push(this.checkNode1.get("value"));
            }
            if (this.checkNode2.get("checked")) {
                getCheckedTypes.push(this.checkNode2.get("value"));
            }
            if (this.checkNode3.get("checked")) {
                getCheckedTypes.push(this.checkNode3.get("value"));
            }
            if (this.checkNode4.get("checked")) {
                getCheckedTypes.push(this.checkNode4.get("value"));
            }
            //if (this.checkNode5.get("checked")) {
            //    getCheckedTypes.push(this.checkNode5.get("value"));
            //}
            return getCheckedTypes;
        },

        destroy: function () {
            this.inherited(arguments);
        }

    });

});