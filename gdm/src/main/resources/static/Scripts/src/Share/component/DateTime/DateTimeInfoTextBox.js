define([
	"dojo/date", // date date.compare
	"dojo/date/locale", // locale.regexp
	"dojo/date/stamp", // stamp.fromISOString stamp.toISOString
	"dojo/_base/declare", // declare
	"dojo/_base/lang", // lang.getObject
    "dojo/Evented",
	"dijit/form/TextBox",
	"dijit/_HasDropDown",
    './DateTimeInfoPicker',
    'dojo/json',
    'dojo/date',
    'dojo/date/locale'
], function (date, locale, stamp, declare, lang,Evented, TextBox, _HasDropDown, DateTimeInfoPicker, json, dateUtil, locale) {

    return declare('egis/Share/component/DateTime/DateTimeInfoTextBox', [TextBox, _HasDropDown, Evented], {
        // hasDownArrow: [const] Boolean
        //		Set this textbox to display a down arrow button, to open the drop down list.
        hasDownArrow: true,
        hasPeriods: true,
        timeTypes: null,
        // Set classes like dijitDownArrowButtonHover depending on mouse action over button node
        cssStateNodes: {
            "_buttonNode": "dijitDownArrowButton"
        },
        maxCharacters: 15,

        currentValue: null,

        formatShowText: function (value) {
            if (value && value.timeSpan) {
                var dp = 'yyyy/MM/dd';
                var tp = 'HH:mm';
                var text = locale.format(value.timeSpan[0], {
                    datePattern: dp,
                    timePattern: tp
                });
                text += ' - ';
                text += locale.format(value.timeSpan[1], {
                    datePattern: dp,
                    timePattern: tp
                });
                return text;
            }
            return "";
        },
        // Override _FormWidget.compare() to work for dates/times
        //        compare: function (/*Date*/val1, /*Date*/val2) {
        //            var isInvalid1 = this._isInvalidDate(val1);
        //            var isInvalid2 = this._isInvalidDate(val2);
        //            return isInvalid1 ? (isInvalid2 ? 0 : -1) : (isInvalid2 ? 1 : date.compare(val1, val2, this._selector));
        //        },

        // flag to _HasDropDown to make drop down Calendar width == <input> width
        forceWidth: false,

        autoWidth: false,

        dropDownPosition: ['below', 'above'],

        popupClass: DateTimeInfoPicker, // default is no popup = text only

        popupConfig: {},

        IsCurrentTime : true,

        constructor: function (params /*===== , srcNodeRef =====*/) {

            if (this.currentValue == null) {
                this.currentValue = {
                    timeSpan: [dateUtil.add(new Date(), 'month', -1), new Date()],
                    periods: [1, 2, 3, 4]
                };
            }
            this.value = this.formatShowText(this.currentValue);
            this.timeTypes = ['year', 'month', 'week', 'custom'];
        },

        buildRendering: function () {
            this.inherited(arguments);

            if (!this.hasDownArrow) {
                this._buttonNode.style.display = "none";
            }

            // If hasDownArrow is false, we basically just want to treat the whole widget as the
            // button.
            if (!this.hasDownArrow) {
                this._buttonNode = this.domNode;
                this.baseClass += " dijitComboBoxOpenOnClick";
            }
        },

        openDropDown: function (/*Function*/callback) {
            // rebuild drop down every time, so that constraints get copied (#6002)
            if (this.dropDown) {
                this.dropDown.destroy();
            }
            var PopupProto = lang.isString(this.popupClass) ? lang.getObject(this.popupClass, false) : this.popupClass,
				textBox = this,
				value = this.get('value');
            this.dropDown = new PopupProto(lang.mixin({
                onChange: function (value) {
                    // this will cause InlineEditBox and other handlers to do stuff so make sure it's last
                    textBox.currentValue = value;
                    textBox.set('value', textBox.formatShowText(value), true);
                    textBox.emit("LockShow", false);
                    textBox.emit("change", value);
                    textBox.IsCurrentTime = false;
                },
                dir: textBox.dir,
                lang: textBox.lang,
                value: textBox.currentValue,
                constraints: textBox.constraints,
                hasPeriods: this.hasPeriods,
                timeTypes: this.timeTypes
                //filterString: textBox.filterString, // for TimeTextBox, to filter times shown
            }, this.popupConfig));

            this.inherited(arguments);
            this.dropDown.startup();

            textBox.emit("LockShow",true);
            //this.connect(this.dropDown.domNode, "mouseout", function () {               
            //    textBox.emit("mouseout");
            //});
            //this.connect(this.dropDown.domNode, "mouseover", function () {        
            //    textBox.emit("mouseover");
            //});
        },

        GetCurrentValue : function()
        {
            if (this.IsCurrentTime)
            {
                this.currentValue = {
                    timeSpan: [dateUtil.add(new Date(), 'month', -1), new Date()],
                    periods: [1, 2, 3, 4]
                };
                this.set('value', this.formatShowText(this.currentValue), true);
            }
            return this.currentValue;
        },

        SetCurrentValue: function (value) {
            this.currentValue = value;
            this.set('value', this.formatShowText(value), true);
        },

        isValid: function () {
            return true;
        },
        //不修改value值，此值无法被手动设置
        _setDisplayedValue: function (value) {
            console.log('set display value');
            return;
        },
        //value值与显示值无关，只能从下拉列表中选择
        _getValueAttr: function () {
            return this.value;
        }
    });
});