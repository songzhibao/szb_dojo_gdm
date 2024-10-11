define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/_base/array',
    'dijit/Dialog',
	'dojo/text!./Dialog.html',
    'dijit/form/Button'
], function (declare, lang, array, Dialog, template, Button) {
    // egis dialog提示，带确认按钮
    // new Dialog(
    //   title: 'title',
    //   message: {
    //     type: 'warn', //'info', 'warn', 'error'
    //     text: 'text'
    //   }
    // ).show();
    return declare('egis/Share/component/Dialog/Dialog', [Dialog], {
        templateString: template,
        message: null,
        title: '标题',
        mode: null,
        constructor: function () {
            this.buttons = [];
        },
        postCreate: function () {
            this.inherited(arguments);
            if (!this.mode) {
                this.mode = ['ok'];
            }
            if (this.mode.indexOf('ok') >= 0) {
                this.okButton = new Button({
                    label: '确认',
                    baseClass: 'egisButtonOk'
                });
                this.okButton.on('click', lang.hitch(this, function () {
                    this.hide();
                }));
                this.buttons.push(this.okButton);
            }
            if (this.mode.indexOf('cancel') >= 0) {
                this.cancelButton = new Button({
                    label: '取消',
                    baseClass: 'egisButtonCancel'
                });
                this.cancelButton.on('click', lang.hitch(this, function () {
                    this.hide();
                }));
                this.buttons.push(this.cancelButton);
            }
            array.forEach(this.buttons, lang.hitch(this, function (button) {
                button.placeAt(this.buttonsNode);
            }));
        },
        _setMessageAttr: function (message) {
            if (message.type) {
                var cls = null;
                if (message.type == 'error') {
                    cls = 'egisDialogTextIconError';
                } else if (message.type == 'info') {
                    cls = 'egisDialogTextIconInfo';
                } else if (message.type == 'warn') {
                    cls = 'egisDialogTextIconWarn';
                }
                if (cls) {
                    $(this.textNode).addClass(cls);
                }
            }
            if (message.text) {
                $(this.textNode).html(message.text);
            }
        },
        buildRendering: function () {
            this.inherited(arguments);
        },
        startup: function () {
            this.inherited(arguments);
            this.okButton.startup();
        }
    });
});