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
'dijit/form/Button',
'egis/Modules/_Module',
'egis/appEnv',
'egis/Share/component/InfoPane/TableInfoPopup',
'egis/Share/component/ToolPane/MapTools',
'egis/Share/component/Dialog/Dialog',
'egis/Modules/Duty/component/RegionShowPane',
'egis/Modules/Duty/component/RegionEditPane',
'egis/Modules/Duty/component/SaveRegionPane',
'ol'

], function (declare, array, lang, aspect, JSON, topic, ready, request, on, Button, _Module, appEnv, TableInfoPopup,MapTools, Dialog, RegionShowPane, RegionEditPane, SaveRegionPane,ol) {
    return declare([_Module], {

        IsShowPane : true,

        constructor: function () {

        },

        startup: function () {

            var mapPane = appEnv.getCurrentPane();
            var me = this;

            topic.subscribe("egis/Map/Click", lang.hitch(this, function (evt) {
                if (!me.IsShowPane)
                {
                    return;
                }
                this.showRegionPane();
            }));

            topic.subscribe("egis/Duty/BeginEdit", lang.hitch(this, this.ShowBeginEditPane));

            topic.subscribe("egis/Duty/SaveInfoPane", lang.hitch(this, this.ShowInfoEditPane));

            topic.subscribe("egis/Duty/CancelEdit", lang.hitch(this, function () {
                var mapPane = appEnv.getCurrentPane();
                if (mapPane.scoutMapManager) {
                    mapPane.scoutMapManager.cacelFeatureEditable();
                };
            }));

            // 响应勤务排班查询
            topic.subscribe("egis/Duty/Region/ToMap", lang.hitch(this, function (paramObject) {

                if (paramObject.Requester.actionType == "/Duty/QueryByType")
                {
                    me.ShowRegions(paramObject.Requester, paramObject.ResultData);
                }
                

            }));

            topic.subscribe("egis/Map/Resource/SelectFeature", lang.hitch(this, this.ShowPopupInfo));

            ready(function () {
                if (!me.IsShowPane)
                {
                    return;
                }

                var tools = new MapTools({
                    id: 'tools',
                    style: 'position:absolute; right:10px; bottom:110px;padding: 0px;z-index: 100;'
                });
                mapPane.addFloatingPane(tools);

                topic.publish('egis/Duty/BeginEdit', null);
                //topic.publish("egis/Map/Locate", { Zoom: 9 });

            });
        },

        ShowInfoEditPane: function (item) {
            var mapPane = appEnv.getCurrentPane();
            if (mapPane.savePane == null) {
                mapPane.savePane = new SaveRegionPane({
                    title: '编辑地质危点',
                    style: "width: 480px;",
                    dockTo: mapPane.dockTo,
                    initPosition: 'lm',
                    closeTip: '关闭后查询结果将清除，是否确认关闭？',
                    item: item
                });

                aspect.after(mapPane.savePane, 'close', lang.hitch(this, function () {
                    mapPane.savePane = null;
                }));

                mapPane.addFloatingPane(mapPane.savePane);
            }
        },



        ShowBeginEditPane: function (item) {

            var mapPane = appEnv.getCurrentPane();
            if (mapPane.regionShowPane == null) {
                this.showRegionPane();
            }
            if (mapPane.regionEditPane == null) {
                mapPane.regionEditPane = new RegionEditPane({
                    title: '',
                    style: 'position:absolute;width:95px;height:350px',
                    dockTo: mapPane.dockTo,
                    initPosition: 'lm',
                    closeTip: '关闭后查询结果将清除，是否确认关闭？',
                    currentItem: item
                });

                aspect.after(mapPane.regionEditPane, 'close', lang.hitch(this, function () {
                    mapPane.regionEditPane = null;
                }));

                mapPane.addFloatingPane(mapPane.regionEditPane);
            }
            else {
                if (item != null) {
                    mapPane.regionEditPane.SetModifyRegion(item);
                }
                else {
                    mapPane.regionEditPane.currentItem = null;
                }
            }

        },



        showRegionPane: function () {
            var mapPane = appEnv.getCurrentPane();
            if (mapPane.regionShowPane == null) {
                mapPane.regionShowPane = new RegionShowPane({
                    title: '地质危点',
                    style: 'position:absolute; left:20px; top:120px; width:140px;height:300px',
                    dockTo: mapPane.dockTo,
                    //initPosition: 'lt',
                    closeTip: '关闭后查询结果将清除，是否确认关闭？'
                });

                aspect.after(mapPane.regionShowPane, 'close', lang.hitch(this, function () {
                    //this._hideRegion();
                    mapPane.regionShowPane = null;
                }));

                mapPane.addFloatingPane(mapPane.regionShowPane);
            }
        },


        ShowRegions: function (requester, resultData)
        {
            var paramObject = { LayerGroup: "网格管理", LayerId: "网格展示", RemoveType: "GROUP" };
            //先清空原先的标注点
            topic.publish("egis/Map/Remove", paramObject);

            for (var num = 0; num < resultData.length; num++) {

                var item = resultData[num];
                var geoArray = item.regionContent.split('~');
                for (var ii = 0; ii < geoArray.length; ii++) {
                    var infoArray = geoArray[ii].split('|');
                    if (infoArray.length == 2) {
                        var showName = "";
                        if (requester.paramObject.isShowName) {
                            showName = item.name;
                        }
                        if (infoArray[0] == "Point") {
                            var info = { LayerGroup: "网格管理", LayerId: "网格展示", Color: item.fillcolor, ShowText: showName, RegionContent: infoArray[1], Data : item };
                            topic.publish("egis/Map/DrawPoint", info);
                        }
                        else if (infoArray[0] == "LineString") {
                            var info = { LayerGroup: "网格管理", LayerId: "网格展示", Color: item.fillcolor, LineWidth: 4, ShowText: showName, RegionContent: infoArray[1], Data: item };
                            topic.publish("egis/Map/DrawLine", info);
                        }
                        else if (infoArray[0] == "Polygon") {
                            var info = { LayerGroup: "网格管理", LayerId: "网格展示", Color: item.fillcolor, LineWidth: 2, ShowText: showName, RegionContent: infoArray[1], Data: item };
                            topic.publish("egis/Map/DrawPolygon", info);
                        }
                        else if (infoArray[0] == "Circle") {
                            var info = { LayerGroup: "网格管理", LayerId: "网格展示", Color: item.fillcolor, LineWidth: 1, ShowText: showName, RegionContent: infoArray[1], Data: item };
                            topic.publish("egis/Map/DrawCircle", info);
                        }
                    }
                }
            }
        },

        ShowPopupInfo: function (paramObject)
        {
            if (paramObject.Feature && paramObject.Feature.Resource && paramObject.Feature.Resource.LayerGroup == "网格管理") {

            }
            else {
                return;
            }
            var feature = paramObject.Feature;
            var coord = paramObject.PopupPosition;
            var mapPane = appEnv.getCurrentPane();
            var olPopup = this.getResourcePopup(feature.Resource.Data, feature, mapPane);
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

        getResourcePopup: function (resource, feature, mapPane) {


            var data = [
                    { name: '名称', value: resource.name },
                    { name: '编号', value: resource.code },
                    { name: '单位', value: resource.orgName },
                    { name: "负责人", value: resource.zrld },
                    //{ name: "联系电话", value: resource.lxdh },
                    //{ name: "单位地址", value: resource.address },
                    { name: "巡检人员", value: resource.showxlry ? resource.showxlry.replace(new RegExp("~", "gm"), "<br>") : ""},
                    { name: "备注", value: resource.memo }
            ];

            var btnArray = new Array();
            var editButton = new Button({
                label: "信息编辑"
            });
            var me = this;
            on.once(editButton, "click", lang.hitch(this, function () {

                topic.publish('egis/Duty/SaveInfoPane', resource);
                mapPane.map.removeOverlay(feature.popup);
                feature.dsPoppup = null;
                feature.popup = null;

            }));
            btnArray.push(editButton);

            var markMapButton = new Button({
                label: "图形编辑"
            });
            on.once(markMapButton, "click", lang.hitch(this, function () {

                topic.publish('egis/Duty/BeginEdit', resource);
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
                        text: '确认删除图形 [' + resource.name + ']？'
                    }
                });
                dialog.okButton.on('click', lang.hitch(this, function () {

                    request.post("/duty/deleteRegion", {
                        data: {
                            id: resource.id
                        },
                        handleAs: "json"
                    }).then(lang.hitch(this, function (data) {
                        if(data.ok) {
                            topic.publish('egis/Duty/SaveRegion', null);
                            mapPane.map.removeOverlay(feature.popup);
                            feature.dsPoppup = null;
                            feature.popup = null;
                        }
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
                else {
                    if (!me.IsShowPane) {
                        btnArray = [];
                    }
                }
            }
            else {
                if (!me.IsShowPane) {
                    btnArray = [];
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
            popup.domNode.style.width = "350px";

            return popup;
        }


    });
});