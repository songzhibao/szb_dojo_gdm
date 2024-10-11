
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


    "dojox/widget/Standby",
    "dojox/grid/EnhancedGrid",
    "dojox/grid/enhanced/plugins/Filter",
    "dojox/grid/enhanced/plugins/Pagination",
    "dojox/grid/enhanced/plugins/IndirectSelection",

    "egis/component/MapFloatingPane",

    "dojo/text!./jjgl_dialog.html"
], function (declare, lang, Evented, on, aspect, request, array, dateUtil, ItemFileWriteStore, Standby, EnhancedGrid, Filter, Pagination, IndirectSelection, MapFloatingPane, template) {

    return declare([MapFloatingPane, Evented], {

        templateString: template, //*

        _value:null,
        ajdz: null,

        map: null,

        circleLayer:null,

        grid: null,

        standby: null,

        postCreate: function () {
            this.inherited(arguments);
        },

        startup: function () {
            this.inherited(arguments);

            this._initStandby();

            this._initGrid();

            this.textBox1.value = this.ajdz;
            

            if (this._value != null && this._value != '') {

                var ee = this._value.split('@@');
                this._queryAreas(ee[0]);
                this.textBox2.value = ee[0];
            }

            this.textBox1.onmouseup = lang.hitch(this, function (e) {

                var txt = window.getSelection();
                if (txt.toString().length > 1) {
                    this.textBox2.value = txt.toString();
                    this._queryAreas(txt.toString());
                }
            });

        },
        _queryAreas: function (name) {


            this.circleLayer.getSource().clear();

            this.grid.setStore(null);

            this.standby.show();

            request.post("/ffyy_caseInfo/GetAreasByLike", {
                data: {
                    name: name,
                },
                handleAs: "json"
            }).then(
                  lang.hitch(this, function (data) {

                      this.standby.hide();

                      var items = [];

                      if (this._value != null && this._value!='' && this._value.indexOf('@@red')) {

                          items.push({
                              area_id: '1',
                              area_name: '置空@@red',
                              area_jwqcode: '1',
                              area_jwqname: '',
                              area_policename: '',
                              area_sqsq: '',
                              area_isdelete: '',
                              area_strxy: '',
                              area_remark: '',
                              area_createtime: ''
                          });
                      }

                      if (data.length > 0) {

                          this.createButton.style.display = 'none';
                          
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
                      }
                      else {

                          this.createButton.style.display = 'block';
                      }

                      if (items.length > 0) {
                          var store = new ItemFileWriteStore({
                              data: {
                                  identifier: "area_id",
                                  items: items
                              }
                          });
                          this.grid.setStore(store);
                      }
                  })
              );
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
        _initGrid: function () {
            this.grid = new EnhancedGrid({
                structure: this._getHeader(),
                style: "width:99.5%; height:250px;padding:1px 0 0 2px;",
                plugins: {
                    pagination: {
                        pageSizes: ["50", "100", "All"],
                        description: false,
                        sizeSwitch: false,
                        pageStepper: false,
                        gotoButton: false,
                        maxPageStep: 4,
                        defaultPageSize: 50,
                        position: "bottom"
                    }
                }
            }, this.gridNode);
            this.grid.startup();

            this.grid.on("rowclick", lang.hitch(this, function (e) {

                var area_id = this.grid.getItem(e.rowIndex).area_id[0];
                var strxy = this.grid.getItem(e.rowIndex).area_strxy[0];
                var area_name = this.grid.getItem(e.rowIndex).area_name[0];

                if (area_name == '置空@@red') {
                    return;
                }

                var strs = strxy.split(',');
                var lonlat = [parseFloat(strs[0]), parseFloat(strs[1])];

                //this.map.getView().setCenter(lonlat);
                //this.map.getView().setZoom(16);


                var x = parseFloat(strs[0]);
                var y = parseFloat(strs[1]);
                var r = parseFloat(strs[2]);
                this._locateToMap(x - r * 1.5, y - r * 1.5, x + r * 1.5, y + r * 1.5);


                this.circleLayer.getSource().clear();
                this._drawCircle(lonlat, parseFloat(strs[2]), area_id);

            }));

        },
        _locateToMap: function (xMin, yMin, xMax, yMax) {

            var extent = [xMin, yMin, xMax, yMax];
            var size = this.map.getSize();
            var view = this.map.getView();
            view.fit(extent, size, {});
        },
        _getHeader: function () {

            var header = [{
                name: '治保名称',
                field: 'area_name',
                width: "130px",
                formatter: function (e) {
                    if (e) {
                        var ee = e.split('@@');
                        if (ee.length == 1) {
                            return e;
                        }
                        else if (ee.length == 2) {
                            return '<div style="color:' + ee[1] + ';">' + ee[0] + '</div>';
                        }
                    }
                }
            }, {
                name: '警务区',
                field: 'area_jwqname',
                width: "150px"
            }];
            return header;
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
        }
    });
});