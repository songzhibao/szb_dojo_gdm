/**
* Created with JetBrains WebStorm.
* User: chengbin
* Date: 13-4-24
* To change this template use File | Settings | File Templates.
*/
define([
    "dojo/_base/declare",
    "dojo/_base/fx",
    "dojo/_base/lang",
    "dojo/dom-class",
    "dojo/dom-geometry",
    "dojo/on",
    'dojo/topic',
    "dijit/_TemplatedMixin",
    'dijit/_WidgetsInTemplateMixin',
    "dojox/layout/ContentPane",
    "dojox/widget/Standby",
    'dijit/form/TextBox',
    'dijit/form/Button',
    'dijit/TooltipDialog',
    'egis/Modules/Alarm/component/AlarmFixedPane/AlarmFixedPane',
    'egis/Modules/Case/component/CaseFixedPane/CaseFixedPane',
    'egis/Modules/Duty/component/DutyConditionControl',
    'egis/Share/component/VideoSelect/VideoProjectControl',
    "egis/Share/component/MapFloatPane/MapBoardPane",
    "dojo/text!./MapToolList.html",
    "egis/Share/component/OrgTree/OrgTree",
    "egis/appEnv"

], function (declare, baseFx, lang, domClass, domGeom, on, topic, TemplatedMixin, _WidgetsInTemplateMixin, ContentPane, Standby, TextBox, Button, TooltipDialog, AlarmFixedPane,CaseFixedPane,DutyConditionControl, VideoProjectControl, MapBoardPane, template, OrgTree, appEnv) {

    var MapFloatingPane = declare([ContentPane, TemplatedMixin, _WidgetsInTemplateMixin], {

        standby: null,

        templateString: template,

        duration: 400,

        IsCheckPoliceOnline: false,

        IsCheckPolice: false,

        BelongModule : "",

        postCreate: function () {
            this.inherited(arguments);
        },

        startup: function () {
            var me = this;
            this.inherited(arguments);
            
            // this.PoliceButton.on("click", lang.hitch(this, this._PoliceButtonClick));
            // this.PoliceButton.on("mouseover", lang.hitch(this, this._PoliceButtonMouseOver));
            // this.PoliceButton.on("mouseout", lang.hitch(this, this._PoliceButtonMouseOut));
            // this.PoliceButton.SetState(this.IsCheckPolice);

            // this.VideoButton.on("click", lang.hitch(this, this._VideoButtonClick));
            // this.VideoButton.on("mouseover", lang.hitch(this, this._VideoButtonMouseOver));
            // this.VideoButton.on("mouseout", lang.hitch(this, this._VideoButtonMouseOut));

            this.JRJQButton.on("click", lang.hitch(this, this._JRJQButtonClick));
            this.JRJQButton.on("mouseover", lang.hitch(this, this._JRJQButtonMouseOver));
            this.JRJQButton.on("mouseout", lang.hitch(this, this._JRJQButtonMouseOut));

            // this.JTXHDButton.on("click", lang.hitch(this, this._JTXHDButtonClick));
            // this.JTYDPButton.on("click", lang.hitch(this, this._JTYDPButtonClick));
            // this.GCCButton.on("click", lang.hitch(this, this._GCCButtonClick));
            //this.DetectorButton.on("click", lang.hitch(this, this._DetectorButtonClick));

            this.WGButton.on("click", lang.hitch(this, this._WGButtonClick));
            this.WGButton.on("mouseover", lang.hitch(this, this._WGButtonMouseOver));
            this.WGButton.on("mouseout", lang.hitch(this, this._WGButtonMouseOut));

            this.connect(this.setingButton, "click", lang.hitch(this, this._setingButtonClick));
            this.connect(this.setingButton, "mouseover", lang.hitch(this, this._setingButtonMouseOver));
            this.connect(this.setingButton, "mouseout", lang.hitch(this, this._setingButtonMouseOut));
            
            var mapPane = appEnv.getCurrentPane();

            //增加警力面板
            // mapPane.PoliceBoardPane = new MapBoardPane({
            //     style: "z-index:200;position: absolute;top: 136px;right: 55px;"
            // });
            // mapPane.FixedPane = new AlarmFixedPane({
            //     title: '警力',
            //     IsOnline: this.IsCheckPoliceOnline
            // });
            // mapPane.FixedPane.on("onCheckChange", lang.hitch(this, this._PoliceCheckChange));
            // mapPane.PoliceBoardPane.addChild(mapPane.FixedPane);
            // mapPane.addFloatingPane(mapPane.PoliceBoardPane);
            // mapPane.PoliceBoardPane.hide();

            //增加视频面板
            // mapPane.VideoBoardPane = new MapBoardPane({
            //     style: "z-index:200;position: absolute;top: 166px;right: 55px;"
            // });
            // mapPane.VideoPane = new VideoProjectControl({
            //     map: mapPane.map,
            //     style: "width:100%; height:330px;",
            //     title: '视频'
            // });
            // mapPane.VideoPane.on("onCheckChange", lang.hitch(this, this._VideoCheckChange));
            // mapPane.VideoBoardPane.addChild(mapPane.VideoPane);
            // mapPane.addFloatingPane(mapPane.VideoBoardPane);
            // mapPane.VideoBoardPane.hide();

            //增加警情分析面板
            mapPane.CaseBoardPane = new MapBoardPane({
                style: "z-index:800;position: absolute;top: 136px;right: 55px;"
            });
            mapPane.CasePane = new CaseFixedPane({
                map: mapPane.map,
                style: "width:338px; height:360px;",
                title: '警情'
            });
            mapPane.CasePane.on("onCheckChange", lang.hitch(this, this._CaseCheckChange));
            mapPane.CasePane.on("mouseout", function () {
                mapPane.CaseBoardPane.mouseout();
            });
            mapPane.CasePane.on("mouseover", function () {
                mapPane.CaseBoardPane.mouseover();
            });
            mapPane.CasePane.on("LockShow", function (IsLock) {
                mapPane.CaseBoardPane.LockShow(IsLock);
            });
            mapPane.CaseBoardPane.addChild(mapPane.CasePane);
            mapPane.addFloatingPane(mapPane.CaseBoardPane);
            mapPane.CaseBoardPane.hide();
            
            //增加巡逻网格条件面板
            mapPane.WGBoardPane = new MapBoardPane({
                style: "z-index:200;position: absolute;top: 166px;right: 55px;"
            });
            mapPane.WGPane = new DutyConditionControl({
                map: mapPane.map,
                style: "width:100%; height:330px;",
                title: '网格'
            });
            mapPane.WGPane.on("onCheckChange", lang.hitch(this, this._WGCheckChange));
            mapPane.WGBoardPane.addChild(mapPane.WGPane);
            mapPane.addFloatingPane(mapPane.WGBoardPane);
            mapPane.WGBoardPane.hide();

            if (this.WGLi && this.BelongModule != "Alarm")
            {
                this.WGLi.style.display = "none";
            }

            this.WGButton.SetState(true);
            this._WGButtonClick(true);
        },

        _JTYDPButtonClick: function (checked) {

            if (checked) {
                var paramObj = {
                    layersName: "DS_JTYDP_PT",
                    selectType: "like",
                    selectVal: "",
                    comdition: ""
                };
                var requester = { getDataUrl: "/Alarm/QueryOneLayerResourcesByGeoJSON", actionExplain: "资源图层切换", actionType: "/Resource/LayerChange", paramObject: paramObj, LayerGroup: "资源展现", LayerId: "诱导牌" };
                topic.publish("egis/Map/Resource/GeoJson", requester);
            }
            else {
                var paramObj = { LayerGroup: "资源展现", LayerId: "诱导牌", RemoveType: "HIDE" };
                //先清空原先的标注点
                topic.publish("egis/Map/Remove", paramObj);
            }
        },

        _VideoCheckChange: function (requester) {
            var check = this.VideoButton.GetState();
            if (check) {
                var paramObject = { LayerGroup: "视频监控", RemoveType: "GROUP" };
                //先清空原先的标注点
                topic.publish("egis/Map/Remove", paramObject);
                topic.publish("egis/Map/Resource/GetVideo", requester);
            }
        },

        _CaseCheckChange: function (requester) {
            var check = this.JRJQButton.GetState();
            if (check) {
                var paramObject = { LayerGroup: "警情上图", RemoveType: "GROUP" };
                //先清空原先的标注点
                topic.publish("egis/Map/Remove", paramObject);
                topic.publish("egis/Map/Resource/GetCase", requester);

                if (requester.checkSSYJ) {
                    var paramObj = requester.paramObject;
                    var ssyjRequest = { getDataUrl: "/Case/GetCasesForSSYJ", LayerGroup: "警情上图", LayerId: "四色预警", actionExplain: paramObj.actionExplain, actionType: paramObj.actionType, paramObject: paramObj};
                    topic.publish("egis/Map/Resource/ShowSSYJ", ssyjRequest);
                }
            }
        },

        _PoliceCheckChange: function (requester)
        {
            var check = this.PoliceButton.GetState();
            if (check) {

                var paramObject = { LayerGroup: "警力上图", RemoveType: "GROUP" };
                //先清空原先的标注点
                topic.publish("egis/Map/Remove", paramObject);

                topic.publish("egis/Map/Resource/GetResource", requester);

                var mapPane = appEnv.getCurrentPane();
                if (mapPane && mapPane.FixedPane) {
                    mapPane.FixedPane.PoliceRequest = requester;
                }
            }
        },

        _WGCheckChange: function (requester) {
            var check = this.WGButton.GetState();
            if (check) {
                var paramObject = { LayerGroup: "网格管理", RemoveType: "GROUP" };
                //先清空原先的标注点
                topic.publish("egis/Map/Remove", paramObject);
                topic.publish("egis/Duty/Region", requester);
            }
        },

        _JTXHDButtonClick: function (checked) {

            if (checked) {
                var paramObj = {
                    layersName: "DS_JTXHD_PT",
                    selectType: "like",
                    selectVal: "",
                    comdition: ""
                };
                var requester = { getDataUrl: "/Alarm/QueryOneLayerResourcesByGeoJSON", actionExplain: "资源图层切换", actionType: "/Resource/LayerChange", paramObject: paramObj, LayerGroup: "资源展现", LayerId: "信号灯" };
                topic.publish("egis/Map/Resource/GeoJson", requester);
            }
            else {
                var paramObj = { LayerGroup: "资源展现", LayerId: "信号灯", RemoveType: "HIDE" };
                //先清空原先的标注点
                topic.publish("egis/Map/Remove", paramObj);
            }

        },


        _VideoButtonMouseOut: function (checked) {
            //if (checked) {
            //    return;
            //}
            if (this.timeOurHandler) {
                window.clearTimeout(this.timeOurHandler);
            }
            this.timeOurHandler = window.setTimeout(lang.hitch(this, "hideSetting"), 500, this.setingButton);

        },

        _VideoButtonMouseOver: function (checked) {
            //if (checked) {
            //    return;
            //}
            if (this.timeOurHandler) {
                window.clearTimeout(this.timeOurHandler);
            }
            this.setingButton.ButtonType = "Video";
            this.setingButton.style.position = "absolute";
            this.setingButton.style.top = "40px";
            this.setingButton.style.right = "29px";
            this.timeOurHandler = window.setTimeout(lang.hitch(this, "showSetting"), 500, this.setingButton);
        },

        _VideoButtonClick: function (checked) {

            if (checked) {
                this._VideoButtonMouseOut(false);
                var mapPane = appEnv.getCurrentPane();
                if (mapPane.VideoPane) {
                    var requester = mapPane.VideoPane.getCurrentRequest();
                    topic.publish("egis/Map/Resource/GetVideo", requester);
                }
            }
            else {
                var paramObject = { LayerGroup: "视频监控", RemoveType: "GROUP" };
                //先清空原先的标注点
                topic.publish("egis/Map/Remove", paramObject);
            }
        },

        _PoliceButtonMouseOut: function (checked) {
            //if (checked) {
            //    return;
            //}
            if (this.timeOurHandler) {
                window.clearTimeout(this.timeOurHandler);
            }
            this.timeOurHandler = window.setTimeout(lang.hitch(this, "hideSetting"), 500, this.setingButton);

        },

        _PoliceButtonMouseOver: function (checked) {
            //if (checked) {
            //    return;
            //}
            if (this.timeOurHandler) {
                window.clearTimeout(this.timeOurHandler);
            }
            this.setingButton.ButtonType = "Police";
            this.setingButton.style.position = "absolute";
            this.setingButton.style.top = "5px";
            this.setingButton.style.right = "29px";
            this.timeOurHandler = window.setTimeout(lang.hitch(this, "showSetting"), 500, this.setingButton);
        },

        _PoliceButtonClick : function(checked)
        {
            var mapPane = appEnv.getCurrentPane();
            if (checked)
            {
                this._PoliceButtonMouseOut(false);
                if (mapPane.FixedPane) {
                    var requester = mapPane.FixedPane.getCurrentRequest();
                    topic.publish("egis/Map/Resource/GetResource", requester);
                    mapPane.FixedPane.PoliceRequest = requester;
                }

                mapPane.FixedPane.PoliceTimeOut = window.setInterval(lang.hitch(this, function () {

                    var paramObject = { LayerGroup: "警力上图", RemoveType: "GROUP" };
                    //先清空原先的标注点
                    topic.publish("egis/Map/Remove", paramObject);
                    if (mapPane.FixedPane && mapPane.FixedPane.PoliceRequest) {
                        topic.publish("egis/Map/Resource/GetResource", mapPane.FixedPane.PoliceRequest);
                    }

                }), appEnv.appConfig.GPSOffTime * 60 * 1000);
            }
            else
            {
                var paramObject = { LayerGroup: "警力上图", RemoveType: "GROUP" };
                //先清空原先的标注点
                topic.publish("egis/Map/Remove", paramObject);
                if (mapPane.FixedPane.PoliceTimeOut)
                {
                    window.clearInterval(mapPane.FixedPane.PoliceTimeOut);
                }
            }
        },


        _GCCButtonClick: function (checked)
        {
            if (checked) {
                var paramObj = {
                    layersName: "DS_GPS_OTHER",
                    selectType: "like",
                    selectVal: "",
                    comdition: ""
                };
                var requester = { getDataUrl: "/Alarm/QueryOneLayerResourcesByGeoJSON", actionExplain: "工程车一键上图", actionType: "/Resource/ShowGCC", paramObject: paramObj, LayerGroup: "工程车上图", LayerId: "上图工程车" };
                topic.publish("egis/Map/Resource/GeoJson", requester);
            }
            else {
                var paramObj = { LayerGroup: "工程车上图", LayerId: "上图工程车", RemoveType: "ID" };
                //先清空原先的标注点
                topic.publish("egis/Map/Remove", paramObj);
            }
        },

        _DetectorButtonClick: function (checked) {
            if (checked) {
                var paramObj = {
                    layersName: "DS_DETECTOR_SITE",
                    selectType: "like",
                    selectVal: "",
                    comdition: ""
                };
                var requester = { getDataUrl: "/Alarm/QueryOneLayerResourcesByGeoJSON", actionExplain: "卡口一键上图", actionType: "/Resource/ShowDetector", paramObject: paramObj, LayerGroup: "卡口上图", LayerId: "上图卡口" };
                topic.publish("egis/Map/Resource/GeoJson", requester);
            }
            else {
                var paramObj = { LayerGroup: "卡口上图", LayerId: "上图卡口", RemoveType: "ID" };
                //先清空原先的标注点
                topic.publish("egis/Map/Remove", paramObj);
            }
        },

        
        _JRJQButtonMouseOut: function (checked) {

            if (this.timeOurHandler) {
                window.clearTimeout(this.timeOurHandler);
            }
            this.timeOurHandler = window.setTimeout(lang.hitch(this, "hideSetting"), 500, this.setingButton);

        },

        _JRJQButtonMouseOver: function (checked) {
            if (this.timeOurHandler) {
                window.clearTimeout(this.timeOurHandler);
            }
            this.setingButton.ButtonType = "Case";
            this.setingButton.style.position = "absolute";
            this.setingButton.style.top = "5px";
            this.setingButton.style.right = "29px";
            this.timeOurHandler = window.setTimeout(lang.hitch(this, "showSetting"), 500, this.setingButton);
        },

        _JRJQButtonClick: function (checked) {

            if (checked) {
                this._JRJQButtonMouseOut(false);
                var mapPane = appEnv.getCurrentPane();
                if (mapPane.CasePane) {
                    var requester = mapPane.CasePane.getCurrentRequest();
                    topic.publish("egis/Map/Resource/GetCase", requester);

                    if (requester.checkSSYJ) {
                        var paramObj = requester.paramObject;
                        var ssyjRequest = { getDataUrl: "/Case/GetCasesForSSYJ", LayerGroup: "警情上图", LayerId: "四色预警", actionExplain: paramObj.actionExplain, actionType: paramObj.actionType, paramObject: paramObj };
                        topic.publish("egis/Map/Resource/ShowSSYJ", ssyjRequest);
                    }
                }
            }
            else {
                var paramObject = { LayerGroup: "警情上图", RemoveType: "GROUP" };
                //先清空原先的标注点
                topic.publish("egis/Map/Remove", paramObject);
            }
        },


        _WGButtonMouseOut: function (checked) {
            if (this.timeOurHandler) {
                window.clearTimeout(this.timeOurHandler);
            }
            this.timeOurHandler = window.setTimeout(lang.hitch(this, "hideSetting"), 500, this.setingButton);

        },

        _WGButtonMouseOver: function (checked) {
            if (this.timeOurHandler) {
                window.clearTimeout(this.timeOurHandler);
            }
            this.setingButton.ButtonType = "Duty";
            this.setingButton.style.position = "absolute";
            this.setingButton.style.top = "38px";
            this.setingButton.style.right = "29px";
            this.timeOurHandler = window.setTimeout(lang.hitch(this, "showSetting"), 500, this.setingButton);
        },

        _WGButtonClick: function (checked) {

            if (checked) {
                this._WGButtonMouseOut(false);
                var mapPane = appEnv.getCurrentPane();
                if (mapPane.WGPane) {
                    var requester = mapPane.WGPane.getCurrentRequest();
                    topic.publish("egis/Duty/Region", requester);
                    //上图网格警力
                    //mapPane.WGPane._check_WGJL();
                }
            }
            else {
                var paramObject = { LayerGroup: "网格管理", RemoveType: "GROUP" };
                //先清空原先的标注点
                topic.publish("egis/Map/Remove", paramObject);

                var paramObject = { LayerGroup: "网格警力", LayerId: "上图警力", RemoveType: "ID" };
                //先清空原先的标注点
                topic.publish("egis/Map/Remove", paramObject);
            }
        },

        _setingButtonMouseOut: function () {

            if (this.timeOurHandler) {
                window.clearTimeout(this.timeOurHandler);
            }
            this.timeOurHandler = window.setTimeout(lang.hitch(this, "hideSetting"), 500, this.setingButton);

        },

        _setingButtonMouseOver: function () {

            if (this.timeOurHandler) {
                window.clearTimeout(this.timeOurHandler);
            }
            this.timeOurHandler = window.setTimeout(lang.hitch(this, "showSetting"), 500, this.setingButton);
        },

        _setingButtonClick: function () {
            var mapPane = appEnv.getCurrentPane();
            if (this.setingButton.ButtonType == "Video") {
                if (mapPane.VideoBoardPane) {
                    mapPane.VideoBoardPane.show();
                }
            }
            else if (this.setingButton.ButtonType == "Case") {
                if (mapPane.CaseBoardPane) {
                    mapPane.CaseBoardPane.show();
                }
            }
            else if (this.setingButton.ButtonType == "Duty") {
                if (mapPane.WGBoardPane) {
                    mapPane.WGBoardPane.show();
                }
            }
            else {
                if (mapPane.PoliceBoardPane) {
                    mapPane.PoliceBoardPane.show();
                }
            } 
        },

        /**
        * @override
        */
        showSetting : function (domNode,/* Function? */callback) {

            var anim = baseFx.fadeIn({
                node: domNode, duration: this.duration,
                beforeBegin: lang.hitch(this, function () {
                    domNode.style.display = "";
                    domNode.style.visibility = "visible";
                    if (typeof callback == "function") { callback(); }
                    
                })
            }).play();

        },

        hideSetting: function (domNode,/* Function? */ callback) {

            baseFx.fadeOut({
                node: domNode,
                duration: this.duration,
                onEnd: lang.hitch(this, function () {
                    domNode.style.display = "none";
                    domNode.style.visibility = "hidden";
                    if (callback) {
                        callback();
                    }
                })
            }).play();
        },

        destroy: function () {
            this.standby.destroy();
            this.inherited(arguments);
        }

    });

    return MapFloatingPane;

});