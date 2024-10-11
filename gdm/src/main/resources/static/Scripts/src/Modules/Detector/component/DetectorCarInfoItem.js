define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    'dojo/_base/array',
    "dojo/dom-style",
    'dojo/topic',

    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "egis/Share/component/Button/ImageButton",
    "dojo/text!./DetectorCarInfoItem.html"

], function (declare, lang, array, domStyle, topic, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, ImageButton, template) {

    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {

        templateString: template,

        widgetsInTemplate: true,

        postCreate: function () {

            this.inherited(arguments);
        },

        startup: function () {

            if (this.data != null) {

                var result = this.data;

                this.inherited(arguments);
                this.iconImg.src = result.imagePath;
                this.detectorTime.innerHTML += result.passTime.replace("T", " ");
                this.detectorInfo.innerHTML += "<b>" + result.carPlateNumber + " 时速:" + result.speed + " km/h " + "</b>";
            }
        },

        destroy: function () {
            this.inherited(arguments);
        }
    });
});