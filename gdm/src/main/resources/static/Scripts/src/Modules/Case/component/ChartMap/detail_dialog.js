
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
    'dojo/topic',
    'dojo/request',
    'dojo/_base/array',
    'dojo/date',
    "dojo/data/ItemFileWriteStore",

    "dojox/widget/Standby",
    "dojox/grid/EnhancedGrid",
    "dojox/grid/enhanced/plugins/Filter",
    "dojox/grid/enhanced/plugins/Pagination",
    "dojox/grid/enhanced/plugins/IndirectSelection",

    "egis/Share/component/MapFloatPane/MapFloatingPane",

    "dojo/text!./detail_dialog.html"
], function (declare, lang, Evented, on, aspect,topic, request, array, dateUtil, ItemFileWriteStore,
    Standby, EnhancedGrid, Filter, Pagination, IndirectSelection, MapFloatingPane, template) {

    return declare([MapFloatingPane, Evented], {

        templateString: template, //*

        map: null,

        grid: null,

        standby: null,

        postCreate: function () {
            this.inherited(arguments);
        },

        startup: function () {
            this.inherited(arguments);

            this._initStandby();

            this._initGrid();

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
            }, this.detailGrid);
            this.grid.startup();

            this.grid.on("rowclick", lang.hitch(this, function (e) {
                if (this.grid.getItem(e.rowIndex).hasDW[0] == '是') {

                    var x = this.grid.getItem(e.rowIndex).lon[0];
                    var y = this.grid.getItem(e.rowIndex).lat[0];

                    topic.publish("egis/Map/Locate", { Lon: parseFloat(x), Lat: parseFloat(y), Zoom: 16 });
                }
            }));

        },


        _loadGridData: function (data,type) {


            var items = [];
            if (type == '选中') {
                data.getSource().forEachFeature(lang.hitch(this, function (feature) {

                    if (feature && feature.data) {
                        items.push({
                            id : feature.data.id,
                            caseCode: feature.data.caseCode,
                            caseTime: feature.data.caseTime,
                            address: feature.data.address,
                            typeName: feature.data.typeName,
                            detailedInfo: feature.data.detailedInfo,
                            lon: feature.data.lon,
                            lat: feature.data.lat,
                            hasDW: '是'
                        });
                    }

                }), this);
            }
            else {
                for (var i = 0; i < data.length; i++) {

                    var hasDW = '是';
                    if (data[i].lon == null || data[i].lat == null) {
                        hasDW = '否';
                    }

                    items.push({
                        id: data[i].id,
                        caseCode: data[i].caseCode,
                        caseTime: data[i].caseTime,
                        address: data[i].address,
                        typeName: data[i].typeName,
                        detailedInfo : data[i].detailedInfo,
                        lon: data[i].lon,
                        lat: data[i].lat,
                        hasDW: hasDW
                    });
                }
            }

            var store = new ItemFileWriteStore({
                data: {
                    identifier: "id",
                    items: items
                }
            });
            this.grid.setStore(store);
        },

        _getHeader: function () {

            var header = [{
                name: '定位',
                field: 'hasDW',
                width: "40px"
            }, {
                name: '报警时间',
                field: 'caseTime',
                width: "100px"
            }, {
                name: '报警类型',
                field: 'typeName',
                width: "60px"
            }, {
                name: '事发地址',
                field: 'address',
                width: "150px"
            }, {
                name: '详情信息',
                field: 'detailedInfo',
                width: "220px"
            }];
            return header;
        }
    });
});