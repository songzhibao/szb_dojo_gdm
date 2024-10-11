/**
* User: shenyi
* Date: 13-9-6
*/
define([
    "dojo/_base/declare",
    "dojo/Evented",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",

    "dojo/text!./DateTimeRangePicker.html",
    './DateTimePicker',
    './_TimeSpanPicker'
], function (declare,Evented, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template, DateTimePicker, _TimeSpanPicker) {

    return declare('egis/Share/component/DateTime/DateTimeRangePicker', [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, _TimeSpanPicker, Evented], {
        templateString: template,
        startTime: null,
        endTime: null,
        constructor: function () {
        },
        buildRendering: function () {
            this.inherited(arguments);
        },
        postCreate: function () {
            var me = this;
            this.inherited(arguments);
            if (this.startTime) this.set('startTime', this.startTime);
            if (this.endTime) this.set('endTime', this.endTime);

            this.connect(this.startTimeNode.domNode, "mouseout", function () {
                me.emit("mouseout");
            });
            this.connect(this.startTimeNode.domNode, "mouseover", function () {
                me.emit("mouseover");
            });
            this.connect(this.endTimeNode.domNode, "mouseout", function () {
                me.emit("mouseout");
            });
            this.connect(this.endTimeNode.domNode, "mouseover", function () {
                me.emit("mouseover");
            });
        },
        _setStartTimeAttr: function (value) {
            this.startTimeNode.set('value', value);
        },
        _setEndTimeAttr: function (value) {
            this.endTimeNode.set('value', value);
        },
        _getStartTimeAttr: function () {
            return this.startTimeNode.get('value');
        },
        _getEndTimeAttr: function () {
            return this.endTimeNode.get('value');
        },
        getTimeSpan: function () {
            var span = [this.get('startTime'), this.get('endTime')];
            if (span[0] && span[1])
                return span;
            return null;
        }
    });
});
