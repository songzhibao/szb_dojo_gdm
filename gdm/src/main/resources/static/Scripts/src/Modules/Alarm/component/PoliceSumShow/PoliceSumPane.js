/**
* User: chengbin
* Date: 13-4-1
*/
define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/Evented",
    "dojo/aspect",
    'dojo/_base/array',
    "dojo/dom-style",
    "dojo/dom-construct",
    "dojo/topic",
    'dojo/request',
    "dojo/data/ItemFileWriteStore",
    "dijit/tree/ForestStoreModel",
    "dojox/grid/TreeGrid",
	'dstore/Memory',
	'dstore/Trackable',
	'dstore/Tree',
    "dgrid/test/data/createHierarchicalStore",
    "dgrid/test/data/hierarchicalCountryData",
    "dgrid/OnDemandGrid",
    "dgrid/Tree",
    "dgrid/Editor",
    "dgrid/Keyboard",
    "dgrid/Selection",
    "dgrid/Selector",
    "dgrid/ColumnSet",
    "egis/Share/component/MapFloatPane/MapFloatingPane",
    "egis/appEnv"
], function (declare, lang, Evented, aspect, array, domStyle, domConstruct, topic, request, ItemFileWriteStore, ForestStoreModel,
                TreeGrid, Memory, Trackable, TreeStoreMixin, createHierarchicalStore, hierarchicalCountryData, OnDemandGrid, tree, editor, Keyboard, Selection, Selector, ColumnSet, MapFloatingPane, appEnv) {

    return declare([MapFloatingPane, Evented], {

        treeGrid: null,

        postCreate: function () {
            this.inherited(arguments);
        },

        startup: function () {
            this.inherited(arguments);
            this.loadOrgTreeGrid();
        },

        /**
        * 加载组织结构树
        * @param carType
        */
        loadOrgTreeGrid: function () {
            var me = this;

            if (me.treeGrid != null) {
                me.treeGrid.destroy();
            }

            var mapPane = appEnv.getCurrentPane();
            mapPane.showProcess("警力查询处理中...");

            request.post("/Alarm/GetPoliceSumList", {
                data: {
                    displayLevel: appEnv.appConfig.orgTreeDisplayLevel,
                    GPSOffTime : appEnv.appConfig.GPSOffTime
                },
                handleAs: "json"
            }).then(function (data) {
                me.buildOrgTreeGrid(data);
                mapPane.hideProgress();
            }, function (error) {
                mapPane.hideProgress();
            });
        },

        buildOrgTreeGrid: function (data) {
            
            var columns = [
				   { label: "单位名称", field: "name", width: '30%', sortable: false, renderExpando: true },
                /*{
                label: "勤务等级",
                field: "dutyRank",
                width: '12%',
                formatter: function (value) {
                var color = "";
                if (value == 1) {
                color = "green";
                } else if (value == 2) {
                color = "red";
                } else if (value == 3) {
                color = "blue";
                } else {
                color = "white";
                }
                return '<div style="background-color:' + color + ';">&nbsp</div>';
                },
                sortable: false
                },*/
				    { label: "总警员", field: "PoliceSum", sortable: false },
				    { label: "在线警员", field: "PoliceOnline", sortable: false },
                    //{ label: "总警车", field: "CarSum", sortable: false },
				    //{ label: "在线警车", field: "CarOnline", sortable: false },
                    { label: "民警警务通", field: "ManPhoneSum", sortable: false },
                    { label: "在线民警警务通", field: "ManPhoneOnline", sortable: false },
                    { label: "辅警警务通", field: "XJPhoneSum", sortable: false },
                    { label: "在线辅警警务通", field: "XJPhoneOnline", sortable: false },
                    { label: "民警对讲机", field: "ManMobileSum", sortable: false },
                    { label: "在线民警对讲机", field: "ManMobileOnline", sortable: false },
                    { label: "辅警对讲机", field: "XJMobileSum", sortable: false },
                    { label: "在线辅警对讲机", field: "XJMobileOnline", sortable: false }
            ];

            this.treeGrid = new declare([OnDemandGrid, tree])({//, Keyboard, Selection
                className : "policeSumGrid",
                collection: createHierarchicalStore({ data: data }, true),
                //shouldExpand: function(){
                //    return true;
                //},
                columns: columns
            });

            this.addChild(this.treeGrid);

            //if (data.items[0]) {
            //    this.treeGrid.expand(data.items[0]);
            //}
        },

        _getPercent: function (num, total) {
            num = parseFloat(num);
            total = parseFloat(total);
            if (isNaN(num) || isNaN(total)) {
                return "-";
            }
            return total <= 0 ? "0.0%" : (Math.round(num / total * 10000) / 100.00 + "%");
        },

        destroy: function () {
            this.inherited(arguments);
        }

    });

});