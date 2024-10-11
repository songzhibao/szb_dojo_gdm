/**
* User: yangcheng
* Date: 16-2-19
*/
define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    'dojo/_base/array',
    "dojo/dom-style",
    'dojo/topic',
    'dojo/request',
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dijit/form/TextBox",
    "dijit/form/TimeTextBox",
    'egis/Share/component/Dialog/Dialog',
    "egis/Share/component/Button/ImageButton",
    'egis/Share/Player/PlanPlayer',
    'egis/appEnv',
    'ol',
    "dojo/text!./StagePlayWidget.html"

], function (declare, lang, array, domStyle, topic, request, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin,
               TextBox,TimeTextBox, Dialog, ImageButton,PlanPlayer, appEnv,ol, template) {

    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {


        templateString: template,

        widgetsInTemplate: true,

        data: null,

        parentNode: null,

        postCreate: function () {

            this.inherited(arguments);
        },

        startup: function () {

            this.inherited(arguments);
            var me = this;
            this.playButton.on("click", lang.hitch(this, this.Play_Click));
            this.stopButton.on("click", lang.hitch(this, this.Stop_Click));

            this.cancelButton.on("click", lang.hitch(this, this.Cancel_Click));
            if (this.data != null) {
                this.ItemName.setValue(this.data.MC);
            }
        },

        Play: function (planInfo) {

            var mapPane = appEnv.getCurrentPane();
            if (mapPane._planPlayer && !mapPane._planPlayer.stopped) {
                mapPane._planPlayer.play();
                return;
            }
            var planPlayer = mapPane._planPlayer = new PlanPlayer({
                planInfo: planInfo
            });
            planPlayer.setSpeed(this.ItemSpinner.getValue());

            mapPane._planShowItemHandler = planPlayer.on('show', lang.hitch(this, function (evt) {

                var data = evt.snapshot.data;
                array.forEach(data, function (oneItem) {
                    var dataItem = oneItem.planItem;
                    if (oneItem.FirstShow) {

                        var param = { LayerGroup: "警卫管理", LayerId: "警卫图形", RemoveType: "GROUP" };
                        if (dataItem.lon && dataItem.lat) {
                            var iconUrl = "/Content/themes/blue/images/Region/" + dataItem.Type + ".png";
                            var param = { LayerGroup: param.LayerGroup, LayerId: param.LayerId, ImgUrl: iconUrl, ShowText: dataItem.name, LonLat: [dataItem.lon, dataItem.lat], Code: dataItem.id, Data: dataItem };
                            topic.publish("egis/Map/AddMarker", param);
                        }
                        else {
                            var geoArray = dataItem.CONTENT.split('~');
                            for (var ii = 0; ii < geoArray.length; ii++) {
                                var infoArray = geoArray[ii].split('|');
                                if (infoArray.length == 2) {
                                    var showName = dataItem.Name;
                                    if (infoArray[0] == "Point") {
                                        var info = { LayerGroup: param.LayerGroup, LayerId: param.LayerId, Color: dataItem.FillColor, ShowText: showName, RegionContent: infoArray[1], Data: item };
                                        topic.publish("egis/Map/DrawPoint", info);
                                    }
                                    else if (infoArray[0] == "LineString") {
                                        var info = { LayerGroup: param.LayerGroup, LayerId: param.LayerId, Color: dataItem.BorderColor, LineWidth: dataItem.BorderWidth, ShowText: showName, RegionContent: infoArray[1], Data: dataItem };
                                        topic.publish("egis/Map/DrawLine", info);
                                    }
                                    else if (infoArray[0] == "Polygon") {
                                        var info = { LayerGroup: param.LayerGroup, LayerId: param.LayerId, Color: dataItem.FillColor, Opacite: dataItem.Opacite, LineWidth: dataItem.BorderWidth, LineColor: dataItem.BorderColor, ShowText: showName, RegionContent: infoArray[1], Data: dataItem };
                                        topic.publish("egis/Map/DrawPolygon", info);
                                    }
                                    else if (infoArray[0] == "Circle") {
                                        var info = { LayerGroup: param.LayerGroup, LayerId: param.LayerId, Color: dataItem.FillColor, Opacite: dataItem.Opacite, LineWidth: dataItem.BorderWidth, LineColor: dataItem.BorderColor, ShowText: showName, RegionContent: infoArray[1], Data: dataItem };
                                        topic.publish("egis/Map/DrawCircle", info);
                                    }
                                }
                            }
                        }
                    }
                    else {
                        var lonlat = oneItem.point.getCoordinates();
                        topic.publish("egis/gps/updategps", { GPSId: dataItem.id, Lon: lonlat[0], Lat: lonlat[1] });
                    }
                });
            }));
            mapPane._planPauseHandler = planPlayer.on('inited', lang.hitch(this, function () {
                var param = { LayerGroup: "警卫管理", LayerId: "警卫图形", RemoveType: "GROUP" };
                topic.publish("egis/Map/Remove", param);
            }));
            mapPane._planPlayHandler = planPlayer.on('stop', lang.hitch(this, function () {
                this.playButton.setLabel("播 放");
            }));
            planPlayer.init().done(lang.hitch(this, function () {
                planPlayer.play();
            }));
        },

        Pause: function () {
            var mapPane = appEnv.getCurrentPane();
            if (mapPane._planPlayer) {
                mapPane._planPlayer.pause();
            }
        },

        Stop: function () {
            var mapPane = appEnv.getCurrentPane();
            if (mapPane._planPlayer) {
                mapPane._planPlayer.stop();
            }
            if (mapPane._planShowItemHandler) {
                mapPane._planShowItemHandler.remove();
            }
            if (mapPane._planPlayHandler) {
                mapPane._planPlayHandler.remove();
            }
            if (mapPane._planPauseHandler) {
                mapPane._planPauseHandler.remove();
            }
            if (mapPane._planPlayer) {
                mapPane._planPlayer.destroy();
                mapPane._planPlayer = null;
            }
            var param = { LayerGroup: "警卫管理", LayerId: "警卫图形", RemoveType: "GROUP" };
            topic.publish("egis/Map/Remove", param);
            topic.publish('egis/Deduce/SaveDeducePoint', null);
        },

        Play_Click: function ()
        {
            var text = this.playButton.label;
            if (text == "播 放") {
                var me = this;
                request.post("/deduce/getDeducePlayInfo", {
                    data: this.data,
                    handleAs: "json"
                }).then(function (planInfo) {

                    me.playButton.setLabel("暂 停");
                    me.Play(planInfo.data);

                }, function (error) {

                });
            } else {
                this.playButton.setLabel("播 放");
                this.Pause();
            }
        },

        Stop_Click: function () {
            this.Stop();
        },

        Cancel_Click: function () {
            if (this.parentNode) {
                this.parentNode.removeChild(this);
            }
        },

        destroy: function () {
            this.inherited(arguments);
        }
    });
});