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
    "dojo/text!./VideoProjectControl.html",
    'ol'
], function (declare, lang, Evented, Deferred,topic, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, AccordionContainer, AccordionPane, ContentPane,LayoutContainer, Button, TextBox, ImageButton,OrgTree, template, ol) {

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

            this.connect(this.util_video_QJ, "change", lang.hitch(this, this._check_Change));
            this.connect(this.util_video_QQ, "change", lang.hitch(this, this._check_Change));
            this.connect(this.util_video_GK, "change", lang.hitch(this, this._check_Change));

            // 初始化组织结构树
            this.orgTree = new OrgTree({
                checkBoxes: true,
                state: "Loaded",
                showRoot: false,
                style: " height:232px; width:265px; overflow-x:hidden;"
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


        _check_Change: function () {

            var orgIds = [];
            var level = 1;
            var selectOrg = this.orgTree.getTopLevelCheckedList(1);
            if (selectOrg != null) {
                orgIds = selectOrg.orgIds;
                level = selectOrg.orgLevel;
            }

            //获取查询视频资源
            var paramObj = {
                layersName: "Video",
                actionType: "/Alarm/GetVideo",
                actionExplain: "获取查询视频资源",
                checkQJ: this.util_video_QJ.checked,
                checkQQ: this.util_video_QQ.checked,
                checkGK: this.util_video_GK.checked,
                likeVal: this.LikeVal,
                orgIds: orgIds,
                OrgLevel: level
            };
            this.currentRequest = { getDataUrl: "/Alarm/GetVideoResources", LayerGroup: "视频监控", LayerId: "上图视频", actionExplain: paramObj.actionExplain, actionType: paramObj.actionType, paramObject: paramObj };

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