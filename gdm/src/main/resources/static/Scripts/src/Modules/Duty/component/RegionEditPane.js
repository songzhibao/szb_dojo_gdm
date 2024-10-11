/**
* User: yangcheng
* Date: 16-2-19
*/
define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/Evented",
    "dojo/aspect",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dojo/store/Memory",
    "dojo/topic",
    "dojo/on",
    'dojo/request',

    "dijit/popup",
    "dijit/form/Button",
    "dijit/form/TextBox",
    'dijit/_WidgetsInTemplateMixin',
    "dijit/Dialog",

    "egis/Share/component/Button/ImageButton",
    "egis/Share/component/MapFloatPane/MapFloatingPane",
    'egis/Modules/Duty/component/SaveRegionPane',
    'egis/appEnv',
    "dojo/text!./RegionEditPane.html",
    'ol'

], function (declare, lang, Evented, aspect, domStyle, domConstruct, Memory, topic, on, request,
             popup, Button, TextBox,_WidgetsInTemplateMixin, Dialog, ImageButton,
             MapFloatingPane, SaveRegionPane, appEnv, template, ol) {

    return declare([MapFloatingPane,_WidgetsInTemplateMixin, Evented], {

        templateString: template,

        widgetsInTemplate: true,

        map: null,

        PointButton: null,

        AreaButton: null,

        LineButton: null,

        SaveButton: null,

        PointMeasureHandler: null,

        AreaMeasureHandler: null,

        LineMeasureHandler: null,

        points: [],

        lines: [],

        areas: [],

        circle: [],

        rect: [],

        type: '',

        currentItem: null,

        startup: function () {

            this.inherited(arguments);
            this.closeNode.style.display = "none";
            this.dockNode.style.display = "none";

            var me = this;
            var mapPane = appEnv.getCurrentPane();
            me.map = mapPane.map;

            this._addToolButtons();

            me.drawVector = new ol.layer.Vector({
                source: new ol.source.Vector(),
                projection: 'EPSG:4326',
                style: new ol.style.Style({
                    fill: new ol.style.Fill({
                        color: 'rgba(0, 0, 255, 0.2)'
                    }),
                    stroke: new ol.style.Stroke({
                        color: '#32CD32',
                        width: 2
                    }),
                    image: new ol.style.Circle({
                        radius: 7,
                        fill: new ol.style.Fill({
                            color: '#32CD32'
                        })
                    })
                })
            });
            me.map.addLayer(me.drawVector);

            me.Modify = {
                init: function () {
                    this.select = new ol.interaction.Select();
                    me.map.addInteraction(this.select);

                    this.modify = new ol.interaction.Modify({
                        features: this.select.getFeatures()
                    });
                    me.map.addInteraction(this.modify);

                    this.setEvents();
                },
                setEvents: function () {
                    var selectedFeatures = this.select.getFeatures();
                    this.select.on('change:active', function () {
                        selectedFeatures.forEach(selectedFeatures.remove, selectedFeatures);
                    });

                    this.modify.on('modifyend', lang.hitch(this, function (evt) {

                        evt.features.forEach(function (feature) {

                            if (me.currentItem == null || feature.Resource.Data.Id != me.currentItem.Id) {
                                return;
                            }
                            me.type = feature.getGeometry().getType();
                            var xy = feature.getGeometry().getCoordinates();
                            var array = null;
                            if (xy.length == 1) {
                                if (xy[0].length == 1) {
                                    array = xy[0][0];
                                }
                                else {
                                    array = xy[0];
                                }
                            }
                            else {
                                array = xy;
                            }
                            if (me.type == "LineString") {
                                me.lines = [];
                                me.lines.push(array);
                            } else if (me.type == "Point") {
                                me.points = [];
                                me.points.push(xy);
                            } else if (me.type == "Polygon") {
                                me.areas = [];
                                me.areas.push(array);
                            }
                            me.CancelButton.setDisabled(false);
                            me.SaveButton.setDisabled(false);
                            feature.isRegionEdit = false;
                        });


                    }));
                },
                setActive: function (active) {
                    this.select.setActive(active);
                    this.modify.setActive(active);
                }
            };
            me.Modify.init();
            me.Modify.setActive(false);

            //点
            me.PointMeasureHandler = new ol.interaction.Draw({
                source: me.drawVector.getSource(),
                type: /** @type {ol.geom.GeometryType} */('Point')
            });
            me.PointMeasureHandler.on('drawend', lang.hitch(this, function (evt) {
                me.type = "Point";
                var xy = evt.feature.getGeometry().getCoordinates();
                me.points.push(xy);
                me.PointButton.Pressed();
                me.PointMeasureHandler.setActive(false);
                me.Modify.setActive(true);

                me._SaveButtonClick();
            }));
            //线
            me.LineMeasureHandler = new ol.interaction.Draw({
                source: me.drawVector.getSource(),
                type: /** @type {ol.geom.GeometryType} */('LineString')
            });
            me.LineMeasureHandler.on('drawend', lang.hitch(this, function (evt) {
                me.type = "LineString";
                var xy = evt.feature.getGeometry().getCoordinates();
                if (xy.length == 1) {
                    if (xy[0].length == 1) {
                        me.lines.push(xy[0][0]);
                    }
                    else {
                        me.lines.push(xy[0]);
                    }
                }
                else {
                    me.lines.push(xy);
                }
                me.LineButton.Pressed();
                me.LineMeasureHandler.setActive(false);
                me.Modify.setActive(true);

                me._SaveButtonClick();
            }));
            //面
            me.AreaMeasureHandler = new ol.interaction.Draw({
                source: me.drawVector.getSource(),
                type: /** @type {ol.geom.GeometryType} */('Polygon')
            });
            me.AreaMeasureHandler.on('drawend', lang.hitch(this, function (evt) {
                me.type = "Polygon";
                var xy = evt.feature.getGeometry().getCoordinates();
                if (xy.length == 1) {
                    if (xy[0].length == 1) {
                        me.areas.push(xy[0][0]);
                    }
                    else {
                        me.areas.push(xy[0]);
                    }
                }
                else {
                    me.areas.push(xy);
                }
                me.AreaButton.Pressed();
                me.AreaMeasureHandler.setActive(false);
                me.Modify.setActive(true);

                me._SaveButtonClick();
            }));


            me.BoxMeasureHandler = new ol.interaction.Draw({
                source: me.drawVector.getSource(),
                type: /** @type {ol.geom.GeometryType} */('LineString'),
                geometryFunction: function (coordinates, geometry) {
                    if (!geometry) {
                        geometry = new ol.geom.Polygon(null);
                    }
                    var start = coordinates[0];
                    var end = coordinates[1];
                    geometry.setCoordinates([
                      [start, [start[0], end[1]], end, [end[0], start[1]], start]
                    ]);
                    return geometry;
                },
                maxPoints : 2
            });
            me.BoxMeasureHandler.on('drawend', lang.hitch(this, function (evt) {
                me.type = "Rect";
                var type = evt.feature.getGeometry().getType();
                var box = evt.feature.getGeometry().getExtent();
                if (box != null) {
                    me.rect = box;
                }
                me.RectButton.Pressed();
                me.BoxMeasureHandler.setActive(false);
                me.Modify.setActive(false);

                me._SaveButtonClick();
            }));


            me.CircleMeasureHandler = new ol.interaction.Draw({
                source: me.drawVector.getSource(),
                type: /** @type {ol.geom.GeometryType} */('Circle')
            });
            me.CircleMeasureHandler.on('drawend', lang.hitch(this, function (evt) {
                me.type = evt.feature.getGeometry().getType();
                var box = evt.feature.getGeometry().getExtent();
                var centerX = (box[0] + box[2]) / 2;
                var centerY = (box[1] + box[3]) / 2;
                var r = centerX - box[0];

                me.circle.push(centerX);
                me.circle.push(centerY);
                me.circle.push(r);
                me.CirButton.Pressed();
                me.CircleMeasureHandler.setActive(false);
                me.Modify.setActive(false);

                me._SaveButtonClick();
            }));

            topic.subscribe("egis/Block/beginEdit", lang.hitch(this, function () {
                me.points = [];
                me.lines = [];
                me.areas = [];
                me.drawVector.getSource().clear();
            }));

            topic.subscribe("egis/Duty/SaveRegion", lang.hitch(this, function () {

                this._CancelButtonClick();

            }));
        },

        _addToolButtons: function () {
            var me = this;


            this.PointButton.on("click", lang.hitch(this, this._PointButtonClick));
            this.LineButton.on("click", lang.hitch(this, this._LineButtonClick));
            this.AreaButton.on("click", lang.hitch(this, this._AreaButtonClick));
            // this.RectButton.on("click", lang.hitch(this, this._RectButtonClick));
            // this.CirButton.on("click", lang.hitch(this, this._CirButtonClick));


            //            this.ClearButton = new Button({ label: '清空图形' });
            //            this.ClearButton.placeAt(this.brNode, 'right');

            //            this.ClearButton.on("click", lang.hitch(this, this._ClearButtonClick));

            this.CancelButton = new Button({ label: '取消' });
            this.CancelButton.placeAt(this.brNode, 'right');
            this.CancelButton.setDisabled(true);
            this.CancelButton.on("click", lang.hitch(this, this._CancelButtonClick));

            this.SaveButton = new Button({ label: '保存' });
            this.SaveButton.placeAt(this.brNode, 'right');
            this.SaveButton.setDisabled(true);
            this.SaveButton.on("click", lang.hitch(this, this._SaveButtonClick));
        },

        _ClearButtonClick: function () {

            if (this.currentItem == null || this.currentItem.Id == null) {
                return;
            }

            request.post("/Duty/ModfityScoutRegion", {
                data: {
                    regionId: this.currentItem.Id,
                    content: ""
                },
                handleAs: "json"
            }).then(lang.hitch(this, function (data) {
                if (data.success) {
                    this.close();
                }
            }));

            this._CancelButtonClick();
        },

        _CancelButtonClick: function () {

            var me = this;
            me.CancelButton.setDisabled(true);
            me.SaveButton.setDisabled(true);

            on.once(me.PointButton, "click", lang.hitch(me, me._PointButtonClick));
            on.once(me.LineButton, "click", lang.hitch(me, me._LineButtonClick));
            on.once(me.AreaButton, "click", lang.hitch(me, me._AreaButtonClick));
            // on.once(me.CirButton, "click", lang.hitch(me, me._CirButtonClick));
            // on.once(me.RectButton, "click", lang.hitch(me, me._RectButtonClick));

            me.PointButton.UnPressed();
            me.LineButton.UnPressed();
            me.AreaButton.UnPressed();
            // me.CirButton.UnPressed();
            // me.RectButton.UnPressed();

            me.points = [];
            me.lines = [];
            me.areas = [];
            me.rect = [];
            me.circle = [];

            this.currentItem = null;

            me.drawVector.getSource().clear();

            me.Modify.setActive(false);
            topic.publish('egis/Duty/CancelEdit', null);
        },

        _SaveButtonClick: function () {

            var me = this;
            me.Modify.setActive(false);
            me.CancelButton.setDisabled(true);
            me.SaveButton.setDisabled(true);

            if (this.points.length > 0 || this.lines.length > 0 || this.areas.length > 0 || this.circle.length > 0 || this.rect.length > 0) {

                var arr = [];
                switch (this.type) {
                    case "Point": arr = this.points; break;
                    case "LineString": arr = this.lines[0]; break;
                    case "Polygon": arr = this.areas[0]; break;
                }

                var pointStr = "";
                if (this.type == "Circle") {
                    pointStr = this.circle[0] + "," + this.circle[1] + "," + this.circle[2];
                }
                else if (this.type == "Rect") {
                    pointStr = this.rect[0] + "," + this.rect[1] + "," + this.rect[0] + "," + this.rect[3] + "," + this.rect[2] + "," + this.rect[3] + "," + this.rect[2] + "," + this.rect[1];
                    this.type = "Polygon";
                }
                else {
                    for (i = 0; i < arr.length; i++) {
                        if (pointStr == "") {
                            pointStr = arr[i][0] + "," + arr[i][1];
                        }
                        else {
                            pointStr += "," + arr[i][0] + "," + arr[i][1];
                        }
                    }
                }
                var geoStr = this.type + "|" + pointStr;
                if (this.currentItem == null) {

                    var mapPane = appEnv.getCurrentPane();
                    if (mapPane.savePane == null) {
                        mapPane.savePane = new SaveRegionPane({
                            title: '新增地质危点',
                            style: "width: 480px;",
                            dockTo: mapPane.dockTo,
                            initPosition: 'lt',
                            closeTip: '关闭后查询结果将清除，是否确认关闭？',
                            pointString: geoStr
                        });

                        aspect.after(mapPane.savePane, 'close', lang.hitch(this, function () {
                            mapPane.savePane = null;
                        }));

                        mapPane.addFloatingPane(mapPane.savePane);
                    }
                    //this._CancelButtonClick();
                    return;
                    //this.close();
                }
                else {
                    //if (me.currentItem.RegionContent2 == "" || me.currentItem.RegionContent2 == null) {
                    //    me.currentItem.RegionContent2 = geoStr;
                    //}
                    //else {
                    //me.currentItem.RegionContent2 += "~" + geoStr;
                    //}
                    me.currentItem.RegionContent2 = geoStr;

                    request.post("/duty/saveRegionEdit", {
                        data: {
                            regionId: this.currentItem.id,
                            content: me.currentItem.RegionContent2
                        },
                        handleAs: "json"
                    }).then(lang.hitch(this, function (data) {
                        var msg = "修改图形成功！";
                        if (data.ok) {
                            this._CancelButtonClick();
                            topic.publish('egis/Duty/SaveRegion', null);
                        } else {
                            msg = "修改图形失败：" + data.msg;
                        }

                        var errorDialog = new Dialog({
                            title: "操作提示",
                            content: msg,
                            style: "width: 200px;height:100px;font-size:14px"
                        });
                        errorDialog.show();
                    }));
                }

            }
            else {
                this._CancelButtonClick();
                var errorDialog = new Dialog({
                    title: "操作提示",
                    content: "无新增！",
                    style: "width: 200px;height:100px;font-size:14px"
                });
                errorDialog.show();
            }
        },

        _PointButtonClick: function (pressed) {
            var me = this;
            if (pressed) {
                me.points = [];
                me.drawVector.getSource().clear();
                me.AreaButton.Pressed();
                me.LineButton.Pressed();
                // me.CirButton.Pressed();
                // me.RectButton.Pressed();
                me.map.addInteraction(this.PointMeasureHandler);
                me.PointMeasureHandler.setActive(true);
            }
            else {
                me.PointMeasureHandler.setActive(false);
            }
        },

        _AreaButtonClick: function (pressed) {
            var me = this;
            if (pressed) {
                me.areas = [];
                me.drawVector.getSource().clear();
                me.PointButton.Pressed();
                me.LineButton.Pressed();
                // me.CirButton.Pressed();
                // me.RectButton.Pressed();
                me.map.addInteraction(this.AreaMeasureHandler);
                me.AreaMeasureHandler.setActive(true);
            }
            else {
                me.AreaMeasureHandler.setActive(false);
            }
        },

        _LineButtonClick: function (pressed) {
            var me = this;
            if (pressed) {
                me.lines = [];
                me.drawVector.getSource().clear();
                me.PointButton.Pressed();
                me.AreaButton.Pressed();
                // me.CirButton.Pressed();
                // me.RectButton.Pressed();
                me.map.addInteraction(this.LineMeasureHandler);
                me.LineMeasureHandler.setActive(true);
            }
            else {
                me.LineMeasureHandler.setActive(false);
            }
        },

        _CirButtonClick: function (pressed) {
            var me = this;
            if (pressed) {
                me.circle = [];
                me.drawVector.getSource().clear();
                me.PointButton.Pressed();
                me.LineButton.Pressed();
                me.AreaButton.Pressed();
                // me.RectButton.Pressed();
                me.map.addInteraction(this.CircleMeasureHandler);
                me.CircleMeasureHandler.setActive(true);
            }
            else {
                me.CircleMeasureHandler.setActive(false);
            }
        },

        _RectButtonClick: function (pressed) {
            var me = this;
            if (pressed) {
                me.circle = [];
                me.drawVector.getSource().clear();
                me.PointButton.Pressed();
                me.LineButton.Pressed();
                me.AreaButton.Pressed();
                // me.CirButton.Pressed();
                me.map.addInteraction(this.BoxMeasureHandler);
                me.BoxMeasureHandler.setActive(true);
            }
            else {
                me.BoxMeasureHandler.setActive(false);
            }
        },

        SetModifyRegion: function (modifyItem) {
            this.Modify.setActive(true);
            this.currentItem = modifyItem;

        },

        destroy: function () {

            this.drawVector.getSource().clear();

            this.map.removeLayer(this.drawVector);
        }

    });
});