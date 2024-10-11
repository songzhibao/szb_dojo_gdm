/**
* User: songzhibao
* Date: 18-2-5
*/
define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/Evented",
    'dojo/_base/array',
    'dojo/_base/array',
    "dojo/dom-style",
    "dojo/dom-construct",
    "dojo/store/Memory",
    "dojo/topic",
    'dojo/request',
    'dijit/form/Button',
    "egis/Share/component/MapFloatPane/MapFloatingPane",
    "egis/Modules/Alarm/component/ManualMarke/ManualMarkeItem",
    "egis/appEnv"
], function (declare, lang, Evented, array, array, domStyle, domConstruct, Memory, topic, request,Button, MapFloatingPane,ManualMarkeItem, appEnv) {

    return declare([MapFloatingPane, Evented], {

        caseList : null,

        postCreate: function () {
            this.inherited(arguments);
            this.caseList = [];
            var clearButton = new Button({
                label: "清空已定位警情",
                style: "float:right"
            }, document.createElement('div'));
            clearButton.on("click", lang.hitch(this, this.clearButtonClick));

            this.buttons = [clearButton];
        },

        startup: function () {
            this.inherited(arguments);
        },




        AddManualCase : function (info) {
            var cc = new ManualMarkeItem({ data: info, ParentPane : this });
            this.addChild(cc);
            this.caseList.push(cc);
        },


        clearButtonClick: function () {

            var me = this;
            array.forEach(this.caseList, lang.hitch(this, function (cc) {

                if (cc.data.status == 1) {
                    me.removeChild(cc);
                    topic.publish('egis/Manual/DeleteMarkerItem', cc);
                }

            }));
        },

        destroy: function () {
            this.inherited(arguments);
        }

    });

});