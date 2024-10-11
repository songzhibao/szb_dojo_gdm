define([
'dojo/_base/declare',
'dojo/_base/lang',
'dojo/_base/array',
'dojo/date',
'dojo/topic',
'dijit/form/Button',
'dijit/layout/TabContainer',
'dijit/layout/ContentPane',
'egis/Share/component/BaseWidget/BasicFloatingPane',
'./DateTimeRangePicker',
'./YearPicker',
'./MonthPicker',
'./WeekPicker',
'./PeriodPicker'
], function (declare, lang, array, dateUtil,topic, Button, TabContainer, ContentPane,BasicFloatingPane, DateTimeRangePicker, YearPicker, MonthPicker, WeekPicker, PeriodPicker) {
    return declare([BasicFloatingPane], {
        style: 'width: 310px;',
        hasPeriods: true,
        periods: null,
        timeTypes: null,
        constructor: function () {
            this.value = {
                timeSpan: [dateUtil.add(new Date(), 'month', -1), new Date()],
                periods: [1, 2, 3, 4]
            };
            this.timeTypes = ['year', 'month', 'week', 'custom'];
        },
        buildRendering: function () {
            this.inherited(arguments);
            var me = this;
            //$(this.containerNode).append($('<div style=""></div>'));

            //时间tabContainer
            var tabContainer = new TabContainer({
                style: 'height: 110px; margin-top: 10px;'
            });
            this.tabContainer = tabContainer;
            this.addChild(tabContainer);
            if (this.timeTypes.indexOf('year') >= 0) {
                //年面板
                var yearPane = new ContentPane({ title: '年' });
                this.yearPane = yearPane;
                var yearPicker = new YearPicker();
                this.yearPicker = yearPicker;
                yearPane.addChild(yearPicker);
                tabContainer.addChild(yearPane);
                tabContainer.selectChild(dateTimePane);
            }
            if (this.timeTypes.indexOf('month') >= 0) {
                //月面板
                var monthPane = new ContentPane({ title: '月', selected: true });
                this.monthPane = monthPane;
                var monthPicker = new MonthPicker();
                this.monthPicker = monthPicker;
                monthPane.addChild(monthPicker);
                tabContainer.addChild(monthPane);
                tabContainer.selectChild(dateTimePane);
            }

            if (this.timeTypes.indexOf('week') >= 0) {
                //周面板
                var weekPane = new ContentPane({ title: '周' });
                this.weekPane = weekPane;
                var weekPicker = new WeekPicker();
                this.weekPicker = weekPicker;
                weekPane.addChild(weekPicker);
                tabContainer.addChild(weekPane);
                tabContainer.selectChild(dateTimePane);
            }


            if (this.timeTypes.indexOf('custom') >= 0) {
                //自定义范围面板
                var dateTimePane = new ContentPane({ title: '自定义' });
                this.dateTimePane = dateTimePane;
                var dateTimeRangePicker = new DateTimeRangePicker({
                    startTime: (this.value && this.value.timeSpan) ? this.value.timeSpan[0] : null,
                    endTime: (this.value && this.value.timeSpan) ? this.value.timeSpan[1] : null
                });
                this.dateTimeRangePicker = dateTimeRangePicker;
                dateTimePane.addChild(dateTimeRangePicker);
                tabContainer.addChild(dateTimePane);

                //this.connect(this.dateTimeRangePicker.domNode, "mouseout", function () {
                //    me.emit("mouseout");
                //});
                //this.connect(this.dateTimeRangePicker.domNode, "mouseover", function () {
                //    me.emit("mouseover");
                //});
            }

            if (this.hasPeriods) {
                //上下午等选择
                this.periodPicker = new PeriodPicker({
                    style: 'margin-top: 10px;',
                    value: (this.value && this.value.periods) ? this.value.periods : null
                });
                this.addChild(this.periodPicker);
            }

            this.confirmBtn = new Button({ label: '确认', style: ' margin-top: 10px;' });
            this.addChild(this.confirmBtn);
        },
        postCreate: function () {
            this.inherited(arguments);
            this.confirmBtn.on('click', lang.hitch(this, function () {
                var timeSpan;
                if (this.tabContainer.selectedChildWidget == this.dateTimePane) {
                    timeSpan = this.dateTimeRangePicker.getTimeSpan();
                } else if (this.tabContainer.selectedChildWidget == this.weekPane) {
                    timeSpan = this.weekPicker.getTimeSpan();
                } else if (this.tabContainer.selectedChildWidget == this.monthPane) {
                    timeSpan = this.monthPicker.getTimeSpan();
                } else if (this.tabContainer.selectedChildWidget == this.yearPane) {
                    timeSpan = this.yearPicker.getTimeSpan();
                }
                var periods = [];
                if (this.hasPeriods) {
                    periods = this.periodPicker.get('value')
                }
                this.onChange({
                    timeSpan: timeSpan,
                    periods: periods
                });
            }));
        },
        startup: function () {
            this.inherited(arguments);

        },
        //value: {timeSpan: [start, end], periods: []}
        onChange: function (value) {
        }
    });
});