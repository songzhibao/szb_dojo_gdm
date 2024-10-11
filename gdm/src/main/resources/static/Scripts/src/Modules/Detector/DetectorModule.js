define([
'dojo/_base/declare',
'dojo/_base/array',
'dojo/_base/lang',
'dojo/aspect',
'dojo/json',
'dojo/topic',
'dojo/ready',
'dojo/request',
"dojo/on",
"dojo/data/ItemFileWriteStore",
'dijit/Toolbar',
"dijit/layout/ContentPane",
"dojox/grid/EnhancedGrid",
"dojox/grid/enhanced/plugins/Filter",
"dojox/grid/enhanced/plugins/Pagination",
"dojox/grid/enhanced/plugins/IndirectSelection",
"dijit/registry",
"dijit/form/TextBox",
'dijit/form/Button',
'dijit/TitlePane',
'egis/Modules/_Module',
'egis/appEnv',
"egis/Share/component/OrgTree/OrgCBTree",
'egis/Share/component/InfoPane/TableInfoPopup',
'egis/Share/component/ToolPane/MapTools',
'egis/Modules/Detector/component/DetectorCarHistoryPane',
'egis/Modules/Detector/component/DetectorCarRealTimePane',
'dijit/Dialog',
"egis/cache",
'ol'

], function (declare, array, lang, aspect, JSON, topic, ready, request, on,ItemFileWriteStore,Toolbar,ContentPane, EnhancedGrid, Filter, Pagination, IndirectSelection,registry,TextBox, Button, TitlePane, _Module, appEnv,OrgTree, TableInfoPopup, MapTools,  DetectorCarHistoryPane,DetectorCarRealTimePane, Dialog, cache, ol) {
    return declare([_Module], {

        currentAlarmItem : null,

        constructor: function () {
        },
        startup: function () {

            var mapPane = appEnv.getCurrentPane();
            var me = this;
            this.ksbkButton = registry.byId("ksbkButton");
            this.clgjButton = registry.byId("clgjButton");
            this.clcxButton = registry.byId("clcxButton");
            if (this.ksbkButton) {
                this.ksbkButton.on("click", lang.hitch(this, this._KSBKButtonClick));
                this.clgjButton.on("click", lang.hitch(this, this._CLGJButtonClick));
                this.clcxButton.on("click", lang.hitch(this, this._CLCXButtonClick));

                var tools = new MapTools({
                    id: 'tools',
                    style: 'position:absolute; right:10px; bottom:110px;padding: 0px;z-index: 100;'
                });
                mapPane.addFloatingPane(tools);

                this.ShowTaskGrid();

                topic.subscribe("egis/Map/Resource/SelectFeature", lang.hitch(this, this.ShowPopupInfo));

                setInterval(lang.hitch(this,this.ShowAlarmGrid), 30000);
                this.ShowAlarmGrid();
            }
            topic.subscribe('egis/detector/CarHistory', lang.hitch(this, this.onDetectorCarHistory));
            topic.subscribe('egis/detector/CarRealTime', lang.hitch(this, this.onDetectorRealTime));
        },


        
        onDetectorCarHistory: function (e) {

            var mapPane = appEnv.getCurrentPane();
            //历史轨迹时间选择面板
            var historyPane = new DetectorCarHistoryPane({
                title: e.name,
                style: 'position:absolute; left:50px; top:60px; width:1100px;height:800px',
                dockTo: mapPane.dockTo,
                data: e
            });
            mapPane.addFloatingPane(historyPane);
        },


        onDetectorRealTime: function (e) {

            var mapPane = appEnv.getCurrentPane();
            var selectItem = e.IsShowImage ? e : null;
            //实时轨迹时间选择面板
            var realTimePane = new DetectorCarRealTimePane({
                title: e.name,
                style: 'position:absolute; left:50px; top:60px; width:1100px;height:800px',
                dockTo: mapPane.dockTo,
                selectItem : selectItem,
                data: e
            });
            mapPane.addFloatingPane(realTimePane);

        },

        _CLGJButtonClick: function () {

            registry.byId("infoTabContainer").selectChild("infoTabForGJ", true);
            var begin = registry.byId("bkBegin").get('value');
            var end = registry.byId("bkEnd").get('value');
            if (begin == null || end == null) {
                topic.publish("egis/messageNotification", { type: "info", text: "请设置时间段！" });
                return;
            }
            var name = registry.byId("bkName").get('value');
            if (name == null || name == "") {
                topic.publish("egis/messageNotification", { type: "info", text: "请设置车牌号码！" });
                return;
            }

            this.ShowPathGrid({
                rName: name,
                begin: begin.toJSON(),
                end: end.toJSON()
            });
        },

        _CLCXButtonClick: function () {

            registry.byId("infoTabContainer").selectChild("infoTabForCL",true);
            var begin = registry.byId("bkBegin").get('value');
            var end = registry.byId("bkEnd").get('value');
            if (begin == null || end == null) {
                topic.publish("egis/messageNotification", { type: "info", text: "请设置时间段！" });
                return;
            }
            var CLYS = registry.byId("bkCLYS").get('value');
            var CLLX = registry.byId("bkCLLX").get('value');
            var CPYS = registry.byId("bkCPYS").get('value');
            var name = registry.byId("bkName").get('value');

            this.ShowCarGrid({
                rName: name,
                CLYS: CLYS,
                CLLX: CLLX,
                CPYS: CPYS,
                begin: begin.toJSON(),
                end: end.toJSON()
            });
        },

        _KSBKButtonClick: function () {

            registry.byId("infoTabContainer").selectChild("infoTabForBK", true);
            var begin = registry.byId("bkBegin").get('value');
            var end = registry.byId("bkEnd").get('value');
            if (begin == null || end == null) {
                topic.publish("egis/messageNotification", { type: "info", text: "请设置时间段！" });
                return;
            }
            var name = registry.byId("bkName").get('value');
            if (name == null || name == "") {
                topic.publish("egis/messageNotification", { type: "info", text: "请设置车牌号码！" });
                return;
            }
            var CPYS = registry.byId("bkCPYS").get('value');

            request.post("/Detector/SaveTask", {
                data: {
                    cpys: CPYS,
                    rName: name,
                    begin: begin.toJSON(),
                    end: end.toJSON()
                },
                handleAs: "json"
            }).then(lang.hitch(this, function (data) {
                if (data.success) {
                    
                    this.ShowTaskGrid();

                    request.post("/Action/RequestContentByPost", {
                        data: {
                            strParam: '[ { "carNum":"' + name + '","carBckColor":"' + CPYS + '","beginDate":"' + data.BEGIN_TIME + '","endDate":"' + data.END_TIME + '"}]',
                           // strParam: "carNum=" + name + "&carBckColor=0&beginDate=" + data.BEGIN_TIME + "&endDate=" + data.END_TIME,
                            strQueryUrl: "http://10.46.147.234:19092/survey/add_survey",
                            postMethod: "POST"
                        },
                        handleAs: "json"
                    }).then(lang.hitch(this, function (data) {
                        if (data.returnMsg != "Success") {
                            topic.publish("egis/messageNotification", { type: "info", text: "推送布控任务失败！" });
                        }
                        else {
                            topic.publish("egis/messageNotification", { type: "info", text: "已经成功推送布控任务!" });
                        }
                    }));

                }
                topic.publish("egis/messageNotification", { type: "info", text: data.msg });
            }));
        },

        ShowDetectorOnMap: function (LayerGroup, LayerId, Items) {

            var removeObject = { LayerGroup: LayerGroup, RemoveType: "GROUP" };
            topic.publish("egis/Map/Remove", removeObject);

            var lineString = "";
            var iconUrl = '/Content/themes/blue/images/map-video.png';
            for (var num = 0; num < Items.length; num++)
            {
                //var showText = Items[num].CAR_TIME;
                var showText = Items[num].DETECTOR_NAME;
                var lonlat = [Items[num].DETECTOR_LON, Items[num].DETECTOR_LAT];
                var param = { LayerGroup: LayerGroup, LayerId: LayerId, ImgUrl: iconUrl, ShowText: showText, LonLat: lonlat, Code: Items[num].ID, Data: Items[num] };
                topic.publish("egis/Map/AddMarker", param);
                if (lineString != "") {
                    lineString += ",";
                }
                lineString += Items[num].DETECTOR_LON + "," + Items[num].DETECTOR_LAT;
            }

            var firstInfo = { LayerGroup: LayerGroup, LayerId: LayerId, Color: "#FF0000", LineWidth: 3, ShowText: "", RegionContent: lineString };
            topic.publish("egis/Map/DrawLine", firstInfo);
        },

        ShowAlarmGrid: function (param) {
            var layout = [{
                name: '车牌',
                field: 'CAR_PLATE_NUMBER',
                width: "30%"
            }, {
                name: '经过卡口',
                field: 'DETECTOR_NAME',
                width: "35%"
            }, {
                name: '经过时间',
                field: 'CAR_TIME',
                width: "35%"
            }];
            var leftCenterContent = registry.byId("leftCenterContent");
            var isHaveNew = false;
            request.post("/Detector/GetAlarmPath", {
                data: param,
                handleAs: "json"
            }).then(lang.hitch(this, function (data) {
                if (data != null && data.length > 0) {
                    this.ShowDetectorOnMap("告警上图", "卡口轨迹", data);
                    this.BuildResultGrid(leftCenterContent, lang.clone(data), layout, (leftCenterContent.h - 0), "告警上图", "卡口轨迹");
                    if (this.currentAlarmItem == null) {
                        this.currentAlarmItem = data[data.length - 1];
                        isHaveNew = true;
                    }
                    else {
                        if (this.currentAlarmItem.ID != data[data.length - 1].ID)
                        {
                            this.currentAlarmItem = data[data.length - 1];
                            isHaveNew = true;
                        }
                    }
                    if (isHaveNew)
                    {
                        topic.publish("egis/Map/Locate", { Lon: this.currentAlarmItem.DETECTOR_LON, Lat: this.currentAlarmItem.DETECTOR_LAT });
                    }
                }
            }));
        },

        ShowCarGrid: function (param) {
            var layout = [{
                name: '车牌',
                field: 'CAR_PLATE_NUMBER',
                width: "30%"
            }, {
                name: '车牌颜色',
                field: 'PLATE_COLOR',
                width: "15%",
                formatter: function (value) {
                    if (value == "") {
                        return value;
                    }
                    var array = registry.byId("bkCPYS").options;
                    for (var num = 0; num < array.length; num++) {
                        if (array[num].value == value)
                        {
                            return array[num].label;
                        }
                    }
                }
            }, {
                name: '车身颜色',
                field: 'CAR_COLOR',
                width: "25%",
                formatter: function (value) {
                    if (value == "") {
                        return value;
                    }
                    var array = registry.byId("bkCLYS").options;
                    for (var num = 0; num < array.length; num++) {
                        if (array[num].value == value) {
                            return array[num].label;
                        }
                    }
                }
            }, {
                name: '车辆类型',
                field: 'CAR_TYPE',
                width: "15%",
                formatter: function (value) {
                    if (value == "")
                    {
                        return value;
                    }
                    var array = registry.byId("bkCLLX").options;
                    for (var num = 0; num < array.length; num++) {
                        if (array[num].value == value) {
                            return array[num].label;
                        }
                    }
                }
            }, {
                name: '经过次数',
                field: 'PASS_COUNT',
                width: "15%"
            }];
            var leftCLCenterContent = registry.byId("leftCLCenterContent");
            request.post("/Detector/GetCarList", {
                data: param,
                handleAs: "json"
            }).then(lang.hitch(this, function (data) {
                if (data != null && data.length > 0) {

                    this.BuildCarGrid(leftCLCenterContent, lang.clone(data), layout, (leftCLCenterContent.h - 0));

                }
            }));
        },

        ShowPathGrid: function (param) {
            var layout = [{
                name: '车牌',
                field: 'CAR_PLATE_NUMBER',
                width: "30%"
            }, {
                name: '经过卡口',
                field: 'DETECTOR_NAME',
                width: "35%"
            }, {
                name: '经过时间',
                field: 'CAR_TIME',
                width: "35%"
            }];
            var leftGJCenterContent = registry.byId("leftGJCenterContent");
            request.post("/Detector/GetHistoryPath", {
                data: param,
                handleAs: "json"
            }).then(lang.hitch(this, function (data) {
                if (data != null && data.length > 0) {
                    this.ShowDetectorOnMap("轨迹上图", "卡口轨迹", data);
                    this.BuildResultGrid(leftGJCenterContent, lang.clone(data), layout, (leftGJCenterContent.h - 0), "轨迹上图", "卡口轨迹");

                }
            }));
        },

        ShowTaskGrid: function ()
        {
            var layout = [{
                name: '匹配车辆',
                field: 'CAR_PLATE_NUMBER',
                width: "30%"
            }, {
                name: '开始时间',
                field: 'BEGIN_TIME',
                width: "35%"
            }, {
                name: '结束时间',
                field: 'END_TIME',
                width: "35%"
            }];
            var leftButtomContent = registry.byId("leftButtomContent");
            request.post("/Detector/GetTaskInfos", {
                data: {},
                handleAs: "json"
            }).then(lang.hitch(this, function (data) {
                if (data != null && data.length > 0) {
                    this.BuildResultGrid(leftButtomContent, data,layout,(leftButtomContent.h - 30));
                }
            }));
            //添加工具条
            if (!leftButtomContent.toolBar) {
                leftButtomContent.toolBar = new Toolbar({}, "toolbar");
                var saveButton = new Button({ label: '撤销' });
                saveButton.on("click", lang.hitch(this, function () {

                    var items = leftButtomContent.ResultGrid.selection.getSelected();
                    if (items.length == 0) {
                        topic.publish("egis/messageNotification", { type: "info", text: "操作提示:请先购选视频点位!" });
                        return;
                    }

                    if (items != null && items.length > 0) {
                        for (var num = 0; num < items.length; num++) {
                            if (items[num] && items[num].CAR_PLATE_NUMBER && items[num].CAR_PLATE_NUMBER.length > 0) {
                                var ID = items[num].ID[0];
                                var name = items[num].CAR_PLATE_NUMBER[0];
                                var CPYS = items[num].CAR_PLATE_COLOR[0];
                                request.post("/Detector/CancelTask", {
                                    data: { ID: ID },
                                    handleAs: "json"
                                }).then(lang.hitch(this, function (data) {
                                    if (data.success) {

                                        this.ShowTaskGrid();
                                        request.post("/Action/RequestContentByPost", {
                                            data: {
                                                strParam: '[ { "carNum":"' + name + '","carBckColor":"' + CPYS + '"}]',
                                                strQueryUrl: "http://10.46.147.234:19092/survey/remove_survey",
                                                postMethod: "POST"
                                            },
                                            handleAs: "json"
                                        }).then(lang.hitch(this, function (data) {
                                            if (data.returnMsg != "Success") {
                                                topic.publish("egis/messageNotification", { type: "info", text: "取消布控任务失败！" });
                                            }
                                            else {
                                                topic.publish("egis/messageNotification", { type: "info", text: "已经成功取消布控任务!" });
                                            }
                                        }));

                                    }
                                    topic.publish("egis/messageNotification", { type: "info", text: data.msg });
                                }));
                            }
                        }
                    }


                }));
                leftButtomContent.toolBar.addChild(saveButton);
                leftButtomContent.addChild(leftButtomContent.toolBar);
            }
        },


        BuildResultGrid: function (tabContainer, data,layout,gridHeight, LayerGroup, LayerId) {

            var store = new ItemFileWriteStore({
                data: {
                    identifier: "ID",
                    items: data
                }
            });

            if (!tabContainer.ResultGrid) {
                var plugin = { indirectSelection: { headerSelector: true, width: "18px" } };
                var grid = new EnhancedGrid({
                    structure: layout,
                    style: "width:100%; height: " + gridHeight + "px;",
                    plugins: plugin
                }, document.createElement("div"));

                tabContainer.addChild(grid);
                grid.startup();

                grid.on("cellClick", lang.hitch(this, function (e) {
                    //若第一列不能有点击事件则取消定位
                    if (e.cellIndex == 0) return;
                    var item = grid.getItem(e.rowIndex);
                    topic.publish("egis/Map/Locate", { Lon: item.DETECTOR_LON[0], Lat: item.DETECTOR_LAT[0] });
                }));

                grid.on("rowmouseover", lang.hitch(this, function (e) {
                    var item = grid.getItem(e.rowIndex);
                    if (!item || !item.DETECTOR_LON || !item.DETECTOR_LAT) return;
                    topic.publish("egis/Map/UpdateScale", { LayerGroup: LayerGroup, LayerId: LayerId, Code: item.ID[0], Scale: 1.5 });
                }));

                grid.on("rowmouseout", lang.hitch(this, function (e) {
                    var item = grid.getItem(e.rowIndex);
                    if (!item || !item.DETECTOR_LON || !item.DETECTOR_LAT) return;
                    topic.publish("egis/Map/UpdateScale", { LayerGroup: LayerGroup, LayerId: LayerId, Code: item.ID[0], Scale: 1 });
                }));
                tabContainer.ResultGrid = grid;
            }
            tabContainer.ResultGrid.setStore(store);
        },

        BuildCarGrid: function (tabContainer, data, layout, gridHeight) {

            var store = new ItemFileWriteStore({
                data: {
                    identifier: "ID",
                    items: data
                }
            });

            if (!tabContainer.ResultGrid) {
                var plugin = { indirectSelection: { headerSelector: true, width: "18px" } };
                var grid = new EnhancedGrid({
                    structure: layout,
                    style: "width:100%; height: " + gridHeight + "px;",
                    plugins: plugin
                }, document.createElement("div"));

                tabContainer.addChild(grid);
                grid.startup();

                grid.on("celldblclick", lang.hitch(this, function (e) {
                    //若第一列不能有点击事件则取消定位
                    if (e.cellIndex == 0) return;
                    var item = grid.getItem(e.rowIndex);

                    registry.byId("infoTabContainer").selectChild("infoTabForGJ", true);
                    var begin = registry.byId("bkBegin").get('value');
                    var end = registry.byId("bkEnd").get('value');

                    this.ShowPathGrid({
                        rName: item.CAR_PLATE_NUMBER[0],
                        begin: begin.toJSON(),
                        end: end.toJSON()
                    });
                }));

                tabContainer.ResultGrid = grid;
            }
            tabContainer.ResultGrid.setStore(store);
        },



        ShowPopupInfo: function (paramObject) {
            var mapPane = appEnv.getCurrentPane();
            var feature = paramObject.Feature;
            var olPopup = null;
            if (feature.Resource && feature.Resource.LayerId == "卡口轨迹") {
                olPopup = this.getDetectorResourcePopup(feature.Resource.Data, feature, mapPane);
            }
            else if (feature.Resource && feature.Resource.LayerId == "上图警情") {
                //olPopup = this.getCaseResourcePopup(feature.Resource.Data, feature, mapPane);
            }
            else {
                return;
            }
            var coord = paramObject.PopupPosition;

            olPopup.on('close', lang.hitch(this, function () {

                mapPane.map.removeOverlay(feature.popup);
                feature.dsPoppup = null;
                feature.popup = null;

            }));

            olPopup.startup();
            olPopup.show();

            var popup = new ol.Overlay({
                element: olPopup.domNode,
                positioning: 'bottom-left',
                offset: [0, 0],
                autoPan: true,
                autoPanAnimation: {
                    duration: 250
                }
            });

            //同时将TabInfoPopup和Overlay绑定到feature，一个用于更新位置，一个用于更新显示信息
            feature.dsPoppup = olPopup;
            feature.popup = popup;

            popup.setPosition(coord);
            if (mapPane.map) {
                mapPane.map.addOverlay(popup);

                topic.publish("egis/Map/LocatePanTo", coord);
            }
        },

        getDetectorResourcePopup: function (resource, feature, mapPane) {

            var data = [
                    { name: '编号', value: resource.DETECTOR_CODE },
                    { name: '名称', value: resource.DETECTOR_NAME },
                    { name: '经度', value: resource.DETECTOR_LON },
                    { name: "纬度", value: resource.DETECTOR_LAT }
            ];

            var btnArray = new Array();
            var gczpButton = new Button({
                label: "过车照片"
            });
            on.once(gczpButton, "click", lang.hitch(this, function () {

                //var dWin = window.open(null, 'showDetectorpane', "width=800,height=600,top=150,left=150,resizable=no,scrollbars=no,location=no");
                //dWin.location.href = resource.CAR_IMAGEURL;
                topic.publish("egis/detector/CarRealTime", { CODE: resource.DETECTOR_CODE, name: resource.DETECTOR_NAME, carPlateNumber: resource.CAR_PLATE_NUMBER, speed: resource.CAR_SPEED, passTime: resource.CAR_TIME,imagePath:resource.CAR_IMAGEURL, IsShowImage: true });
                mapPane.map.removeOverlay(feature.popup);
                feature.dsPoppup = null;
                feature.popup = null;

            }));
            btnArray.push(gczpButton);

            var ssbfButton = new Button({
                label: "实时过车"
            });
            on.once(ssbfButton, "click", lang.hitch(this, function () {

                topic.publish("egis/detector/CarRealTime", { CODE: resource.DETECTOR_CODE, name: resource.DETECTOR_NAME });
                mapPane.map.removeOverlay(feature.popup);
                feature.dsPoppup = null;
                feature.popup = null;

            }));
            btnArray.push(ssbfButton);

            var lscxButton = new Button({
                label: "历史查询"
            });
            on.once(lscxButton, "click", lang.hitch(this, function () {

                topic.publish("egis/detector/CarHistory", { CODE: resource.DETECTOR_CODE, name: resource.DETECTOR_NAME });
                mapPane.map.removeOverlay(feature.popup);
                feature.dsPoppup = null;
                feature.popup = null;

            }));
            btnArray.push(lscxButton);


            var popup = new TableInfoPopup({
                title: "信息",
                map: this.map,
                data: data,
                buttons: btnArray,
                LinkButtonString: null,
                detailClickHandler: null,
                enableDetail: false
            });
            popup.domNode.style.width = "260px";

            return popup;
        }

    });
});