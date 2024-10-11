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
    'egis/Modules/Home/component/WorkStation/WorkStationItem',
    "dojo/text!./WorkStationSwitch.html",
    "egis/appEnv"

], function (declare, baseFx, lang, domClass, domGeom, on, topic, TemplatedMixin, _WidgetsInTemplateMixin, ContentPane, Standby, TextBox, Button, TooltipDialog,WorkStationItem , template, appEnv) {

    var MapFloatingPane = declare([ContentPane, TemplatedMixin, _WidgetsInTemplateMixin], {

        standby: null,

        templateString: template,

        duration: 400,

        selectWidget: null,


        postCreate: function () {
            this.inherited(arguments);
        },

        startup: function () {
            var me = this;
            this.inherited(arguments);        

            this.connect(this.StationPane, "mouseout", lang.hitch(this, "mouseout"));
            this.connect(this.StationPane, "mouseover", lang.hitch(this, "mouseover"));

        },

        DeleteChild : function(childWidget)
        {
            this.removeChild(childWidget);

            if (this.selectWidget.id == childWidget.id) {
                this.switchDesktop();
            }
            topic.publish("egis/Home/RemoveDesktop", childWidget);

        },

        switchDesktop : function (childWidget) {

            var list = this.getChildren();
            if (list != null && list.length > 0) {
                for (var num = 0; num < list.length; num++) {
                    list[num].domNode.style.zIndex = num;
                    this.selectWidget = list[num];
                }
            }
            else {
                return;
            }
            if (childWidget)
            {
                this.selectWidget = childWidget;
            }
            this.selectWidget.domNode.style.zIndex = 100;
            topic.publish("egis/Home/SwitchDesktop", this.selectWidget);

        },

        mouseout: function () {
            if (domClass.contains(this.StationPane, "expand")) {
                domClass.remove(this.StationPane, "expand");
            }
            var list = this.getChildren();
            if (list != null) {
                for (var num = 0; num < list.length; num++) {
                    list[num].domNode.style.right = "0px";
                }
            }
            this.containerNode.style.width = "130px";
        },

        mouseover: function () {
            domClass.add(this.StationPane, "expand");
            var list = this.getChildren();
            if (list != null)
            {
                for (var num = 0; num < list.length; num++)
                {
                    list[num].domNode.style.right = (num * 130) + "px";
                }
            }
            this.containerNode.style.width = (list.length * 130) + "px";
        },

        AddNewStation : function (info) {

            this.selectWidget = new WorkStationItem({
                name: info.name,
                imgsrc: info.imgsrc,
                WorkStation: this,
                WorkIframe : info.workIframe
            });
            this.addChild(this.selectWidget);

            this.switchDesktop(this.selectWidget);
        },


        destroy: function () {
            this.standby.destroy();
            this.inherited(arguments);
        }

    });

    return MapFloatingPane;

});