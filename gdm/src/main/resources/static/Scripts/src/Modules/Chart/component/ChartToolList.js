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
    'egis/Modules/Chart/component/CaseComditionPane',
    "egis/Share/component/Button/ImageButton",
    "egis/Share/component/MapFloatPane/MapBoardPane",
    "dojo/text!./ChartToolList.html",
    "egis/Share/component/OrgTree/OrgTree",
    "egis/appEnv"

], function (declare, baseFx, lang, domClass, domGeom, on, topic, TemplatedMixin, _WidgetsInTemplateMixin, ContentPane, Standby, TextBox, Button, TooltipDialog, CaseComditionPane, ImageButton, MapBoardPane, template, OrgTree, appEnv) {

    var MapFloatingPane = declare([ContentPane, TemplatedMixin, _WidgetsInTemplateMixin], {

        standby: null,

        templateString: template,

        duration: 400,

        IsCheckButton: true,

        postCreate: function () {
            this.inherited(arguments);
        },

        startup: function () {
            var me = this;
            this.inherited(arguments);
            
            this.ZZButton.on("click", lang.hitch(this, this._ZZButtonClick));
            this.ZZButton.on("mouseover", lang.hitch(this, this._ZZButtonMouseOver));
            this.ZZButton.on("mouseout", lang.hitch(this, this._ZZButtonMouseOut));
            this.ZZButton.SetState(this.IsCheckButton);

            this.BZButton.on("click", lang.hitch(this, this._BZButtonClick));
            this.BZButton.on("mouseover", lang.hitch(this, this._BZButtonMouseOver));
            this.BZButton.on("mouseout", lang.hitch(this, this._BZButtonMouseOut));
            this.BZButton.SetState(this.IsCheckButton);

            this.XZButton.on("click", lang.hitch(this, this._XZButtonClick));
            this.XZButton.on("mouseover", lang.hitch(this, this._XZButtonMouseOver));
            this.XZButton.on("mouseout", lang.hitch(this, this._XZButtonMouseOut));
            this.XZButton.SetState(this.IsCheckButton);

            this.connect(this.setingButton, "click", lang.hitch(this, this._setingButtonClick));
            this.connect(this.setingButton, "mouseover", lang.hitch(this, this._setingButtonMouseOver));
            this.connect(this.setingButton, "mouseout", lang.hitch(this, this._setingButtonMouseOut));
            
            var mapPane = appEnv.getCurrentPane();

            //增加柱状面板
            mapPane.ZZBoardPane = new MapBoardPane({
                style: "z-index:800;position: absolute;top: 130px;right: 55px;"
            });
            mapPane.ZZCasePane = new CaseComditionPane({
                map: mapPane.map,
                style: "width:100%; height:330px;",
                title: '柱状分析'
            });
            mapPane.ZZCasePane.on("onCheckChange", lang.hitch(this, this._ZZCaseCheckChange));
            mapPane.ZZCasePane.on("mouseout", function () {
                mapPane.ZZBoardPane.mouseout();
            });
            mapPane.ZZCasePane.on("mouseover", function () {
                mapPane.ZZBoardPane.mouseover();
            });
            mapPane.ZZCasePane.on("LockShow", function (IsLock) {
                mapPane.ZZBoardPane.LockShow(IsLock);
            });
            mapPane.ZZBoardPane.addChild(mapPane.ZZCasePane);
            mapPane.addFloatingPane(mapPane.ZZBoardPane);
            mapPane.ZZBoardPane.hide();

            mapPane.BZBoardPane = new MapBoardPane({
                style: "z-index:800;position: absolute;top: 165px;right: 55px;"
            });
            mapPane.BZCasePane = new CaseComditionPane({
                map: mapPane.map,
                style: "width:100%; height:330px;",
                title: '饼状分析'
            });
            mapPane.BZCasePane.on("onCheckChange", lang.hitch(this, this._BZCaseCheckChange));
            mapPane.BZCasePane.on("mouseout", function () {
                mapPane.BZBoardPane.mouseout();
            });
            mapPane.BZCasePane.on("mouseover", function () {
                mapPane.BZBoardPane.mouseover();
            });
            mapPane.BZCasePane.on("LockShow", function (IsLock) {
                mapPane.BZBoardPane.LockShow(IsLock);
            });
            mapPane.BZBoardPane.addChild(mapPane.BZCasePane);
            mapPane.addFloatingPane(mapPane.BZBoardPane);
            mapPane.BZBoardPane.hide();

            //增加警情分析面板
            mapPane.XZBoardPane = new MapBoardPane({
                style: "z-index:800;position: absolute;top: 200px;right: 55px;"
            });
            mapPane.XZCasePane = new CaseComditionPane({
                map: mapPane.map,
                style: "width:100%; height:330px;",
                title: '线状分析'
            });
            mapPane.XZCasePane.on("onCheckChange", lang.hitch(this, this._XZCaseCheckChange));
            mapPane.XZCasePane.on("mouseout", function () {
                mapPane.XZBoardPane.mouseout();
            });
            mapPane.XZCasePane.on("mouseover", function () {
                mapPane.XZBoardPane.mouseover();
            });
            mapPane.XZCasePane.on("LockShow", function (IsLock) {
                mapPane.XZBoardPane.LockShow(IsLock);
            });
            mapPane.XZBoardPane.addChild(mapPane.XZCasePane);
            mapPane.addFloatingPane(mapPane.XZBoardPane);
            mapPane.XZBoardPane.hide();
            
        },


        _ZZCaseCheckChange: function (requester) {
            var check = this.ZZButton.GetState();
            if (check) {
                topic.publish("egis/Chart/ShowChart", requester);
            }
        },

        _XZCaseCheckChange: function (requester) {
            var check = this.XZButton.GetState();
            if (check) {
                requester.getDataUrl = "/caseinfo/getCaseFor24Line";
                topic.publish("egis/Chart/ShowChart", requester);
            }
        },

        _BZCaseCheckChange: function (requester) {
            var check = this.BZButton.GetState();
            if (check) {
                topic.publish("egis/Chart/ShowChart", requester);
            }
        },

        _BZButtonMouseOut: function (checked) {
            if (this.timeOurHandler) {
                window.clearTimeout(this.timeOurHandler);
            }
            this.timeOurHandler = window.setTimeout(lang.hitch(this, "hideSetting"), 500, this.setingButton);

        },

        _BZButtonMouseOver: function (checked) {
            if (this.timeOurHandler) {
                window.clearTimeout(this.timeOurHandler);
            }
            this.setingButton.ButtonType = "BZCase";
            this.setingButton.style.position = "absolute";
            this.setingButton.style.top = "40px";
            this.setingButton.style.right = "29px";
            this.timeOurHandler = window.setTimeout(lang.hitch(this, "showSetting"), 500, this.setingButton);
        },

        _BZButtonClick: function (checked) {

            if (checked) {
                this._BZButtonMouseOut(false);
                var mapPane = appEnv.getCurrentPane();
                if (mapPane.BZCasePane) {
                    var requester = mapPane.BZCasePane.getCurrentRequest();
                    topic.publish("egis/Chart/ShowChart", requester);
                }
            }
            else {
                var paramObject = { actionExplain: "饼状分析", RemoveType: "Chart" };
                //先清空原先的标注点
                topic.publish("egis/Chart/RemoveChart", paramObject);
            }
        },

        _ZZButtonMouseOut: function (checked) {
            if (this.timeOurHandler) {
                window.clearTimeout(this.timeOurHandler);
            }
            this.timeOurHandler = window.setTimeout(lang.hitch(this, "hideSetting"), 500, this.setingButton);
        },


        _ZZButtonMouseOver: function (checked) {
            if (this.timeOurHandler) {
                window.clearTimeout(this.timeOurHandler);
            }
            this.setingButton.ButtonType = "ZZCase";
            this.setingButton.style.position = "absolute";
            this.setingButton.style.top = "5px";
            this.setingButton.style.right = "29px";
            this.timeOurHandler = window.setTimeout(lang.hitch(this, "showSetting"), 500, this.setingButton);
        },


        _ZZButtonClick : function(checked)
        {
            if (checked)
            {
                this._ZZButtonMouseOut(false);
                var mapPane = appEnv.getCurrentPane();
                if (mapPane.ZZCasePane) {
                    var requester = mapPane.ZZCasePane.getCurrentRequest();
                    topic.publish("egis/Chart/ShowChart", requester);
                }
            }
            else {
                var paramObject = { actionExplain: "柱状分析", RemoveType: "Chart" };
                //先清空原先的标注点
                topic.publish("egis/Chart/RemoveChart", paramObject);
            }
        },


        _XZButtonMouseOut: function (checked) {

            if (this.timeOurHandler) {
                window.clearTimeout(this.timeOurHandler);
            }
            this.timeOurHandler = window.setTimeout(lang.hitch(this, "hideSetting"), 500, this.setingButton);

        },

        _XZButtonMouseOver: function (checked) {
            if (this.timeOurHandler) {
                window.clearTimeout(this.timeOurHandler);
            }
            this.setingButton.ButtonType = "XZCase";
            this.setingButton.style.position = "absolute";
            this.setingButton.style.top = "75px";
            this.setingButton.style.right = "29px";
            this.timeOurHandler = window.setTimeout(lang.hitch(this, "showSetting"), 500, this.setingButton);
        },

        _XZButtonClick: function (checked) {

            if (checked) {
                this._XZButtonMouseOut(false);
                var mapPane = appEnv.getCurrentPane();
                if (mapPane.XZCasePane) {
                    var requester = mapPane.XZCasePane.getCurrentRequest();
                    topic.publish("egis/Chart/ShowChart", requester);
                }
            }
            else {
                var paramObject = { actionExplain: "线状分析", RemoveType: "Chart" };
                //先清空原先的标注点
                topic.publish("egis/Chart/RemoveChart", paramObject);
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
            if (this.setingButton.ButtonType == "ZZCase") {
                if (mapPane.ZZBoardPane) {
                    mapPane.ZZBoardPane.show();
                }
            }
            else if (this.setingButton.ButtonType == "BZCase") {
                if (mapPane.BZBoardPane) {
                    mapPane.BZBoardPane.show();
                }
            }
            else {
                if (mapPane.XZBoardPane) {
                    mapPane.XZBoardPane.show();
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