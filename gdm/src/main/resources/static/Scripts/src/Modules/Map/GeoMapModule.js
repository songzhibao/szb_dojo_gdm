define([
'dojo/_base/declare',
'dojo/_base/array',
'dojo/_base/lang',
'dojo/aspect',
'dojo/json',
'dojo/topic',
'egis/Modules/_Module',
'egis/Map/Manager/GeoJSONMapManager',
'egis/appEnv',
'ol'

], function (declare, array, lang, aspect, JSON, topic, _Module,GeoJSONMapManager, appEnv,ol) {
    return declare([_Module], {

        //绘制资源句柄
        geoJSONMapManger: null,


        startup: function () {

            var mapPane = appEnv.getCurrentPane();
            this.geoJSONMapManger = new GeoJSONMapManager({
                map: mapPane.map
            });
            
            //GeoJson 上图事件
            topic.subscribe("egis/Map/Resource/GeoJson/ToMap", lang.hitch(this, function (paramObject) {
                this.geoJSONMapManger.AddGeoJSONLayerAndShow(paramObject.ResultData, paramObject.Requester);
            }));

            //GPS坐标更新信息
            topic.subscribe("egis/other/updategps", lang.hitch(this, function (data) {

                this.geoJSONMapManger.updateMarkerGPS(data);

            }));

            //响应轨迹跟踪事件
            topic.subscribe("egis/other/ShowFollowLine", lang.hitch(this, function (data) {

                this.geoJSONMapManger.ShowFollowLine(data);

            }));

            //响应清除事件
            topic.subscribe("egis/Map/Remove", lang.hitch(this, function (data) {

                if (data.RemoveType == "ALL") {
                    this.geoJSONMapManger.RemoveAll();
                }
                else if (data.RemoveType == "GROUP") {
                    this.geoJSONMapManger.RemoveLayerByGroupName(data.LayerGroup);
                }
                else if (data.RemoveType == "ID") {
                    this.geoJSONMapManger.RemoveLayerByID(data.LayerGroup + ":" + data.LayerId);
                }
                else if (data.RemoveType == "HIDE") {
                    this.geoJSONMapManger.HideLayerByID(data.LayerGroup + ":" + data.LayerId);
                }
                else if (data.RemoveType == "SHOW") {
                    this.geoJSONMapManger.ShowLayerByID(data.LayerGroup + ":" + data.LayerId);
                }
                else if (data.RemoveType == "GROUPSHOW") {
                    this.geoJSONMapManger.ShowLayerByGroupName(data.LayerGroup);
                }
                else if (data.RemoveType == "GROUPHIDE") {
                    this.geoJSONMapManger.HideLayerByGroupName(data.LayerGroup);
                }
            }));

        }

    });
});