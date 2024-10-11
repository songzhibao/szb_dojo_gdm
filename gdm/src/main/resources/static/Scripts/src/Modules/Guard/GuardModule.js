define([
'dojo/_base/declare',
'dojo/_base/array',
'dojo/_base/lang',
'dojo/aspect',
'dojo/json',
'dojo/topic',
'dojo/ready',
'dojo/request',
'dojo/dom-style',
"dojo/on",
"dojo/data/ItemFileWriteStore",
'dijit/Toolbar',
"dijit/layout/ContentPane",
"dojox/grid/EnhancedGrid",
"dojox/grid/enhanced/plugins/Filter",
"dojox/grid/enhanced/plugins/Pagination",
"dojox/grid/enhanced/plugins/IndirectSelection",
"dijit/registry",
'dijit/form/Button',
'dijit/TitlePane',
'egis/Modules/_Module',
'egis/appEnv',
"egis/Share/component/OrgTree/CBTree",
'egis/Share/component/InfoPane/TableInfoPopup',
'egis/Share/component/ToolPane/MapToolList',
'egis/Share/component/ToolPane/MapTools',
'egis/Share/component/VideoSelect/VideoSelectControl',
'egis/Share/component/Dialog/Dialog',
'egis/Modules/Guard/component/GuardListPane',
'egis/Modules/Guard/component/GuardDrawPane',
"egis/cache",
'ol'

], function (declare, array, lang, aspect, JSON, topic, ready, request, domStyle, on, ItemFileWriteStore, Toolbar, ContentPane, EnhancedGrid, Filter, Pagination, IndirectSelection, registry, Button, TitlePane, _Module, appEnv, CBTree, TableInfoPopup, MapToolList, MapTools, VideoSelectControl, Dialog, GuardListPane, GuardDrawPane, cache, ol) {
    return declare([_Module], {

        constructor: function () {
            
        },
        startup: function () {

            var mapPane = appEnv.getCurrentPane();
            var me = this;

            var tools = new MapTools({
                id: 'tools',
                style: 'position:absolute; right:10px; bottom:110px;padding: 0px;z-index: 100;'
            });
            mapPane.addFloatingPane(tools);

            registry.byId("regionColorPicker").on("change", lang.hitch(this, this.colorPickerOnChange));

            this.ShowGuardTaskPane();

            this.saveButton = registry.byId("saveButton");
            this.saveasButton = registry.byId("saveasButton");
            this.saveButton.on("click", lang.hitch(this, this._SaveButtonClick));
            this.saveasButton.on("click", lang.hitch(this, this._SaveasButtonClick));

            topic.subscribe("egis/Guard/CreateTask", lang.hitch(this, function (paramObject) {

                domStyle.set("saveButton", "display", "");
                domStyle.set("saveasButton", "display", "none");
                registry.byId("saveButton").setDisabled(false);
                registry.byId("saveasButton").setDisabled(true);

                registry.byId("guardColor").setValue("#FF4500");
                registry.byId("guardColor").domNode.style.backgroundColor = "#FF4500";
                paramObject.FillColor = "#FF4500";
                me.TASKID = paramObject.TASKID;
                me.TASKSTATUS = "CreateTask";
                me.ShowGuardDrawPane(null,paramObject);

            }));

            topic.subscribe("egis/Guard/EditTask", lang.hitch(this, function (paramObject) {

                domStyle.set("saveButton", "display", "");
                domStyle.set("saveasButton", "display", "");
                registry.byId("saveButton").setDisabled(false);
                registry.byId("saveasButton").setDisabled(false);
                registry.byId("guardType").setValue(paramObject.Type);
                registry.byId("guardColor").setValue(paramObject.FillColor);
                registry.byId("guardColor").domNode.style.backgroundColor = paramObject.FillColor;
                registry.byId("guardName").setValue(paramObject.Name);
                registry.byId("guardBegin").setValue(paramObject.BeginTime);
                registry.byId("guardEnd").setValue(paramObject.EndTime);
                me.TASKID = paramObject.Id;
                paramObject.TASKID = paramObject.Id;
                me.ShowGuardDrawPane(null,paramObject);
                me.ShowGuardOnMap(me.TASKID);
                me.ShowGuardPointTree(me.TASKID,false);
                me.TASKSTATUS = "EditTask";

            }));


            topic.subscribe("egis/Guard/StartTask", lang.hitch(this, function (paramObject) {

                domStyle.set("saveButton", "display", "none");
                domStyle.set("saveasButton", "display", "none");
                registry.byId("saveButton").setDisabled(true);
                registry.byId("saveasButton").setDisabled(true);
                registry.byId("guardType").setValue(paramObject.Type);
                registry.byId("guardColor").setValue(paramObject.FillColor);
                registry.byId("guardColor").domNode.style.backgroundColor = paramObject.FillColor;
                registry.byId("guardName").setValue(paramObject.Name);
                registry.byId("guardBegin").setValue(paramObject.BeginTime);
                registry.byId("guardEnd").setValue(paramObject.EndTime);
                me.TASKID = paramObject.Id;
                paramObject.TASKID = paramObject.Id;
                me.ShowGuardOnMap(me.TASKID);
                me.ShowGuardPointTree(me.TASKID,true);
                me.ShowPoliceOnMap("taskid",me.TASKID);
                me.TASKSTATUS = "StartTask";

                var toolPane = new MapToolList({
                    id: 'tool-container',
                    IsCheckPolice: false,
                    IsCheckPoliceOnline: true,
                    style: 'position:absolute; right:10px; top:130px;padding: 0px;'
                });
                mapPane.addFloatingPane(toolPane);

            }));

            topic.subscribe("egis/Guard/Region/ToMap", lang.hitch(this, function (paramObject) {
                if (paramObject.Requester.actionType == "/Guard/QueryRegionByTask") {
                    me.ShowGuardRegions(paramObject.Requester, paramObject.ResultData);
                }
                else if (paramObject.Requester.actionType == "/Guard/QueryPointByTask") {
                    for (var num = 0; num < paramObject.ResultData.length; num++) {
                        var item = paramObject.ResultData[num];
                        var iconUrl = "/Content/themes/blue/images/Region/guardPoint.png";
                        var param = { LayerGroup: paramObject.Requester.LayerGroup, LayerId: paramObject.Requester.LayerId, ImgUrl: iconUrl, ShowText: item.Name, LonLat: [item.Lon, item.Lat], Code: item.Id, Data: item };
                        topic.publish("egis/Map/AddMarker", param);
                    }
                }
            }));

            topic.subscribe("egis/Guard/BeginMapEdit", lang.hitch(this, this.ShowGuardDrawPane));

            topic.subscribe("egis/Map/Resource/SelectFeature", lang.hitch(this, this.ShowPopupInfo));

            topic.subscribe("egis/Map/GEO/SelectFeature", lang.hitch(this, this.ShowGeoPopupInfo));

            topic.subscribe("egis/Guard/SaveGuardPoint", lang.hitch(this, function () {

                me.ShowGuardOnMap(me.TASKID);
                me.ShowGuardPointTree(me.TASKID,false);

            }));

            window.SendCallMsg = function (callNumber,callName) {

                window.parent.window.dojo.publish('egis/MSG/CallMsg', { CallType: 'qz', CallerList: [{ CallNumber: appEnv.appConfig.GetCallNumber(callNumber, "sj"), CallerName: callName, CallNumberType: 'sj' }] });

            };
        },


        ShowPoliceOnMap: function (dataType,idStr) {
            var param = { LayerGroup: "警卫管理", LayerId: "上图警力", RemoveType: "ID" };
            //先清空原先的标注点
            topic.publish("egis/Map/Remove", param);

            var paramObj = {
                idStr: idStr,
                checkSTSD: true,
                checkSTBD: false,
                dataType: dataType
            };
            var requester = { getDataUrl: "/Alarm/GetDeviceResourcesForGuard", actionExplain: "获取警卫任务警力", actionType: "/Guard/QueryPoliceByTask", paramObject: paramObj, LayerGroup: param.LayerGroup, LayerId: param.LayerId };
            topic.publish("egis/Map/Resource/GetResource", requester);

        },

        ShowGuardOnMap: function (taskId) {
            var param = { LayerGroup: "警卫管理", LayerId: "警卫图形", RemoveType: "GROUP" };
            //先清空原先的标注点
            topic.publish("egis/Map/Remove", param);

            var paramObj = {
                taskId: taskId
            };
            var requester = { getDataUrl: "/Guard/GetGuardRegoions", actionExplain: "获取警卫图形数据", actionType: "/Guard/QueryRegionByTask", paramObject: paramObj, LayerGroup: param.LayerGroup, LayerId: param.LayerId };
            topic.publish("egis/Guard/Region", requester);
            requester = { getDataUrl: "/Guard/GetGuardPoints", actionExplain: "获取警卫保障点数据", actionType: "/Guard/QueryPointByTask", paramObject: paramObj, LayerGroup: param.LayerGroup, LayerId: "警卫保障点" };
            topic.publish("egis/Guard/Region", requester);
        },

        ShowGuardPointTree: function (taskId, IsCheck) {
            var me = this;
            var leftButtomContent = registry.byId("leftButtomContent");
            request.post("/Guard/GetGuardPointTree", {
                data: { taskId: taskId, IsCheck: IsCheck },
                handleAs: "json"
            }).then(function (data) {
                if (me.jwtTree) {
                    leftButtomContent.removeChild(me.jwtTree);
                }
                me.jwtTree = new CBTree({
                    checkBoxes: true,
                    state: "Loaded",
                    data: data,
                    showRoot: false,
                    ParentId: taskId,
                    style: " height:" + (leftButtomContent.h - 20) + "px; width:100%; overflow-x:hidden;"
                });
                leftButtomContent.addChild(me.jwtTree);

                me.jwtTree.on("CheckBoxClick", function (e) {
                    var checkList = me.jwtTree.getChecked();
                    if (checkList == null) {
                        return;
                    }
                    var policeCodeList = "";
                    for (var num = 0; num < checkList.length; num++)
                    {
                        if (checkList[num].Code)
                        {
                            if (policeCodeList != "")
                            {
                                policeCodeList += ",";
                            }
                            policeCodeList += "'" + checkList[num].Code + "'";
                        }
                    }
                    me.ShowPoliceOnMap("policecode",policeCodeList);
                });

                me.jwtTree.on("click", function (e) {
                    topic.publish("egis/Map/Locate", { Lon: e.lon, Lat: e.lat });
                });

            }, function (error) {

            });
        },

        colorPickerOnChange: function (color) {

            registry.byId("guardColor").domNode.style.backgroundColor = color;
            registry.byId("guardColor").setValue(color);
            var mapPane = appEnv.getCurrentPane();
            if (mapPane.GuardDrawPane)
            {
                mapPane.GuardDrawPane.SetDrawColor(color);
            }
        },


        _SaveasButtonClick: function () {


        },


        ShowGuardRegions: function (requester, resultData) {

            for (var num = 0; num < resultData.length; num++) {

                var item = resultData[num];
                var geoArray = item.CONTENT.split('~');
                for (var ii = 0; ii < geoArray.length; ii++) {
                    var infoArray = geoArray[ii].split('|');
                    if (infoArray.length == 2) {
                        var showName = "";
                        if (requester.paramObject.isShowName) {
                            showName = item.Name;
                        }
                        if (infoArray[0] == "Point") {
                            var info = { LayerGroup: requester.LayerGroup, LayerId: requester.LayerId, Color: item.FillColor, ShowText: showName, RegionContent: infoArray[1], Data: item };
                            topic.publish("egis/Map/DrawPoint", info);
                        }
                        else if (infoArray[0] == "LineString") {
                            var info = { LayerGroup: requester.LayerGroup, LayerId: requester.LayerId, Color: item.FillColor, LineWidth: 4, ShowText: showName, RegionContent: infoArray[1], Data: item };
                            topic.publish("egis/Map/DrawLine", info);
                        }
                        else if (infoArray[0] == "Polygon") {
                            var info = { LayerGroup: requester.LayerGroup, LayerId: requester.LayerId, Color: item.FillColor, LineWidth: 2, ShowText: showName, RegionContent: infoArray[1], Data: item };
                            topic.publish("egis/Map/DrawPolygon", info);
                        }
                        else if (infoArray[0] == "Circle") {
                            var info = { LayerGroup: requester.LayerGroup, LayerId: requester.LayerId, Color: item.FillColor, LineWidth: 1, ShowText: showName, RegionContent: infoArray[1], Data: item };
                            topic.publish("egis/Map/DrawCircle", info);
                        }
                    }
                }
            }
        },

        _SaveButtonClick: function () {

            var begin = registry.byId("guardBegin").get('value');
            var end = registry.byId("guardEnd").get('value');
            if (begin == null || end == null) {
                topic.publish("egis/messageNotification", { type: "info", text: "请设置项目时间段！" });
                return;
            }
            var name = registry.byId("guardName").get('value');
            if (name == null || name == "") {
                topic.publish("egis/messageNotification", { type: "info", text: "请设置项目名称！" });
                return;
            }

            request.post("/Guard/SaveGuardTask", {
                data: {
                    rName: name,
                    type: registry.byId("guardType").get('value'),
                    begin: begin.toJSON(),
                    end: end.toJSON(),
                    FillColor: registry.byId("guardColor").get('value'),
                    TaskID: this.TASKID
                },
                handleAs: "json"
            }).then(lang.hitch(this, function (data) {
                if (data.success) {
                    topic.publish('egis/Guard/SaveGuardPoint', null);
                }
                topic.publish("egis/messageNotification", { type: "info", text: data.msg });
            }));
        },

        ShowGuardDrawPane: function (item,task) {

            var mapPane = appEnv.getCurrentPane();
            if (mapPane.GuardDrawPane == null) {
                mapPane.GuardDrawPane = new GuardDrawPane({
                    title: '',
                    style: 'width:95px;height:350px',
                    dockTo: mapPane.dockTo,
                    initPosition: 'lm',
                    closeTip: '关闭后查询结果将清除，是否确认关闭？',
                    currentItem: item,
                    currentTask : task
                });
                aspect.after(mapPane.GuardDrawPane, 'close', lang.hitch(this, function () {
                    mapPane.GuardDrawPane = null;
                }));

                mapPane.addFloatingPane(mapPane.GuardDrawPane);
            }
            else {
                if (item != null) {
                    mapPane.GuardDrawPane.SetModifyGuard(item);
                }
                else {
                    mapPane.GuardDrawPane.currentItem = null;
                }
            }
        },

        ShowGuardTaskPane: function (item) {

            var mapPane = appEnv.getCurrentPane();
            if (mapPane.GuardListPane == null) {
                mapPane.GuardListPane = new GuardListPane({
                    title: '警卫任务',
                    style: "width: 560px;height:380px;",
                    dockTo: mapPane.dockTo,
                    initPosition: 'lt',
                    closeTip: '关闭后查询结果将清除，是否确认关闭？',
                    item: item
                });

                aspect.after(mapPane.GuardListPane, 'close', lang.hitch(this, function () {
                    mapPane.GuardListPane = null;
                }));

                mapPane.addFloatingPane(mapPane.GuardListPane);
            }
        },


        ShowGeoPopupInfo: function (paramObject) {
            var feature = paramObject.Feature;
            if (!feature.Resource || !feature.Resource.name) {
                return;
            }
            var coord = paramObject.PopupPosition;
            var mapPane = appEnv.getCurrentPane();
            var olPopup = this.getGeoPopup(feature.Resource, feature, mapPane);
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

        getGeoPopup: function (resource, feature, mapPane) {

            var data = [
                    { name: '名称', value: resource.name },
                    { name: '编号', value: resource.id },
                    { name: '经度', value: resource.lonx },
                    { name: "纬度", value: resource.laty },
                    { name: "备注", value: resource.discription }
            ];

            var btnArray = new Array();

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
        },

        ShowPopupInfo: function (paramObject) {
            var mapPane = appEnv.getCurrentPane();
            var feature = paramObject.Feature;
            var olPopup = null;
            if (feature.Resource && feature.Resource.LayerId == "上图警力") {
                olPopup = this.getPoliceResourcePopup(feature.Resource.Data, feature, mapPane);
            }
            else if (feature.Resource && feature.Resource.LayerId == "上图视频") {
                olPopup = this.getVideoResourcePopup(feature.Resource.Data, feature, mapPane);
            }
            else if (feature.Resource && feature.Resource.LayerId == "上图警情") {
                olPopup = this.getCaseResourcePopup(feature.Resource.Data, feature, mapPane);
            }
            else if (feature.Resource && feature.Resource.LayerId == "警卫图形") {
                olPopup = this.getRegionPopup(feature.Resource.Data, feature, mapPane);
            }
            else if (feature.Resource && feature.Resource.LayerId == "警卫保障点") {
                olPopup = this.getPointPopup(feature.Resource.Data, feature, mapPane);
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

        getPoliceResourcePopup: function (resource, feature, mapPane) {

            var orgName = "";
            if (resource.Organization) {
                orgName = resource.Organization.Name;
            }

            var data = [
                    { name: '名称', value: resource.SHOWTEXT },
                    { name: '编号', value: resource.CODE },
                    { name: '单位', value: orgName },
                    { name: "职务", value: resource.ZW },
                    { name: "状态", value: this.getPoliceStateText(resource.DUTY_STATUS) },
                    { name: "联系电话", value: resource.PhoneNum },
                    { name: "定位时间", value: resource.GPS_TIME.replace("T", " ") || '' }
            ];

            var btnArray = new Array();

            var sjhjButton = new Button({
                label: "呼叫手机"
            });
            var me = this;
            on.once(sjhjButton, "click", lang.hitch(this, function () {

                window.parent.window.dojo.publish('egis/MSG/CallMsg', { CallType: 'qz', CallerList: [{ CallNumber: appEnv.appConfig.GetCallNumber(resource.PhoneNum,"sj"), CallerName: resource.SHOWTEXT, CallNumberType: 'sj' }] });
                mapPane.map.removeOverlay(feature.popup);
                feature.dsPoppup = null;
                feature.popup = null;

            }));
            btnArray.push(sjhjButton);

            if (resource.DEVICETYPE == "manJWT") {

                var sthjButton = new Button({
                    label: "指令警务通"
                });
                on.once(sthjButton, "click", lang.hitch(this, function () {

                    mapPane.map.removeOverlay(feature.popup);
                    feature.dsPoppup = null;
                    feature.popup = null;
                }));
                btnArray.push(sthjButton);

                var zljwtButton = new Button({
                    label: "实况视频"
                });
                on.once(zljwtButton, "click", lang.hitch(this, function () {

                    appEnv.appConfig.ShowJWTVideo(resource);

                    mapPane.map.removeOverlay(feature.popup);
                    feature.dsPoppup = null;
                    feature.popup = null;
                }));
                btnArray.push(zljwtButton);
            }
            else {
                var sthjButton = new Button({
                    label: "呼叫手台"
                });
                on.once(sthjButton, "click", lang.hitch(this, function () {

                    window.parent.window.dojo.publish('egis/MSG/CallMsg', { CallType: 'qz', CallerList: [{ CallNumber: appEnv.appConfig.GetCallNumber(resource.CODE, "qita"), CallerName: resource.SHOWTEXT, CallNumberType: 'qita' }] });
                    mapPane.map.removeOverlay(feature.popup);
                    feature.dsPoppup = null;
                    feature.popup = null;
                }));
                btnArray.push(sthjButton);
            }


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
        },

        getPoliceStateText: function (state) {
            if (state == "1" || state == "5") {
                return "备勤";
            }
            else if (state == "9") {
                return "处置";
            }
            else if (state == "8") {
                return "出警";
            }
            else if (state == "2") {
                return "巡逻";
            }
            else if (state == "0") {
                return "离线";
            }
            else {
                return "备勤";
            }
        },

        getVideoResourcePopup: function (resource, feature, mapPane) {

            var data = [
                    { name: '名称', value: resource.Name },
                    { name: '编号', value: resource.Code },
                    { name: '经度', value: resource.LON },
                    { name: "纬度", value: resource.LAT }
            ];

            var btnArray = new Array();
            var bfButton = new Button({
                label: "播放"
            });
            var me = this;
            on.once(bfButton, "click", lang.hitch(this, function () {

                appEnv.appConfig.ShowVideo(resource.Code);
                mapPane.map.removeOverlay(feature.popup);
                feature.dsPoppup = null;
                feature.popup = null;
                return;

                request.post("/Alarm/SaveCaseLocateInfo", {
                    data: {
                        th: window.parent.window.deskNum,
                        sjdbh: GetTimeIDString(),
                        address: resource.Name,
                        videoIdList: resource.Code,
                        lon: resource.LON,
                        lat: resource.LAT
                    },
                    handleAs: "json"
                }).then(lang.hitch(this, function (data) {
                    if (!data.success) {
                        topic.publish("egis/messageNotification", { type: "info", text: "播放视频推送失败！" });
                    }
                    else {
                        topic.publish("egis/messageNotification", { type: "info", text: "播放视频已推送到视频平台！" });
                        mapPane.map.removeOverlay(feature.popup);
                        feature.dsPoppup = null;
                        feature.popup = null;
                    }
                }));


            }));
            btnArray.push(bfButton);


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
        },

        getCaseResourcePopup: function (resource, feature, mapPane) {

            var data = [
                { name: '编号', value: resource.case_code.substring(0, 20) + '</br>' + resource.case_code.substring(20) || '' },
                { name: '类型', value: resource.CaseType.Name || '' },
                { name: '地址', value: resource.case_address || '' },
                { name: '时间', value: resource.case_time.replace("T", " ") || '' }
            ];

            var popup = new TableInfoPopup({
                title: resource.CaseType.Name,
                map: this.map,
                data: data,
                LinkButtonString: null,
                detailClickHandler: lang.hitch(this, function () {

                    appEnv.appConfig.ShowCaseUrl(resource);

                }),
                enableDetail: true
            });
            popup.domNode.style.width = "250px";

            return popup;
        },

        getRegionPopup: function (resource, feature, mapPane) {

            var data = [];

            var btnArray = new Array();

            var markMapButton = new Button({
                label: "编辑"
            });
            on.once(markMapButton, "click", lang.hitch(this, function () {

                resource.SelectFeature = feature;

                topic.publish('egis/Guard/BeginMapEdit', resource);
                mapPane.map.removeOverlay(feature.popup);
                feature.dsPoppup = null;
                feature.popup = null;
                feature.isRegionEdit = true;

            }));
            btnArray.push(markMapButton);
            var deleteButton = new Button({
                label: "删除"
            });
            on.once(deleteButton, "click", lang.hitch(this, function () {

                var dialog = new Dialog({
                    title: '提示',
                    style: "width: 400px;height:220px;",
                    mode: ['ok', 'cancel'],
                    message: {
                        type: 'warn',
                        text: '确认删除图形？'
                    }
                });
                dialog.okButton.on('click', lang.hitch(this, function () {

                    request.post("/Guard/DeleteGuardRegion", {
                        data: {
                            Id: resource.Id
                        },
                        handleAs: "json"
                    }).then(lang.hitch(this, function (data) {
                        topic.publish('egis/Guard/SaveGuardPoint', null);
                        mapPane.map.removeOverlay(feature.popup);
                        feature.dsPoppup = null;
                        feature.popup = null;
                    })
                   );
                }));
                dialog.show();

            }));
            btnArray.push(deleteButton);

            if (appEnv.appConfig.userManager != null) {
                if (appEnv.appConfig.userManager.isGranted("scoutHDBZ")) {
                    btnArray = [];
                }
            }
            var popup = new TableInfoPopup({
                title: "图形信息",
                map: this.map,
                data: data,
                buttons: btnArray,
                LinkButtonString: null,
                detailClickHandler: null,
                enableDetail: false
            });
            popup.domNode.style.width = "280px";

            return popup;
        },

        getPointPopup: function (resource, feature, mapPane) {

            var data = [
                    { name: '名称', value: resource.Name },
                    { name: '编号', value: resource.Code },
                    { name: '单位', value: resource.ORGNAME },
                    { name: "负责警员", value: resource.ZRLD },
                    { name: "联系电话", value: resource.LXDH },
                    { name: "职责", value: resource.ZZ },
                    { name: "装备", value: resource.ZB },
                    { name: "保障警力", value: resource.PoliceStr.replace(new RegExp("~","gm"),"<br>") },
                    { name: "备注", value: resource.Memo }
            ];

            var btnArray = new Array();
            var editButton = new Button({
                label: "信息编辑"
            });
            var me = this;
            on.once(editButton, "click", lang.hitch(this, function () {

                topic.publish('egis/Guard/BeginInfoEdit', resource);
                mapPane.map.removeOverlay(feature.popup);
                feature.dsPoppup = null;
                feature.popup = null;

            }));
            btnArray.push(editButton);

            var markMapButton = new Button({
                label: "编辑"
            });
            on.once(markMapButton, "click", lang.hitch(this, function () {

                resource.SelectFeature = feature;

                topic.publish('egis/Guard/BeginMapEdit', resource);
                mapPane.map.removeOverlay(feature.popup);
                feature.dsPoppup = null;
                feature.popup = null;
                feature.isRegionEdit = true;

            }));
            btnArray.push(markMapButton);

            var deleteButton = new Button({
                label: "删除"
            });
            on.once(deleteButton, "click", lang.hitch(this, function () {

                var dialog = new Dialog({
                    title: '提示',
                    style: "width: 300px;height:160px;",
                    mode: ['ok', 'cancel'],
                    message: {
                        type: 'warn',
                        text: '确认删除保障点 [' + resource.Name + ']？'
                    }
                });
                dialog.okButton.on('click', lang.hitch(this, function () {

                    request.post("/Guard/DeleteGuardPoint", {
                        data: {
                            Id: resource.Id
                        },
                        handleAs: "json"
                    }).then(lang.hitch(this, function (data) {
                        topic.publish('egis/Guard/SaveGuardPoint', null);

                        mapPane.map.removeOverlay(feature.popup);
                        feature.dsPoppup = null;
                        feature.popup = null;
                    })
                   );
                }));
                dialog.show();

            }));
            btnArray.push(deleteButton);

            if (me.TASKSTATUS == "StartTask")
            {
                var sjhjButton = new Button({
                    label: "呼叫 " + resource.ZRLD
                });
                var me = this;
                on.once(sjhjButton, "click", lang.hitch(this, function () {

                    window.parent.window.dojo.publish('egis/MSG/CallMsg', { CallType: 'qz', CallerList: [{ CallNumber: appEnv.appConfig.GetCallNumber(resource.LXDH,"sj"), CallerName: resource.ZRLD, CallNumberType: 'sj' }] });
                    mapPane.map.removeOverlay(feature.popup);
                    feature.dsPoppup = null;
                    feature.popup = null;

                }));
                btnArray = new Array();
                btnArray.push(sjhjButton);
            }


            if (appEnv.appConfig.userManager != null) {
                if (appEnv.appConfig.userManager.isGranted("scoutHDBZ")) {
                    btnArray = [];
                }
            }
            var popup = new TableInfoPopup({
                title: "保障点信息",
                map: this.map,
                data: data,
                buttons: btnArray,
                LinkButtonString: null,
                detailClickHandler: null,
                enableDetail: false
            });
            popup.domNode.style.width = "280px";

            return popup;
        }

    });
});