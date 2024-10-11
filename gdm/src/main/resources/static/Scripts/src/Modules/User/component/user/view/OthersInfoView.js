/**
* Created with JetBrains WebStorm.
* User: chengbin
* Date: 13-4-1
* To change this template use File | Settings | File Templates.
*/
define([
    "dojo/_base/declare",

    "dijit/_Widget",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",

    "dojo/text!./OthersInfoView.html"
], function (declare, _Widget, _TemplatedMixin, _WidgetsInTemplateMixin, template) {

    return declare([_Widget, _TemplatedMixin, _WidgetsInTemplateMixin], {

        templateString: template,

        widgetsInTemplate: true,

        userId: null,

        constructor: function (args) {
            declare.safeMixin(this, args || {});
        },

        startup: function () {
            this.inherited(arguments);
        },

        getData: function () {
            var item = {};
            if (this.userId != null) {
                item.userId = this.userId + '';
            }
            item.lon = this.lon_node.get("value");
            item.lat = this.lat_node.get("value");
            item.displayLevel = this.displayLevel_node.get("value");
            item.region = this.region_node.get("value");
            return item;
        }

    });
});
