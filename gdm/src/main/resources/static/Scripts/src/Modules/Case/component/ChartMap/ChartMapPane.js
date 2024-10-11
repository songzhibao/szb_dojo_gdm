
/**
* User: chengbin
* Date: 13-4-1
*/
define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/Evented",
    "dojo/topic",
    "dojo/on",
    "dojo/aspect",
    'dojo/request',
    'dojo/_base/array',
    'dojo/date',
    "dojo/data/ItemFileWriteStore",
    'dojo/ready',
    "dojo/dom-style",

    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dijit/tree/ForestStoreModel",
    "dijit/form/DateTextBox",
    "dijit/form/Button",
    "dijit/form/Select",
    "dijit/Dialog",
    "dijit/TitlePane",
    "dojox/widget/Standby",
    "dojox/grid/EnhancedGrid",
    "dojox/grid/LazyTreeGrid",
    "dojox/grid/enhanced/plugins/Filter",
    "dojox/grid/enhanced/plugins/Pagination",
    "dojox/grid/enhanced/plugins/IndirectSelection",
    'egis/appEnv',
    'egis/Share/component/InfoPane/TableInfoPopup',
    "egis/Modules/Case/component/ffyy/ConfirmDialog",
    "egis/Modules/Case/component/ffyy/ConfirmDialogOK",
    'ol',
    "egis/Modules/Case/component/ChartMap/detail_dialog",
    "dojo/text!./ChartMapPane.html"
], function (declare, lang, Evented, topic, on, aspect, request, array, dateUtil, ItemFileWriteStore,
    ready, domStyle, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, ForestStoreModel,DateTextBox, Button, Select, Dialog, TitlePane, Standby, EnhancedGrid, LazyTreeGrid, Filter, Pagination,
    IndirectSelection, appEnv,TableInfoPopup, ConfirmDialog, ConfirmDialogOK, ol, detail_dialog, template) {

    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {

        templateString: template,

        standby: null,

        currentLayer_hot: null,
        tbLayer_hot: null,
        hbLayer_hot: null,
        select_Layer_hot: null,

        currentLayer: null,
        tbLayer: null,
        hbLayer: null,
        select_Layer: null,
        seelct_Layer_Type: '',

        currentDetailData: null,

        featurePopup: null,
        _map: null,

        grid: null,

        grid_data: null,

        sDate: '',

        eDate: '',

        tlDIV: null,
        tlDIV1: null,

        postCreate: function () {
            this.inherited(arguments);
        },

        _initMapCenter: function () {

            var center = appEnv.mapConfig.getCenterLonlat();
            this._map.getView().setCenter(center);
            //this._map.getView().setZoom(appEnv.mapConfig.locateZoom);

            //var extent = appEnv.mapConfig.fullExtent;
            //var size = this._map.getSize();
            //var view = this._map.getView();
            //view.fit(extent, size, {});
        },

        startup: function () {
            this.inherited(arguments);
            this._initStandby();
            this._initTL();
            this._initMap();
            this._initChart();
            this._buildTreeGrid();

            this._initMapCenter();

            this._initAction();
        },

        _initStandby: function () {

            this.standby = document.createElement('div');
            this.standby.style.cssText = "text-align:center; cursor: wait;display: none;position:absolute;z-index:200;width:520px;height:" + (parseInt(this.mainTable.clientHeight) - 20) + "px;background-color: rgb(192, 192, 192);opacity: 0.75;left:3px;top:60px;";

            var _img = document.createElement('img');
            _img.style.cssText = "margin-top:" + (parseInt(this.mainTable.clientHeight) - 160 - 32) / 2 + "px;";
            _img.src = "/Content/themes/blue/images/loading.gif";
            this.standby.appendChild(_img);

            this.domNode.appendChild(this.standby);

        },

        _initTL: function () {

            var _tlDIV1 = document.getElementById('tlDIV1');
            var _tlDIV = document.getElementById('tlDIV');

            if (_tlDIV1 != null) {

                this.tlDIV = _tlDIV;
                this.tlDIV1 = _tlDIV1;
                return;
            }

            this.tlDIV1 = document.createElement('div');
            this.tlDIV1.id = 'tlDIV1';
            this.tlDIV1.style.cssText = "display:none; position:absolute;z-index:200;width:160px;height:125px;background-color: #0098ff;opacity: 0.3;top: " + (parseInt(this.mainTable.clientHeight) - 60 - 125) + "px; left: 540px; ";
            this.domNode.appendChild(this.tlDIV1);

            this.tlDIV = document.createElement('div');
            this.tlDIV.id = 'tlDIV';
            this.tlDIV.style.cssText = "display:none; position:absolute;z-index:201;width:150px;height:" + (parseInt(this.tlDIV1.style.height) - 10) + "px;top: " + (parseInt(this.tlDIV1.style.top) + 5) + "px; left: " + (parseInt(this.tlDIV1.style.left) + 5) + "px;";
            this.domNode.appendChild(this.tlDIV);

            var table_title = document.createElement('table');
            var row_title = table_title.insertRow();
            var cell_title = row_title.insertCell();
            cell_title.style.cssText = "width:60px; font-weight:bold; vertical-align:middle; font-size:13px;  font-family:'Microsoft YaHei';";
            cell_title.innerHTML = '&nbsp;&nbsp;&nbsp;&nbsp;图例';
            cell_title = row_title.insertCell();
            cell_title.style.cssText = "width:45px; font-weight:bold; vertical-align:middle; font-size:13px;  font-family:'Microsoft YaHei';";
            cell_title.innerHTML = '热力图';
            cell_title = row_title.insertCell();
            cell_title.style.cssText = "width:30px; font-weight:bold; vertical-align:middle; font-size:13px;  font-family:'Microsoft YaHei';";
            cell_title.innerHTML = '详情';
            this.tlDIV.appendChild(table_title);


            var table = document.createElement('table');

            var row = table.insertRow();
            row.id = "tl_table_row_now";
            row.style.cssText = "display:block;";
            var cell = row.insertCell();
            cell.style.cssText = "width:20px;";
            cell.innerHTML = '<img  src="/Content/themes/blue/images/case/casetype/qsfx/now_24.png"/>';
            cell = row.insertCell();
            cell.style.cssText = "width:40px; vertical-align:middle; font-size:12px;  font-family:'Microsoft YaHei';";
            cell.innerHTML = '当前';
            cell = row.insertCell();
            cell.style.cssText = "width:35px;";
            cell.innerHTML = '<img id="tl_table_rowNow_cellHot" style="cursor:pointer;" src="/Content/themes/blue/images/case/casetype/qsfx/hm_off.png" />';
            cell = row.insertCell();
            cell.style.cssText = "width:30px;";
            cell.innerHTML = '<img id="tl_table_rowNow_cellDetail" style="cursor:pointer;" src="/Content/themes/blue/images/case/casetype/qsfx/caselist_on.png" />';

            row = table.insertRow();
            row.id = "tl_table_row_lastYear";
            row.style.cssText = "display:block;";
            cell = row.insertCell();
            cell.style.cssText = "width:20px;";
            cell.innerHTML = '<img  src="/Content/themes/blue/images/case/casetype/qsfx/lastYear_24.png"/>';
            cell = row.insertCell();
            cell.style.cssText = "width:40px; vertical-align:middle; font-size:12px;  font-family:'Microsoft YaHei';";
            cell.innerHTML = '同比';
            cell = row.insertCell();
            cell.style.cssText = "width:35px;";
            cell.innerHTML = '<img id="tl_table_rowLastYear_cellHot" style="cursor:pointer;" src="/Content/themes/blue/images/case/casetype/qsfx/hm_off.png" />';
            cell = row.insertCell();
            cell.style.cssText = "width:30px;";
            cell.innerHTML = '<img id="tl_table_rowLastYear_cellDetail" style="cursor:pointer;" src="/Content/themes/blue/images/case/casetype/qsfx/caselist_on.png" />';


            row = table.insertRow();
            row.id = "tl_table_row_lastMon";
            row.style.cssText = "display:block;";
            cell = row.insertCell();
            cell.style.cssText = "width:20px;";
            cell.innerHTML = '<img  src="/Content/themes/blue/images/case/casetype/qsfx/lastMon_24.png"/>';
            cell = row.insertCell();
            cell.style.cssText = "width:40px; vertical-align:middle; font-size:12px;  font-family:'Microsoft YaHei';";
            cell.innerHTML = '环比';
            cell = row.insertCell();
            cell.style.cssText = "width:35px;";
            cell.innerHTML = '<img id="tl_table_rowLastMon_cellHot" style="cursor:pointer;" src="/Content/themes/blue/images/case/casetype/qsfx/hm_off.png" />';
            cell = row.insertCell();
            cell.style.cssText = "width:30px;";
            cell.innerHTML = '<img id="tl_table_rowLastMon_cellDetail" style="cursor:pointer;" src="/Content/themes/blue/images/case/casetype/qsfx/caselist_on.png" />';


            row = table.insertRow();
            row.id = "tl_table_row_selected";
            row.style.cssText = "display:none;";
            cell = row.insertCell();
            cell.style.cssText = "width:20px;";
            cell.innerHTML = '<img  src="/Content/themes/blue/images/case/casetype/qsfx/selected_24.png"/>';
            cell = row.insertCell();
            cell.style.cssText = "width:40px; vertical-align:middle; font-size:12px;  font-family:'Microsoft YaHei';";
            cell.innerHTML = '选中';
            cell = row.insertCell();
            cell.style.cssText = "width:35px;";
            cell.innerHTML = '<img id="tl_table_rowSelected_cellHot" style="cursor:pointer;" src="/Content/themes/blue/images/case/casetype/qsfx/hm_off.png" />';
            cell = row.insertCell();
            cell.style.cssText = "width:30px;";
            cell.innerHTML = '<img id="tl_table_rowSelected_cellDetail" style="cursor:pointer;" src="/Content/themes/blue/images/case/casetype/qsfx/caselist_on.png" />';


            this.tlDIV.appendChild(table);


            document.getElementById('tl_table_rowNow_cellHot').onclick = lang.hitch(this, function (e) {

                this._switchHotMap(e.srcElement);
            });
            document.getElementById('tl_table_rowLastYear_cellHot').onclick = lang.hitch(this, function (e) {

                this._switchHotMap(e.srcElement);
            });
            document.getElementById('tl_table_rowLastMon_cellHot').onclick = lang.hitch(this, function (e) {

                this._switchHotMap(e.srcElement);
            });
            document.getElementById('tl_table_rowSelected_cellHot').onclick = lang.hitch(this, function (e) {

                this._switchHotMap(e.srcElement);
            });

            document.getElementById('tl_table_rowNow_cellDetail').onclick = lang.hitch(this, function (e) {

                this._switchDetailDialog(e.srcElement);
            });
            document.getElementById('tl_table_rowLastYear_cellDetail').onclick = lang.hitch(this, function (e) {

                this._switchDetailDialog(e.srcElement);
            });
            document.getElementById('tl_table_rowLastMon_cellDetail').onclick = lang.hitch(this, function (e) {

                this._switchDetailDialog(e.srcElement);
            });
            document.getElementById('tl_table_rowSelected_cellDetail').onclick = lang.hitch(this, function (e) {

                this._switchDetailDialog(e.srcElement);
            });

        },

        _switchDetailDialog: function (obj) {

            var data = null;
            var type = '';
            if (obj.id == 'tl_table_rowNow_cellDetail') {

                data = this.currentDetailData.current;
                type = '当前';
            }
            else if (obj.id == 'tl_table_rowLastYear_cellDetail') {

                data = this.currentDetailData.tb;
                type = '同比';
            }
            else if (obj.id == 'tl_table_rowLastMon_cellDetail') {

                data = this.currentDetailData.hb;
                type = '环比';
            }
            else if (obj.id == 'tl_table_rowSelected_cellDetail') {

                data = this.select_Layer;
                type = '选中';
            }

            this._showDetailDialog(data, type);

        },
        
        _switchHotMap: function (obj) {

            if (obj.id == 'tl_table_rowNow_cellHot') {

                if (obj.src.indexOf('qsfx/hm_off.png') >= 0) {
                    obj.src = '/Content/themes/blue/images/case/casetype/qsfx/hm_on.png';
                    this.showHot(this.currentLayer_hot, this.currentLayer);
                }
                else {
                    obj.src = '/Content/themes/blue/images/case/casetype/qsfx/hm_off.png';
                    this.currentLayer_hot.getSource().clear();
                }
            }
            else if (obj.id == 'tl_table_rowLastYear_cellHot') {

                if (obj.src.indexOf('qsfx/hm_off.png') >= 0) {
                    obj.src = '/Content/themes/blue/images/case/casetype/qsfx/hm_on.png';
                    this.showHot(this.tbLayer_hot, this.tbLayer);
                }
                else {
                    obj.src = '/Content/themes/blue/images/case/casetype/qsfx/hm_off.png';
                    this.tbLayer_hot.getSource().clear();
                }
            }
            else if (obj.id == 'tl_table_rowLastMon_cellHot') {

                if (obj.src.indexOf('qsfx/hm_off.png') >= 0) {
                    obj.src = '/Content/themes/blue/images/case/casetype/qsfx/hm_on.png';
                    this.showHot(this.hbLayer_hot, this.hbLayer);
                }
                else {
                    obj.src = '/Content/themes/blue/images/case/casetype/qsfx/hm_off.png';
                    this.hbLayer_hot.getSource().clear();
                }
            }
            else if (obj.id == 'tl_table_rowSelected_cellHot') {

                if (obj.src.indexOf('qsfx/hm_off.png') >= 0) {
                    obj.src = '/Content/themes/blue/images/case/casetype/qsfx/hm_on.png';
                    this.showHot(this.select_Layer_hot, this.select_Layer);
                }
                else {
                    obj.src = '/Content/themes/blue/images/case/casetype/qsfx/hm_off.png';
                    this.select_Layer_hot.getSource().clear();
                }
            }

        },

        _showDetailDialog: function (data,type) {

            var mapPane = appEnv.getCurrentPane();
            if (!mapPane.detail_dialog) {
                mapPane.detail_dialog = new detail_dialog({
                    title: '警情列表',
                    style: 'position:absolute; left:350px; top:200px; width:650px; height:400px; z-index:100000',
                    map: this._map,
                    initPosition: 'lt'
                });

                aspect.after(mapPane.detail_dialog, 'close', lang.hitch(this, function () {

                    mapPane.detail_dialog = null;

                }));

                mapPane.addFloatingPane(mapPane.detail_dialog);
            }

            mapPane.detail_dialog.set('title',  '警情列表-' + type);
            mapPane.detail_dialog._loadGridData(data, type);
        },

        _resetTL: function () {

            this.tlDIV1.style.display = 'block';
            this.tlDIV.style.display = 'block';
            this.tlDIV1.style.height = '125px';
            this.tlDIV.style.height = '115px';
            this.tlDIV1.style.top = (parseInt(this.mainTable.clientHeight) - 60 - 125).toString() + 'px';
            this.tlDIV.style.top = (parseInt(this.tlDIV1.style.top) + 5).toString() + 'px';

            document.getElementById('tl_table_row_now').style.display = 'block';
            document.getElementById('tl_table_row_lastYear').style.display = 'block';
            document.getElementById('tl_table_row_lastMon').style.display = 'block';
            document.getElementById('tl_table_row_selected').style.display = 'none';

            document.getElementById('tl_table_rowNow_cellHot').src = '/Content/themes/blue/images/case/casetype/qsfx/hm_off.png';
            document.getElementById('tl_table_rowLastYear_cellHot').src = '/Content/themes/blue/images/case/casetype/qsfx/hm_off.png';
            document.getElementById('tl_table_rowLastMon_cellHot').src = '/Content/themes/blue/images/case/casetype/qsfx/hm_off.png';
            document.getElementById('tl_table_rowSelected_cellHot').src = '/Content/themes/blue/images/case/casetype/qsfx/hm_off.png';
        },

        _resetTableHeight: function (id, show) {

            this.tlDIV1.style.display = 'block';
            this.tlDIV.style.display = 'block';

            var old_tlDIV1_top = this.tlDIV1.style.top.replace('px', '');
            var old_tlDIV_top = this.tlDIV.style.top.replace('px', '');
            var old_tlDIV1_height = this.tlDIV1.style.height.replace('px', '');
            var old_tlDIV_height = this.tlDIV.style.height.replace('px', '');

            if (show) {
                
                if (id == 'tl_table_row_selected') {

                    if (document.getElementById(id).style.display == "none") {
                        this.tlDIV1.style.top = (parseInt(old_tlDIV1_top) - 30).toString() + 'px';
                        this.tlDIV.style.top = (parseInt(old_tlDIV_top) - 30).toString() + 'px';
                        this.tlDIV1.style.height = (parseInt(old_tlDIV1_height) + 30).toString() + 'px';
                        this.tlDIV.style.height = (parseInt(old_tlDIV_height) + 30).toString() + 'px';
                    }
                }
                else {
                    this.tlDIV1.style.top = (parseInt(old_tlDIV1_top) - 30).toString() + 'px';
                    this.tlDIV.style.top = (parseInt(old_tlDIV_top) - 30).toString() + 'px';
                    this.tlDIV1.style.height = (parseInt(old_tlDIV1_height) + 30).toString() + 'px';
                    this.tlDIV.style.height = (parseInt(old_tlDIV_height) + 30).toString() + 'px';
                }
                document.getElementById(id).style.display = "block";
            }
            else {


                var mapPane = appEnv.getCurrentPane();
                if (mapPane.detail_dialog) {
                    mapPane.detail_dialog.close();
                }


                document.getElementById(id).style.display = "none";

                this.tlDIV1.style.top = (parseInt(old_tlDIV1_top) + 30).toString() + 'px';
                this.tlDIV.style.top = (parseInt(old_tlDIV_top) + 30).toString() + 'px';
                this.tlDIV1.style.height = (parseInt(old_tlDIV1_height) - 30).toString() + 'px';
                this.tlDIV.style.height = (parseInt(old_tlDIV_height) - 30).toString() + 'px';

                var img_id = '';
                if (id == 'tl_table_row_selected') {

                    this.select_Layer.getSource().clear();
                    this.seelct_Layer_Type = '';
                    img_id = 'tl_table_rowSelected_cellHot';
                    this.select_Layer_hot.getSource().clear();
                }
                else if (id == 'tl_table_row_now') {

                    img_id = 'tl_table_rowNow_cellHot';
                    this.currentLayer_hot.getSource().clear();
                }
                else if (id == 'tl_table_row_lastMon') {

                    img_id = 'tl_table_rowLastMon_cellHot';
                    this.hbLayer_hot.getSource().clear();
                }
                else if (id == 'tl_table_row_lastYear') {

                    img_id = 'tl_table_rowLastYear_cellHot';
                    this.tbLayer_hot.getSource().clear();
                }
                document.getElementById(img_id).src = '/Content/themes/blue/images/case/casetype/qsfx/hm_off.png';

            }

            if (document.getElementById('tl_table_row_now').style.display == 'none' && document.getElementById('tl_table_row_lastMon').style.display == 'none' && document.getElementById('tl_table_row_lastYear').style.display == 'none') {

                this.tlDIV1.style.display = 'none';
                this.tlDIV.style.display = 'none';
            }
        },

        _initMap: function () {


            var pane = appEnv.getCurrentPane();
            if (pane != null) {
                this._map = pane.map;
            }
            this._map.setTarget(document.getElementById('mapPanel_qsfx'));

            this._map.on('singleclick', lang.hitch(this, this._mapOnClickEvent), this);
            this._map.on('pointermove', lang.hitch(this, this._mapOnMoveEvent), this);


            // 环比警情 热点
            this.hbLayer_hot = new ol.layer.Heatmap({
                source: new ol.source.Vector({
                    features: null
                }),
                blur: 20,
                radius: 15
            });
            this._map.addLayer(this.hbLayer_hot);
            // 同比警情 热点
            this.tbLayer_hot = new ol.layer.Heatmap({
                source: new ol.source.Vector({
                    features: null
                }),
                blur: 20,
                radius: 15
            });
            this._map.addLayer(this.tbLayer_hot);
            // 当前警情 热点
            this.currentLayer_hot = new ol.layer.Heatmap({
                source: new ol.source.Vector({
                    features: null
                }),
                blur: 20,
                radius:15
            });
            this._map.addLayer(this.currentLayer_hot);
            // 选择集 热点
            this.select_Layer_hot = new ol.layer.Heatmap({
                source: new ol.source.Vector({
                    features: null
                }),
                blur: 20,
                radius: 15
            });
            this._map.addLayer(this.select_Layer_hot);



            //环比警情
            var source_hb = new ol.source.Vector({
                features: []
            });
            this.hbLayer = new ol.layer.Vector({
                source: source_hb,
                id: "hb"
            });
            this.hbLayer.id = "hb";
            this._map.addLayer(this.hbLayer);
            //同比警情
            var source_tb = new ol.source.Vector({
                features: []
            });
            this.tbLayer = new ol.layer.Vector({
                source: source_tb,
                id: "tb"
            });
            this.tbLayer.id = "tb";
            this._map.addLayer(this.tbLayer);

            //当前警情
            var source_current = new ol.source.Vector({
                features: []
            });
            this.currentLayer = new ol.layer.Vector({
                source: source_current,
                id: "current"
            });
            this.currentLayer.id = "current";
            this._map.addLayer(this.currentLayer);

            //选择集
            var source_select = new ol.source.Vector({
                features: []
            });
            this.select_Layer = new ol.layer.Vector({
                source: source_select,
                id: "select"
            });
            this.select_Layer.id = "select";
            this._map.addLayer(this.select_Layer);
        },

        showHot: function (layer,sourceLayer) {

            var geojsonObject = {
                'type': 'FeatureCollection',
                'crs': {
                    'type': 'name',
                    'properties': {
                        'name': 'EPSG:3857'
                    }
                },
                'features': []
            };


            sourceLayer.getSource().forEachFeature(lang.hitch(this, function (feature) {

                if (feature && feature.data) {

                    var x = feature.getGeometry().getCoordinates()[0];
                    var y = feature.getGeometry().getCoordinates()[1];

                    var tepFeature = new Object();
                    tepFeature.type = 'Feature';
                    tepFeature.geometry = {
                        'type': 'Point',
                        'coordinates': [x, y]
                    }
                    geojsonObject.features.push(tepFeature);
                }

            }), this);

            layer.getSource().addFeatures((new ol.format.GeoJSON()).readFeatures(geojsonObject));

            
        },

        _initAction: function () {

            var selectFun = function () {
                if (this.chart) {
                    this.chart.clear();
                }
                this.sDate = this.datePickerNode1.displayedValue;
                this.eDate = this.datePickerNode2.displayedValue;

                var queryCondition = {
                    startTime: this.sDate.replaceAll('/', '-') + " 00:00:00",
                    endTime: this.eDate.replaceAll('/', '-') + " 23:59:59"
                };

                this._loadTreeGrid(queryCondition);

            };
            on(this.QueryButton, "click", lang.hitch(this, selectFun));     
            
        },

        _loadTreeGrid: function (queryCondition) {

            this.tlDIV1.style.display = 'none';
            this.tlDIV.style.display = 'none';

            this.grid_data = null;
            this.select_Layer.getSource().clear();
            this.select_Layer.setVisible(true);
            this.currentLayer.getSource().clear();
            this.currentLayer.setVisible(true);
            this.tbLayer.getSource().clear();
            this.tbLayer.setVisible(true);
            this.hbLayer.getSource().clear();
            this.hbLayer.setVisible(true);

            this.currentLayer_hot.getSource().clear();
            this.currentLayer_hot.setVisible(true);
            this.tbLayer_hot.getSource().clear();
            this.tbLayer_hot.setVisible(true);
            this.hbLayer_hot.getSource().clear();
            this.hbLayer_hot.setVisible(true);
            this.select_Layer_hot.getSource().clear();
            this.select_Layer_hot.setVisible(true);


            if (this.featurePopup != null) {
                this._map.removeOverlay(this.featurePopup);
                this.featurePopup = null;
            }

            this.standby.style.display = 'block';

            request.post("/caseinfo/getCaseTypeCount", {
                data: queryCondition,
                handleAs: "json"
            }).then(lang.hitch(this, function (result) {
                var data = result.data;
                this.standby.style.display = 'none';
                if (data == null || data == "" || data.length < 1) {
                    return;
                }

                this.grid_data = dojo.clone(data);

                var _data = {
                    identifier: 'id',
                    label: 'name',
                    items: data
                };

                var store = new dojo.data.ItemFileWriteStore({ data: _data });

                this.grid.setStore(store);

            }));
        },

        _buildTreeGrid: function () {

            var data = {
                identifier: 'id',
                label: 'name',
                items: []
            };

            var store = new dojo.data.ItemFileWriteStore({ data: data });
            var model = new dijit.tree.ForestStoreModel({ store: store, childrenAttrs: ['children'] });

            var layout = [
                { name: '案件类型', field: 'name', width: '160px' },
                {
                    name: '当前案件数', field: 'counts', width: '70px'
                },
                {
                    name: '同比数&nbsp;&nbsp;<b>/</b>&nbsp;&nbsp;同比率', field: 'countsTb', width: '100px',
                    formatter: function (value, inx, level, row) {

                        var tblStr = "";
                        var intCount = parseInt(this.grid.getItem(inx).counts[0]);
                        var intCount_tb = parseInt(this.grid.getItem(inx).countsTb[0]);
                        if (intCount_tb == 0) {
                            tblStr = "&nbsp;&nbsp;<b>/</b>&nbsp;&nbsp;<font color='red'>↑100%</font>";
                        }
                        else {
                            var tbl = (intCount - intCount_tb) / intCount_tb;
                            tbl = tbl * 100;
                            tbl = tbl.toFixed(2);

                            if (tbl < 0)
                                tblStr = "&nbsp;&nbsp;<b>/</b>&nbsp;&nbsp;<font color='green'>↓" + (tbl * -1).toString() + "%</font>";
                            else
                                tblStr = "&nbsp;&nbsp;<b>/</b>&nbsp;&nbsp;<font color='red'>↑" + tbl.toString() + "%</font>";
                        }
                        tblStr = intCount_tb.toString() + tblStr;
                        return tblStr;
                    }
                },
                {
                    name: '环比数&nbsp;&nbsp;<b>/</b>&nbsp;&nbsp;环比率', field: 'countsHb', width: '100px',
                    formatter: function (value, inx, level, row) {

                        var tblStr = "";
                        var intCount = parseInt(this.grid.getItem(inx).counts[0]);
                        var intCount_hb = parseInt(this.grid.getItem(inx).countsHb[0]);
                        if (intCount_hb == 0) {
                            tblStr = "&nbsp;&nbsp;<b>/</b>&nbsp;&nbsp;<font color='red'>↑100%</font>";
                        }
                        else {
                            var tbl = (intCount - intCount_hb) / intCount_hb;
                            tbl = tbl * 100;
                            tbl = tbl.toFixed(2);

                            if (tbl < 0)
                                tblStr = "&nbsp;&nbsp;<b>/</b>&nbsp;&nbsp;<font color='green'>↓" + (tbl * -1).toString() + "%</font>";
                            else
                                tblStr = "&nbsp;&nbsp;<b>/</b>&nbsp;&nbsp;<font color='red'>↑" + tbl.toString() + "%</font>";
                        }
                        tblStr = intCount_hb.toString() + tblStr;
                        return tblStr;
                    }
                }
            ];

            this.grid = new dojox.grid.LazyTreeGrid({
                id: 'grid',
                treeModel: model,
                structure: layout,
                rowSelector: '20px'
            }, document.createElement('div'));
            this.grid.on("rowdblclick", lang.hitch(this, function (e) {

                if (this.grid.getItem(e.rowIndex).children != undefined) {
                    var code = this.grid.getItem(e.rowIndex).code[0];
                    this._dbClickLoadDetail(code, e.rowIndex);
                }
            }));

            dojo.byId('gridDiv').appendChild(this.grid.domNode);

            this.grid.canSort = function () { return false; };
            this.grid.startup();
        },

        _dbClickLoadDetail: function (code, selectIndex) {

            this._initMapCenter();

            this.tlDIV1.style.display = 'none';
            this.tlDIV.style.display = 'none';

            this.seelct_Layer_Type = '';
            this.select_Layer.getSource().clear();
            this.select_Layer.setVisible(true);
            this.currentLayer.getSource().clear();
            this.currentLayer.setVisible(true);
            this.tbLayer.getSource().clear();
            this.tbLayer.setVisible(true);
            this.hbLayer.getSource().clear();
            this.hbLayer.setVisible(true);

            this.currentLayer_hot.getSource().clear();
            this.currentLayer_hot.setVisible(true);
            this.tbLayer_hot.getSource().clear();
            this.tbLayer_hot.setVisible(true);
            this.hbLayer_hot.getSource().clear();
            this.hbLayer_hot.setVisible(true);
            this.select_Layer_hot.getSource().clear();
            this.select_Layer_hot.setVisible(true);

            if (this.featurePopup != null) {
                this._map.removeOverlay(this.featurePopup);
                this.featurePopup = null;
            }

            this.currentData = this.grid_data[selectIndex];

            if (this.grid.getItem(selectIndex).detailData != undefined && this.grid.getItem(selectIndex).detailData[0] != null) {

                this.currentDetailData = this.grid.getItem(selectIndex).detailData[0];

                if (this.currentDetailData.current != undefined && this.currentDetailData.tb != undefined && this.currentDetailData.hb != undefined) {

                    this.showCases(this.currentDetailData.current, this.currentLayer, 1, 'current');
                    this.showCases(this.currentDetailData.hb, this.hbLayer, 1, 'hb');
                    this.showCases(this.currentDetailData.tb, this.tbLayer, 1, 'tb');

                    this.showChart();

                    this._resetTL();
                    this.tlDIV1.style.display = 'block';
                    this.tlDIV.style.display = 'block';
                }

                return;
            }

            this.standby.style.display = 'block';

            request.post("/caseinfo/getCaseTypeCountDetail", {
                data: { startTime: this.sDate.replaceAll('/', '-') + " 00:00:00", endTime: this.eDate.replaceAll('/', '-') + " 23:59:59",orgCodes:[appEnv.appConfig.GetRootOrgId()], caseTypes: [code] },
                handleAs: "json"
            }).then(lang.hitch(this, function (result) {
                var data = result.data;
                this.standby.style.display = 'none';
                this.grid.store.setValue(this.grid.getItem(selectIndex), 'detailData', data);
                if (data.current != undefined && data.tb != undefined && data.hb != undefined) {

                    this.currentDetailData = data;
                    this.showCases(data.current, this.currentLayer, 1, 'current');
                    this.showCases(data.hb, this.hbLayer, 1, 'hb');
                    this.showCases(data.tb, this.tbLayer, 1, 'tb');

                    this.showChart();

                    this._resetTL();
                    this.tlDIV1.style.display = 'block';
                    this.tlDIV.style.display = 'block';
                }

            }));
        },

        showCases: function (caseInfos, layer, scale, type) {

            for (var i = 0; i < caseInfos.length; i++) {

                var caseInfo = caseInfos[i];

                var imgurl = "/Content/themes/blue/images/case/casetype/qsfx/now_16.png";
                if (type == 'current') {
                    imgurl = "/Content/themes/blue/images/case/casetype/qsfx/now_16.png";
                }
                else if (type == 'hb') {
                    imgurl = "/Content/themes/blue/images/case/casetype/qsfx/lastMon_16.png";
                }
                else if (type == 'tb') {
                    imgurl = "/Content/themes/blue/images/case/casetype/qsfx/lastYear_16.png";
                }

                var iconStyle = new ol.style.Style({
                    image: new ol.style.Icon({
                        src: imgurl,
                        scale: scale
                    })
                });

                if (caseInfo.lon != null && caseInfo.lat != null) {

                    var lonlat = [parseFloat(caseInfo.lon), parseFloat(caseInfo.lat)];
                    var geom = geom = new ol.geom.Point(lonlat);
                    var feature = new ol.Feature({ geometry: geom });
                    feature.setStyle(iconStyle);
                    feature.data = caseInfo;
                    if (feature) {

                        layer.getSource().addFeature(feature);
                    }
                }
            }
        },

        addFeatureToSelectLayer: function (f) {

            var x = f.getGeometry().getCoordinates()[0];
            var y = f.getGeometry().getCoordinates()[1];

            var imgurl = "/Content/themes/blue/images/case/casetype/qsfx/selected_16.png";

            var iconStyle = new ol.style.Style({
                image: new ol.style.Icon({
                    src: imgurl
                })
            });

            if (x != null && y != null) {

                var lonlat = [parseFloat(x), parseFloat(y)];
                var geom = geom = new ol.geom.Point(lonlat);
                var feature = new ol.Feature({ geometry: geom });
                feature.setStyle(iconStyle);
                feature.data = f.data;
                if (feature) {

                    this.select_Layer.getSource().addFeature(feature);
                }
            }
            //三区三圈
            if (f.data.area_strxy != undefined) {

                var hasExit=this.select_Layer.getSource().forEachFeature(lang.hitch(this, function (feature) {

                    if (feature && feature.data) {

                        if (feature.sqsq_id && feature.sqsq_id == f.data.area_id) {
                            return 'true';
                        }
                    }

                }), this);

                if (hasExit != 'true') {
                    var strs = f.data.area_strxy.split(',');
                    var lonlat = [parseFloat(strs[0]), parseFloat(strs[1])];
                    var radius = parseFloat(strs[2]);

                    var circleStyle = new ol.style.Style({
                        fill: new ol.style.Fill({
                            color: 'rgba(255, 255, 255, 0.3)'
                        }),
                        stroke: new ol.style.Stroke({
                            color: 'green',
                            lineDash: [4, 4],
                            width: 2
                        })
                    });

                    var circle = new ol.geom.Circle(lonlat, radius);
                    var feature = new ol.Feature({ geometry: circle });
                    feature.setStyle(circleStyle);
                    feature.data = f.data;
                    feature.sqsq_id = f.data.area_id;
                    if (feature) {
                        this.select_Layer.getSource().addFeature(feature);
                    }
                }
            }
        },

        forEachLayersGetFeature: function (layer, caseCodes, lx) {

            layer.getSource().forEachFeature(lang.hitch(this, function (feature) {

                if (feature && feature.data) {

                    var _cCaseCode = '';
                    if (lx == 'caseType') {

                        var sqsqays = "'政区','景区','站区','校圈','商圈','医圈'";
                        if (sqsqays.indexOf(caseCodes) >= 0) {
                            _cCaseCode = feature.data.area_sqsq;
                        }
                        else {
                            _cCaseCode = "'" + feature.data.case_type + "'";
                        }
                    }
                    if (lx == 'org') {
                        _cCaseCode = "'" + feature.data.duty_orgid + "'";
                    }

                    if (_cCaseCode != '' && caseCodes.indexOf(_cCaseCode) >= 0) {
                        this.addFeatureToSelectLayer(feature);
                    }
                }

            }), this);
        },

        selectFeatures: function (type, lx, caseCodes) {

            this._initMapCenter();

            if (this.featurePopup != null) {
                this._map.removeOverlay(this.featurePopup);
                this.featurePopup = null;
            }
            this.select_Layer.getSource().clear();
            this.select_Layer.setVisible(true);

            this.seelct_Layer_Type = type;
            if (type == '当前') {

                this.forEachLayersGetFeature(this.currentLayer, caseCodes, lx);
            }
            else if (type == '同比') {

                this.forEachLayersGetFeature(this.tbLayer, caseCodes, lx);
            }
            else if (type == '环比') {

                this.forEachLayersGetFeature(this.hbLayer, caseCodes, lx);
            }

            this._resetTableHeight('tl_table_row_selected', true);
        },

        showHideLayer: function (type, show) {

            if (this.seelct_Layer_Type == type) {
                this.select_Layer.setVisible(show);
                this._resetTableHeight('tl_table_row_selected', show);
            }

            if (type == '当前') {

                this.currentLayer.setVisible(show);
                this._resetTableHeight('tl_table_row_now', show);
            }
            else if (type == '同比') {

                this.tbLayer.setVisible(show);
                this._resetTableHeight('tl_table_row_lastYear', show);
            }
            else if (type == '环比') {

                this.hbLayer.setVisible(show);
                this._resetTableHeight('tl_table_row_lastMon', show);
            }
        },

        _mapOnClickEvent: function (evt) {

            var feature = this._map.forEachFeatureAtPixel(evt.pixel, lang.hitch(this, function (feature, layer) {

                if (feature && layer && (layer.id == 'current' || layer.id == 'tb' || layer.id == 'hb' || layer.id == 'select')) {

                    return feature;
                }
                else {
                    return null;
                }
            }), this, lang.hitch(this, function (layer) {

                if (layer && (layer.id == 'current' || layer.id == 'tb' || layer.id == 'hb' || layer.id == 'select')) {
                    return true;
                }
                else {
                    return false;
                }
            }), this);


            if (feature && feature.data) {

                var geometry = feature.getGeometry();
                if (feature.sqsq_id) {

                    var coord = geometry.getCenter();
                    var caseInfo = feature.data;

                    if (this.featurePopup != null) {
                        this._map.removeOverlay(this.featurePopup);
                        this.featurePopup = null;
                    }
                    var olPopup = new TableInfoPopup({
                        title: caseInfo.area_name,
                        map: this._map,
                        data: [
                            { name: '名称', value: caseInfo.area_name || '' },
                            { name: '区圈', value: caseInfo.area_sqsq || '' },
                            { name: '警务区', value: caseInfo.area_jwqname || '' }
                        ],
                        detailClickHandler: lang.hitch(this, function () {

                            //三区三圈详细信息
                        })
                    });

                    olPopup.on('close', lang.hitch(this, function () {

                        this._map.removeOverlay(this.featurePopup);
                        this.featurePopup = null;
                    }));
                    olPopup.domNode.style.width = '250px';
                    olPopup.startup();
                    olPopup.show();

                    this.featurePopup = new ol.Overlay({
                        element: olPopup.domNode,
                        positioning: 'bottom-left',
                        offset: [-2, -17],
                        autoPan: true,
                        autoPanAnimation: {
                            duration: 250
                        }
                    });

                    this.featurePopup.setPosition(coord);
                    this._map.addOverlay(this.featurePopup);
                }
                else {
                    var coord = geometry.getCoordinates();
                    var caseInfo = feature.data;

                    if (this.featurePopup != null) {
                        this._map.removeOverlay(this.featurePopup);
                        this.featurePopup = null;
                    }

                    var olPopup = new TableInfoPopup({
                        title: caseInfo.caseTypeName,
                        map: this._map,
                        data: [
                                            { name: '编号', value: caseInfo.case_code.substring(0, 20) + '</br>' + caseInfo.case_code.substring(20) || '' },
                                            { name: '类型', value: caseInfo.caseTypeName || '' },
                                            { name: '地址', value: caseInfo.case_address || '' },
                                            { name: '时间', value: caseInfo.case_time.replace("T", " ") || '' }
                        ],
                        detailClickHandler: lang.hitch(this, function () {

                            appEnv.appConfig.ShowCaseUrl(caseInfo);

                        })
                    });

                    olPopup.on('close', lang.hitch(this, function () {

                        this._map.removeOverlay(this.featurePopup);
                        this.featurePopup = null;
                    }));
                    olPopup.domNode.style.width = '250px';
                    olPopup.startup();
                    olPopup.show();

                    this.featurePopup = new ol.Overlay({
                        element: olPopup.domNode,
                        positioning: 'bottom-left',
                        offset: [-2, -17],
                        autoPan: true,
                        autoPanAnimation: {
                            duration: 250
                        }
                    });

                    this.featurePopup.setPosition(coord);
                    this._map.addOverlay(this.featurePopup);
                }
            }
        },

        _mapOnMoveEvent: function (evt) {

            var pixel = this._map.getEventPixel(evt.originalEvent);
            var hit = this._map.hasFeatureAtPixel(pixel);
            this._map.getTarget().style.cursor = hit ? 'pointer' : '';

        },

        _initChart: function () {
            if (!this.chart) {
                this.chart = echarts.init(document.getElementById('chartDiv'));

                this.chart.on('click', lang.hitch(this, function (params) {
                    var evtData = this._getClickData(params.name);

                    var type;
                    if (params.seriesName == '警情类型') {
                        type = '当前';
                    }
                    else {
                        type = params.seriesName;
                    }

                    this.selectFeatures(type, this.showType.get('value'), evtData.ays);
                }));

                this.chart.on('legendselectchanged', lang.hitch(this, function (params) {
                    var obj = params.selected;
                    for (var i in obj) {
                        if (obj.hasOwnProperty(i) && typeof (obj[i]) != "function") {
                            if (i == params.name) {
                                this.showHideLayer(i, obj[i]);
                            }
                        }
                    }
                }));
            }

            this.chartType.on('change', lang.hitch(this, function () {
                this.showChart();
            }));
            this.showType.on('change', lang.hitch(this, function () {
                this.showChart();
            }));
        },

        showChart: function () {
            var showType = this.showType.get('value');
            var chartType = this.chartType.get('value');
            switch (chartType) {
                case 'column': this._showColumn(showType); break;
                case 'pie': this._showPie(showType); break;
            }
        },

        _showColumn: function (type) {
            //初始化
            this.chart.clear();
            var option = {
                color: ['#0000ff', '#cccccc', '#808080'],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                legend: {
                    data: []
                },
                xAxis: [
                    {
                        type: 'category',
                        axisLabel: {
                            formatter: function (val) {
                                return val.split("").join("\n");
                            }
                        },
                        data: []
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: '灾害数',
                        min: 0
                    }
                ],
                series: [],
                animationEasing: 'elasticOut',
                animationDelayUpdate: function (idx) {
                    return idx * 5;
                }
            };

            var data;
            if (type == 'caseType') {
                data = this.currentData.children;
            } else {
                data = this.currentDetailData.orgCounts;
            }

            //构造x轴
            for (var i = 0; i < data.length; i++) {
                option.xAxis[0].data.push(data[i].name);
            }

            //类别
            option.legend.data = ['当前', '同比', '环比'];

            //加入图表数据
            for (var i = 0; i < option.legend.data.length; i++) {
                var item = {
                    name: option.legend.data[i],
                    type: "bar",
                    data: []
                };
                for (var j = 0; j < data.length; j++) {
                    if (item.name == '当前') {
                        item.data.push(data[j].counts);
                    } else if (item.name == '同比') {
                        item.data.push(data[j].countsTb);
                    } else if (item.name == '环比') {
                        item.data.push(data[j].countsHb);
                    } else {
                        item.data.push(0);
                    }
                }
                option.series.push(item);
            }
            this.chart.setOption(option);
        },

        _showPie: function (type, idx) {
            this.chart.clear();
            var option = {
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                series: [{
                    name: '警情类型',
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '60%'],
                    data: [],
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }]
            };

            if (type == 'caseType') {
                data = this.currentData.children;
            } else {
                data = this.currentDetailData.orgCounts;
            }
            for (var i = 0; i < data.length; i++) {
                if (data[i].counts > 0) {
                    option.series[0].data.push({ value: data[i].counts, name: data[i].name });
                }
            }
            // 使用刚指定的配置项和数据显示图表。
            this.chart.setOption(option);
        },

        _getClickData: function (name) {
            var result = null;

            array.forEach(this.currentData.children, function (item) {
                if (item.name == name) {
                    result = item;
                }
            });
            array.forEach(this.currentDetailData.orgCounts, function (item) {
                if (item.name == name) {
                    result = item;
                }
            });

            return result;
        }
    });
});