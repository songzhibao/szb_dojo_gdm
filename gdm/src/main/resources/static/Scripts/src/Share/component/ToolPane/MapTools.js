/**
* Created with JetBrains WebStorm.
* User: chengbin
* Date: 13-4-24
* To change this template use File | Settings | File Templates.
*/
define([
    "dojo/_base/declare",
    "dojo/_base/fx",
    "dojo/_base/lang",
    "dojo/dom-class",
    "dojo/dom-geometry",
    "dojo/on",
    'dojo/topic',
    "dijit/_TemplatedMixin",
    'dijit/_WidgetsInTemplateMixin',
    "dojox/layout/ContentPane",
    "dojox/widget/Standby",
    'dijit/form/TextBox',
    'dijit/form/Button',
    'dijit/TooltipDialog',
    'dijit/form/DropDownButton',
    "dojo/text!./MapTools.html",
    "egis/Share/component/OrgTree/OrgTree",
    "egis/Share/component/Button/ImageButton",
    "egis/appEnv"

], function (declare, baseFx, lang, domClass, domGeom, on, topic, TemplatedMixin, _WidgetsInTemplateMixin, ContentPane, Standby, TextBox, Button, TooltipDialog, DropDownButton, template, OrgTree, ImageButton,appEnv) {

    var MapFloatingPane = declare([ContentPane, TemplatedMixin, _WidgetsInTemplateMixin], {

        standby: null,

        templateString: template,


        postCreate: function () {
            this.inherited(arguments);

        },

        startup: function () {
            var me = this;
            this.inherited(arguments);
            
            this.markButton.on("click", lang.hitch(this, this._markButtonClick));
            this.cejuButton.on("click", lang.hitch(this, this._cejuButtonClick));
            this.quanButton.on("click", lang.hitch(this, this._quanButtonClick));
            this.deleteButton.on("click", lang.hitch(this, this._deleteButtonClick));
        },

        _cejuButtonClick: function () {
            topic.publish("egis/Map/BeginLineMeasure", null);
        },

        _quanButtonClick: function () {
            if (appEnv.mapConfig)
            {
                var centerXY = appEnv.mapConfig.getCenterLonlat();
                if (centerXY != null && centerXY.length == 2) {
                    topic.publish("egis/Map/Locate", { Lon: centerXY[0], Lat: centerXY[1], Zoom: 6 });
                }
            }
        },

        _deleteButtonClick: function () {
            topic.publish("egis/Map/Remove", { RemoveType: "ALL" });
        },

        _markButtonClick : function()
        {
            var markerInfo = { LayerGroup: "交互图层", LayerId: "标记坐标" };
            topic.publish("egis/Map/BeginDrawMarker", markerInfo);
        },

        destroy: function () {
            this.standby.destroy();
            this.inherited(arguments);
        }

    });

    return MapFloatingPane;

});