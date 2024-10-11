define([
"dojo/_base/declare",
"dijit/Dialog",
"dojo/dom-style",
"dijit/_Widget",
"dijit/_TemplatedMixin",
"dijit/_WidgetsInTemplateMixin",
"dojo/text!./ConfirmDialogOK.html",
"dojo/json",
"dojo/_base/lang",
"dojo/on",
"dojo/aspect",
"dijit/form/Button"
], function (
declare, Dialog, domStyle, _Widget, _TemplatedMixin, _WidgetsInTemplateMixin,
template, json, lang, on, aspect
) {
    var DialogContentPane = declare([_Widget, _TemplatedMixin, _WidgetsInTemplateMixin], {
        templateString: template
    });

    var dialog = declare(Dialog, {
        title: "提示",
        message: "您确认吗?",
        preventCache: true,
        constructor: function (kwArgs) {
            lang.mixin(this, kwArgs);

            this.content = new DialogContentPane({ parentDialog: this });
        },
        startup: function () {
            this.inherited(arguments);
            var _this = this;

            var signal = aspect.after(_this, "onHide", function () {
                signal.remove(); 
                _this.destroyRecursive(); 
            });

        },
        onExecute: function () { 
            this.yes();
        }
    });
    return dialog;
});