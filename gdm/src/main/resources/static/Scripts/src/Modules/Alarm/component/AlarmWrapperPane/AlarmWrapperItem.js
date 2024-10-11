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
    'dojo/json',
    'dojo/request',
    "dojo/aspect",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "egis/Share/component/Button/ImageButton",
    'egis/appEnv',
    "dojo/text!./AlarmWrapperItem.html",
    'ol'

], function (declare, lang, array, domStyle, topic, JSON, request, aspect, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin,
              ImageButton, appEnv, template, ol) {

    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {


        templateString: template,

        widgetsInTemplate: true,

        currentItem: null,

        postCreate: function () {

            this.inherited(arguments);

        },

        startup: function () {
            this.inherited(arguments);
                
            this.itemKeyShow.innerHTML = this.currentItem.actionKey;
            this.itemExplainShow.innerHTML = this.currentItem.actionExplain;
            this.on("click", lang.hitch(this, this._itemSelected));
        },


        _itemSelected: function () {
            var request = JSON.parse(this.currentItem.paramObject);
            topic.publish(this.currentItem.EVENTPath, request);
            
            topic.publish("egis/Alarm/ShowResultGrid", request);
        },


        destroy: function () {
            this.inherited(arguments);


        }
    });
});