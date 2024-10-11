
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

    "dojo/dom-style",

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
    "egis/Modules/Case/component/ffyy/jjgl_dialog",
    "egis/Modules/Case/component/ffyy/ConfirmDialog",
    "egis/Modules/Case/component/ffyy/ConfirmDialogOK",
    'egis/Modules/Case/component/ffyy/SaveAreaPane',

    'egis/openlayers/Scale',
    'egis/openlayers/BaseLayerSwitchControl',
    "egis/openlayers/MousePosition",

    'ol',
    'egis/component/TableInfoPopup',
    "dojo/text!./jjgl.html"
], function (declare, lang, Evented, topic, on, aspect, request, array, dateUtil, ItemFileWriteStore, domStyle, _WidgetBase, _TemplatedMixin,
    _WidgetsInTemplateMixin, Dialog, Standby, EnhancedGrid, Filter, Pagination, IndirectSelection, appEnv, jjgl_dialog,
    ConfirmDialog, ConfirmDialogOK, SaveAreaPane, Scale, BaseLayerSwitchControl, MousePosition,
    ol, TableInfoPopup, template) {

    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {

        templateString: template,

        isCloseed:false,
        standby: null,
        grid: null,
        circleLayer: null,
        areasLayer: null,
        _myMap: null,
        DrawEndDialog: null,
        kjcxParam: null,
        CircleMeasureHandler: null,
        _currentSelectRowIndex: null,

        result_allCount: 0,
        result_wppCount: 0,
        result_autoCount: 0,
        result_handCount: 0,
        currentStore_Items: null,

        postCreate: function () {
            this.inherited(arguments);
        },
        startup: function () {
            this.inherited(arguments);

            this._initAYSelect();
            this._initStandby();
            this._initGrid();
            this._initMap();
            this._initAction();

            this.CircleMeasureHandler = new ol.interaction.Draw({
                source: this.circleLayer.getSource(),
                type: /** @type {ol.geom.GeometryType} */('Circle')
            });
            this.CircleMeasureHandler.on('drawend', lang.hitch(this, function (evt) {

                var box = evt.feature.getGeometry().getExtent();
                var centerX = (box[0] + box[2]) / 2;
                var centerY = (box[1] + box[3]) / 2;
                var valStr = centerX + "," + centerY + "," + (centerX - box[0]);

                this.kjcxParam = {
                    geoType: "circle",
                    geoVal: valStr
                };

                this._onDrawed(this.kjcxParam);

                //置回原来的状态
                this._CircleButtonClick(false);
            }));
        },
        _initAction: function () {

            this.jjxqDiv.domNode.innerHTML = "&nbsp;报警内容：";
            this.resuultDetialLeft.domNode.innerHTML = "";
            this.resuultDetialRight.domNode.innerHTML = "";
            this.saveButton.set('disabled', true);
            this.QueryButton.set('disabled', true);

            on(this.QueryButton, "click", lang.hitch(this, function () {

                var date_s = this.datePickerNode1.displayedValue;
                var date_e = this.datePickerNode2.displayedValue;
                var ay = this.ay_select.value;
                var haswpp = false;
                if (this.wpp.checked) {
                    haswpp = true;
                }
                var hasautopp = false;
                if (this.autopp.checked) {
                    hasautopp = true;
                }

                var queryCondition = {
                    sTime: date_s,
                    eTime: date_e,
                    ay:ay,
                    haswpp: haswpp,
                    hasautopp: hasautopp
                };

                if (!this.saveButton.disabled) {

                    var cd = new ConfirmDialog({

                        message: "有未保存的数据,确认重新查询吗？",
                        yes: lang.hitch(this, function () {
                            this._updateGrid(queryCondition);
                        }),
                        no: lang.hitch(this, function () {
                            //alert("no...");
                        })
                    });
                    cd.show();
                }
                else {
                    this._updateGrid(queryCondition);
                }
                
            }));

            on(this.saveButton, "click", lang.hitch(this, function () {

                var updateJson = "";
                var list = this.grid.store._arrayOfAllItems;
                for (var i = 0; i < list.length; i++) {

                    var areaid = list[i].areaid[0];
                    if (areaid == null) areaid = '';
                    var case_code = list[i].case_code[0];
                    var hasGL = list[i].hasGL[0];
                    if (hasGL == "true") {

                        var jsonItem = "{ 'case_code': '" + case_code + "', 'areaid': '" + areaid + "'}";
                        if (updateJson == "") {
                            updateJson += jsonItem;
                        }
                        else {
                            updateJson += "," + jsonItem;
                        }
                    }
                }
                
                if (updateJson != "") {
                    updateJson = '{"data":[' + updateJson + ']}';
                    this._saveGLData(updateJson);
                }

            }));
        },
        _initAYSelect: function () {

            request.post("/ffyy_CaseInfo/GetAY", {
                handleAs: "json"
            }).then(
                    lang.hitch(this, function (data) {

                        if (data == null || data.length < 1) {
                            return;
                        }

                        var options = [{ value: '', label: '全部' }];

                        for (var i = 0; i < data.length; i++) {

                            var optionItem = { value: data[i].items, label: data[i].name };
                            options.push(optionItem);
                        }
                        this.ay_select.addOption(options);

                        this.QueryButton.set('disabled', false);

                    })
                );

        },
        _initStandby: function () {
            // 创建等待提示
            //this.standby = new Standby({
            //    target: this.domNode
            //});
            //document.body.appendChild(this.standby.domNode);
            //this.standby.startup();
            //this.standby.show();

            this.standby = document.createElement('div');
            this.standby.style.cssText = "text-align:center; cursor: wait;display: none;position:absolute;z-index:200;width:800px;height:" + (parseInt(this.mainTable.clientHeight) - 160) + "px;background-color: rgb(192, 192, 192);opacity: 0.75;left:3px;top:112px;";

            var _img=document.createElement('img');
            _img.style.cssText = "margin-top:" + (parseInt(this.mainTable.clientHeight) - 160-32) / 2 + "px;";
            _img.src = "/Scripts/lib/dojo-release-1.8.3/dojox/widget/Standby/images/loading.gif";
            this.standby.appendChild(_img);

            document.body.appendChild(this.standby);
            
        },
        _initGrid: function () {
            this.grid = new EnhancedGrid({
                structure: this._getHeader(),
                loadingMessage:"请稍后……",
                //style: "width:100%; height:100%;padding:0px;",
                plugins: {
                    pagination: {
                        pageSizes: ["50", "100", "All"],
                        description: true,
                        sizeSwitch: true,
                        pageStepper: true,
                        gotoButton: true,
                        maxPageStep: 4,
                        defaultPageSize: 50,
                        position: "bottom"
                    }
                }
            }, this.gridNode);
            this.grid.startup();

            var store = new ItemFileWriteStore({
                data: {
                    identifier: "num",
                    items: []
                }
            });
            this.grid.setStore(store);

            this.grid.on("rowclick", lang.hitch(this, function (e) {

                if (e.rowIndex != this._currentSelectRowIndex) {
                    var mapPane = appEnv.getCurrentPane();
                    if (mapPane.jjgl_dialog) {
                        mapPane.jjgl_dialog.close();
                    }
                }
                this._currentSelectRowIndex = e.rowIndex;

                var jjxqstr = this.grid.getItem(e.rowIndex).case_detailedinfo[0];
                var orgCode = this.grid.getItem(e.rowIndex).deptcode[0];
                var jwqCode = this.grid.getItem(e.rowIndex).jwqdm[0];
                var area_strxy = this.grid.getItem(e.rowIndex).area_strxy[0];

                var caseX = this.grid.getItem(e.rowIndex).lon[0];
                var caseY = this.grid.getItem(e.rowIndex).lat[0];

                this._gridRowClick(caseX, caseY, jjxqstr, orgCode, jwqCode, area_strxy);

            }));

            this.grid.on("cellClick", lang.hitch(this, function (e) {

                if (e.cell.name != "自动匹配地址") {
                    return;
                }

                var _value = this.grid.getItem(e.rowIndex).area_name[0];
                var _ajdz = this.grid.getItem(e.rowIndex).case_address[0];

                if (_value != null && _value != '' && _value.indexOf('@@red') == -1) {

                    var cd = new ConfirmDialog({

                        message: "已关联区域，确认修改？",
                        yes: lang.hitch(this, function () {
                            this._showGLDialog(_value, _ajdz);
                        }),
                        no: lang.hitch(this, function () {
                            //alert("no...");
                        })
                    });
                    cd.show();

                }
                else {
                    this._showGLDialog(_value, _ajdz);
                }



            }));
        },
        _getHeader: function () {

            var header = [{
                name: ' ',
                field: 'num',
                width: "23px"
            }, {
                name: '报警时间',
                field: 'case_time',
                width: "120px"
            }, {
                name: '事发地址',
                field: 'case_address',
                width: "140px"
            }, {
                name: '自动匹配地址',
                field: 'area_name',
                width: "80px",
                formatter: function (e) {
                    if (e) {
                        var ee = e.split('@@');
                        if (ee.length == 1) {
                            return '<div style="cursor:pointer;">' + e + '</div>';
                        }
                        else if (ee.length == 2) {
                            return '<div style="cursor:pointer;color:' + ee[1] + ';">' + ee[0] + '</div>';
                        }
                    } else {
                        return '<a href="#">手动关联</a>';
                    }
                }
            }, {
                name: '报警类型',
                field: 'case_type_name',
                width: "65px"
            }, {
                name: '所属单位',
                field: 'deptname',
                width: "90px"
            }, {
                name: '警务区',
                field: 'jwqname',
                width: "110px"
            }, {
                name: '三区三圈',
                field: 'area_sqsq',
                width: "55px",
                formatter: function (e) {
                    if (e) {
                        var ee = e.split('@@');
                        if (ee.length == 1) {
                            return e;
                        }
                        else if (ee.length == 2) {
                            return '<div style="color:' + ee[1] + ';">' + ee[0] + '</div>';
                        }
                    } else {
                        return e;
                    }
                }
            }];
            return header;
        },
        _initMap: function () {

            var baseLayers = appEnv.mapConfig.getBaseLayers();
            baseLayers.SelectLayer = true;

            var baseLayerTypes = appEnv.mapConfig.getBaseLayerTypes();
            baseLayerTypes.push(baseLayers);


            var posDiv = document.createElement('div');
            posDiv.style.cssText = "position: absolute; left: 810px; bottom: 50px; z-index: 1003;";
            this.domNode.appendChild(posDiv);

            var mousePos = new ol.control.MousePosition({
                coordinateFormat: ol.coordinate.createStringXY(4),
                projection: 'EPSG:4326',
                className: 'custom-mouse-position',
                target: posDiv,
                undefinedHTML: '&nbsp;'
            });

            this._myMap = new ol.Map({
                layers: [baseLayers],
                projection: 'EPSG:4326',
                target: 'mapPanel_jjgl',
                logo: false,
                controls: [

                    new ol.control.ScaleLine(),
                    //new LayerSwitchControl(),
                    new BaseLayerSwitchControl({
                        baseLayerTypes: baseLayerTypes,
                        type: 1
                    }),
                    mousePos
                ],
                view: new ol.View({

                    minZoom: 10,
                    maxZoom: 20,
                    projection: 'EPSG:4326',
                    center: appEnv.mapConfig.getCenterLonlat(),
                    zoom: appEnv.mapConfig.locateZoom
                })
            });

            var source = new ol.source.Vector({
                features: []
            });
            this.circleLayer = new ol.layer.Vector({
                source: source,
                id: "画圆"
            });
            this.circleLayer.id = "画圆";
            this._myMap.addLayer(this.circleLayer);

            var _source = new ol.source.Vector({
                features: []
            });
            this.areasLayer = new ol.layer.Vector({
                source: _source,
                id: "画区域"
            });
            this.areasLayer.id = "画区域";
            this._myMap.addLayer(this.areasLayer);
        },

        _updateGrid: function (queryCondition) {

            this.isCloseed = false;
            this.currentStore_Items = null;
            this.result_allCount = 0;
            this.result_wppCount = 0;
            this.result_autoCount = 0;
            this.result_handCount = 0;

            this.jjxqDiv.domNode.innerHTML = "&nbsp;报警内容：";
            this.resuultDetialLeft.domNode.innerHTML = "";
            this.resuultDetialRight.domNode.innerHTML = "";


            this.standby.style.display = 'block';

            var store = new ItemFileWriteStore({
                data: {
                    identifier: "num",
                    items: []
                }
            });
            this.grid.setStore(store);

            var url = "/ffyy_CaseInfo/Get_ffyyCaseInfo_SQL";

            request.post(url, {
                data: queryCondition,
                handleAs: "json"
            }).then(lang.hitch(this, function (data) {

                if (data == null || data.length < 1 || this.isCloseed) {

                    this.standby.style.display = 'none';
                    return;
                }

                var items = [];
                for (var i = 0; i < data.length; i++) {

                    var hasAutoGL = "false";
                    this.result_allCount++;
                    if (data[i].hasGL == 'false') {

                        this.result_wppCount++;
                        if (data[i].areaid != null) {
                            this.result_autoCount++;
                            hasAutoGL = "true";
                        }
                    }

                    items.push({
                        num: data[i].num,
                        case_id: data[i].case_id,
                        case_code: data[i].case_code,
                        case_time: data[i].case_time,
                        case_type: data[i].case_type,
                        case_address: data[i].case_address,
                        case_detailedinfo: data[i].case_detailedinfo,
                        duty_orgid: data[i].duty_orgid,
                        lon: data[i].lon,
                        lat: data[i].lat,
                        bjr: data[i].bjr,
                        lxdh: data[i].lxdh,
                        jwqdm: data[i].jwqdm,
                        case_type_name: data[i].case_type_name,
                        deptcode: data[i].deptcode,
                        deptname: data[i].deptname,
                        jwqname: data[i].jwqname,
                        areaid: data[i].areaid,
                        area_name: data[i].area_name,
                        area_jwqcode: data[i].area_jwqcode,
                        area_policename: data[i].area_policename,
                        area_sqsq: data[i].area_sqsq,
                        area_strxy: data[i].area_strxy,
                        hasGL: hasAutoGL
                    });

                }

                this.currentStore_Items = lang.clone(items);

                var store = new ItemFileWriteStore({
                    data: {
                        identifier: "num",
                        items: items
                    }
                });
                this.grid.setStore(store);

                this.standby.style.display = 'none';



                if (this.result_autoCount == 0 && this.result_handCount == 0) {
                    this.saveButton.set('disabled', true);
                }
                else {
                    this.saveButton.set('disabled', false);
                }
                this.resuultDetialLeft.domNode.innerHTML = "当前查询&nbsp;" + this.result_allCount + "&nbsp;条，未匹配&nbsp;" + this.result_wppCount + "&nbsp;条.";
                this.resuultDetialRight.domNode.innerHTML = "自动匹配&nbsp;" + this.result_autoCount + "&nbsp;条，手动匹配&nbsp;" + this.result_handCount + "&nbsp;条.&nbsp;&nbsp;";


            }));
        },
        _CircleButtonClick: function (pressed) {

            if (pressed) {
                this._myMap.addInteraction(this.CircleMeasureHandler);
                this.circleLayer.getSource().clear();
                this.CircleMeasureHandler.setActive(true)
            }
            else {
                this._myMap.removeInteraction(this.CircleMeasureHandler)
                this.CircleMeasureHandler.setActive(false);
            }
        },
        _onDrawed: function (kjcxParam) {

        this.DrawEndDialog = new Dialog({
            title: "区域保存",
            style: "width: 460px;height:360px;"
        });

        var mapPane = appEnv.getCurrentPane();
            
        var savePane = new SaveAreaPane({
            fromType: 'JQGL',
            initName:mapPane.jjgl_dialog.textBox2.value,
            valStrs: kjcxParam.geoVal
        });

        topic.subscribe("sh/component/ffyy/SaveAreaPane_JQGL", lang.hitch(this, function () {
                
            this.DrawEndDialog.destroyRecursive();

            var mapPane = appEnv.getCurrentPane();
            mapPane.jjgl_dialog._queryAreas(mapPane.jjgl_dialog.textBox2.value);
        }));

        this.DrawEndDialog.addChild(savePane);

        this.DrawEndDialog.show();

    },

        _saveGLData: function (json) {

            this.isCloseed = false;

            this.standby.style.display = 'block';
            request.post("/ffyy_CaseInfo/UpdateCaseAreas", {
                data: {
                    jsonData: json
                },
                handleAs: "json"
            }).then(
                    lang.hitch(this, function (data) {

                        this.standby.style.display = 'none';
                        if (data && data.success && !this.isCloseed) {
                            
                            var cd = new ConfirmDialogOK({
                                message: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;保存成功！&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;",
                                yes: lang.hitch(this, function () {})
                            });
                            cd.show();
                          
                            

                            var list = this.grid.store._arrayOfAllItems;
                            for (var i = 0; i < list.length; i++) {

                                var areaid = list[i].areaid[0];
                                if (areaid == null) areaid = '';
                                var case_code = list[i].case_code[0];
                                var hasGL = list[i].hasGL[0];
                                if (hasGL == "true") {

                                    var area_name = list[i].area_name[0];
                                    var area_sqsq = list[i].area_sqsq[0];

                                    var _item = this.grid.store._getItemByIdentity(i + 1);
                                    this.grid.store.setValue(_item, 'area_name', area_name.replace('@@red', ''));
                                    this.grid.store.setValue(_item, 'area_sqsq', area_sqsq.replace('@@red', ''));
                                    this.grid.store.setValue(_item, 'hasGL', 'false');

                                    this.currentStore_Items[i].area_name = area_name.replace('@@red', '');
                                    this.currentStore_Items[i].area_sqsq = area_sqsq.replace('@@red', '');
                                    this.currentStore_Items[i].hasGL = 'false';
                                }
                            }                            

                            this.result_wppCount = this.result_wppCount - this.result_autoCount - this.result_handCount;
                            this.result_autoCount = 0;
                            this.result_handCount = 0;
                            this.saveButton.set('disabled', true);
                            this.resuultDetialLeft.domNode.innerHTML = "当前查询&nbsp;" + this.result_allCount + "&nbsp;条，未匹配&nbsp;" + this.result_wppCount + "&nbsp;条.";
                            this.resuultDetialRight.domNode.innerHTML = "自动匹配&nbsp;" + this.result_autoCount + "&nbsp;条，手动匹配&nbsp;" + this.result_handCount + "&nbsp;条.&nbsp;&nbsp;";

                        }
                        else {
                            var cd = new ConfirmDialogOK({
                                title:"失败",
                                message: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;保存失败。&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;",
                                yes: lang.hitch(this, function () { })
                            });
                            cd.show();
                        }
                    })
                );
        },
        _showGLDialog: function (_value, _ajdz) {
            var mapPane = appEnv.getCurrentPane();
            if (!mapPane.jjgl_dialog) {
                mapPane.jjgl_dialog = new jjgl_dialog({
                    title: '关联区域',
                    style: 'position:absolute; left:300px; top:200px; width:350px;z-index:100',
                    dockTo: mapPane.dockTo,
                    ajdz: _ajdz,
                    _value: _value,
                    map: this._myMap,
                    circleLayer: this.circleLayer,
                    initPosition: 'lt'
                });

                aspect.after(mapPane.jjgl_dialog, 'close', lang.hitch(this, function () {

                    mapPane.jjgl_dialog = null;
                    this.circleLayer.getSource().clear();
                    this._CircleButtonClick(false);
                }));

                mapPane.jjgl_dialog.queryButton.onclick = lang.hitch(this, function (e) {


                    var selectIndex = mapPane.jjgl_dialog.grid.selection.selectedIndex;
                    if (selectIndex != -1) {

                        var area_id = mapPane.jjgl_dialog.grid.getItem(selectIndex).area_id[0];
                        var area_name = mapPane.jjgl_dialog.grid.getItem(selectIndex).area_name[0];
                        var area_sqsq = mapPane.jjgl_dialog.grid.getItem(selectIndex).area_sqsq[0];
                        var area_strxy = mapPane.jjgl_dialog.grid.getItem(selectIndex).area_strxy[0];

                        var parentGrid_selectIndex = this.grid.selection.selectedIndex;

                        if (area_name == '置空@@red') {

                            var currentID = this.grid.store._getItemByIdentity(parentGrid_selectIndex + 1).areaid[0];
                            if (currentID == null) currentID = '';

                            this.grid.store.setValue(this.grid.getItem(parentGrid_selectIndex), 'areaid', '');
                            this.grid.store.setValue(this.grid.getItem(parentGrid_selectIndex), 'area_name', '');
                            this.grid.store.setValue(this.grid.getItem(parentGrid_selectIndex), 'area_sqsq', '');
                            this.grid.store.setValue(this.grid.getItem(parentGrid_selectIndex), 'area_strxy', '');

                            var oldID = this.currentStore_Items[parentGrid_selectIndex].areaid;
                            if (oldID == null) oldID = '';
                            var oldGL = this.currentStore_Items[parentGrid_selectIndex].hasGL;
                            var newID = this.grid.store._getItemByIdentity(parentGrid_selectIndex + 1).areaid[0];
                            
                            if (newID == oldID) {

                                if (oldGL == "false") {
                                    this.result_handCount--;
                                    this.grid.store.setValue(this.grid.getItem(parentGrid_selectIndex), 'hasGL', 'false');
                                }                              
                            }
                            else {

                                if (currentID == oldID) {

                                    if (oldGL == "false") {
                                        this.result_handCount++;
                                        this.grid.store.setValue(this.grid.getItem(parentGrid_selectIndex), 'hasGL', 'true');
                                    }
                                    else {
                                        this.result_autoCount--;
                                        this.result_handCount++;
                                        this.grid.store.setValue(this.grid.getItem(parentGrid_selectIndex), 'hasGL', 'true');
                                    }
                                }
                                else {
                                }
                            }


                            var feature = this._getUnSelectFeature('_sqsq');

                            if (feature) {
                                this.areasLayer.getSource().removeFeature(feature);
                            }
                        }
                        else {
                            var currentID = this.grid.store._getItemByIdentity(parentGrid_selectIndex + 1).areaid[0];
                            if (currentID == null) currentID = '';

                            this.grid.store.setValue(this.grid.getItem(parentGrid_selectIndex), 'areaid', area_id);
                            this.grid.store.setValue(this.grid.getItem(parentGrid_selectIndex), 'area_strxy', area_strxy);

                            var oldID = this.currentStore_Items[parentGrid_selectIndex].areaid;
                            if (oldID == null) oldID = '';
                            var oldGL = this.currentStore_Items[parentGrid_selectIndex].hasGL;
                            var newID = this.grid.store._getItemByIdentity(parentGrid_selectIndex + 1).areaid[0];

                            if (newID == currentID) {
                            }
                            else {
                                if (newID == oldID) {
                                    if (oldGL == "false") {

                                        this.result_handCount--;
                                        this.grid.store.setValue(this.grid.getItem(parentGrid_selectIndex), 'area_name', area_name);
                                        this.grid.store.setValue(this.grid.getItem(parentGrid_selectIndex), 'area_sqsq', area_sqsq);
                                        this.grid.store.setValue(this.grid.getItem(parentGrid_selectIndex), 'hasGL', 'false');
                                    }
                                    else {

                                        this.result_autoCount++;
                                        this.result_handCount--;
                                        this.grid.store.setValue(this.grid.getItem(parentGrid_selectIndex), 'area_name', area_name + '@@red');
                                        this.grid.store.setValue(this.grid.getItem(parentGrid_selectIndex), 'area_sqsq', area_sqsq + '@@red');
                                        this.grid.store.setValue(this.grid.getItem(parentGrid_selectIndex), 'hasGL', 'true');
                                    }
                                }
                                else {

                                    if (currentID == oldID) {
                                        if (oldGL == "false") {
                                            this.result_handCount++;
                                        }
                                        else {
                                            this.result_autoCount--;
                                            this.result_handCount++;
                                        }
                                    }
                                    else {
                                    }

                                    this.grid.store.setValue(this.grid.getItem(parentGrid_selectIndex), 'area_name', area_name + '@@red');
                                    this.grid.store.setValue(this.grid.getItem(parentGrid_selectIndex), 'area_sqsq', area_sqsq + '@@red');
                                    this.grid.store.setValue(this.grid.getItem(parentGrid_selectIndex), 'hasGL', 'true');
                                }
                            }
                            
                            var strs = area_strxy.split(',');
                            var lonlat = [parseFloat(strs[0]), parseFloat(strs[1])];
                            this._drawCircle(lonlat, parseFloat(strs[2]), "green");
                        }

                        if (this.result_autoCount == 0 && this.result_handCount == 0) {
                            this.saveButton.set('disabled', true);
                        }
                        else {
                            this.saveButton.set('disabled', false);
                        }
                        this.resuultDetialLeft.domNode.innerHTML = "当前查询&nbsp;" + this.result_allCount + "&nbsp;条，未匹配&nbsp;" + this.result_wppCount + "&nbsp;条.";
                        this.resuultDetialRight.domNode.innerHTML = "自动匹配&nbsp;" + this.result_autoCount + "&nbsp;条，手动匹配&nbsp;" + this.result_handCount + "&nbsp;条.&nbsp;&nbsp;";

                        mapPane.jjgl_dialog.close();
                    }
                });

                mapPane.jjgl_dialog.createButton.onclick = lang.hitch(this, function (e) {

                    this._CircleButtonClick(true);
                });

                mapPane.addFloatingPane(mapPane.jjgl_dialog);
            }
        },
        _getUnSelectFeature: function (rid) {

            var feature = this.areasLayer.getSource().forEachFeature(lang.hitch(this, function (feature) {

                if (feature && feature.rid) {

                    if (feature.rid == rid)
                        return feature;
                }
                else {
                    return null;
                }

            }), this);

            return feature;
        },
        _locateToMap: function (xMin, yMin, xMax, yMax) {
               
            var extent = [xMin, yMin, xMax, yMax];
            var size = this._myMap.getSize();
            var view = this._myMap.getView();
            view.fit(extent, size, {});
        },
        _gridRowClick: function (caseX,caseY,jjxqstr, orgCode, jwqCode, area_strxy) {

            
            this.jjxqDiv.domNode.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + jjxqstr;
            this.areasLayer.getSource().clear();
            this.circleLayer.getSource().clear();

            if (area_strxy != null && area_strxy != '') {

                var strs = area_strxy.split(',');
                var lonlat = [parseFloat(strs[0]), parseFloat(strs[1])];
                this._drawCircle(lonlat, parseFloat(strs[2]), "green");
            }

            var _queryCondition = {
                orgCode: orgCode,
                jwqCode: jwqCode
            };

            request.post("/ffyy_CaseInfo/GetOrgStrAndJwqStr", {
                data: _queryCondition,
                handleAs: "json"
            }).then(lang.hitch(this, function (data) {

                if (data == null || data.length < 1) {
                    return;
                }

                var centerX = 0.0;
                var centerY = 0.0;

                var hasLocate = false;

                if (data[0].org != null) {

                    centerX = (parseFloat(data[0].org.XMax) - parseFloat(data[0].org.XMin)) / 2;
                    centerY = (parseFloat(data[0].org.YMax) - parseFloat(data[0].org.YMin)) / 2;

                    if (!hasLocate) {
                        this._locateToMap(data[0].org.XMin, data[0].org.YMin, data[0].org.XMax, data[0].org.YMax);
                        hasLocate = true;
                    }

                    var pointList = data[0].org.Polygon;
                    var points = [];

                    for (var i = 1; i < pointList.length; i++) {
                        var x = pointList[i].X;
                        var y = pointList[i].Y;
                        var lonlat = [x, y];
                        points.push(lonlat);
                    }

                    this._drawPolygons(points, "blue");

                }
                if (data[0].jwq != null) {

                    centerX = (parseFloat(data[0].jwq.XMax) - parseFloat(data[0].jwq.XMin)) / 2;
                    centerY = (parseFloat(data[0].jwq.YMax) - parseFloat(data[0].jwq.YMin)) / 2;

                    if (!hasLocate) {
                        this._locateToMap(data[0].jwq.XMin, data[0].jwq.YMin, data[0].jwq.XMax, data[0].jwq.YMax);
                        hasLocate = true;
                    }

                    var pointList = data[0].jwq.Polygon;
                    var points = [];

                    for (var i = 1; i < pointList.length; i++) {
                        var x = pointList[i].X;
                        var y = pointList[i].Y;
                        var lonlat = [x, y];
                        points.push(lonlat);
                    }

                    this._drawPolygons(points, "red");
                }

                

                if (area_strxy != null && area_strxy != null) {

                    var strs = area_strxy.split(',');
                    var x = parseFloat(strs[0]);
                    var y = parseFloat(strs[1]);
                    var r = parseFloat(strs[2]);

                    centerX = x;
                    centerY = y;

                    if (!hasLocate) {
                        this._locateToMap(x - r * 1.5, y - r * 1.5, x + r * 1.5, y + r * 1.5);
                    }
                }

                if (caseX != null && caseX != '' && caseX != '0') {

                    var lonlat = [parseFloat(caseX), parseFloat(caseY)];
                    this._drawPoint(lonlat);
                    this._myMap.getView().setCenter(lonlat);
                }
                else {
                    var lonlat = [parseFloat(centerX), parseFloat(centerY)];
                    this._drawPoint(lonlat);
                }

                return;

            }));
        },
        _drawPolygons: function (points, color) {

            var circleStyle = new ol.style.Style({
                fill: new ol.style.Fill({
                    color: 'rgba(255, 255, 255, 0.1)'
                }),
                stroke: new ol.style.Stroke({
                    color: color,
                    lineDash: [4, 4],
                    width: 2
                })
            });

            var polygon = new ol.geom.Polygon([points]);
            var feature = new ol.Feature({ geometry: polygon });
            feature.setStyle(circleStyle);
            if (feature) {

                this.areasLayer.getSource().addFeature(feature);
            }
        },
        _drawCircle: function (lonlat, radius,color) {

            var circleStyle = new ol.style.Style({
                fill: new ol.style.Fill({
                    color: 'rgba(255, 255, 255, 0.1)'
                }),
                stroke: new ol.style.Stroke({
                    color: color,
                    lineDash: [4, 4],
                    width: 2
                })
            });

            var circle = new ol.geom.Circle(lonlat, radius);
            var feature = new ol.Feature({ geometry: circle });
            feature.setStyle(circleStyle);
            feature.rid = '_sqsq';
            if (feature) {
                this.areasLayer.getSource().addFeature(feature);
            }
        },
        _drawPoint: function (lonlat) {

            var iconStyle = new ol.style.Style({
                image: new ol.style.Icon({
                    src: '../../../../Content/images/scout/location_24px.png'
                })
            });

            var geom = geom = new ol.geom.Point(lonlat);
            var feature = new ol.Feature({ geometry: geom });
            feature.setStyle(iconStyle);
            if (feature) {

                this.areasLayer.getSource().addFeature(feature);
            }
        },
        
    });
});






