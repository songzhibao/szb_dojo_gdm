/**
* User: shenyi
* Date: 13-9-6
*/
define([
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    'dijit/form/ComboBox',
    "dojo/store/Memory",
    'dojo/text!./YearPicker.html',
    'dojo/date',
    './_TimeSpanPicker'
], function (declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, ComboBox, Memory, template, dateUtil, _TimeSpanPicker) {

    return declare('egis/Share/component/DateTime/YearPicker', [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, _TimeSpanPicker], {
        templateString: template,
        yearRange: null,
        constructor: function () {
        },
        postCreate: function () {
            if (!this.yearRange) {
                var thisYear = (new Date()).getFullYear();
                this.yearRange = [thisYear - 10, thisYear + 1];
            }
            this.inherited(arguments);
            var years = [];
            var months = [];
            for (var i = this.yearRange[1]; i >= this.yearRange[0]; --i) {
                years.push({ value: i });
            }
            var yearStore = new Memory({
                data: years
            });
            this.year = new ComboBox({
                name: 'year',
                'class': 'year',
                value: (new Date()).getFullYear(),
                store: yearStore,
                labelAttr: 'value',
                searchAttr: 'value',
                style: 'width: 100px;'
            }, this.yearNode);
        },
        getTimeSpan: function () {
            var year = this.year.get('value');
            var startDate = new Date(year, 0, 1);
            return [startDate, dateUtil.add(startDate, 'year', 1)];
        }
        ,
        getTimeValue: function () {
            var year = this.year.get('value');
            return year;
        }

    });
});
