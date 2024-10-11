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
    "dojo/text!./LineSettingWidget.html"

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
            this.saveItemButton.on("click", lang.hitch(this, this.Save_Click));
            this.cacelItemButton.on("click", lang.hitch(this, this.Cancel_Click));
            this.deleteItemButton.on("click", lang.hitch(this, this.Delete_Click));

            this.regionColorPicker.on("change", lang.hitch(this, this.colorPickerOnChange));

            if (this.data != null) {
                this.ItemName.setValue(this.data.MC);
                this.ItemStage.setValue(this.data.Stage);
                this.ItemSpinner.setValue(this.data.LineWidth);
                this.colorPickerOnChange(this.data.LineColor);
            }
        },

        colorPickerOnChange: function (color) {
            this.ItemFillColor.domNode.style.backgroundColor = color;
            this.ItemFillColor.setValue(color);
        },

        Save_Click: function () {
            request.post("/deduce/saveRegionInfo", {
                data: {
                    Id: this.data.id,
                    Name: this.ItemName.getValue(),
                    Stage: this.ItemStage.getValue(),
                    LineWidth: this.ItemSpinner.getValue(),
                    LineColor: this.ItemFillColor.getValue(),
                    FillColor: "",
                    Opacite : 1
                },
                handleAs: "json"
            }).then(lang.hitch(this, function (data) {
                var msg = "信息保存成功！";
                if (data.success) {
                    if (this.parentNode) {
                        this.parentNode.removeChild(this);
                    }
                    topic.publish('egis/Deduce/SaveDeducePoint', null);
                }
                else {
                    msg = "信息保存失败,请重新操作试试！";
                }
                topic.publish("egis/messageNotification", { type: "info", text: msg });
            })
            );
        },

        Delete_Click: function () {
            var dialog = new Dialog({
                title: '提示',
                style: "width: 400px;height:220px;",
                mode: ['ok', 'cancel'],
                message: {
                    type: 'warn',
                    text: '确认删除 [' + this.data.MC + ']？'
                }
            });
            dialog.okButton.on('click', lang.hitch(this, function () {

                request.post("/deduce/deleteDeduceRegion", {
                    data: {
                        id: this.data.Id
                    },
                    handleAs: "json"
                }).then(lang.hitch(this, function (data) {
                    if (data.success) {
                        if (this.parentNode) {
                            this.parentNode.removeChild(this);
                        }
                        topic.publish('egis/Deduce/SaveDeducePoint', null);
                    }
                })
               );
            }));
            dialog.show();
        },

        Cancel_Click: function () {
            if (this.parentNode) {
                this.parentNode.removeChild(this);
            }
        },

        destroy: function () {
            this.inherited(arguments);
        }
    });
});