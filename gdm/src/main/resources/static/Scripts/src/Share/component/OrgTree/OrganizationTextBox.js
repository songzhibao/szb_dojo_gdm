define([
	"dojo/date", // date date.compare
	"dojo/date/locale", // locale.regexp
	"dojo/date/stamp", // stamp.fromISOString stamp.toISOString
	"dojo/_base/declare", // declare
	"dojo/_base/lang", // lang.getObject
    'dojo/json',
    "dojo/Evented",
	"dijit/form/TextBox",
	"dijit/_HasDropDown",
    './OrganizationPicker',
    "egis/cache"
], function (date, locale, stamp, declare, lang, JSON,Evented, TextBox, _HasDropDown, OrganizationPicker, cache) {

    return declare('egis/Share/component/OrgTree/OrganizationTextBox', [TextBox, _HasDropDown, Evented], {

        // hasDownArrow: [const] Boolean
        //		Set this textbox to display a down arrow button, to open the drop down list.
        hasDownArrow: true,

        // Set classes like dijitDownArrowButtonHover depending on mouse action over button node
        cssStateNodes: {
            "_buttonNode": "dijitDownArrowButton"
        },

        maxCharacters: 15,

        currentValue: null,

        formatShowText: function (value) {
            if (lang.isArray(value) && value.length > 0) {
                var formatted = "";
                var i = 0;
                while (formatted.length <= this.maxCharacters && i < value.length) {
                    if (i == 0) {
                        formatted += value[i].name;
                    }
                    else {
                        formatted += ', ' + value[i].name;
                    }
                    ++i;
                }
                if (i != value.length) {
                    formatted += '...';
                }
                return formatted;
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

        popupClass: OrganizationPicker, // default is no popup = text only

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

        postCreate: function () {
            var me = this;
            this.inherited(arguments);

            var PopupProto = lang.isString(this.popupClass) ? lang.getObject(this.popupClass, false) : this.popupClass;
            this.dropDown = new PopupProto({
                id: this.id + "_popup",
                dir: this.dir,
                lang: this.lang,
                value: this.get('value'),
                constraints: this.constraints,
                onChange: lang.hitch(this, function (value) {
                    // this will cause InlineEditBox and other handlers to do stuff so make sure it's last
                    me.currentValue = value;
                    me.set('value', me.formatShowText(value), true);
                    me.emit("LockShow", false);
                    me.emit("change", value);
                })
                //filterString: textBox.filterString, // for TimeTextBox, to filter times shown
            });
            //var value = cache.orgTreeStore.query({ checked: true });
            this.currentValue = this.dropDown.get("value");

            this.set('value', this.formatShowText(this.currentValue), true);

            //me.emit("LockShow", true);

            this.connect(this.dropDown.domNode, "mouseout", function () {
                me.emit("mouseout");
            });
            this.connect(this.dropDown.domNode, "mouseover", function () {
                me.emit("mouseover");
            });
        },

        openDropDown: function (/*Function*/callback) {
            // rebuild drop down every time, so that constraints get copied (#6002)
//             if (this.dropDown) {
//                 this.dropDown.destroy();
//             }
//             var PopupProto = lang.isString(this.popupClass) ? lang.getObject(this.popupClass, false) : this.popupClass;
//             this.dropDown = new PopupProto({
//                 id: this.id + "_popup",
//                 dir: this.dir,
//                 lang: this.lang,
//                 value: this.get('value'),
//                 constraints: this.constraints,
//                 onChange: lang.hitch(this, function (value) {
//                     // this will cause InlineEditBox and other handlers to do stuff so make sure it's last
//                     this.set('value', value, true);
//                 })
//                 //filterString: textBox.filterString, // for TimeTextBox, to filter times shown
//             });

            this.inherited(arguments);
        },

        GetCurrentValue: function () {
            return this.currentValue;
        },

        isValid: function () {
            return true;
        },

        //value值与显示值无关，只能从下拉列表中选择
        _getValueAttr: function () {
            return this.value;
        }

    });
});