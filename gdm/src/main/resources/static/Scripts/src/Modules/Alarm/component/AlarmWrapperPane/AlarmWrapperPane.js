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
    "dojo/aspect",
    "dojox/layout/ContentPane",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "egis/Modules/Alarm/component/AlarmWrapperPane/AlarmWrapperItem",
    'egis/appEnv',
    "dojo/text!./AlarmWrapperPane.html",
    'ol'

], function (declare, lang, array, domStyle, topic, request, aspect, ContentPane, _TemplatedMixin, _WidgetsInTemplateMixin,
              AlarmWrapperItem, appEnv, template, ol) {

    return declare([ContentPane, _TemplatedMixin, _WidgetsInTemplateMixin], {

        templateString: template,

        widgetsInTemplate: true,

        requestParam: null, 

        postCreate: function () {

            this.inherited(arguments);

        },

        startup: function () {
            this.inherited(arguments);
            var me = this;
            request.post("/Action/GetActionList", {
                data: this.requestParam,
                handleAs: "json"
            }).then(
                function (actionList) {
                    if (actionList != null)
                    {
                        for (var num = 0; num < actionList.length; num++)
                        {
                            var item = new AlarmWrapperItem({ currentItem: actionList[num] });
                            me.addChild(item);
                        }
                    }
                }
            );
        },

        destroy: function () {
            this.inherited(arguments);

        }
    });
});