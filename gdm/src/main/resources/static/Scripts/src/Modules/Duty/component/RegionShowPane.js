/**
* User: yangcheng
* Date: 16-2-19
*/
define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/Evented",
    "dojo/aspect",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dojo/store/Memory",
    "dojo/topic",
    "dojo/on",
    'dojo/request',
    'dojo/_base/array',
    "dojo/_base/connect",
    "dojo/parser",

    "dijit/Dialog",
    "dijit/popup",
    'dijit/_WidgetsInTemplateMixin',
    "dijit/form/CheckBox",
    "dijit/layout/BorderContainer",
    "dijit/layout/ContentPane",
    "dijit/form/DropDownButton",
    "dijit/TooltipDialog",
    "egis/Share/component/MapFloatPane/MapFloatingPane",
    "egis/Share/component/OrgTree/OrgCBTree",
    'egis/appEnv',
    "dojo/text!./RegionShowPane.html"

], function (declare, lang, Evented, aspect, domStyle, domConstruct, Memory, topic, on, request, array, connect,parser, Dialog,
             popup, _WidgetsInTemplateMixin, CheckBox, BorderContainer, ContentPane, DropDownButton, TooltipDialog, MapFloatingPane,OrgTree, appEnv, template) {

    return declare([MapFloatingPane,_WidgetsInTemplateMixin, Evented], {


        templateString: template,

        widgetsInTemplate: true,

        typeCheck: [],

        orgs: [],

        orgSelected: null,

        mcCheck: false,

        xlxlCheck: false,

        postCreate: function () {
            this.inherited(arguments);
        },

        startup: function () {
            this.inherited(arguments);

            this.closeNode.style.display = "none";
            this.dockNode.style.display = "none";
            var me = this;
            var mapPane = appEnv.getCurrentPane();

            // 初始化组织结构树
            this.orgTree = new OrgTree({
                checkBoxes: true,
                state: "Loaded",
                showRoot: false,
                style: " height:230px; width:260px; overflow-x:hidden;"
            }, this.orgNode);


            this.orgTree.on("CheckBoxClick", function (e) {
                me._onClick(null);
            });

            //默认打开巡防图
            me._onClick(null);

            topic.subscribe("egis/Duty/SaveRegion", lang.hitch(this, function () {

                this._onClick(null);

            }));

        },

        _onMCClick: function (args) {
            //默认打开巡防图
            this.mcCheck = args.target.checked;
            this._onClick(null);
        },

        _onClick: function (args) {
            var me = this;
            me.typeCheck = [];
            if (me.checkNodeRegionType_1.checked) {
                me.typeCheck.push(me.checkNodeRegionType_1.value);
            }
            if (me.checkNodeRegionType_3.checked) {
                me.typeCheck.push(me.checkNodeRegionType_3.value);
            }
            if (me.checkNodeRegionType_5.checked) {
                me.typeCheck.push(me.checkNodeRegionType_5.value);
            }
            if (me.checkNodeRegionType_10.checked) {
                me.typeCheck.push(me.checkNodeRegionType_10.value);
            }
            if (me.checkNodeRegionType_0.checked) {
                me.typeCheck.push(me.checkNodeRegionType_0.value);
            }

            var orgIds = me.orgTree.getCheckedIdList();
            var paramObj = {
                orgIds: orgIds,
                regionType: me.typeCheck,
                isShowName: me.mcCheck
            };

            var requester = { getDataUrl: "/duty/getDutyRegionList", actionExplain: "获取网格数据", actionType: "/Duty/QueryByType", paramObject: paramObj,LayerGroup:"网格管理", LayerId: "网格展示" };
            topic.publish("egis/Duty/Region", requester);

        },


        destroy: function () {
            this.inherited(arguments);
        }
    });

});


