/* File Created: 九月 5, 2013 */
define([
'dojo/_base/declare',
'dojo/_base/lang',
'dojo/_base/array',
'dojo/window',
'dojo/topic',
'dojo/aspect',
'egis/Map/Manager/MapManager',
// 'egis/Map/openlayers/AnimatedClusterLayer',
//'egis/Map/openlayers/SelectClusterInteraction',
"egis/appEnv",
"ol"
], function (declare, lang, array, win, topic, aspect, MapManager, appEnv, ol) {

    return declare([MapManager], {

        selectFeature: null,
        selectShowFeature : null,

        constructor: function () {

            this.map.on('singleclick',this._onMapClick, this);
            this.map.on('pointermove', this._mapOnMoveEvent, this);
            this.map.Manager = this;
            this.BuildSelectFeature();
        },

        BuildSelectFeature : function()
        {
            var markerInfo = { LayerGroup: "交互图层", LayerId: "选中对象", ImgUrl: "/Content/themes/blue/images/transparent.png", ShowText: "", LonLat: [0, 0], Code: "selectFeature", zIndex: 200, Manager: this };
            this.selectShowFeature = this.addMarker(markerInfo);
        },

        _mapOnMoveEvent: function (evt) {

            var pixel = this.getEventPixel(evt.originalEvent);
            //var pixel = this.map.getEventPixel(evt.originalEvent);
            var coordinate = evt.coordinate;
            var hit = this.hasFeatureAtPixel(pixel);
            //var hit = this.map.hasFeatureAtPixel(pixel);
            this.getTarget().style.cursor = hit ? 'pointer' : '';
            //this.map.getTarget().style.cursor = hit ? 'pointer' : '';
            if (!hit)
            {
                if (this.Manager.selectShowFeature && this.Manager.selectShowFeature.IsShow) {
                    var style = this.Manager.selectShowFeature.getStyle();
                    var text = style.getText();
                    if (text)
                    {
                        text.setScale(1);
                        text.setText('');
                    }
                    var image = style.getImage();
                    if (image) {
                        image.setScale(1);
                    }
                    var geom = new ol.geom.Point([0, 0]);
                    if (geom != null) {
                        this.Manager.selectShowFeature.setGeometry(geom);
                    }
                    this.Manager.selectShowFeature.setStyle(style);
                    this.Manager.selectShowFeature.IsShow = false;
                    this.Manager.selectShowFeature.IsGeoFeature = false;
                }
            }

            if (hit)
            {
                var feature = this.forEachFeatureAtPixel(evt.pixel, lang.hitch(this, function (feature, layer) {
                    return feature;
                }), this, lang.hitch(this, function (layer) {
                    if (layer) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }), this);

                var isCluster = false;
                var fs = feature.get('features');
                if (fs != null && fs.length > 0)
                {
                    return;
                    if (fs.length == 1) {
                        feature = fs[0];
                    }
                    else {
                        return;
                    }
                    isCluster = true;
                }


                var style = null;
                var showtext = "";
                if (feature.GeoStyle)
                {
                    style = feature.GeoStyle;
                    showtext = feature.get("name");
                    feature.Resource = feature.getProperties();
                    feature.Resource.CODE = feature.get("id");
                    feature.Resource.LayerGroup = feature.get("LayerGroup");
                    feature.Resource.LayerId = feature.get("LayerId");
                    feature.Resource.SHOWTEXT = showtext;
                    this.Manager.selectShowFeature.IsGeoFeature = true;
                }
                else if (feature.Resource && typeof feature.Resource.ShowText == "string")
                {
                    style = feature.getStyle();
                    showtext = feature.Resource.ShowText;
                }

                if (style)
                {
                    var text = style.getText();
                    var image = style.getImage();
                    if (image && image.getSrc)
                    {
                        image = new ol.style.Icon(({
                            src: style.getImage().getSrc(),
                            scale: 1.2
                        }));
                    }
                    var newStyle = new ol.style.Style({
                        geometry: style.getGeometry(),
                        fill: style.getFill(),
                        image: image,
                        stroke: style.getStroke(),
                        text: new ol.style.Text({
                            offsetX: 0,
                            offsetY: text.getOffsetY(),
                            text: showtext,
                            fill: text.getFill(),
                            stroke: text.getStroke(),
                            scale : 1.2
                        }),
                        zIndex: style.getZIndex()
                    });
                    if (feature.Resource) {
                        this.Manager.selectShowFeature.Resource = feature.Resource;
                        //置换选中对象图层顺序
                        var selectLayer = this.Manager.GetLayer("交互图层", "选中对象");
                        if (selectLayer) {
                            if (this.Manager.selectShowFeature.Resource.zIndex) {
                                selectLayer.Layer.setZIndex(this.selectShowFeature.Resource.zIndex + 10);
                            }
                            else {
                                selectLayer.Layer.setZIndex(200);
                            }
                        }
                    }
                    else {
                        this.Manager.selectShowFeature.Resource = {};
                    }
                    this.Manager.selectShowFeature.Resource.ShowText = showtext;
                    this.Manager.selectShowFeature.IsOpenGZ = feature.IsOpenGZ;

                    if (isCluster) {
                        var geom = new ol.geom.Point(coordinate);
                        if (geom != null) {
                            this.Manager.selectShowFeature.setGeometry(geom);
                            //console.debug(fs[0].getGeometry().getCoordinates() + "  " + coordinate);
                        }
                    }
                    else {
                        this.Manager.selectShowFeature.setGeometry(feature.getGeometry());
                    }
                    this.Manager.selectShowFeature.setStyle(newStyle);
                    this.Manager.selectShowFeature.IsShow = true;
                }
            }
        },

        _onMapClick: function (evt) {

            //推送地图单击事件
            topic.publish("egis/Map/Click", evt);

            var selectFeature = this.forEachFeatureAtPixel(evt.pixel, lang.hitch(this, function (feature, layer) {
                return feature;
            }), this, lang.hitch(this, function (layer) {
                if (layer) {
                    return true;
                }
                else {
                    return false;
                }
            }), this);

            if (!selectFeature || selectFeature.isRegionEdit) {
                return;
            }
            var fs = selectFeature.get('features');
            if (fs != null && fs.length > 1) {
                return;
            }
            else if (fs != null && fs.length == 1)
            {
                selectFeature = fs[0];
            }

            var eventType = "egis/Map/Resource/SelectFeature";
            if (!selectFeature.Resource || selectFeature.IsGeoFeature)
            {
                if (!selectFeature.Resource) {
                    selectFeature.Resource = selectFeature.getProperties();
                }
                selectFeature.IsGeoFeature = true;
                eventType = "egis/Map/GEO/SelectFeature";
            }

            if (this.selectFeature != null && this.selectFeature.popup != null) {
                this.map.removeOverlay(this.selectFeature.popup);
                this.selectFeature.popup = null;
                this.selectFeature = null;
            }

            this.selectFeature = selectFeature;
            var geometry = selectFeature.getGeometry();
            var type = geometry.getType();
            var coord = null;
            if (type == "Point") {
                coord = geometry.getCoordinates();
            }
            else if (type == "LineString" || type == "Polygon") {
                var xyArray = geometry.getCoordinates();
                if (xyArray.length == 1) {
                    if (xyArray[0].length == 1) {
                        coord = xyArray[0][0][0];
                    }
                    else {
                        coord = xyArray[0][0];
                    }
                }
                else {
                    coord = xyArray[0];
                }
            }
            else if (type == "Circle") {
                var box = geometry.getExtent();
                var centerX = (box[0] + box[2]) / 2;
                var centerY = (box[1] + box[3]) / 2;
                coord = [centerX, centerY];
            }

            var paramObject = { Resource: selectFeature.Resource, Feature: selectFeature, PopupPosition: coord };

            topic.publish(eventType, paramObject);


        },

        ShowFollowLine: function (gpsInfo)
        {
            for (var key in this.LayerList) {
                var feature = this.LayerList[key].Source.getFeatureById(gpsInfo.gpsId);
                if (feature != null)
                {
                    var LayerGroup = "轨迹跟踪";
                    feature.IsOpenGZ = gpsInfo.IsOpenGZ;
                    if (!gpsInfo.IsOpenGZ) {
                        this.RemoveLayerByID(LayerGroup + ":" + gpsInfo.gpsId);
                    }
                    else {
                        var color = this.getRandomColor(gpsInfo.gpsId);
                        var geometry = feature.getGeometry();
                        var coord = geometry.getCoordinates();
                        var pointInfo = { LayerGroup: LayerGroup, LayerId: gpsInfo.gpsId, Color: color, ShowText: "起点", RegionContent: coord[0] + "," + coord[1] };

                        this.drawPoint(pointInfo);
                    }
                }
            }
        },

        updateMarkerGPS : function(gpsInfo)
        {
            for (var key in this.LayerList) {
                var feature = this.LayerList[key].Source.getFeatureById(gpsInfo.GPSId);
                if (feature != null)
                {

                    if (feature.IsOpenGZ) {
                        var geometry = feature.getGeometry();
                        var coord = geometry.getCoordinates();

                        var lineInfo = { LayerGroup: "轨迹跟踪", LayerId: gpsInfo.GPSId, LineWidth: 3, RandomLineColor: true, RegionContent: gpsInfo.Lon + "," + gpsInfo.Lat + "," + coord[0] + "," + coord[1] };
                        this.drawLine(lineInfo);
                    }
                    var geom = new ol.geom.Point([parseFloat(gpsInfo.Lon), parseFloat(gpsInfo.Lat)]);

                    if (geom != null) {
                        feature.setGeometry(geom);

                        var style = feature.getStyle();
                        if (feature.Resource && feature.Resource.Data && feature.Resource.Data.GPS_TIME)
                        {
                            var result = GetDateDiff(feature.Resource.Data.GPS_TIME, gpsInfo.GpsTime, "minute");
                            if (result > appEnv.appConfig.GPSOffTime) {
                                feature.Resource.Data.DUTY_STATUS = "0";
                            }
                            else {
                                feature.Resource.Data.DUTY_STATUS = feature.Resource.Data.OLD_STATUS;
                            }
                            feature.Resource.Data.GPS_TIME = gpsInfo.GpsTime;

                            var imgUrl = this.getPoliceForceIconUrl(feature.Resource.DeviceType, feature.Resource.Data.DUTY_STATUS);

                            var newStyle = new ol.style.Style({
                                geometry: style.getGeometry(),
                                fill: style.getFill(),
                                image: new ol.style.Icon(({
                                    src: imgUrl
                                })),
                                stroke: style.getStroke(),
                                text: style.getText(),
                                zIndex: style.getZIndex()
                            });
                            var color = this.getPoliceStateColor(feature.Resource.Data.DUTY_STATUS);
                            if (color) {
                                newStyle.getText().getStroke().setColor(color);
                            }
                            feature.setStyle(newStyle);
                        }
                        if (gpsInfo.ChangeInfo == "ShowText") {
                            var textStyle = style.getText();
                            if (textStyle) {
                                textStyle.setText(gpsInfo.ChangeValue);
                            }
                        }
                        else {
                            //this.waterFlash(geom);
                        }
                    }

                }
                key = null;
            }
        },

        updateMarkerStatus: function (gpsInfo) {
            for (var key in this.LayerList) {
                var feature = this.LayerList[key].Source.getFeatureById(gpsInfo.GPSId);
                if (feature != null) {
                    var imgUrl = this.getPoliceForceIconUrl(feature.Resource.DeviceType, gpsInfo.Status);
                    
                    var style = feature.getStyle();
                    var newStyle = new ol.style.Style({
                        geometry: style.getGeometry(),
                        fill: style.getFill(),
                        image: new ol.style.Icon(({
                            src: imgUrl
                        })),
                        stroke: style.getStroke(),
                        text: style.getText(),
                        zIndex: style.getZIndex()
                    });
                    var color = this.getPoliceStateColor(gpsInfo.Status);
                    if (color)
                    {
                        newStyle.getText().getStroke().setColor(color);
                    }
                    feature.setStyle(newStyle);

                    //var text = style.getText();
                    //var image = style.getImage();
                    //if (image.getSrc) {
                    //    image = new ol.style.Icon(({
                    //        src: style.getImage().getSrc(),
                    //        scale: 1.2
                    //    }));
                    //}
                    //var newStyle = new ol.style.Style({
                    //    geometry: style.getGeometry(),
                    //    fill: style.getFill(),
                    //    image: image,
                    //    stroke: style.getStroke(),
                    //    text: new ol.style.Text({
                    //        offsetX: 0,
                    //        offsetY: text.getOffsetY(),
                    //        text: showtext,
                    //        fill: text.getFill(),
                    //        stroke: text.getStroke(),
                    //        scale: 1.2
                    //    }),
                    //    zIndex: style.getZIndex()
                    //});

                    this.selectShowFeature.setGeometry(feature.getGeometry());
                    this.selectShowFeature.setStyle(newStyle);
                    this.selectShowFeature.IsShow = true;
                }
                key = null;
            }
        },


        updateMarkerScale: function (scaleInfo) {
            var layerInfo = this.GetLayer(scaleInfo.LayerGroup, scaleInfo.LayerId);
            if (layerInfo == null) {
                return;
            }

            var feature = layerInfo.Source.getFeatureById(scaleInfo.Code);
            if (feature != null) {

                var style = feature.getStyle();
                var newStyle = new ol.style.Style({
                    geometry: style.getGeometry(),
                    fill: style.getFill(),
                    image: new ol.style.Icon(({
                        src: style.getImage().getSrc(),
                        scale: scaleInfo.Scale
                    })),
                    stroke: style.getStroke(),
                    text: style.getText(),
                    zIndex: style.getZIndex()
                });
                feature.setStyle(newStyle);
            }
        },



        addListMarker: function (layerGroup, layerId, markerInfoList, IsShosSD, IsShowBD) {
            if (!markerInfoList || markerInfoList.length == 0)
            {
                topic.publish("egis/messageNotification", { type: "info", text: "查询结果为空！" });
                return;
            }
            for (var num = 0; num < markerInfoList.length; num++)
            {
                if (!markerInfoList[num].dutyStatus || markerInfoList[num].dutyStatus == "0")
                {
                    markerInfoList[num].dutyStatus = "3";
                }
                markerInfoList[num].oldStatus = markerInfoList[num].dutyStatus;
                if (markerInfoList[num].GPS_TIME) {
                    var result = GetDateDiff(markerInfoList[num].GPS_TIME, GetCurrentTimeString(), "minute");
                    if (result > appEnv.appConfig.GPSOffTime) {
                        markerInfoList[num].dutyStatus = "0";
                    }
                }
                else {
                    markerInfoList[num].dutyStatus = "0";
                }
                var imgUrl = markerInfoList[num].imgUrl;
                if(!imgUrl) {
                    imgUrl = this.getPoliceForceIconUrl(markerInfoList[num].DEVICETYPE, markerInfoList[num].DUTY_STATUS);
                }
                var markerInfo = { LayerGroup: layerGroup, LayerId: layerId, ImgUrl: imgUrl, ShowText: markerInfoList[num].showText, LonLat: [markerInfoList[num].lon, markerInfoList[num].lat], Code: markerInfoList[num].code, DeviceType: markerInfoList[num].deviceType, PoliceStatus: markerInfoList[num].dutyStatus, Data: markerInfoList[num], IsClusterLayer: false, Manager: this };
                this.addMarker(markerInfo);
            }

            var layerInfo = this.GetLayer(layerGroup, layerId);
            if (layerInfo != null) {
                if (!IsShosSD) {
                    this.HideLayerByID(layerGroup + ":" + layerId);
                }
                if (IsShowBD) {
                    this.ShowByCold(layerGroup, layerId + "冰点", 9, layerInfo.Layer);
                }
            }
        },




        addCaseMarker: function (layerGroup, layerId, markerInfoList,IsShosSD,IsShowRD) {
            if (!markerInfoList || markerInfoList.length == 0) {
                topic.publish("egis/messageNotification", { type: "info", text: "查询结果为空！" });
                return;
            }
            for (var num = 0; num < markerInfoList.length; num++) {

                var imgUrl = this.getCaseIconUrl(markerInfoList[num]);

                var markerInfo = { LayerGroup: layerGroup, LayerId: layerId, ImgUrl: imgUrl, ShowText: "", LonLat: [markerInfoList[num].lon, markerInfoList[num].lat], Code: markerInfoList[num].caseCode, Data: markerInfoList[num], IsClusterLayer: false, Manager: this };
                this.addMarker(markerInfo);
            }

            var layerInfo = this.GetLayer(layerGroup, layerId);
            if (layerInfo != null) {
                if (!IsShosSD)
                {
                    this.HideLayerByID(layerGroup + ":" + layerId);
                }
                if (IsShowRD) {
                    this.ShowByHot(layerGroup , layerId + "热点",9,layerInfo.Layer);
                }
            }
        },


        ShowByHot: function (LayerGroup,LayerId,zIndex, sourceLayer) {

            var layerInfo = this.GetLayer(LayerGroup, LayerId);
            if (layerInfo == null) {
                if (zIndex) {
                    layerInfo = this.CreateHotLayer(LayerGroup, LayerId, zIndex);
                }
                else {
                    layerInfo = this.CreateHotLayer(LayerGroup, LayerId);
                }
            }

            var geojsonObject = {
                'type': 'FeatureCollection',
                'crs': {
                    'type': 'name',
                    'properties': {
                        'name': 'EPSG:3857'
                    }
                },
                'features': []
            };


            sourceLayer.getSource().forEachFeature(lang.hitch(this, function (feature) {

                if (feature) {

                    var x = feature.getGeometry().getCoordinates()[0];
                    var y = feature.getGeometry().getCoordinates()[1];

                    var tepFeature = new Object();
                    tepFeature.type = 'Feature';
                    tepFeature.geometry = {
                        'type': 'Point',
                        'coordinates': [x, y]
                    }
                    geojsonObject.features.push(tepFeature);
                }

            }), this);

            layerInfo.Source.addFeatures((new ol.format.GeoJSON()).readFeatures(geojsonObject));
        },


        ShowByCold: function (LayerGroup, LayerId, zIndex, sourceLayer) {

            var layerInfo = this.GetLayer(LayerGroup, LayerId);
            if (layerInfo == null) {
                if (zIndex) {
                    layerInfo = this.CreateColdLayer(LayerGroup, LayerId, zIndex);
                }
                else {
                    layerInfo = this.CreateColdLayer(LayerGroup, LayerId);
                }
            }

            var geojsonObject = {
                'type': 'FeatureCollection',
                'crs': {
                    'type': 'name',
                    'properties': {
                        'name': 'EPSG:3857'
                    }
                },
                'features': []
            };


            sourceLayer.getSource().forEachFeature(lang.hitch(this, function (feature) {

                if (feature) {

                    var x = feature.getGeometry().getCoordinates()[0];
                    var y = feature.getGeometry().getCoordinates()[1];

                    var tepFeature = new Object();
                    tepFeature.type = 'Feature';
                    tepFeature.geometry = {
                        'type': 'Point',
                        'coordinates': [x, y]
                    }
                    geojsonObject.features.push(tepFeature);
                }

            }), this);

            layerInfo.Source.addFeatures((new ol.format.GeoJSON()).readFeatures(geojsonObject));
        },

        addVideoListMarker: function (layerGroup, layerId, markerInfoList) {
            if (!markerInfoList || markerInfoList.length == 0) {
                topic.publish("egis/messageNotification", { type: "info", text: "查询结果为空！" });
                return;
            }
            for (var num = 0; num < markerInfoList.length; num++) {
                var imgUrl = "/Content/themes/blue/images/video" + markerInfoList[num].type + ".png";
                
                var markerInfo = { LayerGroup: layerGroup, LayerId: layerId, ImgUrl: imgUrl, ShowText: markerInfoList[num].name, LonLat: [markerInfoList[num].lon, markerInfoList[num].lat], Code: markerInfoList[num].code, PoliceStatus: markerInfoList[num].status, Data: markerInfoList[num], HideText: false, IsClusterLayer: false, Manager: this };
                this.addMarker(markerInfo);
            }
        },

        getCaseIconUrl : function(caseInfo)
        {
            return "/Content/themes/blue/images/case/casetype/" + caseInfo.mainTypeCode + ".gif";
        },

        getPoliceForceIconUrl: function (type, status) {
            if (type != null) {
                var policeForceIcons = appEnv.appConfig.policeForceIcons.url;
                for (var i = 0; i < policeForceIcons.length; i++) {
                    if (policeForceIcons[i].type == type) {
                        for (var j = 0; j < policeForceIcons[i].statusIcons.length; j++) {
                            if (policeForceIcons[i].statusIcons[j].status == status) {
                                return policeForceIcons[i].statusIcons[j].icon;
                            }
                        }
                        //没有匹配上用默认图标
                        for (var j = 0; j < policeForceIcons[i].statusIcons.length; j++) {
                            if (policeForceIcons[i].statusIcons[j].status == null) {
                                return policeForceIcons[i].statusIcons[j].icon;
                            }
                        }
                    }
                }
            }

        },

        addMarker: function (markerInfo) {

            var layerInfo = this.GetLayer(markerInfo.LayerGroup, markerInfo.LayerId);
            if (layerInfo == null)
            {
                if (markerInfo.IsClusterLayer) {
                    layerInfo = this.CreateAnimatedClusterLayer(markerInfo.LayerGroup, markerInfo.LayerId);
                }
                else {
                    if (markerInfo.zIndex) {
                        layerInfo = this.CreateNewLayer(markerInfo.LayerGroup, markerInfo.LayerId, markerInfo.zIndex);
                    }
                    else {
                        layerInfo = this.CreateNewLayer(markerInfo.LayerGroup, markerInfo.LayerId);
                    }
                }
            }

            var stateColor = "Green";
            if (markerInfo.PoliceStatus)
            {
                stateColor = this.getPoliceStateColor(markerInfo.PoliceStatus);
            }
            var showText = markerInfo.ShowText ? markerInfo.ShowText : '';
            if(markerInfo.HideText)
            {
                showText ="";
            }
            var scale = 1;
            if (markerInfo.Scale) {
                scale = markerInfo.Scale;
            }
            var iconStyle = new ol.style.Style({
                image: new ol.style.Icon(({
                    src: markerInfo.ImgUrl,
                    scale: scale
                })),
                text: new ol.style.Text({
                    offsetX: 0,
                    offsetY: -26,
                    text: showText,
                    fill: new ol.style.Fill({ color: 'white' }),
                    stroke: new ol.style.Stroke({
                        color: stateColor,
                        width: 4
                    })
                })
            });

            var point = new ol.geom.Point(markerInfo.LonLat);
            var feature = new ol.Feature({ geometry: point });
            feature.setStyle(iconStyle);
            if (feature) {
                if (!markerInfo.Code)
                {
                    return;
                }
                feature.setId(markerInfo.Code);
                feature.Resource = markerInfo;
                layerInfo.Source.addFeature(feature);
            }
            return feature;
        },

        getPoliceStateColor : function(state)
        {
            if (state == "1" || state == "5")
            {
                return "#15b100";
            }
            else if (state == "9")
            {
                return "#ff1000";
            }
            else if (state == "8") {
                return "#8b01be";
            }
            else if (state == "2")
            {
                return "#0064c1";
            }
            else if (state == "0") {
                return "#535353";
            }
            else {
                return "Green";
            }
        },


        //获取非聚合样式
        getSingleStyle: function (feature, resolution) {

            var style;
            var fs = feature.get('features');
            if (fs.length <= 0) {
                return;
            }
            else {
                var originalFeature = fs[0];
                style = originalFeature.getStyle();
            }
            return style;
        },

        //聚合图标
        getResourceClusterIconUrl: function (resource) {

            var url = "/Content/themes/blue/images/cluster/video_cluster_32.png";

            return url;
        },

        getClusterColorByType: function (type) {

            return "35,109,181";

            switch (type) {
                case 'man': return appConfig.PoliceForceMonitor.ClusterColor; break;
                case 'car': return appConfig.PoliceForceMonitor.ClusterColor; break;
                case 'video': return "35,109,181"; break;
                case 'case': return appConfig.CaseModule.ClusterColor; break;
                case 'detector': return appConfig.CaseModule.DetectorModule; break;
            }
        },

        //获取聚合样式
        getClusterStyle: function (feature, size) {
            var style;
            //获取聚合图标
            var iconUrl = this.getResourceClusterIconUrl(feature.get('features')[0].Resource);
            if (iconUrl == "")//没有指定聚合图标
            {
                var color = me.getClusterColorByType(feature.get('features')[0].Resource.Type);

                var radius = Math.max(8, Math.min(size * 0.75, 20));
                var dash = 2 * Math.PI * radius / 6;
                var dashArr = [0, dash, dash, dash, dash, dash, dash];

                style = [
                    new ol.style.Style({
                        image: new ol.style.Circle(
                        {
                            radius: radius,
                            stroke: new ol.style.Stroke({
                                color: "rgba(" + color + ",0.5)",
                                width: 9,
                                lineDash: dashArr
                            }),
                            fill: new ol.style.Fill({
                                color: "rgba(" + color + ",1)"
                            })
                        }),
                        text: new ol.style.Text({
                            text: size.toString(),
                            fill: new ol.style.Fill({
                                color: 'white'
                            }),
                            font: '14px sans-serif'
                        })
                    })
                ];
            } else {
                style = [
                    new ol.style.Style(
                    {
                        image: new ol.style.Icon(({
                            src: iconUrl
                        })),
                        text: new ol.style.Text(
                        {
                            text: size.toString(),
                            fill: new ol.style.Fill({
                                color: 'white'
                            }),
                            font: '14px sans-serif'
                        })
                    })
                ];
            }

            return style;
        },


        //获取元素样式
        getAnimatedClusterStyle: function (feature, resolution) {
            var me = this;

            if (resolution > appEnv.appConfig.nonClusterResoultion) {//
                var size = feature.get('features').length;
                if (size > 1) {//聚合时，图标显示效果
                    return this.getClusterStyle(feature, size);
                }
                else {//单个点时显示效果
                    return this.getSingleStyle(feature, resolution);
                }
            } else {
                return this.getSingleStyle(feature, resolution);
            }

        },

        CreateAnimatedClusterLayer: function (layerGroup, layerId, zIndex) {
            var layerInfo = new Object();
            var layerKey = layerGroup + ":" + layerId;
            layerInfo.Source = new ol.source.Vector({
                features: []
            });
            
            //layerInfo.Layer = new ol.layer.AnimatedCluster({
            layerInfo.Layer = new ol.layer.VectorLayer({
                source: new ol.source.Cluster({
                    distance: 50,
                    source: layerInfo.Source,
                }),
                animationDuration: 500,
                id: layerKey,
                style: lang.hitch(this, this.getAnimatedClusterStyle)
            });

            if (zIndex) {
                layerInfo.Layer.setZIndex(zIndex);
            }
            else {
                layerInfo.Layer.setZIndex(100);
            }
            this.map.addLayer(layerInfo.Layer);

            this.LayerList[layerKey] = layerInfo;

            this._setResourceSelectCluster();

            return layerInfo;
        },

        //设置选择器
        _setResourceSelectCluster: function () {
            var me = this;
            if (!this.selectInterAction) {
                // Select interaction to spread cluster out and select features
                this.selectInterAction = new ol.interaction.SelectCluster(
                {   // Point radius: to calculate distance between the features
                    pointRadius: 22,
                    //map: this.map,
                    //animate: true,
                    // Feature style when it springs apart
                    featureStyle: function () {
                        var img = new ol.style.Circle(
                            {
                                radius: 6,
                                stroke: new ol.style.Stroke(
                                {
                                    color: "rgba(255,255,255,1)",
                                    width: 2
                                }),
                                fill: new ol.style.Fill(
                                {
                                    color: "rgba(0,255,0,0.8)"
                                })
                            });
                        var style = new ol.style.Style(
                            {
                                image: img,
                                // Draw a link beetween points (or not)
                                stroke: new ol.style.Stroke(
                                    {
                                        color: "rgba(255,255,255,1)", //#00ff00//#f00
                                        width: 1.5
                                    })
                            });
                        return [style];
                    }
                });
                this.map.addInteraction(this.selectInterAction);

            };
        },


        destroy: function () {  
            this.RemoveAll();
        }




    });

});