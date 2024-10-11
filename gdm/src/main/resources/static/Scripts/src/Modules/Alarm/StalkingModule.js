define([
'dojo/_base/declare',
'dojo/_base/array',
'dojo/_base/lang',
'dojo/aspect',
'dojo/json',
'dojo/request/xhr',
"dojo/DeferredList",
'egis/Modules/_Module',
'egis/Modules/Alarm/component/Stalking/StalkingConditionPane',
'egis/appEnv',
"dijit/layout/ContentPane",
'dijit/layout/TabContainer',
'dojo/topic'
], function (declare, array, lang, aspect, JSON, xhr,DeferredList, _Module, StalkingConditionPane, appEnv, ContentPane, TabContainer, topic) {

    return declare([_Module], {
        clkHandler: null,
        popup: null,
        lon: null,
        lat: null,
        isClick: false,
        stalkingScale: 20000,
        constructor: function () {

        },
        startup: function () {

            var mySelf = this;
            topic.subscribe("egis/Stalking/Begin", lang.hitch(this, function (mapPane) {

                var paramObject = { LayerGroup: "堵控点", RemoveType: "GROUP" };
                //先清空原先的标注点
                topic.publish("egis/Map/Remove", paramObject);

                var markerInfo = { LayerGroup: "堵控点", LayerId: "堵控点", UsedType: "UseingForStalking", ImgUrl: "/Content/themes/blue/images/stalking/stalking.png" };
                topic.publish("egis/Map/BeginDrawMarker", markerInfo);

            }));


            topic.subscribe("egis/Map/DrawMarkerModifyEnd", lang.hitch(this, function (evt) {

                if (evt.UsedType == "UseingForStalking") {
                    var paramObject = { LayerGroup: "一键堵控", RemoveType: "GROUP" };
                    //先清空原先的标注点
                    topic.publish("egis/Map/Remove", paramObject);

                    mySelf.lon = evt.LonLat[0];
                    mySelf.lat = evt.LonLat[1];
                    mySelf.showStalkingPane(evt.LonLat[0], evt.LonLat[1]);
                }

            }));

            topic.subscribe("egis/Stalking/ReBlock", lang.hitch(this, function (evt) {

                var paramObject = { LayerGroup: "一键堵控", RemoveType: "GROUP" };
                //先清空原先的标注点
                topic.publish("egis/Map/Remove", paramObject);

                var mapPane = appEnv.getCurrentPane();
                this.queryJuction(mySelf.lon, mySelf.lat, mapPane.stalkingPane.timePursue_1.value * mapPane.stalkingPane.speed * mapPane.stalkingPane.constant, mapPane.stalkingPane.timePursue_2.value * mapPane.stalkingPane.speed * mapPane.stalkingPane.constant, mapPane.stalkingPane.timePursue_3.value * mapPane.stalkingPane.speed * mapPane.stalkingPane.constant, mapPane);

            }));

            topic.subscribe("egis/Stalking/ResourceShow", lang.hitch(this, function (args) {
                var mapPane = appEnv.getCurrentPane();
                mapPane.stalkingPane.removeTabContainer(args.type);
                var circleExtent = this.lon + "," + this.lat + "," + mapPane.stalkingPane.timePursue_3.value * mapPane.stalkingPane.speed * mapPane.stalkingPane.constant / 111194;
                if (args.type == "Video") {
                    var removeObject = { LayerGroup: "一键堵控", LayerId: "上图视频", RemoveType: "ID" };
                    topic.publish("egis/Map/Remove", removeObject);
                    if (args.checked == true) {
                        var paramObj = {
                            layersName: "Video",
                            actionType: "/Alarm/GetVideo",
                            actionExplain: "查询视频",
                            gisQueryType: "Circle",
                            gisQueryValue: circleExtent,
                            comdition: ""
                        };
                        var request = { getDataUrl: "/alarm/getVideoList",IsPostJson:true, LayerGroup: "一键堵控", LayerId: "上图视频", actionExplain: paramObj.actionExplain, actionType: paramObj.actionType, actionKey: "一键堵控查询", paramObject: paramObj };
                        topic.publish("egis/Map/Resource/GetVideo", request);
                        mapPane.stalkingPane.ShowResultGrid("Video", request.getDataUrl, request.paramObject, request.LayerGroup, request.LayerId);

                    }
                }

                if (args.type == "Police") {

                    var removeObject = { LayerGroup: "一键堵控", LayerId: "重点单位", RemoveType: "ID" };
                    topic.publish("egis/Map/Remove", removeObject);

                    if (args.checked == true) {
                        var paramObj = {
                            layersName: "data_zddw",
                            actionType: "/Alarm/GetDeviceResources",
                            actionExplain: "重点单位",
                            gisQueryType: "Circle",
                            gisQueryValue: circleExtent,
                            checkSTSD: true,
                            checkSTBD: false,
                            comdition: ""
                        };

                        var request = { getDataUrl: "/layer/getResources",IsPostJson:true, LayerGroup: "一键堵控", LayerId: "重点单位", actionExplain: paramObj.actionExplain, actionType: paramObj.actionType, actionKey: "一键堵控查询", paramObject: paramObj };
                        topic.publish("egis/Map/Resource/GetResource", request);
                        mapPane.stalkingPane.ShowResultGrid("Police", request.getDataUrl, request.paramObject, request.LayerGroup, request.LayerId);
                    }
                }

                if (args.type == "Detector") {

                    var removeObject = { LayerGroup: "一键堵控", LayerId: "物资存放点", RemoveType: "ID" };
                    topic.publish("egis/Map/Remove", removeObject);

                    if (args.checked == true) {
                        var paramObj = {
                            layersName: "data_wzcfd",
                            actionType: "/Alarm/GetDeviceResources",
                            actionExplain: "物资存放点",
                            gisQueryType: "Circle",
                            gisQueryValue: circleExtent,
                            checkSTSD: true,
                            checkSTBD: false,
                            comdition: ""
                        };
                        var request = { getDataUrl: "/layer/getResources",IsPostJson:true, LayerGroup: "一键堵控", LayerId: "物资存放点", actionExplain: paramObj.actionExplain, actionType: paramObj.actionType, actionKey: "一键堵控查询", paramObject: paramObj };
                        topic.publish("egis/Map/Resource/GetResource", request);
                        mapPane.stalkingPane.ShowResultGrid("Detector", request.getDataUrl, request.paramObject, request.LayerGroup, request.LayerId);
                    }
                }
            }));

        },



        showStalkingPane: function (lon,lat) {
            var mapPane = appEnv.getCurrentPane();
            if (!mapPane.stalkingPane) {
                mapPane.stalkingPane = new StalkingConditionPane({
                    title: '模拟发生',
                    style: 'left: 20px; top: 130px;width:320px;',
                    dockTo: mapPane.dockTo
                });

                mapPane.stalkingPane.tabContainer = new TabContainer({
                    style: "width:100%; height:300px;z-index:105;"
                }); 

                mapPane.stalkingPane.addChild(mapPane.stalkingPane.tabContainer);

                aspect.after(mapPane.stalkingPane, 'close', lang.hitch(this, function () {
                    if (mapPane.stalkingPane) {
                        mapPane.stalkingPane = null;
                    }
                    
                    var paramObject = { LayerGroup: "一键堵控", RemoveType: "GROUP" };
                    //先清空原先的标注点
                    topic.publish("egis/Map/Remove", paramObject);

                }));
                mapPane.addFloatingPane(mapPane.stalkingPane);
            }

            this.queryJuction(lon, lat, mapPane.stalkingPane.timePursue_1.value * mapPane.stalkingPane.speed * mapPane.stalkingPane.constant, mapPane.stalkingPane.timePursue_2.value * mapPane.stalkingPane.speed * mapPane.stalkingPane.constant, mapPane.stalkingPane.timePursue_3.value * mapPane.stalkingPane.speed * mapPane.stalkingPane.constant, mapPane);
        },


        queryJuction: function (lon, lat, radius_1, radius_2, radius_3, mapPane) {

            //三次堵控条件
            var options = {
                data: {
                    lon: lon,
                    lat: lat,
                    radius: radius_1
                },
                handleAs: 'json'
            };
            var options2 = {
                data: {
                    lon: lon,
                    lat: lat,
                    radius: radius_2
                },
                handleAs: 'json'
            };
            var options3 = {
                data: {
                    lon: lon,
                    lat: lat,
                    radius: radius_3
                },
                handleAs: 'json'
            };


            var paramObject = { LayerGroup: "一键堵控", LayerId: "第一层", Color: "#FF0000", Opacite: 0.3, LineWidth: 6, LineColor: "#FF0000", Radius: radius_1/ 111194, LonLat: [parseFloat(lon), parseFloat(lat)] };
            topic.publish("egis/Map/DrawCircle", paramObject);

            paramObject = { LayerGroup: "一键堵控", LayerId: "第二层",Color: "#FFFF00", Opacite: 0.3, LineWidth: 4, LineColor: "#FFFF00", Radius: radius_2/ 111194, LonLat: [parseFloat(lon), parseFloat(lat)] };
            topic.publish("egis/Map/DrawCircle", paramObject);

            paramObject = { LayerGroup: "一键堵控", LayerId: "第三层",Color: "#0000FF", Opacite: 0.3, LineWidth: 2, LineColor: "#0000FF", Radius: radius_3/ 111194, LonLat: [parseFloat(lon), parseFloat(lat)] };
            topic.publish("egis/Map/DrawCircle", paramObject);
            //显示堵控圈内资源
            if (mapPane.stalkingPane) {
                mapPane.stalkingPane.StalkingSourceShow();
            }
            return;

            //开始堵控请求
            var defs = new dojo.DeferredList([xhr.post('/Alarm/GetStalkingBy', options), xhr.post('/Alarm/GetStalkingBy', options2), xhr.post('/Alarm/GetStalkingBy', options3)]);
            defs.then(function (results) {
                if (results[0][0] && results[1][0] && results[2][0]) {
                    var r1 = results[0][1];
                    var r2 = results[1][1];
                    var r3 = results[2][1];

                    var firstLine = "";
                    $.each(r1, lang.hitch(this, function (index, c) {
                        if (firstLine != "")
                        {
                            firstLine += ",";
                        }
                        firstLine += c.X + "," + c.Y;
                    }));
                    var firstInfo = { LayerGroup: "一键堵控", LayerId: "第一层", Color: "#FF0000", LineWidth: 6, ShowText: "", RegionContent: firstLine };
                    topic.publish("egis/Map/DrawLine", firstInfo);

                    var sencondLine = "";
                    $.each(r2, lang.hitch(this, function (index, c) {
                        if (sencondLine != "") {
                            sencondLine += ",";
                        }
                        sencondLine += c.X + "," + c.Y;
                    }));
                    var sencondInfo = { LayerGroup: "一键堵控", LayerId: "第二层", Color: "#FFFF00", LineWidth: 4, ShowText: "", RegionContent: sencondLine };
                    topic.publish("egis/Map/DrawLine", sencondInfo);

                    var thirdLine = "";
                    $.each(r3, lang.hitch(this, function (index, c) {
                        if (thirdLine != "") {
                            thirdLine += ",";
                        }
                        thirdLine += c.X + "," + c.Y;
                    }));
                    var thirdInfo = { LayerGroup: "一键堵控", LayerId: "第三层", Color: "#0000FF", LineWidth: 2, ShowText: "", RegionContent: thirdLine };
                    topic.publish("egis/Map/DrawLine", thirdInfo);
 
                }
            });

            //显示堵控圈内资源
            if (mapPane.stalkingPane) {
                mapPane.stalkingPane.StalkingSourceShow();
            }
        }
    });
});