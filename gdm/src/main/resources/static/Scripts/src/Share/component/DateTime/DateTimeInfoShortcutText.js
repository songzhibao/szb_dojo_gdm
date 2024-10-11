define([
'dojo/_base/declare',
'dojo/_base/array',
'dojo/_base/lang',
'dojo/date',
'egis/Share/component/BaseWidget/ShortcutText',
'egis/appEnv'
], function (declare, array, lang, dateUtil, ShortcutText, appEnv) {
    var today = new Date();
    return declare('egis/Share/component/DateTime/DateTimeInfoShortcutText', [ShortcutText], {
        baseClass: 'shortcut-text datetimeinfo-shortcut-text',
        textBox: null,
        defaultData: [
            {
                text: '最近24小时',
                value: {
                    timeSpan: [dateUtil.add(today, 'day', -1), today],
                    periods: [1, 2, 3, 4]
                }
            }, {
                text: '最近三天',
                value: {
                    timeSpan: [dateUtil.add(today, 'day', -3), today],
                    periods: [1, 2, 3, 4]
                }
            }, {
                text: '最近一周',
                value: {
                    timeSpan: [dateUtil.add(today, 'week', -1), today],
                    periods: [1, 2, 3, 4]
                }
            }, {
                text: '最近一月',
                value: {
                    timeSpan: [dateUtil.add(today, 'month', -1), today],
                    periods: [1, 2, 3, 4]
                }
            }
        ],
        _setTextBoxAttr: function (textBox) {
            this.textBox = textBox;
            //优先使用this.data，否则使用appConfig中定义的数据，最后使用默认数据
            var data = this.data || appEnv.appConfig.dateTimeInfoShortcutData || this.defaultData;
            if (data) {
                data = lang.clone(data);
                this.set('data', data);
            }
        },
        onItemClick: function (item) {
            if (this.textBox) {
                //this.textBox.set('value', this.textBox.formatShowText(item.value));
                this.textBox.IsCurrentTime = false;
                this.textBox.SetCurrentValue(item.value);
                this.textBox.emit("change", item.value);
            }
        }
    });
});