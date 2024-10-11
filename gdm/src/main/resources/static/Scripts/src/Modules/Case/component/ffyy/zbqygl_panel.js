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
    'dojo/_base/array',
    
    "egis/component/JwqTreeTextBox",
    "dijit/Dialog",
    "dijit/_WidgetsInTemplateMixin",
    "dijit/popup",

    "dojox/widget/Standby",
    "dojo/data/ItemFileWriteStore",
    "dojox/grid/EnhancedGrid",
    "dojox/grid/enhanced/plugins/Filter",
    "dojox/grid/enhanced/plugins/Pagination",
    "dojox/grid/enhanced/plugins/IndirectSelection",

    "egis/component/MapFloatingPane",
    'egis/appEnv',
    'egis/component/ffyy/SaveAreaPane',
    'ol',
    "dojo/text!./zbqygl_panel.html"
], function (declare, lang, Evented, aspect, domStyle, domConstruct, Memory, topic, on, request, array, JwqTreeTextBox, Dialog,
                _WidgetsInTemplateMixin, popup, Standby, ItemFileWriteStore, EnhancedGrid, Filter, Pagination, IndirectSelection, MapFloatingPane, appEnv, SaveAreaPane, ol, template) {

    return declare([MapFloatingPane, _WidgetsInTemplateMixin, Evented], {

        templateString: template,
        widgetsInTemplate: true,

        kjcxParam: null,
        CircleMeasureHandler: null,
        drawVector: null,
        circleLayer: null,
        map: null,

        grid: null,
        standby: null,
        DrawEndDialog:null,

        postCreate: function () {
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
        startup: function () {
            this.inherited(arguments);

            this._initStandby();

            this._initGrid();

            this.drawVector = new ol.layer.Vector({
                source: new ol.source.Vector(),
                projection: 'EPSG:4326',
                style: new ol.style.Style({
                    fill: new ol.style.Fill({
                        color: 'rgba(255, 255, 255, 0.2)'
                    }),
                    stroke: new ol.style.Stroke({
                        color: 'blue',
                        width: 2
                    }),
                    image: new ol.style.Circle({
                        radius: 5,
                        fill: new ol.style.Fill({
                            color: 'blue'
                        })
                    })
                })
            });
            this.map.addLayer(this.drawVector);


            var source = new ol.source.Vector({
                features: []
            });
            this.circleLayer = new ol.layer.Vector({
                source: source,
                id: "画圆"
            });
            this.map.addLayer(this.circleLayer);

            


            this.CircleMeasureHandler = new ol.interaction.Draw({
                source: this.drawVector.getSource(),
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


            this.queryButton.on("click", lang.hitch(this, function () {

                this.drawVector.getSource().clear();

                var orgs = this.orgSelected.value;
                var orgIds = [];
                array.forEach(orgs, function (item) {
                    orgIds.push(item.OrgId);
                });

                this.queryCondition = {
                    name: this.regionName.value,
                    orgs: orgIds,
                    used: this.IsUsed.value
                };

                if (orgIds.length > 0) {

                    this._queryRegion();
                }
                else {
                    var errorDialog = new Dialog({
                        title: "提示",
                        content: "未选中组织机构！",
                        style: "width: 200px;height:100px;font-size:14px"
                    });
                    errorDialog.show();
                    return;
                }

            }));

            this.createButton.on("click", lang.hitch(this, function () {
                
                this._CircleButtonClick(true);
            }));


            this.map.on('pointermove', lang.hitch(this, this._mapOnMoveEvent), this);
            this.createToolTip();
        },

        hasCreate:false,
        toolTip:null,
        toolTipElement: null,
        tipMessage: '请在警务区中绘制治保区域',
        createToolTip: function () {

            this.toolTipElement = document.createElement('div');
            this.toolTipElement.id = 'tooltip-measure';
            this.toolTipElement.style.cssText = "text-align:center; z-index:20000;background-color: rgb(192, 192, 192);opacity: 0.9;";
            this.toolTipElement.innerHTML = this.tipMessage;

            this.toolTip = new ol.Overlay({
                element: this.toolTipElement,
                offset: [0, -15],
                position: 'buttom-center'
            });
            
            this.map.addOverlay(this.toolTip);
            this.toolTipElement.style.display = 'none';
        },

        _mapOnMoveEvent: function (evt) {

            if (this.toolTipElement.style.display == 'block') {
                this.toolTip.setPosition(evt.coordinate);
            }
        },

        _CircleButtonClick: function (pressed) {

            if (pressed) {
                this.map.addInteraction(this.CircleMeasureHandler);
                this.drawVector.getSource().clear();
                this.CircleMeasureHandler.setActive(true);
                this.toolTipElement.style.display = 'block';
            }
            else {
                this.map.removeInteraction(this.CircleMeasureHandler);
                this.CircleMeasureHandler.setActive(false);
                this.toolTipElement.style.display = 'none';
            }
        },
        _onDrawed: function (kjcxParam) {

            this.DrawEndDialog = new Dialog({
                title: "区域保存",
                style: "width: 460px;height:360px;"
            });

            var savePane = new SaveAreaPane({
                fromType: 'QYHZ',
                initName: '',
                valStrs: kjcxParam.geoVal
            });
            topic.subscribe("sh/component/ffyy/SaveAreaPane_QYHZ", lang.hitch(this, function () {

                this.DrawEndDialog.destroyRecursive();
            }));

            this.DrawEndDialog.addChild(savePane);

            this.DrawEndDialog.show();

        },
        destroy: function () {
            this.inherited(arguments);
        },
        _initGrid: function () {
            this.grid = new EnhancedGrid({
                structure: this._getHeader(),
                style: "width:99%; height:99%;padding:0px;",
                plugins: {
                    indirectSelection: {
                        headerSelector: true,
                        width: "20px",
                        styles: "text-align: center;"
                    },
                    pagination: {
                        pageSizes: ["50", "100", "All"],
                        description: false,
                        sizeSwitch: false,
                        pageStepper: true,
                        gotoButton: false,
                        maxPageStep: 4,
                        defaultPageSize: 50,
                        position: "bottom"
                    }
                }
            }, this.gridNode);
            this.grid.startup();

            this.grid.on("CellClick", lang.hitch(this, function (e) {

                if (e.cellIndex != 0) {
                    if (this.grid.selection.selected[e.rowIndex] == undefined) {

                        this.grid.selection.setSelected(e.rowIndex,true);
                    }

                    var strxy = this.grid.getItem(e.rowIndex).area_strxy[0];
                    var strs = strxy.split(',');
                    var lonlat = [parseFloat(strs[0]), parseFloat(strs[1])];

                    this.map.getView().setCenter(lonlat);
                    this.map.getView().setZoom(16);
                }
            }));
            this.grid.on("Selected", lang.hitch(this, function (e) {

                var strxy = this.grid.getItem(e).area_strxy[0];
                var area_id = this.grid.getItem(e).area_id[0];
                var strs = strxy.split(',');
                var lonlat = [parseFloat(strs[0]), parseFloat(strs[1])];
                this._drawCircle(lonlat, parseFloat(strs[2]), area_id);

            }));
            this.grid.on("Deselected", lang.hitch(this, function (e) {

                var area_id = this.grid.getItem(e).area_id[0];
                var feature = this._getUnSelectFeature(area_id);

                if (feature) {
                    this.circleLayer.getSource().removeFeature(feature);
                }

            }));

        },
        _getUnSelectFeature: function (area_id) {

            var feature = this.circleLayer.getSource().forEachFeature(lang.hitch(this, function (feature) {

                if (feature && feature.area_id) {

                    if (feature.area_id == area_id)
                        return feature;
                }
                else {
                    return null;
                }

            }), this);

            return feature;
        },
        _drawCircle: function (lonlat, radius, area_id) {

            var circleStyle = new ol.style.Style({
                fill: new ol.style.Fill({
                    color: 'rgba(255, 255, 255, 0.2)'
                }),
                stroke: new ol.style.Stroke({
                    color: 'blue',
                    lineDash: [4, 4],
                    width: 2
                })
            });

            var circle = new ol.geom.Circle(lonlat, radius);
            var feature = new ol.Feature({ geometry: circle });
            feature.setStyle(circleStyle);
            if (feature) {
                feature.area_id = area_id;
                this.circleLayer.getSource().addFeature(feature);
            }
        },
        _removeCircle: function (vector) {
            if (this.drawVector) {
                this.drawVector.removeFeatures([vector], {
                    silent: true
                });
            }
        },
        _getHeader: function () {

            var header = [{
                name: '区域名称',
                field: 'area_name',
                width: "110px"
            }, {
                name: '警务区',
                field: 'area_jwqname',
                width: "116px"
            }];
            return header;
        },
        _queryRegion: function () {


            this.grid.selection.deselectAll();
            this.grid.setStore(null);

            this.standby.show();

            request.post("/ffyy_caseInfo/GetAreas", {
                data: {
                    rName: this.queryCondition.name,
                    orgId: this.queryCondition.orgs,
                    isUsed: this.queryCondition.used
                },
                handleAs: "json"
            }).then(
                  lang.hitch(this, function (data) {

                      this.standby.hide();
                      if (data.length > 0) {

                          var items = [];
                          for (var i = 0; i < data.length; i++) {
                              items.push({
                                  area_id: data[i].area_id,
                                  area_name: data[i].area_name,
                                  area_jwqcode: data[i].area_jwqcode,
                                  area_jwqname: data[i].area_jwqname,
                                  area_policename: data[i].area_policename,
                                  area_sqsq: data[i].area_sqsq,
                                  area_isdelete: data[i].area_isdelete,
                                  area_strxy: data[i].area_strxy,
                                  area_remark: data[i].area_remark,
                                  area_createtime: data[i].area_createtime
                              });
                          }
                          var store = new ItemFileWriteStore({
                              data: {
                                  identifier: "area_id",
                                  items: items
                              }
                          });
                          this.grid.setStore(store);
                      }
                      else {
                          var errorDialog = new Dialog({
                              title: "提示",
                              content: "查询结果为空！",
                              style: "width: 200px;height:100px;font-size:14px"
                          });
                          errorDialog.show();
                          return;
                      }
                  })
              );
        }


    });

});