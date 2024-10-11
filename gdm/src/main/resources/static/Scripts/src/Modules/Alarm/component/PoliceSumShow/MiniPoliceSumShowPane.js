define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/Evented",
    "dojo/dnd/move",
    "dojo/dnd/Moveable",
    "dojo/on",
    "dojo/mouse",

    "dijit/Tooltip",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",

    "dojo/text!./MiniPoliceSumShowPane.html"
], function (declare, lang, Evented, move, Moveable, on, mouse, Tooltip, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template) {

    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Evented], {

        templateString: template,

        widgetsInTemplate: true,        

        postCreate: function () {
            this.inherited(arguments);
        },

        startup: function () {
            this.inherited(arguments);
        }        
    });
});