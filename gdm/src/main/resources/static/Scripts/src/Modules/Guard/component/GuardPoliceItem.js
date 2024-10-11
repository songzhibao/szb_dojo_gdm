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
    "dojo/text!./GuardPoliceItem.html"

], function (declare, lang, array, domStyle, topic, request, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin,
               TextBox,TimeTextBox, Dialog, ImageButton, appEnv, template) {

    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {


        templateString: template,

        widgetsInTemplate: true,

        data: null,

        parentNode : null,

        postCreate: function () {

            this.inherited(arguments);
        },

        startup: function () {

            this.inherited(arguments);
            var me = this;
            this.xlDelete.on("click", lang.hitch(this, this._xlDelete_Click));

            var infoArray = me.data.split(',');
            if (infoArray != null && infoArray.length > 0) {
                this.xlXM.setValue(infoArray[0].split('：')[1]);
                this.xlZW.setValue(infoArray[1].split('：')[1]);
                //this.xlJH.setValue(infoArray[2].split('：')[1]);
                //this.xlSDC.setDisplayedValue(infoArray[3].split('：')[1]);
                //this.xlSDZ.setDisplayedValue(infoArray[4].split('：')[1]);
                this.xlSJ.setValue(infoArray[2].split('：')[1]);
                this.xlBH.setValue(infoArray[3].split('：')[1]);
            }
        },

        _xlDelete_Click : function()
        {
            if (this.parentNode) {
                this.parentNode.removeChild(this);
            }
        },

        getValuesString: function () {
            //return "姓名：" + this.xlXM.value + ",职务：" + this.xlZW.value + ",警号：" + this.xlJH.value + ",时段 从：" + this.xlSDC.displayedValue + ",至：" + this.xlSDZ.displayedValue + ",手机：" + this.xlSJ.value;
            return "民警：" + this.xlXM.value + ",职务：" + this.xlZW.value + ",联系电话：" + this.xlSJ.value + ",编号：" + this.xlBH.value;

        },

        destroy: function () {
            this.inherited(arguments);
        }
    });
});