define([
'dojo/_base/declare',
'dojo/_base/array',
'dojo/_base/lang',
'dojo/aspect',
'dojo/json',
'dojo/topic',
'egis/Modules/_Module',
'egis/Map/Manager/DrawMapManager',
'egis/appEnv',
'ol'

], function (declare, array, lang, aspect, JSON, topic, _Module, DrawMapManager, appEnv, ol) {
    return declare([_Module], {

        //绘制资源句柄
        drawMapManager: null,

        constructor: function () {

        },


        startup: function () {

            var mapPane = appEnv.getCurrentPane();
            this.drawMapManager = new DrawMapManager({
                map: mapPane.map
            });
            
            //响应单击标点事件
            topic.subscribe("egis/Map/UpdateMarkerLocate", lang.hitch(this, function (param) {

                var info = param.data;
                var locateCoord = param.coord;
                var selectF = this.drawMapManager.GetFeatureById(info.CaseId);
                if (selectF) {
                    var geom = new ol.geom.Point(locateCoord);
                    selectF.setGeometry(geom);
                }
                else {
                    var markerInfo = { LayerGroup: '交互图层', LayerId: '地图选点', ImgUrl: "/Content/themes/blue/images/red-pin.gif", ShowText: info.CaseAddress, LonLat: locateCoord, CaseId: info.CaseId };
                    this.drawMapManager.addMarker(markerInfo);
                }
                if (info) {
                    info.CaseLonX = locateCoord[0];
                    info.CaseLatY = locateCoord[1];
                    topic.publish("egis/Map/DrawMarkerModifyEnd", info);
                }
            }));

            //开始绘制标记点事件
            topic.subscribe("egis/Map/BeginDrawMarker", lang.hitch(this, function (markerInfo) {

                if (!markerInfo.ImgUrl)
                {
                    markerInfo.ImgUrl = "/Content/themes/blue/images/red-pin.gif";
                }
                this.drawMapManager.BeginDrawMarker(markerInfo);

            }));

            //响应距离测量事件
            topic.subscribe("egis/Map/BeginLineMeasure", lang.hitch(this, function (param) {

                var measureInfo = { LayerGroup: "交互图层", LayerId: "测量距离", DrawType: "LineString" };
                this.drawMapManager.BeginMeasure(measureInfo);

            }));

            //响应面积测量事件
            topic.subscribe("egis/Map/BeginPolygonMeasure", lang.hitch(this, function (param) {

                var measureInfo = { LayerGroup: "交互图层", LayerId: "测量面积", DrawType: "Polygon" };
                this.drawMapManager.BeginMeasure(measureInfo);

            }));

            //响应框选查询事件
            topic.subscribe("egis/Map/BeginExtentQuery", lang.hitch(this, function (param) {

                this.drawMapManager.BeginExtentQuery();

            }));
            //响应空间查询事件
            topic.subscribe("egis/Map/BeginGeometryQuery", lang.hitch(this, function (param) {

                this.drawMapManager.BeginGeometryQuery(param);

            }));

            //响应空间查询事件
            topic.subscribe("egis/Map/CancelGeometryQuery", lang.hitch(this, function (param) {

                this.drawMapManager.CancelGeometryQuery(param);

            }));

            //响应清除事件
            topic.subscribe("egis/Map/Remove", lang.hitch(this, function (data) {

                if (data.RemoveType == "ALL") {
                    this.drawMapManager.RemoveAll();
                }
                else if (data.RemoveType == "GROUP") {
                    this.drawMapManager.RemoveLayerByGroupName(data.LayerGroup);
                }
                else if (data.RemoveType == "ID") {
                    this.drawMapManager.RemoveLayerByID(data.LayerGroup + ":" + data.LayerId);
                }
                else if (data.RemoveType == "FID") {
                    this.drawMapManager.RemoveFeatureByID(data.FID);
                }
                else if (data.RemoveType == "FObject") {
                    this.drawMapManager.RemoveFeatureByObject(data.LayerGroup + ":" + data.LayerId,data.FObject);
                }
            }));
        }

    });
});