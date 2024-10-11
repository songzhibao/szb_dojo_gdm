/**
* User: shenyi
* Date: 13-9-6
*/
define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/Evented",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    'dojo/date/locale',
    "dojo/text!./DateTimePicker.html",
    'dijit/form/DateTextBox',
    'dijit/form/TimeTextBox'
], function (declare, lang, Evented, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, dateLocale, template, DateTextBox, TimeTextBox) {

    return declare('egis/Share/component/DateTime/DateTimePicker', [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Evented], {
        label: '时间范围：',
        templateString: template,
        widgetsInTemplate: true,
        value: null,
        constructor: function () {
            var me = this;
            this.value = new Date();

        },
        _getValueAttr: function () {
            var date = this.dateTextBox.get('value');
            var time = this.timeTextBox.get('value');
            if (date != null && time != null) {
                var dateTime = new Date(date);
                dateTime.setHours(time.getHours());
                dateTime.setMinutes(time.getMinutes());
                dateTime.setSeconds(time.getSeconds());
                return dateTime;
            } else if (date != null) {
                return new Date(time);
            } else if (time != null) {
                return new Date(date);
            } else return null;
        },
        _setValueAttr: function (value) {
            this.dateTextBox.set('value', value);
            this.timeTextBox.set('value', value);
        }
    });
});
