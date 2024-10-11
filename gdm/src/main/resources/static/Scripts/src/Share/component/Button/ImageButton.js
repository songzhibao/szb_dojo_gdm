/* File Created: 八月 30, 2013 */
define([
    "dojo/_base/declare",
    "dojo/on",
    "dojo/_base/lang",
    "dojo/Evented",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dojo/text!./ImageButton.html"
], function (declare, on, lang, Evented, _WidgetBase, _TemplatedMixin, template) {
    return declare([_WidgetBase, _TemplatedMixin, Evented], {

        templateString: template,

        enableToggle: false,

        img: null,

        unpressedImg: '/Content/themes/blue/images/nav-4-1.png',

        pressedImg: '/Content/themes/blue/images/nav-4-2.png',

        text: '',

        tipText : "",

        _pressed: false,

        postMixInProperties: function () {
            // 初始化设置未按下状态图标
            if (!this.img) {
                this.img = this.unpressedImg;
            }
        },

        postCreate: function () {
            this.inherited(arguments);
            on(this.domNode, "click", lang.hitch(this, this._onClick));
            on(this.domNode, "mouseout", lang.hitch(this, this._onMouseOut));
            on(this.domNode, "mouseover", lang.hitch(this, this._onMouseOver));
            if (this.text == "" || !this.text) {
                this.imgText.style.display = "none";
            }
        },

        GetState : function()
        {
            return this._pressed;
        },

        UnPressed: function () {
            // 切换图标
            //if (!this.enableToggle) {
            //    this.imgNode.src = this.unpressedImg;
            //    this._pressed = false;
            //}
            this.imgNode.src = this.unpressedImg;
            this._pressed = false;
        },

        Pressed: function () {
            //if (!this.enableToggle)
            //{
            //    this.imgNode.src = this.pressedImg;
            //    this._pressed = true;
            //}
            this.imgNode.src = this.pressedImg;
            this._pressed = true;
        },

        SetState : function(checked)
        {
            if (checked) {
                this.Pressed();
            }
            else {
                this.UnPressed();
            }
        },

        onClick: function () {
        },

        _onMouseOver: function () {
            this.emit("mouseover", this._pressed);
        },

        _onMouseOut: function () {
            this.emit("mouseout", this._pressed);
        },

        _onClick: function () {
            // 切换图标
            if (this.enableToggle) {
                if (this._pressed) {
                    this.imgNode.src = this.unpressedImg;
                } else {
                    this.imgNode.src = this.pressedImg;
                }
            }

            this._pressed = !this._pressed;
            this.emit("click", this._pressed);
            this.onClick(this._pressed);
        }
    });
});