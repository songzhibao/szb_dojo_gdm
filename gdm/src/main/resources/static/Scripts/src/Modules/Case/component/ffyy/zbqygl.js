
/**
* User: chengbin
* Date: 13-4-1
*/
define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/Evented",
    "dojo/on",
    "dojo/aspect",
    'dojo/request',
    'dojo/_base/array',
    'dojo/date',
    "dojo/data/ItemFileWriteStore",

    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dijit/Dialog",

    "dojox/widget/Standby",
    "dojox/grid/EnhancedGrid",
    "dojox/grid/enhanced/plugins/Filter",
    "dojox/grid/enhanced/plugins/Pagination",
    "dojox/grid/enhanced/plugins/IndirectSelection",
    'egis/appEnv',
    'ds/gis/openlayers/control/ZIndexManagerControl',
    'ds/gis/openlayers/control/LayerSwitchControl',
    'egis/openlayers/Scale',
    'egis/openlayers/BaseLayerSwitchControl',
    "egis/openlayers/MousePosition",
    'ol',
    "egis/component/ffyy/zbqygl_panel",
    "dojo/text!./zbqygl.html"
], function (declare, lang, Evented, on, aspect, request, array, dateUtil, ItemFileWriteStore, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin,
    Dialog, Standby, EnhancedGrid, Filter, Pagination, IndirectSelection, appEnv, ZIndexManagerControl, LayerSwitchControl, Scale, BaseLayerSwitchControl, MousePosition,
    ol, zbqygl_panel, template) {

    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {

        templateString: template,

        _myMap: null,

        standby: null,

        postCreate: function () {
            this.inherited(arguments);
        },

        startup: function () {
            this.inherited(arguments);

            this._initStandby();
            this._initMap();
            this._initFloatPanel();
        },

        destroy: function () {
            this.inherited(arguments);
        },
        _initStandby: function () {
            // 创建等待提示
            this.standby = new Standby({
                target: this.domNode
            });
            document.body.appendChild(this.standby.domNode);
            this.standby.startup();
        },
        _initFloatPanel: function () {

            var mapPane = appEnv.getCurrentPane();
            if (!mapPane.zbqygl_panel) {
                mapPane.zbqygl_panel = new zbqygl_panel({
                    title: '治保区域',
                    map:this._myMap,
                    style: 'position:absolute; left:360px; top:200px; width:320px;height:530px',
                    dockTo: mapPane.dockTo,
                    initPosition: 'lt'
                });

                mapPane.addFloatingPane(mapPane.zbqygl_panel);
            }
        },
        _initMap: function () {

            var baseLayers = appEnv.mapConfig.getBaseLayers();
            baseLayers.SelectLayer = true;

            var baseLayerTypes = appEnv.mapConfig.getBaseLayerTypes();
            baseLayerTypes.push(baseLayers);

            var mousePos = new ol.control.MousePosition({
                coordinateFormat: ol.coordinate.createStringXY(4),
                projection: 'EPSG:4326',
                className: 'custom-mouse-position',
                target: document.getElementById('mouse-position'),
                undefinedHTML: '&nbsp;'
            });

            this._myMap = new ol.Map({
                layers: [baseLayers],
                projection: 'EPSG:4326',
                target: 'mapPanel_zbqygl',
                logo: false,
                controls: ol.control.defaults().extend([

                    new ol.control.ScaleLine()
                ]),
                controls: ol.control.defaults().extend([

                    new ol.control.ScaleLine(),
                    //new LayerSwitchControl(),
                    new BaseLayerSwitchControl({
                        baseLayerTypes: baseLayerTypes,
                        type: 0
                    }),
                    mousePos
                ]),
                view: new ol.View({

                    minZoom: 10,
                    maxZoom: 20,
                    projection: 'EPSG:4326',
                    center: appEnv.mapConfig.getCenterLonlat(),
                    zoom: appEnv.mapConfig.locateZoom
                })
            });
        }
    });
});