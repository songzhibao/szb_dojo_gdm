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
    'dojo/_base/array',
    "dojo/on",
    'dojo/request',
    'dojox/widget/ColorPicker',
    "dijit/_WidgetBase",
    'dijit/_WidgetsInTemplateMixin',
    'dijit/ColorPalette',
    'dijit/form/Textarea',
    'dijit/form/TextBox',
    'dijit/form/Select',
    'dijit/form/DropDownButton',
    'dijit/TooltipDialog',
    'dijit/form/ComboButton',
    "egis/Share/component/MapFloatPane/MapFloatingPane",
    "egis/Share/component/OrgTree/OrgTree",
    "egis/Share/component/OrgTree/CBTree",
    'egis/Share/component/Dialog/Dialog',
    "egis/Modules/Guard/component/GuardInfoItem",
    'egis/appEnv',
    'dojo/text!./GuardListPane.html'
], function (declare, lang, Evented, aspect, domStyle, domConstruct, Memory, topic, array, on, request,ColorPicker,
                _WidgetBase, _WidgetsInTemplateMixin, ColorPalette, Textarea, TextBox, Select, DropDownButton, TooltipDialog, ComboButton, MapFloatingPane, OrgTree, CBTree,Dialog, GuardInfoItem, appEnv, template) {

    return declare([MapFloatingPane,_WidgetsInTemplateMixin, Evented], {

        templateString: template,

        widgetsInTemplate: true,

        startup: function () {
            var me = this;
            this.inherited(arguments);
            this.createButton.on("click", lang.hitch(this, this.CreateButtonClick));
            this.ShowGuardTask();
        },


        ShowGuardTask : function()
        {
            var me = this;
            request.post("/Guard/GetGuardTasks", {
                data: { },
                handleAs: "json"
            }).then(function (List) {
                
                array.forEach(List, function (o) {
                    if (o.Id) {
                        var sp = new GuardInfoItem({ data: o, parentNode: me.gridNode,parent : me });
                        me.gridNode.addChild(sp);
                    }
                });

            }, function (error) {

            });
        },

        EditGuardTask: function (task) {
            topic.publish('egis/Guard/EditTask', task);
            this.close();
        },

        StartGuardTask: function (task) {
            topic.publish('egis/Guard/StartTask', task);
            this.close();
        },


        CreateButtonClick: function () {
            topic.publish('egis/Guard/CreateTask', { TASKID: GetTimeIDString ()});
            this.close();
        }

    });
});
