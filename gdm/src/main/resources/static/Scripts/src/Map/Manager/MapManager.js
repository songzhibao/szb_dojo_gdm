/**
* Author: shenyi
* Email: shenyi@dscomm.com.cn
* Date: 13-9-5
*/
define(['dojo/_base/declare', 'dojo/_base/lang', 'dojo/Evented', 'dojox/uuid/generateRandomUuid', 'ol'], function (declare, lang, Evented, generateRandomUuid, ol) {
    return declare([Evented], {
        map: null,
        LayerList: null,

        constructor: function (config) {
            this.id = generateRandomUuid();
            declare.safeMixin(this, config || {});

            this.LayerList = new Object();

        },
        zoomTo: function (zoom) {
            this.map.zoomTo.apply(this.map, arguments);
        },
        zoomToMaxExtent: function () {
            this.map.zoomToMaxExtent.apply(this.map, arguments);
        },
        zoomToExtent: function (bounds, closet) {
            this.map.zoomToExtent.apply(this.map, arguments);
        },
        zoomIn: function () {
            this.map.zoomIn.apply(this.map, arguments);
        },
        zoomOut: function () {
            this.map.zoomOut.apply(this.map, arguments);
        },
        zoomToScale: function (scale, closest) {
            this.map.zoomToScale.apply(this.map, arguments);
        },
        setCenter: function (location, zoom, dragging, forceZoomChange) {
            this.map.setCenter.apply(this.map, arguments);
        },

        GetFeatureById: function (featureId)
        {
            for (var key in this.LayerList) {
                var feature = this.LayerList[key].Source.getFeatureById(featureId);
                if (feature != null)
                {
                    return feature;
                }
            }
            return null;
        },

        /**
        * 显示鼠标跟随提示
        */
        showMouseHelpTooltip: function (helpMsg) {
            var me = this;
            if (me.helpTooltipElement) {
                me.helpTooltipElement.parentNode.removeChild(me.helpTooltipElement);
            }
            me.helpTooltipElement = document.createElement('div');
            me.helpTooltipElement.className = 'tooltip';
            me.helpTooltip = new ol.Overlay({
                element: me.helpTooltipElement,
                offset: [15, 0],
                positioning: 'center-left'
            });
            me.helpTooltipElement.innerHTML = helpMsg;
            me.map.addOverlay(me.helpTooltip);
            me.map.TooltipSelf = me;
            me.map.on('pointermove', me.pointerMoveHandler);
        },

        pointerMoveHandler: function (evt) {
            var me = evt.map.TooltipSelf;
            if (evt.dragging) {
                return;
            }
            var tooltipCoord = evt.coordinate;
            me.helpTooltip.setPosition(evt.coordinate);
        },

        hideMouseHelpTooltip: function () {

            var me = this;
            me.map.un('pointermove', me.pointerMoveHandler);
            if (me.helpTooltip) {
                me.map.removeOverlay(me.helpTooltip);
                me.helpTooltip = null;
            }

            if (me.helpTooltipElement) {
                me.helpTooltipElement.parentNode.removeChild(me.helpTooltipElement);
                me.helpTooltipElement = null;
            }
        },

        selectPointFromMap: function (info)
        {
            this.map.CurrentSelectEvent = info;
            this.map.CurrentMapManager = this;
            if (info.HelpMsg) {
                this.showMouseHelpTooltip(info.HelpMsg);
            }
            this.map.once('click', this.selectPointClickHandler);
        },

        selectPointClickHandler: function (evt)
        {
            var tooltipCoord = evt.coordinate;
            if (evt.map.CurrentSelectEvent) {
                if (!evt.map.CurrentSelectEvent.EventType)
                {
                    evt.map.CurrentSelectEvent.EventType = "egis/Map/SelectPoint/Reply";
                }
                evt.map.CurrentSelectEvent.SelectPoint = tooltipCoord;
                window.dojo.publish(evt.map.CurrentSelectEvent.EventType, evt.map.CurrentSelectEvent);
                if (window.parent.window.dojo)
                {
                    window.parent.window.dojo.publish(evt.map.CurrentSelectEvent.EventType, evt.map.CurrentSelectEvent);
                }
                evt.map.CurrentMapManager.hideMouseHelpTooltip();
                evt.map.CurrentSelectEvent = null;
            }
        },

        locateFlash: function (flashGeom) {

            var start = new Date().getTime();
            var listenerKey;
            var duration = 4000;
            var me = this;

            // function animate(event) {
            //     var vectorContext = event.vectorContext;
            //     var frameState = event.frameState;
            //     var elapsed = frameState.time - start;
            //     var elapsedRatio = elapsed / duration;
            //     // radius will be 5 at start and 30 at end.
            //     var radius = ol.easing.easeOut(elapsedRatio) * 40 + 5;
            //     var opacity = ol.easing.easeOut(1 - elapsedRatio);

            //     var style = new ol.style.Style({
            //         image: new ol.style.Circle({
            //             radius: radius,
            //             snapToPixel: false,
            //             stroke: new ol.style.Stroke({
            //                 color: 'rgba(255, 0, 0, ' + opacity + ')',
            //                 width: 0.25 + opacity
            //             })
            //         })
            //     });

            //     vectorContext.setStyle(style);
            //     vectorContext.drawGeometry(flashGeom);
            //     if (elapsed > duration) {
            //         ol.Observable.unByKey(listenerKey);
            //         return;
            //     }
            //     // tell OL3 to continue postcompose animation
            //     me.map.render();
            // }
            // listenerKey = this.map.on('postcompose', animate);

            // OL4  以上的实现方式
            var view = this.map.getView();
            view.animate({center:flashGeom.getCoordinates(),duration:duration});
        },


        waterFlash: function (flashGeom) {

            var start = new Date().getTime();
            var listenerKey;
            var duration = 4000;
            var me = this;

            function animate(event) {
                var vectorContext = event.vectorContext;
                var frameState = event.frameState;
                var elapsed = frameState.time - start;
                var elapsedRatio = elapsed / duration;
                // radius will be 5 at start and 30 at end.
                var radius = ol.easing.easeOut(elapsedRatio) * 10 + 5;
                var opacity = ol.easing.easeOut(1 - elapsedRatio);

                var style = new ol.style.Style({
                    image: new ol.style.Circle({
                        radius: radius,
                        snapToPixel: false,
                        stroke: new ol.style.Stroke({
                            color: 'rgba(24, 152, 164, ' + opacity + ')',
                            width: 0.25 + opacity
                        })
                    })
                });

                vectorContext.setStyle(style);
                vectorContext.drawGeometry(flashGeom);
                if (elapsed > duration) {
                    ol.Observable.unByKey(listenerKey);
                    return;
                }
                // tell OL3 to continue postcompose animation
                me.map.render();
            }
            listenerKey = this.map.on('postcompose', animate);
        },

        locatePanTo: function (coords) {

            var view = this.map.getView();
            // OL3 的平移实现
            // var pan = ol.animation.pan({
            //     duration: 2000,
            //     source: /** @type {ol.Coordinate} */(view.getCenter())
            // });
            // this.map.beforeRender(pan);
            // view.setCenter(coords);

            // OL4  以上的实现方式
            view.animate({center:coords,duration:2000});
        },

        locateFlyTo: function (flashGeom) {
            var view = this.map.getView();
            var duration = 2000;

            // OL3 的平移实现
            // var start = +new Date();
            // var pan = ol.animation.pan({
            //     duration: duration,
            //     source: /** @type {ol.Coordinate} */(view.getCenter()),
            //     start: start
            // });
            // var bounce = ol.animation.bounce({
            //     duration: duration,
            //     resolution: 4 * view.getResolution(),
            //     start: start
            // });
            // this.map.beforeRender(pan, bounce);
            // view.setCenter(flashGeom.getCoordinates());

            // OL4  以上的实现方式
            view.animate({center:flashGeom.getCoordinates(),duration:duration});
        },

        AddLayer: function (layerGroup, layerId,layer,source) {
            var layerInfo = new Object();
            var layerKey = layerGroup + ":" + layerId;

            layerInfo.Layer = layer;

            layerInfo.Source = source;

            this.map.addLayer(layerInfo.Layer);

            this.LayerList[layerKey] = layerInfo;

            return layerInfo;
        },

        CreateNewLayer: function (layerGroup, layerId,zIndex) {
            var layerInfo = new Object();
            var layerKey = layerGroup + ":" + layerId;
            layerInfo.Source = new ol.source.Vector({
                features: []
            });

            layerInfo.Layer = new ol.layer.Vector({
                source: layerInfo.Source,
                id: layerKey
            });
            if (zIndex) {
                layerInfo.Layer.setZIndex(zIndex);
            }
            else {
                layerInfo.Layer.setZIndex(100);
            }
            this.map.addLayer(layerInfo.Layer);

            this.LayerList[layerKey] = layerInfo;

            return layerInfo;
        },


        calculateClusterInfo: function (feature, resolution, layerInfo) {

            layerInfo.Layer.maxFeatureCount = 0;

            var features = layerInfo.Layer.getSource().getFeatures();
            var feature, radius;
            for (var i = features.length - 1; i >= 0; --i) {
                feature = features[i];
                var originalFeatures = feature.get('features');
                var extent = ol.extent.createEmpty();
                var j, jj;
                for (j = 0, jj = originalFeatures.length; j < jj; ++j) {
                    ol.extent.extend(extent, originalFeatures[j].getGeometry().getExtent());
                }
                layerInfo.Layer.maxFeatureCount = Math.max(layerInfo.Layer.maxFeatureCount, jj);
                radius = 0.25 * (ol.extent.getWidth(extent) + ol.extent.getHeight(extent)) / resolution;
                feature.set('radius', radius);
            }
        },

        styleClusterFunction: function (feature, resolution) {
            var fs = feature.get('features');
            if (fs.length <= 0)
            {
                return;
            }

            var manager = fs[0].Resource.Manager;
            var layerInfo = manager.GetLayer(fs[0].Resource.LayerGroup, fs[0].Resource.LayerId);
            if (layerInfo == null) {
                return;
            }
            if (resolution != layerInfo.Layer.currentClusterResolution) {
                manager.calculateClusterInfo(feature, resolution, layerInfo);
                layerInfo.Layer.currentClusterResolution = resolution;
            }
            var style;
            var size = fs.length;
            if (size > 1) {
                style = new ol.style.Style({
                    image: new ol.style.Circle({
                        radius: feature.get('radius'),
                        fill: new ol.style.Fill({
                            color: [255, 153, 0, Math.min(0.8, 0.4 + (size / layerInfo.Layer.maxFeatureCount))]
                        })
                    }),
                    text: new ol.style.Text({
                        text: size.toString(),
                        fill: new ol.style.Fill({
                            color: '#fff'
                        }),
                        stroke: new ol.style.Stroke({
                            color: 'rgba(0, 0, 0, 0.6)',
                            width: 3
                        })
                    })
                });
            } else {
                var originalFeature = fs[0];
                style = originalFeature.getStyle();
            }
            return style;
        },

        selectStyleClusterFunction : function (feature) {
            var styles = [new ol.style.Style({
            image: new ol.style.Circle({
                radius: feature.get('radius'),
                fill: new ol.style.Fill({
                    color: 'rgba(255, 255, 255, 0.01)'
                })
              })
            })];
            var originalFeatures = feature.get('features');
            var originalFeature;
            for (var i = originalFeatures.length - 1; i >= 0; --i) {
                originalFeature = originalFeatures[i];
                styles.push(originalFeature.getStyle());
            }
            return styles;
        },


        CreateClusterLayer: function (layerGroup, layerId, zIndex) {
            var layerInfo = new Object();
            var layerKey = layerGroup + ":" + layerId;
            layerInfo.Source = new ol.source.Vector({
                features: []
            });

            layerInfo.Layer = new ol.layer.Vector({
                source: new ol.source.Cluster({
                    distance: 40,
                    source: layerInfo.Source,
                }),
                style: this.styleClusterFunction,
                id: layerKey
            });

            //layerInfo.Layer.Select = new ol.interaction.Select({
            //    condition: function (evt) {
            //        return evt.originalEvent.type == 'mousemove' ||
            //            evt.type == 'singleclick';
            //    },
            //    style: this.selectStyleClusterFunction
            //});
            //this.map.addInteraction(layerInfo.Select);
            if (zIndex) {
                layerInfo.Layer.setZIndex(zIndex);
            }
            else {
                layerInfo.Layer.setZIndex(100);
            }
            this.map.addLayer(layerInfo.Layer);

            this.LayerList[layerKey] = layerInfo;

            return layerInfo;
        },

        CreateHotLayer: function (layerGroup, layerId, zIndex) {
            var layerInfo = new Object();
            var layerKey = layerGroup + ":" + layerId;
            layerInfo.Source = new ol.source.Vector({
                features: []
            });

            layerInfo.Layer = new ol.layer.Heatmap({
                source: layerInfo.Source,
                blur: 20,
                radius:15,
                id: layerKey
            });

            if (zIndex) {
                layerInfo.Layer.setZIndex(zIndex);
            }
            else {
                layerInfo.Layer.setZIndex(100);
            }
            this.map.addLayer(layerInfo.Layer);

            this.LayerList[layerKey] = layerInfo;

            return layerInfo;
        },


        CreateColdLayer: function (layerGroup, layerId, zIndex) {
            var layerInfo = new Object();
            var layerKey = layerGroup + ":" + layerId;
            layerInfo.Source = new ol.source.Vector({
                features: []
            });

            layerInfo.Layer = new ol.layer.Heatmap({
                source: layerInfo.Source,
                blur: 30,
                radius: 10,
                gradient: ['#10ecfa', '#7bcdfc', '#539df9', '#2182fb', '#2182fb'],
                id: layerKey
            });

            if (zIndex) {
                layerInfo.Layer.setZIndex(zIndex);
            }
            else {
                layerInfo.Layer.setZIndex(100);
            }
            this.map.addLayer(layerInfo.Layer);

            this.LayerList[layerKey] = layerInfo;

            return layerInfo;
        },

        RemoveAll: function () {
            for (var key in this.LayerList) {
                this.RemoveLayerByID(key);
                key = null;
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


        HideLayerByGroupName: function (layerGroup) {
            for (var key in this.LayerList) {
                if (key.toString().indexOf(layerGroup + ":") == 0) {
                    this.HideLayerByID(key);
                }
                key = null;
            }
        },

        ShowLayerByGroupName: function (layerGroup) {
            for (var key in this.LayerList) {
                if (key.toString().indexOf(layerGroup + ":") == 0) {
                    this.ShowLayerByID(key);
                }
                key = null;
            }
        },

        RemoveLayerByID: function (key) {

            var layerInfo = this.LayerList[key];
            if (layerInfo != null) {
                layerInfo.Layer.getSource().clear();
                if (layerInfo.Layer.Select)
                {
                    this.map.removeInteraction(layerInfo.Layer.Select);
                }
                this.map.removeLayer(layerInfo.Layer);
                layerInfo.Layer = null;

                delete this.LayerList[key];
                layerInfo = null;
            }
        },


        GetLayersByGroupName: function (layerGroup) {

            var array = new Array();
            for (var key in this.LayerList) {
                if (key.toString().indexOf(kmlName + ":") == 0) {
                    var layer = this.LayerList[key];
                    if (layer != null) {
                        array.push(layer);
                    }
                }
                key = null;
            }
            return array;
        },


        IsHaveLayer: function (layerGroup, layerId) {
            var layer = this.LayerList[layerGroup + ":" + layerId]
            if (layer != null) {
                return true;
            }
            else {
                return false;
            }
        },

        HideLayerByID: function (key) {

            var layerInfo = this.LayerList[key];
            if (layerInfo != null) {
                this.map.removeLayer(layerInfo.Layer);
            }
        },


        ShowLayerByID: function (key) {

            var layerInfo = this.LayerList[key];
            if (layerInfo != null) {
                this.map.addLayer(layerInfo.Layer);
            }
        },

        GetLayer: function (layerGroup, layerId) {
            var layer = this.LayerList[layerGroup + ":" + layerId]
            if (layer != null) {
                return layer;
            }
            else {
                return null;
            }
        },


        //获取随机颜色
        getRandomColor: function (belongId) {
            var colorList = ["#008000", "#000080", "#B50000", "#5300A6", "lightskyblue", "fuchsia", "navy", "darkgreen", "red", "purple"];
            if (!this.BelongColorList) {
                this.BelongColorList = new Object();
                this.BelongColorArray = new Array();
            }

            var color = this.BelongColorList[belongId]
            if (color == null) {
                var ramdomNum = this.BelongColorArray.length % 4;
                if (ramdomNum >= 0) {
                    color = colorList[ramdomNum];
                    this.BelongColorList[belongId] = color;
                    this.BelongColorArray.push({ BelongId: belongId, Color: color });
                }
            }
            return color;
        },



        drawCircle: function (circleInfo) {

            if (!circleInfo.zIndex)
            {
                circleInfo.zIndex = 50;
            }
            var layerInfo = this.GetLayer(circleInfo.LayerGroup, circleInfo.LayerId);
            if (layerInfo == null) {
                layerInfo = this.CreateNewLayer(circleInfo.LayerGroup, circleInfo.LayerId, circleInfo.zIndex);
            }
            var lineColor = circleInfo.LineColor;
            if (!lineColor) {
                lineColor = '#80B0E1';
            }
            var lineOpacite = circleInfo.Opacite;
            if (!lineOpacite) {
                lineOpacite = 0.2;
            }
            var fillColor = circleInfo.Color;
            if (fillColor) {
                if (!lineColor) {
                    lineColor = fillColor;
                }
                fillColor = circleInfo.Color.colorRgb(lineOpacite);
            }
            else {
                fillColor = 'rgba(255, 225, 0, ' + lineOpacite + ')';
            }
            var lineWidth = circleInfo.LineWidth;
            if (!lineWidth) {
                lineWidth = 3;
            }
            var lineDash = circleInfo.LineDash;
            if (!lineDash) {
                lineDash = [4, 4];
            }

            var circleStyle = new ol.style.Style({
                fill: new ol.style.Fill({ color: fillColor }),
                stroke: new ol.style.Stroke({
                    color: lineColor,
                    lineDash: lineDash,
                    width: lineWidth
                }),
                text: new ol.style.Text({
                    text: circleInfo.ShowText,
                    font: '12px Calibri,sans-serif',
                    fill: new ol.style.Fill({ color: 'white' }),
                    stroke: new ol.style.Stroke({
                        color: 'Green',
                        width: 8
                    }),
                    offsetY: -16
                })
            });

            var regionContent = circleInfo.RegionContent;
            if (regionContent) {
                var list = regionContent.split(',');
                circleInfo.LonLat = [parseFloat(list[0]), parseFloat(list[1])];
                circleInfo.Radius = parseFloat(list[2]);
            }

            var circle = new ol.geom.Circle(circleInfo.LonLat, circleInfo.Radius);
            var feature = new ol.Feature({ geometry: circle });
            feature.setStyle(circleStyle);
            if (feature) {
                feature.Resource = circleInfo;
                layerInfo.Source.addFeature(feature);
            }

        },


        drawPoint: function (pointInfo) {

            var layerInfo = this.GetLayer(pointInfo.LayerGroup, pointInfo.LayerId);
            if (layerInfo == null) {
                layerInfo = this.CreateNewLayer(pointInfo.LayerGroup, pointInfo.LayerId);
            }

            var pointStyle = new ol.style.Style({
                image: new ol.style.Circle({//图片
                    radius: 5,
                    fill: new ol.style.Fill({
                        color: pointInfo.Color
                    })
                }),
                text: new ol.style.Text({
                    text: pointInfo.ShowText,
                    font: '12px Calibri,sans-serif',
                    fill: new ol.style.Fill({ color: 'white' }),
                    stroke: new ol.style.Stroke({
                        color: 'Green',
                        width: 8
                    }),
                    offsetY: -16
                })
            });

            var list = pointInfo.RegionContent.split(',');
            var lonlat = [parseFloat(list[0]), parseFloat(list[1])];

            var geom = new ol.geom.Point(lonlat);
            var feature = new ol.Feature({ geometry: geom });
            feature.setStyle(pointStyle);
            if (feature) {
                feature.Resource = pointInfo;
                layerInfo.Source.addFeature(feature);
            }

        },


        drawLine: function (lineInfo) {

            var layerInfo = this.GetLayer(lineInfo.LayerGroup, lineInfo.LayerId);
            if (layerInfo == null) {
                layerInfo = this.CreateNewLayer(lineInfo.LayerGroup, lineInfo.LayerId);
            }

            var lineColor = "Green";
            if (lineInfo.RandomLineColor) {
                lineColor = this.getRandomColor(lineInfo.LayerId);
            }
            if (lineInfo.Color) {
                lineColor = lineInfo.Color;
            }
            var lineWidth = 2;
            if (lineInfo.LineWidth) {
                lineWidth = lineInfo.LineWidth;
            }

            var lineStyle = new ol.style.Style({
                stroke: new ol.style.Stroke({//边界
                    color: lineColor,
                    width: lineWidth
                }),
                text: new ol.style.Text({
                    text: lineInfo.ShowText,
                    font: '12px Calibri,sans-serif',
                    fill: new ol.style.Fill({ color: 'white' }),
                    stroke: new ol.style.Stroke({
                        color: "Green",
                        width: 8
                    }),
                    offsetY: -16
                })
            });

            var points = [];
            var list = lineInfo.RegionContent.split(',');
            for (var i = 1; i < list.length; i = i + 2) {
                var x = list[i - 1];
                var y = list[i];
                var lonlat = [parseFloat(x), parseFloat(y)];
                points.push(lonlat);
            }
            var lineString = new ol.geom.LineString(points);
            var feature = new ol.Feature({ geometry: lineString });
            feature.setStyle(lineStyle);
            if (feature) {
                feature.Resource = lineInfo;
                layerInfo.Source.addFeature(feature);
            }

        },


        drawPolygon: function (polygonInfo) {

            if (!polygonInfo.zIndex)
            {
                polygonInfo.zIndex = 50;
            }
            var layerInfo = this.GetLayer(polygonInfo.LayerGroup, polygonInfo.LayerId);
            if (layerInfo == null) {
                layerInfo = this.CreateNewLayer(polygonInfo.LayerGroup, polygonInfo.LayerId, polygonInfo.zIndex);
            }
            var lineColor = polygonInfo.LineColor;
            if (!lineColor) {
                lineColor = '#80B0E1';
            }
            var lineOpacite = polygonInfo.Opacite;
            if (!lineOpacite) {
                lineOpacite = 0.2;
            }
            if (!polygonInfo.Color)
            {
                polygonInfo.Color = "#0000FF";
            }
            var polygonStyle = new ol.style.Style({
                fill: new ol.style.Fill({//填充
                    color: polygonInfo.Color.colorRgb(lineOpacite)
                }),
                stroke: new ol.style.Stroke({//边界
                    color: lineColor,
                    width: polygonInfo.LineWidth
                }),
                text: new ol.style.Text({
                    text: polygonInfo.ShowText,
                    font: '12px Calibri,sans-serif',
                    fill: new ol.style.Fill({ color: 'white' }),
                    stroke: new ol.style.Stroke({
                        color: 'Green',
                        width: 8
                    }),
                    offsetY: -16
                })
            });

            var points = [];
            var list = polygonInfo.RegionContent.split(',');
            for (var i = 1; i < list.length; i = i + 2) {
                var x = list[i - 1];
                var y = list[i];
                var lonlat = [parseFloat(x), parseFloat(y)];
                points.push(lonlat);
            }
            var polygon = new ol.geom.Polygon([points]);
            var feature = new ol.Feature({ geometry: polygon });
            feature.setStyle(polygonStyle);
            if (feature) {
                feature.Resource = polygonInfo;
                layerInfo.Source.addFeature(feature);
            }

        },



        destroy: function () {
            this.map = null;
        }
    });
});