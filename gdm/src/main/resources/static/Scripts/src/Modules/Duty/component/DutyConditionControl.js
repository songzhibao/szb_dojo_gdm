/**
* User: chengbin
* Date: 13-4-1
*/
define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/Evented",
    "dojo/Deferred",
    'dojo/topic',
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dijit/layout/AccordionContainer",
    "dijit/layout/AccordionPane",
    "dijit/layout/ContentPane",
    "dijit/layout/LayoutContainer",
    "dijit/form/Button",
    "dijit/form/TextBox",

    "egis/Share/component/Button/ImageButton",
    "egis/Share/component/OrgTree/OrgCBTree",
    "dojo/text!./DutyConditionControl.html",
    'ol'
], function (declare, lang, Evented, Deferred, topic, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, AccordionContainer, AccordionPane, ContentPane, LayoutContainer, Button, TextBox, ImageButton, OrgTree, template, ol) {

    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Evented], {

        templateString: template,

        widgetsInTemplate: true,

        map: null,

        me: null,

        LikeVal: "",

        currentRequest: null,

        startup: function () {
            this.inherited(arguments);
            me = this;

            this.connect(this.util_duty_RCXL, "change", lang.hitch(this, this._check_Change));
            this.connect(this.util_duty_ZDXL, "change", lang.hitch(this, this._check_Change));
            this.connect(this.util_duty_ZDHD, "change", lang.hitch(this, this._check_Change));
            this.connect(this.util_duty_SZJC, "change", lang.hitch(this, this._check_Change));
            this.connect(this.util_duty_QTLX, "change", lang.hitch(this, this._check_Change));

            //this.connect(this.util_duty_WGJL, "change", lang.hitch(this, this._check_WGJL));
            // 初始化组织结构树
            this.orgTree = new OrgTree({
                checkBoxes: true,
                state: "Loaded",
                showRoot: false,
                style: " height:200px; width:265px; overflow-x:hidden;"
            }, this.orgNode);

            this.orgTree.on("CheckBoxClick", function (e) {
                me._check_Change();
            });

            this._check_Change();
        },


        SelectByText: function (txtValue) {
            this.LikeVal = txtValue;
            this._check_Change();
        },

        _check_WGJL : function()
        {
            if (this.util_duty_WGJL.checked) {
                var requester = this.getCurrentRequest();
                var paramObj = requester.paramObject;
                var wgjlRequest = { getDataUrl: "/Alarm/GetDeviceResourcesForDuty", LayerGroup: "网格警力", LayerId: "上图警力", actionExplain: paramObj.actionExplain, actionType: paramObj.actionType, paramObject: paramObj };

                //topic.publish("egis/Map/Resource/GetResource", wgjlRequest);
            }
            else {
                var paramObject = { LayerGroup: "网格警力", LayerId: "上图警力", RemoveType: "ID" };
                //先清空原先的标注点
                topic.publish("egis/Map/Remove", paramObject);
            }
        },

        _check_Change: function () {
            var me = this;
            var orgIds = me.orgTree.getCheckedIdList();
            me.typeCheck = [];
            if (me.util_duty_RCXL.checked) {
                me.typeCheck.push(me.util_duty_RCXL.value);
            }
            if (me.util_duty_ZDXL.checked) {
                me.typeCheck.push(me.util_duty_ZDXL.value);
            }
            if (me.util_duty_ZDHD.checked) {
                me.typeCheck.push(me.util_duty_ZDHD.value);
            }
            if (me.util_duty_SZJC.checked) {
                me.typeCheck.push(me.util_duty_SZJC.value);
            }
            if (me.util_duty_QTLX.checked) {
                me.typeCheck.push(me.util_duty_QTLX.value);
            }

            //获取查询视频资源
            var paramObj = {
                actionType: "/Duty/QueryByType",
                actionExplain: "获取网格数据",
                orgIds: orgIds,
                regionType: me.typeCheck,
                checkSTSD: true,
                checkSTBD: false,
                isShowName: true
            };
            this.currentRequest = { getDataUrl: "/duty/getDutyRegionList", LayerGroup: "网格管理", LayerId: "网格展示", actionExplain: paramObj.actionExplain, actionType: paramObj.actionType, paramObject: paramObj };

            this.emit("onCheckChange", this.currentRequest);
        },

        getCurrentRequest: function () {

            return this.currentRequest;
        },

        destroy: function () {

            me.map.removeLayer(me.drawVector);
        }

    });
});