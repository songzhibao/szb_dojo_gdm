/**
* User: chengbin
* Date: 13-4-1
*/
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

    "dojo/text!./PoliceSumShowPane.html"
], function (declare, lang, Evented, move, Moveable, on, mouse, Tooltip, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template) {

    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Evented], {

        templateString: template,

        widgetsInTemplate: true,

        displayName: "",

        postCreate: function () {
            this.inherited(arguments);
        },

        startup: function () {
            this.inherited(arguments);
        },

        update: function (data) {
            this.util_police_manDJJ_online.innerHTML = data.manDJJ_online;
            this.util_police_manDJJ_onsum.innerHTML = data.manDJJ_onsum;

            this.util_police_manJWT_online.innerHTML = data.manJWT_online;
            this.util_police_manJWT_onsum.innerHTML = data.manJWT_onsum;

            this.util_police_xjDJJ_online.innerHTML = data.xjDJJ_online;
            this.util_police_xjDJJ_onsum.innerHTML = data.xjDJJ_onsum;

            this.util_police_xjJWT_online.innerHTML = data.xjJWT_online;
            this.util_police_xjJWT_onsum.innerHTML = data.xjJWT_onsum;
            
            this.titleShowNode.innerHTML = data.titleShow;
        }
    });
});