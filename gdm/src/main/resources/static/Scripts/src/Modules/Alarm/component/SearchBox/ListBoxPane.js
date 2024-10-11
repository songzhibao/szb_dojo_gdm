define([
    "dojo/_base/kernel",
    "dojo/_base/lang",
    "dojo/_base/window",
    "dojo/_base/declare",
	"dojo/_base/fx",
    "dojo/_base/connect",
    "dojo/_base/array",
    "dojo/_base/sniff",
	"dojo/window",
    "dojo/dom",
    "dojo/dom-class",
    "dojo/dom-geometry",
    "dojo/dom-construct",
    "dojo/touch",
    'dojo/topic',
    "dojo/Evented",
	"dijit/_TemplatedMixin",
    "dijit/_Widget",
	"dijit/registry",
    "dojox/layout/ContentPane",
    "dojo/text!./ListBoxPane.html"
], function (
	kernel, lang, winUtil, declare, baseFx, connectUtil, arrayUtil,
	has, windowLib, dom, domClass, domGeom, domConstruct, touch,topic,Evented, TemplatedMixin, Widget,
	registry, ContentPane, template) {

    kernel.experimental("dojox.layout.FloatingPane");

    return declare("egis.layout.ListBoxPane", [ContentPane, TemplatedMixin, Evented], {

        duration: 400,

        contentClass: "",

        templateString: template,

        selectButton: "rect",

        IsLockShow: false,

        timeOurHandler: null,

        postCreate: function () {
            this.inherited(arguments);
        },

        startup: function () {

            this.inherited(arguments);
            var me = this;
            this._control_show();

            this.connect(this.otherbuttonJX, "click", lang.hitch(this, this._check_Change_JX));
            this.connect(this.otherbuttonYX, "click", lang.hitch(this, this._check_Change_YX));
            this.connect(this.otherbuttonDBX, "click", lang.hitch(this, this._check_Change_DBX));
            this.connect(this.otherbuttonXX, "click", lang.hitch(this, this._check_Change_XX));

            this.connect(this.other_button_list, "mouseout", lang.hitch(this, "mouseout"));
            this.connect(this.other_button_list, "mouseover", lang.hitch(this, "mouseover"));
        },

        _check_Change_JX : function()
        {
            this.selectButton = "rect";
            this._control_show();
            this.emit("onCheckChange", this.selectButton);
            this.hide();
        },

        _check_Change_YX: function () {
            this.selectButton = "circle";
            this._control_show();
            this.emit("onCheckChange", this.selectButton);
            this.hide();
        },

        _check_Change_DBX: function () {
            this.selectButton = "polygon";
            this._control_show();
            this.emit("onCheckChange", this.selectButton);
            this.hide();
        },

        _check_Change_XX: function () {
            this.selectButton = "line";
            this._control_show();
            this.emit("onCheckChange", this.selectButton);
            this.hide();
        },

        _control_show : function()
        {
            if (this.selectButton == "rect") {
                this.li_JX.style.display = "none";
                this.li_YX.style.display = "block";
                this.li_DBX.style.display = "block";
                this.li_XX.style.display = "block";
            }
            else if (this.selectButton == "circle") {
                this.li_JX.style.display = "block";
                this.li_YX.style.display = "none";
                this.li_DBX.style.display = "block";
                this.li_XX.style.display = "block";
            }
            else if (this.selectButton == "polygon") {
                this.li_JX.style.display = "block";
                this.li_YX.style.display = "block";
                this.li_DBX.style.display = "none";
                this.li_XX.style.display = "block";
            }
            else if (this.selectButton == "line") {
                this.li_JX.style.display = "block";
                this.li_YX.style.display = "block";
                this.li_DBX.style.display = "block";
                this.li_XX.style.display = "none";
            }
            //this.li_XX.style.display = "none";
        },
        /**
        * @override
        */
        show: function (/* Function? */callback) {
            // summary:
            //		Show the FloatingPane
            var anim = baseFx.fadeIn({
                node: this.domNode, duration: this.duration,
                beforeBegin: lang.hitch(this, function () {
                    this.domNode.style.display = "";
                    this.domNode.style.visibility = "visible";
                    if (this.dockTo && this.dockable) { this.dockTo._positionDock(null); }
                    if (typeof callback == "function") { callback(); }
                    this._isDocked = false;
                    if (this._dockNode) {
                        this._dockNode.destroy();
                        this._dockNode = null;
                    }
                })
            }).play();

            // use w / h from content box dimensions and x / y from position
            var contentBox = domGeom.getContentBox(this.domNode);
            this.resize(lang.mixin(domGeom.position(this.domNode), { w: contentBox.w, h: contentBox.h }));
            this._onShow(); // lazy load trigger
        },

        hide: function (/* Function? */ callback) {
            // summary:
            //		Close, but do not destroy this FloatingPane
            baseFx.fadeOut({
                node: this.domNode,
                duration: this.duration,
                onEnd: lang.hitch(this, function () {
                    this.domNode.style.display = "none";
                    this.domNode.style.visibility = "hidden";
                    if (this.dockTo && this.dockable) {
                        this.dockTo._positionDock(null);
                    }
                    if (callback) {
                        callback();
                    }
                })
            }).play();
        },


        mouseout: function () {
            if (this.IsLockShow) {
                return;
            }
            if (this.timeOurHandler) {
                window.clearTimeout(this.timeOurHandler);
            }
            this.timeOurHandler = window.setTimeout(lang.hitch(this, "hide"), 500);
        },

        mouseover: function () {
            if (this.IsLockShow) {
                return;
            }
            if (this.timeOurHandler) {
                window.clearTimeout(this.timeOurHandler);
            }
            this.timeOurHandler = window.setTimeout(lang.hitch(this, "show"), 500);
        },

        close: function () {
            // summary:
            //		Close and destroy this widget
            if (!this.closable) { return; }
            connectUtil.unsubscribe(this._listener);
            this.hide(lang.hitch(this, function () {
                this.destroyRecursive();
            }));
        },

        destroy: function () {
            // summary:
            //		Destroy this FloatingPane completely
            this._allFPs.splice(arrayUtil.indexOf(this._allFPs, this), 1);
            if (this._resizeHandle) {
                this._resizeHandle.destroy();
            }
            this.inherited(arguments);
        }
    });

});
