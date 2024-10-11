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
    'dijit/form/ComboBox',
    "dojo/store/Memory",
    'dojo/text!./MonthPicker.html',
    'dojo/date'
], function (declare, lang, Evented, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, ComboBox, Memory, template, dateUtil) {

    return declare('egis/Share/component/DateTime/MonthPicker', [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Evented], {
        templateString: template,
        month: 1,
        constructor: function () {
            if (!this.yearRange) {
                var thisYear = (new Date()).getFullYear();
                this.yearRange = [thisYear - 10, thisYear + 1];
            }
        },
        postCreate: function () {
            this.inherited(arguments);
            var years = [];
            var months = [];
            for (var i = this.yearRange[1]; i >= this.yearRange[0]; --i) {
                years.push({ value: i });
            }
            for (var i = 1; i <= 12; ++i) {
                months.push({ month: i });
            }
            var yearStore = new Memory({
                data: years
            });
            var monthStore = new Memory({
                data: months
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
            this.month = new ComboBox({
                name: 'month',
                'class': 'month',
                value: this.month,
                store: monthStore,
                labelAttr: 'month',
                searchAttr: 'month'
            }, this.monthNode);

            // 设置默认当前月份
            this.month.set("value", (new Date()).getMonth() + 1);

            this.month.on("change", lang.hitch(this, function () {
                this.emit("changeTime");
            }));
            this.year.on("change", lang.hitch(this, function () {
                this.emit("changeTime");
            }));
        },
        getTimeSpan: function () {
            var month = this.month.get('value');
            var year = this.year.get('value');
            //getFirstDayByMonth 从0开始
            if (month) month -= 1; else return null;
            var span = [this.getFirstDayByMonth(month, year), this.getFirstDayByMonth(month + 1, year)];
            if (span[0] && span[1])
                return span;
            return null;
        },
        //Month, from 0
        getFirstDayByMonth: function (month, year) {
            if (!year) {
                year = (new Date()).getFullYear();
            }
            var date = new Date(year, 0, 1);
            date = dateUtil.add(date, 'month', month);
            return date;
        },

        getTimeValue: function () {
            var month = this.month.get('value');
            var year = this.year.get('value');
            return year + "-" + month;
        }
    });
});
