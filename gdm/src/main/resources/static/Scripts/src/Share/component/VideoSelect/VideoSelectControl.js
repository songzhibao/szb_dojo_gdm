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
    'egis/Share/component/OrgTree/OrganizationTextBox',
    "egis/Share/component/Button/ImageButton",
    "egis/Share/component/OrgTree/OrgCBTree",
    "dojo/text!./VideoSelectControl.html",
    'ol'
], function (declare, lang, Evented, Deferred,topic, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, AccordionContainer, AccordionPane, ContentPane,LayoutContainer, Button, TextBox,OrganizationTextBox, ImageButton,OrgTree, template, ol) {

    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Evented], {

        templateString: template,

        widgetsInTemplate: true,

        JXCXButton: null,

        YXCXButton: null,

        DBXCXButton: null,

        me: null,

        LikeVal: "",

        startup: function () {
            this.inherited(arguments);

            me = this;

            this._addKJCXButtons();

            //// 初始化组织结构树
            //this.orgTree = new OrgTree({
            //    checkBoxes: true,
            //    state: "Loaded",
            //    showRoot: false,
            //    style: " height:200px; width:260px; overflow-x:hidden;"
            //}, this.orgNode);


            //this.orgTree.on("CheckBoxClick", function (e) {
                
            //});

        },


        SelectByText: function (txtValue) {
            this.LikeVal = txtValue;
            this._onDrawed('','like',txtValue);
        },


        _addKJCXButtons: function () {


            this.JXCXButton = new ImageButton({
                unpressedImg: "/Content/themes/blue/images/rect-1.gif",
                pressedImg: "/Content/themes/blue/images/rect-2.gif",
                text: "矩形",
                style: "padding:8px 20px 20px 20px;",
                layoutAlign: "left",
                enableToggle: true
            });
            this.JXCXButton.on("click", lang.hitch(this, this._BoxButtonClick));
            this.kjcxAccordionPane.addChild(this.JXCXButton);


            this.YXCXButton = new ImageButton({
                unpressedImg: "/Content/themes/blue/images/cir-1.gif",
                pressedImg: "/Content/themes/blue/images/cir-2.gif",
                text: "圆形",
                style: "padding:8px 20px 20px 20px;",
                layoutAlign: "left",
                enableToggle: true
            });
            this.YXCXButton.on("click", lang.hitch(this, this._CircleButtonClick));
            this.kjcxAccordionPane.addChild(this.YXCXButton);

            this.DBXCXButton = new ImageButton({
                unpressedImg: "/Content/themes/blue/images/polyg-1.gif",
                pressedImg: "/Content/themes/blue/images/polyg-2.gif",
                text: "多边形",
                style: "padding:8px 20px 20px 20px;",
                layoutAlign: "left",
                enableToggle: true
            });
            this.DBXCXButton.on("click", lang.hitch(this, this._PolygonButtonClick));
            this.kjcxAccordionPane.addChild(this.DBXCXButton);

            this.XXCXButton = new ImageButton({
                unpressedImg: "/Content/themes/blue/images/poline-1.gif",
                pressedImg: "/Content/themes/blue/images/poline-2.gif",
                text: "线选",
                style: "padding:8px 10px 20px 10px;",
                layoutAlign: "left",
                enableToggle: true
            });
            this.XXCXButton.on("click", lang.hitch(this, this._PolylineButtonClick));
            this.kjcxAccordionPane.addChild(this.XXCXButton);

        },

        ButtonCancel: function () {
            var me = this;
            var queryInfo = { LayerGroup: "交互图层", LayerId: "空间查询" };
            topic.publish("egis/Map/CancelGeometryQuery", queryInfo);
            me.YXCXButton.UnPressed();
            me.DBXCXButton.UnPressed();
            me.XXCXButton.UnPressed();
            me.JXCXButton.UnPressed();
        },

        _BoxButtonClick: function (pressed) {

            var queryInfo = { LayerGroup: "交互图层", LayerId: "空间查询", DrawType: "rect", value: "" };

            var me = this;
            me.YXCXButton.UnPressed();
            me.DBXCXButton.UnPressed();
            me.XXCXButton.UnPressed();
            if (pressed) {
                topic.publish("egis/Map/BeginGeometryQuery", queryInfo);
            }
            else {
                me.JXCXButton.UnPressed();
                topic.publish("egis/Map/CancelGeometryQuery", queryInfo);
            }
        },

        _CircleButtonClick: function (pressed) {

            var queryInfo = { LayerGroup: "交互图层", LayerId: "空间查询", DrawType: "circle", value: "" };

            var me = this;
            me.JXCXButton.UnPressed();
            me.DBXCXButton.UnPressed();
            me.XXCXButton.UnPressed();
            if (pressed) {
                topic.publish("egis/Map/BeginGeometryQuery", queryInfo);
            }
            else {
                me.YXCXButton.UnPressed();
                topic.publish("egis/Map/CancelGeometryQuery", queryInfo);
            }
        },

        _PolygonButtonClick: function (pressed) {

            var queryInfo = { LayerGroup: "交互图层", LayerId: "空间查询", DrawType: "polygon", value: "" };

            var me = this;
            me.YXCXButton.UnPressed();
            me.JXCXButton.UnPressed();
            me.XXCXButton.UnPressed();
            if (pressed) {
                topic.publish("egis/Map/BeginGeometryQuery", queryInfo);
            }
            else {
                me.DBXCXButton.UnPressed();
                topic.publish("egis/Map/CancelGeometryQuery", queryInfo);
            }
        },

        _PolylineButtonClick: function (pressed) {

            var queryInfo = { LayerGroup: "交互图层", LayerId: "空间查询", DrawType: "line", value: "" };

            var me = this;
            me.YXCXButton.UnPressed();
            me.JXCXButton.UnPressed();
            me.DBXCXButton.UnPressed();
            if (pressed) {
                topic.publish("egis/Map/BeginGeometryQuery", queryInfo);
            }
            else {
                me.XXCXButton.UnPressed();
                topic.publish("egis/Map/CancelGeometryQuery", queryInfo);
            }
        },


        destroy: function () {

        }

    });
});