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
    'dojo/text!./WeekRangePicker.html',
    'dojo/date'
], function (declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, ComboBox, Memory, template, dateUtil) {

    return declare('egis/Share/component/DateTime/WeekRangePicker', [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        templateString: template,
        startWeek: 1,
        endWeek: 2,
        constructor: function () {
        },
        postCreate: function () {
            this.inherited(arguments);
            var startWeeks = [];
            var endWeeks = [];
            for (var i = 1; i <= 52; ++i) {
                startWeeks.push({ week: i });
                endWeeks.push({ week: i });
            }
            var startWeekStore = new Memory({
                data: startWeeks
            });
            var endWeekStore = new Memory({
                data: endWeeks
            });
            this.startWeek = new ComboBox({
                name: 'startWeek',
                'class': 'start-week',
                value: this.startWeek,
                store: startWeekStore,
                labelAttr: 'week',
                searchAttr: 'week'
            }, this.startWeekNode);
            this.endWeek = new ComboBox({
                name: 'endWeek',
                'class': 'end-week',
                value: this.endWeek,
                store: startWeekStore,
                labelAttr: 'week',
                searchAttr: 'week'
            }, this.endWeekNode);
        },
        getTimeSpan: function () {
            var startWeek = this.startWeek.get('value');
            if (startWeek) startWeek -= 1; else return null;
            var endWeek = this.endWeek.get('value');
            if (endWeek) endWeek -= 1; else return null;
            var span = [this.getFirstDayByWeek(startWeek), this.getFirstDayByWeek(endWeek)];
            if (span[0] && span[1])
                return span;
            return null;
        },
        //week, from 0
        getFirstDayByWeek: function (week, year) {
            if (!year) {
                year = (new Date()).getFullYear();
            }
            var date = new Date(0);
            date.setYear(year);
            date = dateUtil.add(date, 'week', week);
            return date;
        }
    });
});
