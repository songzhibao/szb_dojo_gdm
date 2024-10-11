/**
* User: chengbin
* Date: 13-5-2
*/
define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/request/xhr',
    // 'egis/Map/component/BaseLayerSwitch',
    'ol'

], function (declare, lang, xhr, ol) {

    var _MapBuilder = declare([], {

        /**
        * openlayers地图实例的配置文件，必须覆盖该属性
        */
        mapConfig: null,

        constructor: function (args) {
            declare.safeMixin(this, args || {});
        },

        buildMap: function (el) {

        }

    });

    return declare([_MapBuilder], {

        buildMap: function () {

            var me = this,
                baseLayers,
                map;

            baseLayers = me.mapConfig.getBaseLayers();
            baseLayers.SelectLayer = true;

            var baseLayerTypes = this.mapConfig.getBaseLayerTypes();
            baseLayerTypes.push(baseLayers);

            var mousePos = new ol.control.MousePosition({
                coordinateFormat: ol.coordinate.createStringXY(6),
                projection: me.mapConfig.projection,
                className: 'custom-mouse-position',
                target: document.getElementById('mouse-position'),
                undefinedHTML: '&nbsp;'
            });

            var map = new ol.Map({
                layers: [baseLayers],
                projection: 'EPSG:4326',
                renderer: 'canvas',
                controls: [
                // new BaseLayerSwitch({
                //     baseLayerTypes: baseLayerTypes
                // }),
                mousePos
                ],
                view: new ol.View(me.mapConfig)
            });

            map.EventSelf = this;
            map.getView().on('change:resolution', function (evt) {
                var r = map.getView().getResolution();
                if (document.getElementById("mouse-zoom")) {
                    document.getElementById("mouse-zoom").innerHTML = map.getView().getZoom() + "级";
                }
                //var dpi = 96;
                //var mtoin = 39.3700787;
                //var scale = (1 / r) * dpi * mtoin;
                ////console.log(r + "—>" + scale);

                //var layers = map.getLayers().getArray();
                //var len = layers.length;
                //for (var i = 0; i < len; i++) {
                //    var layer = layers[i];
                //    if (layer.id == "资源撒点图层") {
                //        map.EventSelf.changeResolution(r,layer);
                //    }
                //}
                


            }, this);


            return map;

        },

        changeResolution: function (oldSolution,resourceLayer) {

            if (resourceLayer) {
                var source = resourceLayer.getSource();
                source.forEachFeature(lang.hitch(this, function (feature) {
                    if (feature && feature.resource) {

                        var style = feature.getStyle();
                        if (style) {
                            var text = style.getText();
                            if (text) {
                                if (oldSolution > 0.000010728836059570312) {
                                    var name = text.getText();
                                    if (name) {
                                        text.setText("");
                                        feature.resource.Data.Name = name;
                                    }
                                }
                                else {
                                    var name = text.getText();
                                    if (!name) {
                                        text.setText(feature.resource.Data.Name);
                                    }
                                }
                            }
                        }
                    }
                }), this);

            }
        },

    });

});