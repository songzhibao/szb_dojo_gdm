/* File Created: 九月 5, 2013 */
define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/_base/array',
    'dojo/aspect',
    'dojo/request/xhr',
    'dojo/topic',
    "dijit/Dialog",
    "dijit/layout/TabContainer",
    "dijit/layout/ContentPane",
    'dijit/form/Button',
    'egis/Map/Manager/MapManager',
    'egis/appEnv',
    "ol"
], function (declare, lang, array, aspect, xhr,topic, Dialog, TabContainer, ContentPane, Button, MapManager,
                appEnv, ol) {

    return declare([MapManager], {

        GeoJSONLayerStyleList: new Object(),

        constructor: function () {

        },

        updateMarkerGPS: function (gpsInfo) {
            //return;
            for (var key in this.LayerList) {
                var feature = this.LayerList[key].Source.getFeatureById(gpsInfo.GPSId);
                if (feature != null) {

                    if (feature.IsOpenGZ) {
                        var geometry = feature.getGeometry();
                        var coord = geometry.getCoordinates();

                        var lineInfo = { LayerGroup: "轨迹跟踪", LayerId: gpsInfo.GPSId, LineWidth: 3, RandomLineColor: true, RegionContent: gpsInfo.Lon + "," + gpsInfo.Lat + "," + coord[0] + "," + coord[1] };
                        this.drawLine(lineInfo);
                    }

                    var geom = new ol.geom.Point([gpsInfo.Lon, gpsInfo.Lat]);
                    if (geom != null) {
                        feature.setGeometry(geom);
                        //this.waterFlash(geom);
                    }
                }
                key = null;
            }
        },


        ShowFollowLine: function (gpsInfo) {
            for (var key in this.LayerList) {
                var feature = this.LayerList[key].Source.getFeatureById(gpsInfo.gpsId);
                if (feature != null) {
                    var LayerGroup = "轨迹跟踪";
                    feature.IsOpenGZ = gpsInfo.IsOpenGZ;
                    if (!gpsInfo.IsOpenGZ) {
                        this.RemoveLayerByID(LayerGroup + ":" + gpsInfo.gpsId);
                    }
                    else {
                        var color = this.getRandomColor(gpsInfo.gpsId);
                        var geometry = feature.getGeometry();
                        var coord = geometry.getCoordinates();
                        var pointInfo = { LayerGroup: LayerGroup, LayerId: gpsInfo.gpsId, Color: color, ShowText: "起点", RegionContent: coord[0] + "," + coord[1] };

                        this.drawPoint(pointInfo);
                    }
                }
            }
        },




        selectStyleFunction: function (feature) {
            var style = feature.GeoStyle;
            var textObj = style.getText();
            if (textObj) {
                textObj.setText(feature.get("name")); 
            }
            return style;
        },

        AddGeoJSONLayerAndShow: function (data, GeoInfo, zIndex) {

            //eval("this.GeoJSONLayerStyleList['ZHZX_PNAME_PT'] ={ 'Point': new ol.style.Style({ image: new ol.style.Circle({ radius: 3, fill: new ol.style.Fill({ color: '#32CD32' }) }),text: new ol.style.Text({ font: '12px Calibri,sans-serif', fill: new ol.style.Fill({ color: 'white' }) ,stroke: new ol.style.Stroke({ color: '#32CD32', width: 3 }), offsetY: 10 }) }),'maxResolutionForLayer' : 4.29153442382814E-05, 'maxResolutionForText' : 0.000010728836059570312};");

            //eval("this.GeoJSONLayerStyleList['ZHZX_XQ_PG'] ={ 'Polygon': new ol.style.Style({ stroke: new ol.style.Stroke({ color: 'blue', lineDash: [4], width: 2 }), fill: new ol.style.Fill({ color: 'rgba(0, 0, 255, 0.1)'}) ,text: new ol.style.Text({ font: '14px Calibri,sans-serif', fill: new ol.style.Fill({ color: 'white' }) ,stroke: new ol.style.Stroke({ color: 'blue', width: 8 }), offsetY: 10 }) }), 'maxResolutionForText' :  0.0054931640625};");

            var layerId = GeoInfo.LayerGroup + ":" + GeoInfo.LayerId;
            var layerName = GeoInfo.paramObject.layersName;
            var geoJSONLayer = this.GetLayer(GeoInfo.LayerGroup, GeoInfo.LayerId);
            if (geoJSONLayer != null) {
                this.ShowLayerByID(layerId);
                return;
            }
            var me = this;
            var geoJSONSource = new ol.source.Vector({
                features: (new ol.format.GeoJSON()).readFeatures(data)
            });

            if (data.GeoJSONLayerStyleList != null) {
                eval(data.GeoJSONLayerStyleList);
                var maxResolutionForLayer = me.GeoJSONLayerStyleList[layerName]["maxResolutionForLayer"];
                if (!maxResolutionForLayer) {
                    maxResolutionForLayer = 1;
                }
                geoJSONLayer = new ol.layer.Vector({
                    source: geoJSONSource,
                    id: layerId,
                    maxResolution: maxResolutionForLayer,
                    style: function (feature, resolution) {
                        var style = feature.getStyle();
                        if (style)
                        {
                            return;
                        }
                        feature.set("LayerGroup", GeoInfo.LayerGroup);
                        feature.set("LayerId", GeoInfo.LayerId);
                        var styleObj = me.GeoJSONLayerStyleList[layerName][feature.getGeometry().getType()];
                        if (styleObj != null) {
                            var maxResolutionForText = me.GeoJSONLayerStyleList[layerName]["maxResolutionForText"];
                            var textObj = styleObj.getText();
                            if (textObj) {
                                if (maxResolutionForText) {
                                    textObj.setText(resolution <= maxResolutionForText ? feature.get("name") : '');
                                }
                                else {
                                    textObj.setText(feature.get("name"));
                                }
                            }
                            if (styleObj.getImage && styleObj.getImage().setScale) {
                                styleObj.getImage().setScale(0.8);
                            }
                            feature.GeoStyle = styleObj;
                            return styleObj;
                        }
                    }
                });



                //geoJSONLayer.Select = new ol.interaction.Select({
                //    condition: function (evt) {
                //        var pixel = this.map.getEventPixel(evt.originalEvent);
                //        var hit = this.map.hasFeatureAtPixel(pixel);
                //        if (hit) {
                //            return evt.originalEvent.type == 'mousemove';
                //        }
                //        else {
                //            return false;
                //        }
                //    },
                //    style: this.selectStyleFunction
                //});
                //this.map.addInteraction(geoJSONLayer.Select);
            }
            else {
                geoJSONLayer = new ol.layer.Vector({
                    source: geoJSONSource,
                    id: layerId
                });
            }

            if (zIndex) {
                geoJSONLayer.setZIndex(zIndex);
            }
            else {
                geoJSONLayer.setZIndex(100);
            }

            this.AddLayer(GeoInfo.LayerGroup, GeoInfo.LayerId, geoJSONLayer, geoJSONSource);

        },


        destroy: function () {
            this.RemoveAll();
            this.inherited(arguments);
        }
    });
});