define([
'dojo/_base/declare',
'dojo/_base/array',
'dojo/_base/lang',
'dojo/aspect',
'dojo/window',
'dojo/json',
'dojo/topic',
'egis/Modules/_Module',
'egis/Map/Manager/ResourceMapManager',
'egis/appEnv',
'ol'

], function (declare, array, lang, aspect,win, JSON, topic, _Module, ResourceMapManager, appEnv, ol) {
    return declare([_Module], {

        //绘制资源句柄
        ResourceMapManager: null,

        constructor: function () {

        },


        startup: function () {

            var mapPane = appEnv.getCurrentPane();
            this.ResourceMapManager = new ResourceMapManager({
                map: mapPane.map
            });


            //响应资源上图
            topic.subscribe("egis/Map/Resource/GetResource/ToMap", lang.hitch(this, function (paramObject) {

                this.ResourceMapManager.addListMarker(paramObject.Requester.LayerGroup, paramObject.Requester.LayerId, paramObject.ResultData, paramObject.Requester.paramObject.checkSTSD, paramObject.Requester.paramObject.checkSTBD);

            }));

            //响应警情上图
            topic.subscribe("egis/Map/Resource/GetCase/ToMap", lang.hitch(this, function (paramObject) {

                this.ResourceMapManager.addCaseMarker(paramObject.Requester.LayerGroup, paramObject.Requester.LayerId, paramObject.ResultData, paramObject.Requester.checkSD, paramObject.Requester.checkRD);

            }));

            //响应四色预警上图
            topic.subscribe("egis/Map/Resource/ShowSSYJ/ToMap", lang.hitch(this, function (paramObject) {

                var prewarningItems = paramObject.ResultData;
                for (var i = 0; i < prewarningItems.length; i++) {
                    if (prewarningItems[i].boundary == null) {
                        continue;
                    }
                    for (var k = 0; k < prewarningItems[i].boundary.length; k++) {
                        var polygon = prewarningItems[i].boundary[k].Polygon;
                        var pointList = [];
                        for (var j = 0; j < polygon.length; j++) {
                            var newPoint = [polygon[j].X, polygon[j].Y];
                            pointList.push(newPoint);
                        }
                        pointList.push(pointList[0]);


                        var info = { LayerGroup: paramObject.Requester.LayerGroup, LayerId: paramObject.Requester.LayerId, Color: prewarningItems[i].Color, LineWidth: 2, ShowText: prewarningItems[i].CurrentCount + "/" + prewarningItems[i].LastCount, RegionContent: pointList.join(','), Data: prewarningItems[i] };

                        this.ResourceMapManager.drawPolygon(info);

                    }
                }

            }));


            //响应视频上图
            topic.subscribe("egis/Map/Resource/GetVideo/ToMap", lang.hitch(this, function (paramObject) {

                this.ResourceMapManager.addVideoListMarker(paramObject.Requester.LayerGroup, paramObject.Requester.LayerId, paramObject.ResultData);

            }));
            
            //GPS坐标更新信息
            topic.subscribe("egis/gps/updategps", lang.hitch(this, function (data) {

                this.ResourceMapManager.updateMarkerGPS(data);

            }));

            //GPS状态更新信息
            topic.subscribe("egis/gps/updatestatus", lang.hitch(this, function (data) {

                this.ResourceMapManager.updateMarkerStatus(data);

            }));

            //响应标记点事件
            topic.subscribe("egis/Map/AddMarker", lang.hitch(this, function (data) {

                this.ResourceMapManager.addMarker(data);

            }));

            //响应画圆事件
            topic.subscribe("egis/Map/DrawCircle", lang.hitch(this, function (data) {

                this.ResourceMapManager.drawCircle(data);

            }));

            //响应画点事件
            topic.subscribe("egis/Map/DrawPoint", lang.hitch(this, function (data) {

                this.ResourceMapManager.drawPoint(data);

            }));

            //响应画线事件
            topic.subscribe("egis/Map/DrawLine", lang.hitch(this, function (data) {

                this.ResourceMapManager.drawLine(data);

            }));

            //响应轨迹跟踪事件
            topic.subscribe("egis/Map/ShowFollowLine", lang.hitch(this, function (data) {

                this.ResourceMapManager.ShowFollowLine(data);

            }));

            //响应画多边形事件
            topic.subscribe("egis/Map/DrawPolygon", lang.hitch(this, function (data) {

                this.ResourceMapManager.drawPolygon(data);

            }));
            //选择地图一个位置坐标
            topic.subscribe("egis/Map/SelectPoint", lang.hitch(this, function (data) {

                this.ResourceMapManager.selectPointFromMap(data);

            }));

            //判断是否处于边界，拉回中间
            topic.subscribe("egis/Map/LocatePanTo", lang.hitch(this, function (coord) {

                var pixArray = this.ResourceMapManager.map.getPixelFromCoordinate(coord);
                var box = win.getBox();
                if (pixArray != null && (pixArray[0] > box.w - 350 || pixArray[1] < 400)) {
                    this.ResourceMapManager.locatePanTo(coord);                 
                }                
            }));

            //响应清除事件
            topic.subscribe("egis/Map/Remove", lang.hitch(this, function (data) {

                if (data.RemoveType == "ALL") {
                    this.ResourceMapManager.RemoveAll();
                    this.ResourceMapManager.BuildSelectFeature();
                }
                else if (data.RemoveType == "GROUP") {
                    this.ResourceMapManager.RemoveLayerByGroupName(data.LayerGroup);
                }
                else if (data.RemoveType == "ID") {
                    this.ResourceMapManager.RemoveLayerByID(data.LayerGroup + ":" + data.LayerId);
                }
                else if (data.RemoveType == "HIDE") {
                    this.ResourceMapManager.HideLayerByID(data.LayerGroup + ":" + data.LayerId);
                }
                else if (data.RemoveType == "SHOW") {
                    this.ResourceMapManager.ShowLayerByID(data.LayerGroup + ":" + data.LayerId);
                }
                else if (data.RemoveType == "GROUPSHOW") {
                    this.ResourceMapManager.ShowLayerByGroupName(data.LayerGroup);
                }
                else if (data.RemoveType == "GROUPHIDE") {
                    this.ResourceMapManager.HideLayerByGroupName(data.LayerGroup);
                }
            }));

            //响应地图定位事件
            topic.subscribe("egis/Map/Locate", lang.hitch(this, function (e) {

                if (e.Lon && e.Lat) {
                    if (e.Lon > 10 && e.Lon < 180 && e.Lat > 10 && e.Lat < 80) {
                        var lonlat = [e.Lon, e.Lat];
                        var point = new ol.geom.Point(lonlat);
                        mapPane.map.getView().setCenter(lonlat);
                        this.ResourceMapManager.locateFlash(point);
                    }
                    else {
                        topic.publish("egis/messageNotification", { type: "info", text: "定位坐标不在地图范围内！" });
                    }
                }

                if (e.Zoom) {
                    mapPane.map.getView().setZoom(e.Zoom);
                }
            }));

            //图标放大
            topic.subscribe("egis/Map/UpdateScale", lang.hitch(this, function (data) {

                this.ResourceMapManager.updateMarkerScale(data);

            }));
        }

    });
});