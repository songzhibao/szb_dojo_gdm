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
    'dojo/text!./WeekPicker.html',
    'dojo/date',
    'dojo/date/locale'
], function (declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, ComboBox, Memory, template, dateUtil, locale) {

    return declare('egis/Share/component/DateTime/WeekPicker', [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        templateString: template,
        week: 1,
        constructor: function () {
            if (!this.yearRange) {
                var thisYear = (new Date()).getFullYear();
                this.yearRange = [thisYear - 10, thisYear + 1];
            }
            this.week = this.getWeekOfYear(new Date());
        },
        postCreate: function () {
            this.inherited(arguments);
            var years = [];
            var weeks = [];
            for (var i = this.yearRange[1]; i >= this.yearRange[0]; --i) {
                years.push({ value: i });
            }
            for (var i = 1; i <= 52; ++i) {
                weeks.push({ week: i });
            }
            var yearStore = new Memory({
                data: years
            });
            var weekStore = new Memory({
                data: weeks
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
            this.week = new ComboBox({
                name: 'week',
                'class': 'week',
                value: this.week,
                maxHeight: 150,
                store: weekStore,
                labelAttr: 'week',
                searchAttr: 'week'
            }, this.weekNode);
        },
        getTimeSpan: function () {
            var week = this.week.get('value');
            var year = this.year.get('value');
            if (week) week -= 1; else return null;
            var span = [this.getFirstDayByWeek(week, year), this.getFirstDayByWeek(week + 1, year)];
            if (span[0] && span[1])
                return span;
            return null;
        },
        //week, from 0
        getFirstDayByWeek: function (week, year) {
            if (!year) {
                year = (new Date()).getFullYear();
            }
            var date = new Date(year, 0, 1);
            date = dateUtil.add(date, 'week', week);
            return date;
        },
        getWeekOfYear: function (/*Date*/dateObject, /*Number*/firstDayOfWeek) {
            if (arguments.length == 1) { firstDayOfWeek = 0; } // Sunday
            var d = new Date(dateObject.getFullYear(), 0, 1).getDay();
            var firstDayOfYear = new Date(dateObject.getFullYear(), 0, 1).getDay(),
		        adj = (firstDayOfYear - firstDayOfWeek + 7) % 7,
		        week = Math.floor((this.getDayOfYear(dateObject) + adj - 1) / 7);
            // if year starts on the specified day, start counting weeks at 1
            if (firstDayOfYear == firstDayOfWeek) { week++; }
            return week; // Number
        },
        getDayOfYear: function (/*Date*/dateObject) {
            // summary:
            //		gets the day of the year as represented by dateObject
            return dateUtil.difference(new Date(dateObject.getFullYear(), 0, 1, dateObject.getHours()), dateObject) + 1; // Number
        }
    });
});
