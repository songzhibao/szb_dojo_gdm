define([
'dojo/_base/declare',
'dojo/_base/array',
'dojo/_base/lang',
'dojo/aspect',
'dojo/json',
'dojo/topic',
'dojo/request',
"dojo/on",
"dojo/data/ItemFileWriteStore",
'dijit/Toolbar',
'dijit/form/Button',
"dijit/layout/TabContainer",
"dijit/layout/ContentPane",
"dojox/grid/EnhancedGrid",
"dojox/grid/enhanced/plugins/Filter",
"dojox/grid/enhanced/plugins/Pagination",
"dojox/grid/enhanced/plugins/IndirectSelection",
'egis/Modules/_Module',
'egis/Share/component/InfoPane/TableInfoPopup',
'egis/Modules/Alarm/component/SearchBox/SearchBoxPane',
'egis/Modules/Alarm/component/AlarmWrapperPane/AlarmWrapperPane',
'egis/Modules/Alarm/component/ResourceType/TypeCheckPane',
'egis/Modules/Alarm/component/PoliceSumShow/PoliceSumShowPane',
'egis/Modules/Alarm/component/PoliceSumShow/MiniPoliceSumShowPane',
'egis/Modules/Alarm/component/PoliceSumShow/PoliceSumPane',
'egis/Share/component/BaseWidget/BaseWrapperPane',
// 'egis/Share/component/ResourceSwitch/ResourceSwitchMapControl',
'egis/Share/component/ToolPane/MapToolList',
'egis/Share/component/ToolPane/MapTools',
'egis/Share/component/MapFloatPane/MapFixedPane',
'egis/Share/component/ResourceSelect/ResourceTreeControl',
"egis/Modules/Alarm/component/SearchBox/ListBoxPane",
"egis/Modules/Alarm/component/ManualMarke/ManualMarkePane",
'egis/appEnv',
'ol'

], function (declare, array, lang, aspect, JSON, topic, request, on, ItemFileWriteStore,Toolbar, Button, TabContainer, ContentPane, EnhancedGrid, Filter, Pagination, IndirectSelection,

    _Module, TableInfoPopup, SearchBoxPane, AlarmWrapperPane, TypeCheckPane, PoliceSumShowPane, MiniPoliceSumShowPane, PoliceSumPane, BaseWrapperPane, MapToolList, MapTools, MapFixedPane, ResourceTreeControl, ListBoxPane, ManualMarkePane, appEnv, ol) {
    return declare([_Module], {

        constructor: function () {

        },

        startup: function () {
            var me = this;
            var mapPane = appEnv.getCurrentPane();
            //if (mapPane != null)
            //{
            //    mapPane.map.addControl(new ResourceSwitchMapControl());
            //}
            // mapPane.SearchBoxPane = new SearchBoxPane({
            //     title: '地名搜索栏',
            //     style: 'position:absolute; left:30px; top:80px;padding: 0px;z-index: 100;'
            // });
            // mapPane.addFloatingPane(mapPane.SearchBoxPane);

            var toolPane = new MapToolList({
                id: 'tool-container',
                IsCheckPolice: false,
                IsCheckPoliceOnline: true,
                BelongModule : "Alarm",
                style: 'position:absolute; right:10px; top:130px;padding: 0px;'
            });
            mapPane.addFloatingPane(toolPane);
  
            var tools = new MapTools({
                id: 'tools',
                style: 'position:absolute; right:10px; bottom:110px;padding: 0px;z-index: 100;'
            });
            mapPane.addFloatingPane(tools);

            topic.subscribe("egis/Modules/Alarm/SearchBoxPress", lang.hitch(this, function (param) {
                var mapPane = appEnv.getCurrentPane();
                if (param.value == "") {
                    //显示快捷面板
                    if (mapPane != null && mapPane.FixPane) {
                        mapPane.FixPane.show();
                    }
                    else {
                        mapPane.FixPane = new MapFixedPane({
                            id: 'police-container',
                            style: "z-index:200;"
                        });

                        mapPane.FixTabContainer = new TabContainer({});
                        mapPane.FixTabContainer.on("click", lang.hitch(this, this._TabContainerClick));
                        mapPane.FixPane.addChild(mapPane.FixTabContainer);

                        mapPane.AlarmFixedPane = new ContentPane({
                            map: mapPane.map,
                            style: "width:100%; height:330px;",
                            title: '警力'
                        });
                        var requestParam = { actionType: "/Alarm/GetDeviceResources", limitNumber: 7, eventId: "" };
                        var policeLastPane = new AlarmWrapperPane({ requestParam: requestParam });
                        mapPane.AlarmFixedPane.addChild(policeLastPane);
                        mapPane.FixTabContainer.addChild(mapPane.AlarmFixedPane);

                        mapPane.AlamVideoPane = new ContentPane({
                            map: mapPane.map,
                            style: "width:100%; height:330px;",
                            title: '视频'
                        });
                        var requestParam = { actionType: "/Alarm/GetVideo", limitNumber: 7, eventId: "" };
                        var videoLastPane = new AlarmWrapperPane({ requestParam: requestParam });
                        mapPane.AlamVideoPane.addChild(videoLastPane);
                        mapPane.FixTabContainer.addChild(mapPane.AlamVideoPane);

                        //增加地理面板
                        mapPane.AlamGISPane = new ResourceTreeControl({
                            map: mapPane.map,
                            style: "width:100%; height:330px;",
                            title: '信息点'
                        });
                        var requestParam = { actionType: "/Alarm/SelectLike", limitNumber: 4, eventId: "" };
                        var infoLastPane = new AlarmWrapperPane({ requestParam: requestParam });
                        mapPane.AlamGISPane.addChild(infoLastPane);
                        mapPane.FixTabContainer.addChild(mapPane.AlamGISPane);
                        mapPane.addFloatingPane(mapPane.FixPane);
                    }
                }
                else {
                    if (mapPane != null && mapPane.SearchResultListPane) {
                        mapPane.SearchResultListPane.show(); 
                    }
                }
            }));

            topic.subscribe("egis/Modules/Alarm/SearchButtonClick", lang.hitch(this, function (param) {
                if (param.value == "") {
                    me.SelectResouseByType({ geoType: "like", geoVal: param.value, actionKey: "空值" });
                }
                else {
                    me.SelectResouseByType({ geoType: "like", geoVal: param.value, actionKey: param.value });
                }
            }));

            topic.subscribe("egis/Map/EndGeometryQuery", lang.hitch(this, function (evt) {

                var removeObject = null;
                var paramObj = null;
                if (!evt.geoType || !evt.geoVal)
                {
                    return;
                }
                evt.actionKey = "空间查询";
                me.SelectResouseByType(evt);

                //查询一次就取消查询状态
                if (mapPane.SearchBoxPane)
                {
                    mapPane.SearchBoxPane.ButtonCancel();
                }
            }));

            topic.subscribe("egis/Map/Click", lang.hitch(this, function (evt) {

                var mapPane = appEnv.getCurrentPane();
                if (mapPane != null && mapPane.resultGridPane != null) {
                    mapPane.resultGridPane.minimize();
                }
                //if (mapPane != null && mapPane.FixPane) {
                //    mapPane.FixPane.hide();
                //}
            }));

            topic.subscribe("egis/Map/Resource/SelectFeature", lang.hitch(this, this.ShowPopupInfo));

            topic.subscribe("egis/Map/GEO/SelectFeature", lang.hitch(this, this.ShowGeoPopupInfo));

            //订阅资源变化    
            //topic.subscribe("egis/Map/Resource/ShowDLZY", lang.hitch(this, this.ShowResourceLayer));

            //开始框选查询    
            topic.subscribe("egis/Map/BeginExtentDraw", lang.hitch(this, this.ShowResourceGridPane));

            //框选查询    
            topic.subscribe("egis/Map/EndExtentDraw", lang.hitch(this, this.ShowResourceGrid));

            topic.subscribe("egis/Alarm/ShowResultGrid", lang.hitch(this, function (request) {

                if (request.actionType == "/Alarm/GetVideo")
                {
                    me.ShowResultGrid("Video", request.getDataUrl, request.paramObject, request.LayerGroup, request.LayerId);
                }
                else if (request.actionType == "/Alarm/SelectLike") {
                    var param = {
                        layersNameList: request.paramObject.layersName,
                        selectType: request.paramObject.selectType,
                        selectVal: request.paramObject.selectVal,
                        comdition: ""
                    };
                    me.ShowResultGrid("GIS", "/Alarm/GetResourcesListToGrid", param, request.LayerGroup, null);
                }
                else if (request.actionType == "/Alarm/GetDeviceResources") {
                    me.ShowResultGrid("Police", request.getDataUrl, request.paramObject, request.LayerGroup, request.LayerId);
                }

            }));


            topic.subscribe("egis/Manual/MarkMySlef", lang.hitch(this, function (caseInfo) {

                if (caseInfo.Lon == null || caseInfo.Lon == "" || caseInfo.Lon == 0 || caseInfo.Lat == null || caseInfo.Lat == "" || caseInfo.Lat == 0) {
                    topic.publish("egis/messageNotification", { type: "info", text: "操作提示:警情无坐标，请手动定位!" });
                }
                else {
                    topic.publish("egis/Map/Locate", { Lon: caseInfo.Lon, Lat: caseInfo.Lat, Zoom: 9 });
                }

                var mapPane = appEnv.getCurrentPane();
                if (mapPane.manualPane == null) {
                    mapPane.manualPane = new ManualMarkePane({
                        title: '手动定位',
                        style: 'position:absolute; left:360px; top:200px; width:380px;height:500px',
                        dockTo: mapPane.dockTo,
                        initPosition: 'lt',
                        closeTip: '关闭后查询结果将清除，是否确认关闭？'
                    });

                    aspect.after(mapPane.manualPane, 'close', lang.hitch(this, function () {
                        mapPane.manualPane = null;
                        var paramObject = { LayerGroup: "报警定位", RemoveType: "GROUP" };
                        //先清空原先的标注点
                        topic.publish("egis/Map/Remove", paramObject);

                    }));
                    mapPane.addFloatingPane(mapPane.manualPane);
                }
                mapPane.manualPane.AddManualCase(caseInfo);

            }));

            var fun = function () {
                //if (currentLocateCase.CaseLonX != "") {
                //    topic.publish("egis/Map/Locate", { Lon: currentLocateCase.CaseLonX, Lat: currentLocateCase.CaseLatY, Zoom: 17 });
                //}
                me.createPoliceSumShowPane();
            }
            //window.setTimeout(fun, 2000);
        },


        showPoliceSumPane: function () {
            var mapPane = appEnv.getCurrentPane();
            if (mapPane.policeSumPane == null) {
                mapPane.policeSumPane = new PoliceSumPane({
                    title: '警力报备',
                    style: 'position:absolute; left:200px; top:150px; width:800px; height:600px; z-index:100;',
                    dockable: false//,
                    //initPosition: 'mm'
                });
                aspect.after(mapPane.policeSumPane, 'close', lang.hitch(this, function () {
                    mapPane.policeSumPane = null;
                }));
                mapPane.addFloatingPane(mapPane.policeSumPane);
            }
        },

        createPoliceSumShowPane: function () {
            var mapPane = appEnv.getCurrentPane();
            if (mapPane.policeSumShowPane == null) {
                mapPane.policeSumShowPane = new PoliceSumShowPane({
                    displayName: appEnv.appConfig.orgRootName
                });
                mapPane.addFloatingPane(mapPane.policeSumShowPane);

                on(mapPane.policeSumShowPane.maximizeButton, "click", lang.hitch(this, function () {
                    this.showPoliceSumPane();
                }));

                on(mapPane.policeSumShowPane.minimizeButton, "click", lang.hitch(this, function () {
                    if (mapPane.policeSumShowPane) {
                        $(mapPane.policeSumShowPane.domNode).css('display', 'none');
                    }

                    if (mapPane.miniPoliceSumShowPane) {
                        $(mapPane.miniPoliceSumShowPane.domNode).css('display', 'block');
                    }
                }));
            }

            if (mapPane.miniPoliceSumShowPane == null) {
                mapPane.miniPoliceSumShowPane = new MiniPoliceSumShowPane();
                $(mapPane.miniPoliceSumShowPane.domNode).css('display', 'none');

                mapPane.addFloatingPane(mapPane.miniPoliceSumShowPane);

                on(mapPane.miniPoliceSumShowPane.domNode, "click", lang.hitch(this, function () {
                    if (mapPane.miniPoliceSumShowPane) {
                        $(mapPane.miniPoliceSumShowPane.domNode).css('display', 'none');
                    }

                    if (mapPane.policeSumShowPane) {
                        $(mapPane.policeSumShowPane.domNode).css('display', 'block');
                    }
                }));
            }

            topic.subscribe("egis/Alarm/SumShowUpdate", lang.hitch(this, function (data) {

                var mapPane = appEnv.getCurrentPane();
                if (mapPane.policeSumShowPane != null) {
                    mapPane.policeSumShowPane.update(data);
                }

            }));

        },


        SelectResouseByType : function(evt)
        {
            var mapPane = appEnv.getCurrentPane();
            if (mapPane.FixTabContainer) {
                var pane = mapPane.FixTabContainer.selectedChildWidget;
                if (pane.title == "视频") {
                    removeObject = { LayerGroup: "视频监控", RemoveType: "GROUP" };
                    topic.publish("egis/Map/Remove", removeObject);

                    paramObj = {
                        layersName: "Video",
                        actionType: "/Alarm/GetVideo",
                        actionExplain: "查询视频",
                        selectType: evt.geoType,
                        selectVal: evt.geoVal,
                        comdition: ""
                    };
                    var request = { getDataUrl: "/Alarm/GetResources", LayerGroup: "视频监控", LayerId: "上图视频", actionExplain: paramObj.actionExplain, actionType: paramObj.actionType, actionKey: evt.actionKey, paramObject: paramObj };
                    topic.publish("egis/Map/Resource/GetVideo", request);
                    this.ShowResultGrid("Video", request.getDataUrl, request.paramObject, request.LayerGroup, request.LayerId);
                    return;
                }
                else if (pane.title == "信息点") {
                    var checkList = mapPane.AlamGISPane.getChecked();
                    if (checkList == null || checkList.length <= 0) {
                        topic.publish("egis/messageNotification", { type: "info", text: "请先购选查询图层！" });
                        return;
                    }
                    var layerGroup = "资源展现";
                    removeObject = { LayerGroup: layerGroup, RemoveType: "GROUP" };
                    topic.publish("egis/Map/Remove", removeObject);

                    var nameList = "";
                    for (var num = 0; num < checkList.length; num++) {
                        if (!checkList[num].DisplayField || !checkList[num].name || !checkList[num].type) {
                            continue;
                        }
                        var paramObj = {
                            layersName: checkList[num].name,
                            selectType: evt.geoType,
                            selectVal: evt.geoVal,
                            comdition: ""
                        };
                        if (nameList != "") {
                            nameList += ",";
                        }
                        nameList += checkList[num].name;
                        var requester = { getDataUrl: "/Alarm/QueryOneLayerResourcesByGeoJSON", actionExplain: "查询信息", actionType: "/Alarm/SelectLike", actionKey: evt.actionKey, paramObject: paramObj, LayerGroup: layerGroup, LayerId: paramObj.layersName };
                        topic.publish("egis/Map/Resource/GeoJson", requester);
                    }

                    var param = {
                        layersNameList: nameList,
                        selectType: evt.geoType,
                        selectVal: evt.geoVal,
                        comdition: ""
                    };
                    this.ShowResultGrid("GIS", "/Alarm/GetResourcesListToGrid", param, layerGroup, null);
                    return;
                }
            }

            removeObject = { LayerGroup: "警力上图", RemoveType: "GROUP" };
            topic.publish("egis/Map/Remove", removeObject);

            paramObj = {
                layersName: "Police",
                actionType: "/Alarm/GetDeviceResources",
                actionExplain: "查询警力",
                selectType: evt.geoType,
                selectVal: evt.geoVal,
                checkSTSD: true,
                checkSTBD : false,
                comdition: ""
            };
            var request = { getDataUrl: "/Alarm/GetResources", LayerGroup: "警力上图", LayerId: "上图警力", actionExplain: paramObj.actionExplain, actionType: paramObj.actionType, actionKey: evt.actionKey, paramObject: paramObj };
            topic.publish("egis/Map/Resource/GetResource", request);
            this.ShowResultGrid("Police", request.getDataUrl, request.paramObject,request.LayerGroup,request.LayerId);
        },


        _TabContainerClick : function(evt)
        {
            var mapPane = appEnv.getCurrentPane();
            if (mapPane && mapPane.FixTabContainer) {
                var pane = mapPane.FixTabContainer.selectedChildWidget;
                if (pane)
                {
                    if (pane.title == "视频")
                    {
                        mapPane.SearchBoxPane.changePlaceHolder("搜视频编号、名称");
                    }
                    else if (pane.title == "信息点") {
                        mapPane.SearchBoxPane.changePlaceHolder("搜地名、查道路、找单位");
                    }
                    else {
                        mapPane.SearchBoxPane.changePlaceHolder("搜设备编号、名称");
                    }
                }
            }
        },
        

        //ShowResourceLayer : function(paramObject)
        //{
        //    if (paramObject.name && paramObject.name != "layers")
        //    {
        //        if (paramObject.checked == true) {
        //            var paramObj = {
        //                layersName: paramObject.name,
        //                selectType: "like",
        //                selectVal: "",
        //                comdition: paramObject.comdition
        //            };
        //            var requester = { getDataUrl: "/Alarm/QueryOneLayerResourcesByGeoJSON", actionExplain: "资源图层切换", actionType: "/Resource/LayerChange", paramObject: paramObj, LayerGroup: "资源展现", LayerId: paramObject.MC };
        //            topic.publish("egis/Map/Resource/GeoJson", requester);
        //        }
        //        else {
        //            var paramObj = { LayerGroup: "资源展现", LayerId: paramObject.MC, RemoveType: "HIDE" };
        //            //先清空原先的标注点
        //            topic.publish("egis/Map/Remove", paramObj);
        //        }
        //    }
        //},

        ShowGeoPopupInfo: function (paramObject) {
            var feature = paramObject.Feature;
            if (!feature.Resource || !feature.Resource.name)
            {
                return;
            }
            var coord = paramObject.PopupPosition;
            var mapPane = appEnv.getCurrentPane();
            var olPopup = null;
            if (feature.Resource && (feature.Resource.LayerId == "上图工程车" || feature.Resource.LayerId == "DS_GPS_OTHER")) {
                olPopup = this.getProjectCarGeoPopup(feature.Resource, feature, mapPane);
            }
            else if (feature.Resource && (feature.Resource.LayerId == "上图卡口" || feature.Resource.LayerId == "DS_DETECTOR_SITE")) {
                olPopup = this.getDetectorGeoPopup(feature.Resource, feature, mapPane);
            }
            else {
                olPopup = this.getGeoPopup(feature.Resource, feature, mapPane);
            }
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

        getDetectorGeoPopup : function (resource, feature, mapPane) {

            var data = [
                    { name: '编号', value: resource.id },
                    { name: '名称', value: resource.name },
                    { name: '经度', value: resource.lonx },
                    { name: "纬度", value: resource.laty },
                    { name: "备注", value: resource.discription }
            ];

            var btnArray = new Array();

            var ssbfButton = new Button({
                label: "实时过车"
            });
            on.once(ssbfButton, "click", lang.hitch(this, function () {

                topic.publish("egis/detector/CarRealTime", resource);
                mapPane.map.removeOverlay(feature.popup);
                feature.dsPoppup = null;
                feature.popup = null;

            }));
            btnArray.push(ssbfButton);

            var lscxButton = new Button({
                label: "历史查询"
            });
            on.once(lscxButton, "click", lang.hitch(this, function () {

                topic.publish("egis/detector/CarHistory", resource);
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
        },


        getProjectCarGeoPopup: function (resource, feature, mapPane) {

            var data = [
                    { name: '编号', value: resource.id },
                    { name: '名称', value: resource.name },
                    { name: '单位', value: resource.ORG_NAME },
                    { name: '经度', value: resource.lonx },
                    { name: "纬度", value: resource.laty },
                    { name: "速度", value: resource.SPEED },
                    { name: "时间", value: resource.GPS_TIME },
                    { name: "备注", value: resource.discription }
            ];

            var btnArray = new Array();

            var gjgzButton = new Button({
                label: feature.IsOpenGZ ? "停止跟踪" : "轨迹跟踪"
            });
            on.once(gjgzButton, "click", lang.hitch(this, function () {

                if (feature.IsOpenGZ) {
                    feature.IsOpenGZ = false;
                }
                else {
                    feature.IsOpenGZ = true;
                }
                topic.publish("egis/other/ShowFollowLine", { gpsId: resource.CODE, IsOpenGZ: feature.IsOpenGZ });
                mapPane.map.removeOverlay(feature.popup);
                feature.dsPoppup = null;
                feature.popup = null;

            }));
            btnArray.push(gjgzButton);

            var gjboButton = new Button({
                label: "轨迹播放"
            });
            on.once(gjboButton, "click", lang.hitch(this, function () {

                appEnv.appConfig.ShowMutiPath(resource, false, "/Content/themes/blue/images/GCC_ZX.png");

                mapPane.map.removeOverlay(feature.popup);
                feature.dsPoppup = null;
                feature.popup = null;

            }));
            btnArray.push(gjboButton);

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


        ShowPopupInfo: function (paramObject)
        {
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

        getPoliceResourcePopup : function (resource, feature, mapPane) {

            var orgName = "";
            var me = this;
            if(resource.Organization)
            {
                orgName = resource.Organization.Name;
            }

            var data = [
                    { name: '名称', value: resource.SHOWTEXT },
                    { name: '编号', value: resource.CODE },
                    { name: '单位', value: orgName },
                    { name: "职务", value: resource.ZW },
                    { name: "状态", value: this.getPoliceStateText(resource.DUTY_STATUS) },
                    { name: "联系电话", value: resource.PhoneNum },
                    { name: "定位时间", value:  resource.GPS_TIME ? resource.GPS_TIME.replace("T", " ") || '' : '无' }
            ];

            var btnArray = new Array();

            var gjgzButton = new Button({
                label: feature.IsOpenGZ ? "停止跟踪" : "轨迹跟踪"
            });
            on.once(gjgzButton, "click", lang.hitch(this, function () {

                if (feature.IsOpenGZ) {
                    feature.IsOpenGZ = false;
                }
                else {
                    feature.IsOpenGZ = true;
                }
                topic.publish("egis/Map/ShowFollowLine", { gpsId: resource.CODE, IsOpenGZ: feature.IsOpenGZ });
                mapPane.map.removeOverlay(feature.popup);
                feature.dsPoppup = null;
                feature.popup = null;

            }));
            btnArray.push(gjgzButton);

            var gjboButton = new Button({
                label: "轨迹播放" 
            });
            on.once(gjboButton, "click", lang.hitch(this, function () {

                appEnv.appConfig.ShowMutiPath(resource,false, "/Content/themes/blue/images/police/交警-正常.png");

                mapPane.map.removeOverlay(feature.popup);
                feature.dsPoppup = null;
                feature.popup = null;

            }));
            btnArray.push(gjboButton);

            if (resource.DEVICETYPE == "car_122") {
                var sjspButton = new Button({
                    label: "4G视频"
                });
                on.once(sjspButton, "click", lang.hitch(this, function () {

                    appEnv.appConfig.ShowCarVideo(resource);

                    mapPane.map.removeOverlay(feature.popup);
                    feature.dsPoppup = null;
                    feature.popup = null;
                }));
                btnArray.push(sjspButton);
            }
            else {
                var sjhjButton = new Button({
                    label: "呼叫手机"
                });
                on.once(sjhjButton, "click", lang.hitch(this, function () {

                    window.parent.window.dojo.publish('egis/MSG/CallMsg', { CallType: 'qz', CallerList: [{ CallNumber: appEnv.appConfig.GetCallNumber(resource.PhoneNum, "sj"), CallerName: resource.SHOWTEXT, CallNumberType: 'sj' }] });
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
                    { name: '名称', value: resource.name },
                    { name: '编号', value: resource.code },
                    { name: '经度', value: resource.lon },
                    { name: "纬度", value: resource.lat }
            ];

            var btnArray = new Array();
            var bfButton = new Button({
                label: "播放"
            });
            var me = this;
            on.once(bfButton, "click", lang.hitch(this, function () {

                appEnv.appConfig.ShowVideo(resource.code);
                mapPane.map.removeOverlay(feature.popup);
                feature.dsPoppup = null;
                feature.popup = null;
                return;

            }));
            btnArray.push(bfButton);

            var lsButton = new Button({
                label: "历史视频"
            });
            var me = this;
            on.once(lsButton, "click", lang.hitch(this, function () {

                appEnv.appConfig.ShowLSVideo(resource.code);
                mapPane.map.removeOverlay(feature.popup);
                feature.dsPoppup = null;
                feature.popup = null;
                return;

            }));
            btnArray.push(lsButton);


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


        ShowResultGrid: function (type, url, param,LayerGroup,LayerId) {

            var mapPane = appEnv.getCurrentPane();        
            request.post(url, {
                data: param,
                handleAs: "json"
            }).then(lang.hitch(this, function (data) {


                if (mapPane != null && mapPane.FixPane) {
                    mapPane.FixPane.hide();
                }
                if (mapPane.resultGridPane) {
                    if (mapPane.resultGridPane.LayerGroup == LayerGroup) {
                        mapPane.resultGridPane.close();
                        mapPane.resultGridPane = null;
                    }
                    else {
                        mapPane.resultGridPane.minimize();
                    }
                }

                if (data != null && data.length > 0) {
                    var param = {
                        title: LayerGroup + "[" + data.length + "]",
                        dockTo: mapPane.dockTo,
                        dockable: true,
                        LayerGroup: LayerGroup,
                        LayerId: LayerId,
                        mapPane: mapPane                        
                    };
                    //if (mapPane.FixPane && mapPane.FixPane.IsShow())
                    //{
                    //    param.style = "position:absolute; left:30px; top:440px; width:280px; z-index:100";
                    //}
                    mapPane.resultGridPane = new MapFixedPane(param);

                    mapPane.resultTabContainer = new TabContainer({
                        style: "width:100%; height:330px;z-index:105;"
                    });

                    mapPane.resultGridPane.addChild(mapPane.resultTabContainer);
                    mapPane.addFloatingPane(mapPane.resultGridPane);

                    this.buildGridPane(mapPane.resultTabContainer, data, type, LayerGroup, LayerId);
                }
            }));
        },


        //显示框选资源查询结果
        ShowResourceGrid: function (extent) {
            
            var mapPane = appEnv.getCurrentPane();
        
            var types = mapPane.resourceTypeSelectPane.getCheckedTypes();
            for (var i = 0; i < types.length; i++) {
                //上图
                this.GetResourceToMap(extent, types[i]);
                request.post("/Alarm/GetResources", {
                    data: {
                        layersName: types[i],
                        selectType: "extent",
                        selectVal: extent.left + "," + extent.top + "," + extent.right + "," + extent.bottom,
                        comdition: ""
                    },
                    handleAs: "json"
                }).then(lang.hitch(this, function (data) {

                    if (data != null && data.length > 0)
                    {
                        var type = "Video";
                        var LayerGroup = "框选查询";
                        var LayerId = "上图视频";
                        if (data[0].DEVICETYPE)
                        {
                            type = "Police";
                            LayerGroup = "框选查询";
                            LayerId = "上图警力";
                        }
                        this.buildGridPane(mapPane.resourceTabContainer, data, type, LayerGroup, LayerId);
                    }
                }));
            }
        },

        buildGridPane: function (tabContainer, data, type, LayerGroup, LayerId) {

            if (!data.length || data.length == 0) {
                return;
            }
            var gridData = this._buildGridData(data,type);
            var pane = new ContentPane({
                title: gridData.title
            });
            var plugin = { indirectSelection: { headerSelector: true, width: "18px" } };
            var grid = new EnhancedGrid({
                structure: gridData.layout,
                style: "width:100%; height:220px;",
                plugins: plugin
            }, document.createElement("div"));
            grid.startup();
            grid.setStore(gridData.store);

            //添加工具条
            var toolBar = new Toolbar({}, "toolbar");

            //if (type == "Police") {
            //    var buttonSchedul = this.BuildSchedulButton(grid, type);
            //    toolBar.addChild(buttonSchedul);
            //}
            //if (type == "man") {
            //    var sendSmsButton = this.BuildSmsButton(grid, type);
            //    toolBar.addChild(sendSmsButton);

            //    var buttonSchedul = this.BuildSchedulButton(grid, type);
            //    toolBar.addChild(buttonSchedul);
            //}
            //if (type == "video") {
            //    var videoButton = this.BuildVideoButton(grid, type);
            //    toolBar.addChild(videoButton);
            //}
            //if (type == "detector") {
            //    var videoButton = this.BuildDetectorVideoButton(grid, type);
            //    toolBar.addChild(videoButton);

            //    var passButton = this.BuildDetectorPassButton(grid, type);
            //    toolBar.addChild(passButton);
            //}
            //if (toolBar.hasChildren()) {
            //    pane.addChild(toolBar);
            //}

            pane.addChild(grid);
            tabContainer.addChild(pane);

            grid.on("cellClick", lang.hitch(this, function (e) {
                //若第一列不能有点击事件则取消定位
                if (e.cellIndex == 0) return;

                var item = grid.getItem(e.rowIndex);
                topic.publish("egis/Map/Locate", { Lon: item.lon, Lat: item.lat });

            }));

            grid.on("rowmouseover", lang.hitch(this, function (e) {
                var item = grid.getItem(e.rowIndex);
                if (!item || !item.lon || !item.lat) return;

                topic.publish("egis/Map/UpdateScale", { LayerGroup: LayerGroup, LayerId: LayerId, Code: item.BH[0], Scale: 1.5 });
            }));

            grid.on("rowmouseout", lang.hitch(this, function (e) {
                var item = grid.getItem(e.rowIndex);
                if (!item || !item.lon || !item.lat) return;
                topic.publish("egis/Map/UpdateScale", { LayerGroup: LayerGroup, LayerId: LayerId, Code: item.BH[0], Scale: 1 });
            }));
        },

        _buildGridData: function (data,type) {
            var layout, title, store;

            if (type == "Police") {
                title = "警力[" + data.length + "]";
                layout = [{
                    name: '名称',
                    field: 'MC',
                    width: "30%"
                }, {
                    name: '所属机构',
                    field: 'orgName',
                    width: "35%"
                }, {
                    name: '编号',
                    field: 'BH',
                    width: "30%"
                }];
                var items = [];
                for (var i = 0; i < data.length; i++) {
                    var orgName = " ";
                    if (data[i].Organization) {
                        orgName = data[i].Organization.Name;
                    }
                    items.push({
                        id: data[i].ID,
                        MC: data[i].SHOWTEXT,
                        orgName: orgName,
                        BH: data[i].CODE,
                        lon: data[i].LON,
                        lat: data[i].LAT
                    });
                }

                store = new ItemFileWriteStore({
                    data: {
                        identifier: "id",
                        items: items
                    }
                });

            } else if (type == "Video") {
                title = "视频[" + data.length + "]";
                layout = [{
                    name: '名称',
                    field: 'MC',
                    width: "60%"
                }, {
                    name: '编号',
                    field: 'BH',
                    width: "40%"
                }];
                var items = [];
                for (var i = 0; i < data.length; i++) {
                    var orgName = "";
                    if (data[i].Organization) {
                        orgName = data[i].Organization.Name;
                    }
                    items.push({
                        id: data[i].Id,
                        MC: data[i].Name,
                        orgName: orgName,
                        BH : data[i].Code,
                        Address: data[i].Address,
                        lon: data[i].LON,
                        lat: data[i].LAT
                    });
                }
                store = new ItemFileWriteStore({
                    data: {
                        identifier: "id",
                        items: items
                    }
                });

            } else if (type == "GIS") {
                title = "地理[" + data.length + "]";
                layout = [{
                    name: '名称',
                    field: 'MC',
                    width: "60%"
                }, {
                    name: '编号',
                    field: 'BH',
                    width: "40%"
                }];
                var items = [];
                for (var i = 0; i < data.length; i++) {
                    items.push({
                        id: data[i].id,
                        MC: data[i].name,
                        BH: data[i].id,
                        lon: data[i].lonx,
                        lat: data[i].laty
                    });
                }
                store = new ItemFileWriteStore({
                    data: {
                        identifier: "id",
                        items: items
                    }
                });

            } else if (type == "Detector") {
                title = "卡口点";
                layout = [{
                    name: '名称',
                    field: 'name',
                    width: "30%"
                }, {
                    name: '所属机构',
                    field: 'orgName',
                    width: "35%"
                }, {
                    name: '编号',
                    field: 'code',
                    width: "30%"
                }];
                var items = [];
                for (var i = 0; i < data.length; i++) {
                    var orgName = " ";
                    if (data[i].Data.DutyOrg) {
                        orgName = data[i].Data.DutyOrg.Name;
                    }
                    items.push({
                        id: data[i].Id,
                        name: data[i].Data.Name,
                        orgName: orgName,
                        code: data[i].Data.Code,
                        lon: data[i].Location.X,
                        lat: data[i].Location.Y
                    });
                }
                store = new ItemFileWriteStore({
                    data: {
                        identifier: "id",
                        items: items
                    }
                });

            } else if (type == "Block") {
                title = "堵控点";
                layout = [{
                    name: '类型名称',
                    field: 'name',
                    width: "30%"
                }, {
                    name: '所属机构',
                    field: 'orgName',
                    width: "35%"
                }, {
                    name: '编号',
                    field: 'code',
                    width: "30%"
                }];
                var items = [];
                for (var i = 0; i < data.length; i++) {
                    var orgName = " ";
                    if (data[i].Data.Organization) {
                        orgName = data[i].Data.Organization.Name;
                    }
                    items.push({
                        id: data[i].Id,
                        name: data[i].Data.Name,
                        orgName: orgName,
                        code: data[i].Data.Code,
                        lon: data[i].Location.X,
                        lat: data[i].Location.Y
                    });
                }
                store = new ItemFileWriteStore({
                    data: {
                        identifier: "id",
                        items: items
                    }
                });

            } else {
                title = "无资源";
                layout = [{
                    name: '无',
                    field: 'default',
                    width: "15%"
                }];
            }
            return {
                layout: layout,
                title: title,
                store: store
            };
        },


        GetResourceToMap: function (extent, type) {

            var paramObject = { LayerGroup: "框选查询", RemoveType: "GROUP" };
            //先清空原先的标注点
            topic.publish("egis/Map/Remove", paramObject);

            if (type == "Police") {
                //获取周边警力资源
                var paramObj = {
                    layersName: "Police",
                    actionType: "/Alarm/GetPolice",
                    actionExplain: "框选警力资源",
                    selectType: "extent",
                    selectVal: extent.left + "," + extent.top + "," + extent.right + "," + extent.bottom,
                    checkSTSD: true,
                    checkSTBD: false,
                    comdition: ""
                };
                var requester = { getDataUrl: "/Alarm/GetResources", LayerGroup: "框选查询", LayerId: "上图警力", actionExplain: paramObj.actionExplain, actionType: paramObj.actionType, paramObject: paramObj };
                topic.publish("egis/Map/Resource/GetResource", requester);
            }
            if (type == "Video") {
                //获取周边视频资源
                var paramObj = {
                    layersName: "Video",
                    actionType: "/Alarm/GetVideo",
                    actionExplain: "框选视频资源",
                    selectType: "extent",
                    selectVal: extent.left + "," + extent.top + "," + extent.right + "," + extent.bottom,
                    comdition: ""
                };
                var requester = { getDataUrl: "/Alarm/GetResources", LayerGroup: "框选查询", LayerId: "上图视频", actionExplain: paramObj.actionExplain, actionType: paramObj.actionType, paramObject: paramObj };
                topic.publish("egis/Map/Resource/GetVideo", requester);
            }
        },

        ShowResourceGridPane: function () {

            var mapPane = appEnv.getCurrentPane();
            if (mapPane.resultGridPane) {
                if (mapPane.resultGridPane.LayerGroup == "框选查询") {
                    mapPane.resultGridPane.close();
                    mapPane.resultGridPane = null;
                }
                else {
                    mapPane.resultGridPane.minimize();
                }
            }

            mapPane.resultGridPane = new MapFixedPane({
                title: "框选查询",
                dockTo: mapPane.dockTo,
                dockable: true,
                LayerGroup: "框选查询",
                LayerId: null,
                mapPane: mapPane
                //style: "position:absolute; left:300px; top:200px; width:400px; z-index:100"
            });
            mapPane.resourceTypeSelectPane = new TypeCheckPane({
                style: "width:100%; height:60px;z-index:105;"
            });
            mapPane.resultGridPane.addChild(mapPane.resourceTypeSelectPane);

            mapPane.resourceTabContainer = new TabContainer({
                style: "width:100%; height:300px;z-index:105;"
            });

            mapPane.resultGridPane.addChild(mapPane.resourceTabContainer);
            mapPane.addFloatingPane(mapPane.resultGridPane);

        }


    });
});