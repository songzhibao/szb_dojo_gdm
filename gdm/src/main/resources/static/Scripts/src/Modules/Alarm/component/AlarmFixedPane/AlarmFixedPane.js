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
    "dojo/Evented",
    "dojo/on",
    'dojo/topic',
    "dijit/_TemplatedMixin",
    'dijit/_WidgetsInTemplateMixin',
    "dojox/layout/ContentPane",
    "dojox/widget/Standby",
    'dijit/form/TextBox',
    "dijit/_WidgetBase",
    'dijit/form/Button',
    'dijit/TooltipDialog',
    'dijit/form/DropDownButton',
    "dojo/text!./AlarmFixedPane.html",
    "egis/Share/component/OrgTree/OrgCBTree",
    "egis/appEnv"

], function (declare, baseFx, lang, domClass, domGeom,Evented, on, topic, TemplatedMixin, _WidgetsInTemplateMixin, ContentPane, Standby, TextBox,_WidgetBase, Button, TooltipDialog, DropDownButton, template, OrgTree,appEnv) {

    var AlarmFixedPane = declare([_WidgetBase, TemplatedMixin, _WidgetsInTemplateMixin, Evented], {

        standby: null,

        templateString: template,

        LikeVal: "",

        currentRequest: null,

        IsOnline : false,

        postCreate: function () {
            this.inherited(arguments);

        },

        startup: function () {
            var me = this;
            this.inherited(arguments);

            this.connect(this.util_police_manDJJ, "change", lang.hitch(this, this._check_Change));
            this.connect(this.util_police_manJWT, "change", lang.hitch(this, this._check_Change));
            this.connect(this.util_police_car, "change", lang.hitch(this, this._check_Change));
            this.connect(this.util_police_xjDJJ, "change", lang.hitch(this, this._check_Change));
            this.connect(this.util_police_xjJWT, "change", lang.hitch(this, this._check_Change));
            this.connect(this.util_police_BB, "change", lang.hitch(this, this._check_Change));
            this.connect(this.util_police_CJ, "change", lang.hitch(this, this._check_Change));
            this.connect(this.util_police_ZX, "change", lang.hitch(this, this._check_Change));
            this.connect(this.util_police_CZ, "change", lang.hitch(this, this._check_Change));
            this.connect(this.util_police_point, "change", lang.hitch(this, this._check_Change));
            this.connect(this.util_police_cold, "change", lang.hitch(this, this._check_Change));

            this.util_police_ZX.checked = this.IsOnline;

            // 初始化组织结构树
            this.orgTree = new OrgTree({
                checkBoxes: true,
                state: "Loaded",
                showRoot: false,
                style: " height:160px; width:265px; overflow-x:hidden;"
            }, this.orgNode);

            this.orgTree.on("CheckBoxClick", function (e) {
                me._check_Change();
            });

            me._check_Change();
        },

        SelectByText : function(txtValue)
        {
            this.LikeVal = txtValue;
            this._check_Change();
        },


        _check_Change : function()
        {
            var orgIds = [];
            var level = 1;
            var selectOrg = this.orgTree.getTopLevelCheckedList(1);
            if(selectOrg != null)
            {
                orgIds = selectOrg.orgIds;
                level = selectOrg.orgLevel;
            }
            //获取周边警力资源
            var paramObj = {
                actionType: "/Alarm/GetDeviceResources",
                actionExplain: "获取全市警力资源",
                checkCAR: this.util_police_car.checked,
                checkmanDJJ: this.util_police_manDJJ.checked,
                checkmanJWT: this.util_police_manJWT.checked,
                checkxjDJJ: this.util_police_xjDJJ.checked,
                checkxjJWT: this.util_police_xjJWT.checked,
                checkmanQT: false,
                checkBB: this.util_police_BB.checked,
                checkCJ: this.util_police_CJ.checked,
                checkZX: this.util_police_ZX.checked,
                checkCZ: this.util_police_CZ.checked,
                checkSTSD: this.util_police_point.checked,
                checkSTBD: this.util_police_cold.checked,
                likeVal: this.LikeVal,
                orgIds: orgIds,
                OrgLevel: level,
                GPSOffTime: appEnv.appConfig.GPSOffTime
            };
            this.currentRequest = { getDataUrl: "/Alarm/GetDeviceResources", LayerGroup: "警力上图", LayerId: "上图警力", actionExplain: paramObj.actionExplain, actionType: paramObj.actionType, paramObject: paramObj };

            this.emit("onCheckChange", this.currentRequest);
        },


        getCurrentRequest : function()
        {
            return this.currentRequest;
        },

        destroy: function () {
            this.inherited(arguments);
        }

    });

    return AlarmFixedPane;

});