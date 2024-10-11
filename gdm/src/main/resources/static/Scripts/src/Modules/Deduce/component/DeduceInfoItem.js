/**
* User: yangcheng
* Date: 16-2-19
*/
define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    'dojo/_base/array',
    "dojo/dom-style",
    'dojo/topic',
    'dojo/request',
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dijit/form/TextBox",
    "dijit/form/TimeTextBox",
    'egis/Share/component/Dialog/Dialog',
    "egis/Share/component/Button/ImageButton",
    'egis/appEnv',
    "dojo/text!./DeduceInfoItem.html"

], function (declare, lang, array, domStyle, topic, request, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin,
               TextBox,TimeTextBox, Dialog, ImageButton, appEnv, template) {

    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {


        templateString: template,

        widgetsInTemplate: true,

        data: null,

        parentNode: null,

        parent: null,

        postCreate: function () {

            this.inherited(arguments);
        },

        startup: function () {

            this.inherited(arguments);
            var me = this;
            this.taskDelete.on("click", lang.hitch(this, this.TaskDelete_Click));
            this.taskEdit.on("click", lang.hitch(this, this.TaskEdit_Click));
            this.taskStart.on("click", lang.hitch(this, this.TaskStart_Click));

            if (this.data != null) {
                this.taskName.setValue(this.data.Name);
                this.taskBegin.setDisplayedValue(this.data.BeginTime.split('T')[0]);
                this.taskEnd.setDisplayedValue(this.data.EndTime.split('T')[0]);
                this.taskBH.setValue(this.data.Id);
            }
        },

        TaskDelete_Click : function()
        {
            var dialog = new Dialog({
                title: '提示',
                style: "width: 400px;height:220px;",
                mode: ['ok', 'cancel'],
                message: {
                    type: 'warn',
                    text: '确认删除任务 [' + this.data.Name + ']？'
                }
            });
            dialog.okButton.on('click', lang.hitch(this, function () {

                request.post("/Deduce/DeleteGuardTask", {
                    data: {
                        taskId: this.data.Id
                    },
                    handleAs: "json"
                }).then(lang.hitch(this, function (data) {
                    if (data.success)
                    {
                        if (this.parentNode) {
                            this.parentNode.removeChild(this);
                        }
                    }
                })
               );
            }));
            dialog.show();
        },

        TaskEdit_Click: function () {
            if (this.parent) {
                this.parent.EditGuardTask(this.data);
            }
        },

        TaskStart_Click: function () {
            if (this.parent) {
                this.parent.StartGuardTask(this.data);
            }
        },

        destroy: function () {
            this.inherited(arguments);
        }
    });
});