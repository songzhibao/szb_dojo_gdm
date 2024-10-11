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
    'dijit/form/DropDownButton',
    "dojo/text!./MapToolPane.html",
    "egis/Share/component/OrgTree/OrgTree",
    "egis/appEnv"

], function (declare, baseFx, lang, domClass, domGeom, on,topic, TemplatedMixin, _WidgetsInTemplateMixin, ContentPane, Standby, TextBox,Button, TooltipDialog, DropDownButton, template, OrgTree,appEnv) {

    var MapFloatingPane = declare([ContentPane, TemplatedMixin, _WidgetsInTemplateMixin], {

        standby: null,

        templateString: template,


        postCreate: function () {
            this.inherited(arguments);

        },

        startup: function () {
            var me = this;
            this.inherited(arguments);
            on(this.util_control, "click", lang.hitch(this, this._util_controlClick));
            on(this.util_traffic, "click", lang.hitch(this, this._util_trafficClick));
            //on(this.util_police, "click", lang.hitch(this, this._util_policeClick));

            on(this.util_police_car, "change", lang.hitch(this, this._check_Change));
            on(this.util_police_man, "change", lang.hitch(this, this._check_Change));
            on(this.util_police_JWT, "change", lang.hitch(this, this._check_Change));
            on(this.util_police_BB, "change", lang.hitch(this, this._check_Change));
            on(this.util_police_CJ, "change", lang.hitch(this, this._check_Change));
            on(this.util_police_ZX, "change", lang.hitch(this, this._check_Change));

            on(this.clearButton, "change", lang.hitch(this, this._clearButtonClick));

            on(this.util_control_measure, "click", lang.hitch(this, this._util_control_measureClick));
            on(this.util_control_mark, "click", lang.hitch(this, this._util_control_markClick));
            on(this.util_control_share, "click", lang.hitch(this, this._util_control_shareClick));

            // 初始化组织结构树
            //this.orgTree = new OrgTree({
            //    checkBoxes: true,
            //    state: "Loaded",
            //    showRoot: false,
            //    style: " height:220px; width:240px; overflow-x:hidden;"
            //}, this.orgNode);


            //this.orgTree.on("click", function (e) {
            //    me.orgName.set("value", e.name);
            //    me._check_Change();
            //});
        },

        _util_control_shareClick: function () {

            topic.publish("egis/Map/Remove", { RemoveType: "ALL" });

        },

        _util_control_markClick: function () {
            var markerInfo = { LayerGroup: "交互图层", LayerId: "标记坐标" };
            topic.publish("egis/Map/BeginDrawMarker", markerInfo);
        },

        _util_control_measureClick: function () {
            topic.publish("egis/Map/BeginLineMeasure", null);
        },

        _clearButtonClick : function()
        {
            var paramObject = { LayerGroup: "警力上图", RemoveType: "GROUP" };
            //先清空原先的标注点
            topic.publish("egis/Map/Remove", paramObject);
        },

        _check_Change : function()
        {
            var paramObject = { LayerGroup: "警力上图", RemoveType: "GROUP" };
            //先清空原先的标注点
            topic.publish("egis/Map/Remove", paramObject);

            var orgIds = [];
            var level = 1;
            var selectOrg = this.orgTree.getSelectedOrgInfo(1);
            if(selectOrg != null)
            {
                orgIds = [selectOrg.orgId];
                level = selectOrg.level;
            }
            //获取周边警力资源
            var paramObj = {
                actionType: "/Alarm/GetDeviceResources",
                actionExplain: "获取全市警力资源",
                checkCAR: this.util_police_car.checked,
                checkMan: this.util_police_man.checked,
                checkJWT: this.util_police_JWT.checked,
                checkBB: this.util_police_BB.checked,
                checkCJ: this.util_police_CJ.checked,
                checkZX: this.util_police_ZX.checked,
                orgIds: orgIds,
                checkSTSD: true,
                checkSTBD: false,
                OrgLevel: level,
                GPSOffTime: appEnv.appConfig.GPSOffTime
            };
            var requester = { getDataUrl: "/Alarm/GetDeviceResources", LayerGroup: "警力上图", LayerId: "上图警力", actionExplain: paramObj.actionExplain, actionType: paramObj.actionType, paramObject: paramObj};
            topic.publish("egis/Map/Resource/GetResource", requester);

        },

        _util_controlClick : function()
        {
            var node = this.util_traffic_em;
            if (domClass.contains(node, "active")) {
                domClass.remove(node, "active");
            }
            else {
                domClass.add(node, "active");
            }
            var display = this.util_traffic_detail.style.display;
            if (display == "none") {
                this.util_traffic_detail.style.display = "block";
            }
            else {
                this.util_traffic_detail.style.display = "none"
            }
            
        },

        _util_trafficClick: function () {

        },

        _util_policeClick: function () {
            var node = this.util_police_em;
            if (domClass.contains(node, "active")) {
                domClass.remove(node, "active");
            }
            else {
                domClass.add(node, "active");
            }
            var display = this.util_police_detail.style.display;
            if (display == "none") {
                this.util_police_detail.style.display = "block";
            }
            else {
                this.util_police_detail.style.display = "none"
            }
        },

        destroy: function () {
            this.standby.destroy();
            this.inherited(arguments);
        }

    });

    return MapFloatingPane;

});