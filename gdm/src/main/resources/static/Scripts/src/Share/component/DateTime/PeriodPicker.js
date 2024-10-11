/**
* User: shenyi
* Date: 13-9-6
*/
define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/_base/array",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    'dojo/date/locale',
    "dojo/text!./PeriodPicker.html",
    'dijit/form/CheckBox'
], function (declare, lang, array, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, dateLocale, template, CheckBox) {

    return declare('egis/Share/component/DateTime/PeriodPicker', [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        templateString: template,
        widgetsInTemplate: true,
        constructor: function () {
        },
        postCreate: function () {
            this.inherited(arguments);
            this.periods = [];
            this.periods.push(this.period1);
            this.periods.push(this.period2);
            this.periods.push(this.period3);
            this.periods.push(this.period4);
            array.forEach(this.periods, lang.hitch(this, function (period) {
                if (this.value) {
                    if (array.indexOf(this.value, period.get('periodId')) >= 0) {
                        period.set('checked', true);
                    } else {
                        period.set('checked', false);
                    }
                } else {
                    period.set('checked', false);
                }
            }));
        },
        _getValueAttr: function () {
            var value = [];
            array.forEach(this.periods, function (period) {
                if (period.get('checked')) value.push(period.get('periodId'));
            });
            return value;
        }
    });
});
