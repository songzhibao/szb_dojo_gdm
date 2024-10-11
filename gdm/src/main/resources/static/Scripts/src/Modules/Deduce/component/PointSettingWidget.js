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
    'egis/appEnv',
    'ol',
    "dojo/text!./PointSettingWidget.html"

], function (declare, lang, array, domStyle, topic, request, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin,
               TextBox,TimeTextBox, Dialog, ImageButton, appEnv,ol, template) {

    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {


        templateString: template,

        widgetsInTemplate: true,

        data: null,

        parentNode: null,

        polylineHandler: null,

        drawVector : null,

        postCreate: function () {

            this.inherited(arguments);
        },

        startup: function () {

            this.inherited(arguments);
            var me = this;
            this.saveItemButton.on("click", lang.hitch(this, this.Save_Click));
            this.cacelItemButton.on("click", lang.hitch(this, this.Cancel_Click));
            this.deleteItemButton.on("click", lang.hitch(this, this.Delete_Click));

            this.drawActionButton.on("click", lang.hitch(this, this.DrawAction_Click));

            if (this.data != null) {
                this.ItemName.setValue(this.data.MC);
                this.ItemStage.setValue(this.data.Stage);
                this.ItemAction.setValue(this.data.Action);
            }
        },

        DrawAction_Click: function () {

            this.ItemAction.setValue("");

            var mapPane = appEnv.getCurrentPane();
            polylineHandler = new ol.interaction.Draw({
                source: this.getDrawVector(mapPane).getSource(),
                type: /** @type {ol.geom.GeometryType} */('LineString')
            });
            polylineHandler.on('drawend', lang.hitch(this, function (evt) {

                var pointStr = "";
                var arr = evt.feature.getGeometry().getCoordinates();
                if (arr.length > 0) {
                    for (i = 0; i < arr.length; i++) {
                        if (pointStr == "") {
                            pointStr = arr[i][0] + "," + arr[i][1];
                        }
                        else {
                            pointStr += "," + arr[i][0] + "," + arr[i][1];
                        }
                    }
                    this.ItemAction.setValue(pointStr);
                }
                mapPane.map.removeInteraction(polylineHandler)
            }));

            mapPane.map.addInteraction(polylineHandler);

        },

        getDrawVector: function (mapPane) {

            if (this.drawVector) {
                return this.drawVector;
            }

            var source = new ol.source.Vector();
            var styleFunction = function (feature, resolution) {
                var geometry = feature.getGeometry();
                var styles = [
                    new ol.style.Style({
                        stroke: new ol.style.Stroke({
                            color: '#ff0000',
                            width: 2
                        })
                    })];

                geometry.forEachSegment(function (start, end) {
                    var dx = end[0] - start[0];
                    var dy = end[1] - start[1];
                    var rotation = Math.atan2(dy, dx);
                    // arrows
                    styles.push(new ol.style.Style({
                        geometry: new ol.geom.Point(end),
                        image: new ol.style.Icon({
                            src: '/Content/themes/blue/images/Region/arrow.png',
                            anchor: [0.75, 0.5],
                            rotateWithView: false,
                            rotation: -rotation
                        })
                    }));
                });

                return styles;
            };
            var vector = new ol.layer.Vector({
                source: source,
                style: styleFunction
            });

            mapPane.map.addLayer(vector);

            return vector;
        },

        Save_Click: function ()
        {
            request.post("/deduce/savePointInfo", {
                data: dojo.toJson({
                    id: this.data.id,
                    name: this.ItemName.getValue(),
                    stage: this.ItemStage.getValue(),
                    action: this.ItemAction.getValue()
                }),
                headers: {  'Content-Type': "application/json;charset=UTF-8" },
                handleAs: "json"
            }).then(lang.hitch(this, function (data) {
                var msg = "信息保存成功！";
                if (data.ok) {
                    if (this.parentNode) {
                        this.parentNode.removeChild(this);
                    }
                    topic.publish('egis/Deduce/SaveDeducePoint', null);
                }
                else {
                    msg = "信息保存失败,请重新操作试试！";
                }
                topic.publish("egis/messageNotification", { type: "info", text: msg });
            })
            );
        },

        Delete_Click: function () {
            var dialog = new Dialog({
                title: '提示',
                style: "width: 400px;height:220px;",
                mode: ['ok', 'cancel'],
                message: {
                    type: 'warn',
                    text: '确认删除 [' + this.data.MC + ']？'
                }
            });
            dialog.okButton.on('click', lang.hitch(this, function () {

                request.post("/deduce/deleteDeducePoint", {
                    data: {
                        id: this.data.Id
                    },
                    handleAs: "json"
                }).then(lang.hitch(this, function (data) {
                    if (data.success) {
                        if (this.parentNode) {
                            this.parentNode.removeChild(this);
                        }
                        topic.publish('egis/Deduce/SaveDeducePoint', null);
                    }
                })
               );
            }));
            dialog.show();
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