/* File Created: 九月 5, 2013 */
define([
'dojo/_base/declare',
'dojo/_base/lang',
'dojo/_base/array',
'dojo/topic',
'dojo/aspect',
'egis/Map/Manager/MapManager',
"egis/appEnv",
"ol"
], function (declare, lang, array, topic, aspect, MapManager, appEnv, ol) {

    return declare([MapManager], {

        DataInfo : null,
        // wgs84Sphere: new ol.Sphere(6378137),

        constructor: function () {

        },

        RemoveAll: function () {
            for (var key in this.LayerList) {
                this.RemoveLayerByID(key);
                key = null;
            }
            if (this.measureTooltip) {
                this.map.removeOverlay(this.measureTooltip);
            }
        },

        RemoveLayerByGroupName: function (layerGroup) {
            for (var key in this.LayerList) {
                if (key.toString().indexOf(layerGroup + ":") == 0) {
                    this.RemoveLayerByID(key);
                }
                key = null;
            }
        },

        RemoveLayerByID: function (key) {

            var layerInfo = this.LayerList[key];
            if (layerInfo != null) {
                layerInfo.Layer.getSource().clear();
                if (layerInfo.Select) {
                    this.map.removeInteraction(layerInfo.Select);
                }
                if (layerInfo.Modify) {
                    layerInfo.Modify.un("modifyend", this.ModifyEndHandler);
                    this.map.removeInteraction(layerInfo.Modify);
                }
                if (layerInfo.Drawer) {
                    layerInfo.Drawer.un("modifyend", this.ModifyEndHandler);
                    this.map.removeInteraction(layerInfo.Drawer);
                }
                this.map.removeLayer(layerInfo.Layer);

                layerInfo.Layer = null;

                delete this.LayerList[key];
                layerInfo = null;
            }
        },

        RemoveFeatureByID: function (FID) {

            for (var key in this.LayerList) {
                var layerInfo = this.LayerList[key];
                if (layerInfo != null) {
                    var fearture = layerInfo.Layer.getSource().getFeatureById(FID);
                    if (fearture)
                    {
                        layerInfo.Layer.getSource().removeFeature(fearture);
                    }
                }
            }

        },

        RemoveFeatureByObject: function (key, fearture) {

            var layerInfo = this.LayerList[key];
            if (layerInfo != null) {
                if (fearture) {
                    layerInfo.Layer.getSource().removeFeature(fearture);
                    //layerInfo.Layer.getSource().refresh();
                }
            }

        },

        BeginExtentQuery: function ()
        {
            var me = this;
            me.SelectHandler = new ol.interaction.DragBox({
                condition: ol.events.condition.mouseOnly,
                style: new ol.style.Style({
                    fill: new ol.style.Fill({
                        color: 'rgba(255, 255, 255, 0.2)'
                    }),
                    stroke: new ol.style.Stroke({
                        color: '#ffcc33',
                        width: 2
                    })
                })
            });

            me.SelectHandler.once('boxend', lang.hitch(this, function (evt) {

                var box = me.SelectHandler.getGeometry().getExtent();
                var extent = {
                    left: box[0],
                    top: box[3],
                    right: box[2],
                    bottom: box[1]
                };
 
                me.map.removeInteraction(me.SelectHandler)
                me.hideMouseHelpTooltip();
                topic.publish("egis/Map/EndExtentDraw", extent);
            }));

            me.map.addInteraction(me.SelectHandler);
            me.showMouseHelpTooltip('在地图上按住鼠标左键拉框查询');
            topic.publish("egis/Map/BeginExtentDraw", null);
        },


        BeginGeometryQuery: function (queryInfo) {
            var me = this;
            var layerInfo = this.GetLayer(queryInfo.LayerGroup, queryInfo.LayerId);
            if (layerInfo == null) {
                layerInfo = this.CreateNewLayer(queryInfo.LayerGroup, queryInfo.LayerId);
            }

            var queryStyle = new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: 'rgba(21, 124, 196, 0.5)',
                    width: 2
                }),
                fill: new ol.style.Fill({
                    color: 'rgba(148, 219, 255, 0.3)'
                }),
                image: new ol.style.Circle({
                    radius: 5,
                    stroke: new ol.style.Stroke({
                        color: 'rgba(21, 124, 196, 0.3)',
                        width: 1
                    }),
                    fill: new ol.style.Fill({
                        color: 'rgba(148, 219, 255, 0.3)'
                    })
                })
            });


            layerInfo.Layer.setStyle(queryStyle);

            var drawStyle = new ol.style.Style({
                fill: new ol.style.Fill({
                    color: 'rgba(148, 219, 255, 0.5)'
                }),
                stroke: new ol.style.Stroke({
                    color: 'rgba(21, 124, 196, 0.8)',
                    //lineDash: [10, 10],
                    width: 2
                }),
                image: new ol.style.Circle({
                    radius: 5,
                    stroke: new ol.style.Stroke({
                        color: 'rgba(21, 124, 196, 0.5)',
                        width: 1
                    }),
                    fill: new ol.style.Fill({
                        color: 'rgba(148, 219, 255, 0.5)'
                    })
                })
            });


            if (queryInfo.DrawType == "rect") {

                layerInfo.Drawer = new ol.interaction.Draw({
                    source: layerInfo.Source,
                    type: /** @type {ol.geom.GeometryType} */("Circle"),
                    style: drawStyle,
                    geometryFunction: function (coordinates, opt_geometry) {
                        var extent = ol.extent.boundingExtent(coordinates);
                        var geometry = opt_geometry || new ol.geom.Polygon(null);
                        geometry.setCoordinates([[
                            ol.extent.getBottomLeft(extent),
                            ol.extent.getBottomRight(extent),
                            ol.extent.getTopRight(extent),
                            ol.extent.getTopLeft(extent),
                            ol.extent.getBottomLeft(extent)
                        ]]);
                        return geometry;
                    }
                });

            }
            else if (queryInfo.DrawType == "line")
            {
                layerInfo.Drawer = new ol.interaction.Draw({
                    source: layerInfo.Source,
                    type: /** @type {ol.geom.GeometryType} */("LineString"),
                    style: drawStyle
                });
            }
            else if (queryInfo.DrawType == "circle") {
                layerInfo.Drawer = new ol.interaction.Draw({
                    source: layerInfo.Source,
                    type: /** @type {ol.geom.GeometryType} */("Circle"),
                    style: drawStyle
                });
            }
            else if (queryInfo.DrawType == "polygon") {
                layerInfo.Drawer = new ol.interaction.Draw({
                    source: layerInfo.Source,
                    type: /** @type {ol.geom.GeometryType} */("Polygon"),
                    style: drawStyle
                });
            }

            this.map.addInteraction(layerInfo.Drawer);
            me.map.DrawMapManager = me;
            me.showMouseHelpTooltip('单击并移动鼠标绘制查询范围！');

            layerInfo.Drawer.on('drawstart',
              function (evt) {
                  me.hideMouseHelpTooltip();
              }, this);

            layerInfo.Drawer.on('drawend',
              function (evt) {
                  
                  var paramObj = null;
                  if (queryInfo.DrawType == "rect") {
                      var box = evt.feature.getGeometry().getExtent();
                      paramObj = { geoType: "extent", geoVal: box[0] + "," + box[3] + "," + box[2] + "," + box[1] };
                  }
                  else if (queryInfo.DrawType == "line") {
                      var coll = evt.feature.getGeometry().getCoordinates();
                      var valStr = "";
                      if (coll.length > 0) {
                          for (var num = 0; num < coll[0].length; num++) {
                              if (valStr == "") {
                                  valStr = coll[num][0] + "," + coll[num][1];
                              }
                              else {
                                  valStr += "," + coll[num][0] + "," + coll[num][1];
                              }
                          }
                      }
                      paramObj = { geoType: "line", geoVal: valStr };
                  }
                  else if (queryInfo.DrawType == "circle") {
                      var box = evt.feature.getGeometry().getExtent();
                      var centerX = (box[0] + box[2]) / 2;
                      var centerY = (box[1] + box[3]) / 2;
                      var valStr = centerX + "," + centerY + "," + (centerX - box[0]);
                      paramObj = { geoType: "circle", geoVal: valStr };
                  }
                  else if (queryInfo.DrawType == "polygon") {
                      var coll = evt.feature.getGeometry().getCoordinates();
                      var valStr = "";
                      if (coll.length > 0) {
                          for (var num = 0; num < coll[0].length; num++) {
                              if (valStr == "") {
                                  valStr = coll[0][num][0] + "," + coll[0][num][1];
                              }
                              else {
                                  valStr += "," + coll[0][num][0] + "," + coll[0][num][1];
                              }
                          }
                      }
                      paramObj = { geoType: "polygon", geoVal: valStr };
                  }

                  topic.publish("egis/Map/EndGeometryQuery", paramObj);

              }, this);
        },

        CancelGeometryQuery: function (queryInfo) {
            var me = this;
            var layerInfo = this.GetLayer(queryInfo.LayerGroup, queryInfo.LayerId);
            if (layerInfo == null) {
                layerInfo = this.CreateNewLayer(queryInfo.LayerGroup, queryInfo.LayerId);
            }

            me.hideMouseHelpTooltip();
            //取消查询
            me.map.removeInteraction(layerInfo.Drawer);
        },

        //开始测量线、面
        BeginMeasure : function(measureInfo)
        {
            var me = this;
            var layerInfo = this.GetLayer(measureInfo.LayerGroup, measureInfo.LayerId);
            if (layerInfo == null) {
                layerInfo = this.CreateNewLayer(measureInfo.LayerGroup, measureInfo.LayerId);
            }

            var measureStyle = new ol.style.Style({
                fill: new ol.style.Fill({
                    color: 'rgba(255, 255, 255, 0.5)'
                }),
                stroke: new ol.style.Stroke({
                    color: '#ffcc33',
                    width: 2
                }),
                image: new ol.style.Circle({
                    radius: 7,
                    fill: new ol.style.Fill({
                        color: '#ffcc33'
                    })
                })
            });

            layerInfo.Layer.setStyle(measureStyle);

            layerInfo.Drawer = new ol.interaction.Draw({
                source: layerInfo.Source,
                type: /** @type {ol.geom.GeometryType} */(measureInfo.DrawType),
                style: new ol.style.Style({
                    fill: new ol.style.Fill({
                        color: 'rgba(255, 255, 255, 0.5)'
                    }),
                    stroke: new ol.style.Stroke({
                        color: 'rgba(0, 0, 0, 0.5)',
                        lineDash: [10, 10],
                        width: 2
                    }),
                    image: new ol.style.Circle({
                        radius: 5,
                        stroke: new ol.style.Stroke({
                            color: 'rgba(0, 0, 0, 0.5)'
                        }),
                        fill: new ol.style.Fill({
                            color: 'rgba(255, 255, 255, 0.5)'
                        })
                    })
                })
            });
            this.map.addInteraction(layerInfo.Drawer);
            me.map.DrawMapManager = me;
            me.map.on('pointermove', me.pointerMoveHandlerForMeasure);

            me.createMeasureTooltip();
            me.showMouseHelpTooltip('单击开始测量');

            layerInfo.Drawer.on('drawstart',
              function (evt) {
                  // set sketch
                  me.sketch = evt.feature;
                  me.hideMouseHelpTooltip();
              }, this);

            layerInfo.Drawer.on('drawend',
              function (evt) {
                  me.measureTooltipElement.className = 'tooltip tooltip-static';
                  me.measureTooltip.setOffset([0, -7]);
                  // unset sketch
                  me.sketch = null;
                  // unset tooltip so that a new one can be created
                  me.measureTooltipElement = null;

                  //取消测量
                  me.map.removeInteraction(layerInfo.Drawer);
                  me.map.un('pointermove', me.pointerMoveHandlerForMeasure);

              }, this);
        },

        pointerMoveHandlerForMeasure: function (evt) {
            var me = evt.map.DrawMapManager;
            if (evt.dragging) {
                return;
            }
            var tooltipCoord = evt.coordinate;

            if (me.sketch) {
                var output;
                var geom = (me.sketch.getGeometry());
                if (geom instanceof ol.geom.Polygon) {
                    output = me.formatArea(geom, evt.map);
                    tooltipCoord = geom.getInteriorPoint().getCoordinates();
                } else if (geom instanceof ol.geom.LineString) {
                    output = me.formatLength(geom, evt.map);
                    tooltipCoord = geom.getLastCoordinate();
                }
                me.measureTooltipElement.innerHTML = output;
                me.measureTooltip.setPosition(tooltipCoord);
            }
        },

        /**
        * Creates a new measure tooltip
        */
        createMeasureTooltip: function () {
            var me = this;
            if (me.measureTooltipElement) {
                me.measureTooltipElement.parentNode.removeChild(me.measureTooltipElement);
            }
            me.measureTooltipElement = document.createElement('div');
            me.measureTooltipElement.className = 'tooltip tooltip-measure';
            me.measureTooltip = new ol.Overlay({
                element: this.measureTooltipElement,
                offset: [0, -15],
                positioning: 'bottom-center'
            });
            me.map.addOverlay(me.measureTooltip);
        },

        /**
        * format length output
        * @param {ol.geom.LineString} line
        * @return {string}
        */
        formatLength: function (line, map) {
            var length;
            if (true) {
                var coordinates = line.getCoordinates();
                length = 0;
                // var sourceProj = map.getView().getProjection();
                // for (var i = 0, ii = coordinates.length - 1; i < ii; ++i) {
                //     var c1 = ol.proj.transform(coordinates[i], sourceProj, 'EPSG:4326');
                //     var c2 = ol.proj.transform(coordinates[i + 1], sourceProj, 'EPSG:4326');
                //     length += map.DrawMapManager.wgs84Sphere.haversineDistance(c1, c2);
                // }
                length = ol.sphere.getLength(line,map.getView().getProjection());
            } else {
                length = Math.round(line.getLength() * 100) / 100;
            }
            var output;
            if (length > 100) {
                output = (Math.round(length / 1000 * 100) / 100) +
                ' ' + 'km';
            } else {
                output = (Math.round(length * 100) / 100) +
                ' ' + 'm';
            }
            return output;
        },


        /**
        * format length output
        * @param {ol.geom.Polygon} polygon
        * @return {string}
        */
        formatArea: function (polygon, map) {
            var area;
            if (true) {
                var sourceProj = map.getView().getProjection();
                // var geom = /** @type {ol.geom.Polygon} */(polygon.clone().transform(
                // sourceProj, 'EPSG:4326'));
                // var coordinates = geom.getLinearRing(0).getCoordinates();
                // area = Math.abs(map.DrawMapManager.wgs84Sphere.geodesicArea(coordinates));
                area = ol.sphere.getArea(polygon,sourceProj);
            } else {
                area = polygon.getArea();
            }
            var output;
            if (area > 10000) {
                output = (Math.round(area / 1000000 * 100) / 100) +
                ' ' + 'km<sup>2</sup>';
            } else {
                output = (Math.round(area * 100) / 100) +
                ' ' + 'm<sup>2</sup>';
            }
            return output;
        },




        //开始绘制标点
        BeginDrawMarker : function(markerInfo)
        {
            var layerInfo = this.GetLayer(markerInfo.LayerGroup, markerInfo.LayerId);
            if (layerInfo == null) {
                layerInfo = this.CreateNewLayer(markerInfo.LayerGroup, markerInfo.LayerId);
            }
            if (!layerInfo.Select) {
                layerInfo.Select = new ol.interaction.Select({
                    layers: [layerInfo.Layer],
                    filter: function (feature) {
                        if (feature.Moveable) {
                            return true;
                        }
                    }
                });
                this.map.addInteraction(layerInfo.Select);
            }
            if (!layerInfo.Modify) {
                layerInfo.Modify = new ol.interaction.Modify({
                    features: layerInfo.Select.getFeatures()
                });

                layerInfo.Modify.on("modifyend", this.ModifyEndHandler);
                this.map.addInteraction(layerInfo.Modify);
            }


            //var selectF = layerInfo.Source.getFeatureById(markerInfo.CaseId);
            //if (selectF) {
            //    selectF.Moveable = true;
            //}
            //else {
                this.showMouseHelpTooltip("单击选定定位点，可以拖动修改!");
                this.DataInfo = markerInfo;
                this.map.DrawMapManager = this;
                this.map.once('click', this.mapClickHandler);
            //}
        },

        mapClickHandler: function (evt) {
            var me = evt.map.DrawMapManager;
            me.DataInfo.LonLat = evt.coordinate;
            me.DataInfo.Feature = me.addMarker(me.DataInfo);
            me.hideMouseHelpTooltip();

            if (me.DataInfo && me.DataInfo.Data) {
                me.DataInfo.Data.CaseLonX = me.DataInfo.LonLat[0];
                me.DataInfo.Data.CaseLatY = me.DataInfo.LonLat[1];
            }
            topic.publish("egis/Map/DrawMarkerModifyEnd", me.DataInfo);
        },



        ModifyEndHandler: function (evt) {

            var me = evt.mapBrowserPointerEvent.map.DrawMapManager;
            if (!me.DataInfo) {
                return;
            }

            me.DataInfo.LonLat = me.DataInfo.Feature.getGeometry().getCoordinates();
            if (me.DataInfo && me.DataInfo.Data) {
                me.DataInfo.Data.CaseLonX = me.DataInfo.LonLat[0];
                me.DataInfo.Data.CaseLatY = me.DataInfo.LonLat[1];
            }
            topic.publish("egis/Map/DrawMarkerModifyEnd", me.DataInfo);
        },


        addMarker: function (markerInfo) {

            var layerInfo = this.GetLayer(markerInfo.LayerGroup, markerInfo.LayerId);
            if (layerInfo == null) {
                layerInfo = this.CreateNewLayer(markerInfo.LayerGroup, markerInfo.LayerId);
            }

            var titleColor = "Green";
            if (markerInfo.TitleColor) {
                titleColor = markerInfo.TitleColor;
            }
            var iconStyle = new ol.style.Style({
                image: new ol.style.Icon(({
                    src: markerInfo.ImgUrl
                })),
                text: new ol.style.Text({
                    offsetX: 0,
                    offsetY: -36,
                    text: markerInfo.ShowText,
                    fill: new ol.style.Fill({ color: 'white' }),
                    stroke: new ol.style.Stroke({
                        color: titleColor,
                        width: 4
                    })
                })
            });

            var point = new ol.geom.Point(markerInfo.LonLat);
            var feature = new ol.Feature({ geometry: point });
            feature.setStyle(iconStyle);

            feature.DataInfo = markerInfo;
            if (markerInfo.CaseId) {
                feature.setId(markerInfo.CaseId);
            }
            layerInfo.Source.addFeature(feature);
            feature.Moveable = true;
            return feature;
        }

    });

});