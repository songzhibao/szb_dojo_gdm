/**
* Created with JetBrains WebStorm.
* User: chengbin
* Date: 13-4-24
* To change this template use File | Settings | File Templates.
*/
define([
    "dojo/_base/declare",
    "dojo/_base/fx",
    "dojo/_base/lang",
    "dojo/dom-class",
    "dojo/dom-geometry",
    "dojo/on",
    'dojo/topic',
    "dojo/_base/connect",
    "dojox/layout/ContentPane",
    "dojox/widget/Standby",
    "dijit/registry",
    "dijit/_TemplatedMixin",
    'dijit/form/TextBox',
    'dijit/form/Button',
    'dijit/TooltipDialog',
    'dijit/form/DropDownButton',
    "egis/Share/component/OrgTree/OrgTree",
    "dojo/text!./MapBoardPane.html",
    "egis/appEnv"

], function (declare, baseFx, lang, domClass, domGeom, on, topic,connectUtil, ContentPane, Standby, registry,_TemplatedMixin, TextBox, Button, TooltipDialog, DropDownButton, OrgTree, template, appEnv) {

    var MapFixedPane = declare([ContentPane, _TemplatedMixin], {

        templateString: template,

        standby: null,

        baseClass: "mapBoardPane",

        duration: 400,

        LayerGroup: null,

        LayerId: null,

        mapPane: null,

        IsLockShow : false,

        timeOurHandler : null,

        postMixInProperties: function () {
            this.inherited(arguments);
            if (this.templateString) {
                if (this.contentTemplateString) {
                    this.templateString = this.templateString.replace("__contentTemplateString__", this.contentTemplateString);
                } else {
                    this.templateString = this.templateString.replace("__contentTemplateString__", "");
                }
            }
        },

        postCreate: function () {
            this.inherited(arguments);

        },

        startup: function () {
            var me = this;
            this.inherited(arguments);

            this.connect(this.boardPane,"mouseout", lang.hitch(this, "mouseout"));
            this.connect(this.boardPane, "mouseover", lang.hitch(this, "mouseover"));

        },


        IsShow : function()
        {
            if (this.domNode.style.display == "none") {
                return false;
            }
            else {
                return true;
            }
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

        mouseover : function()
        {
            if (this.IsLockShow)
            {
                return;
            }
            if (this.timeOurHandler)
            {
                window.clearTimeout(this.timeOurHandler);
            }
            this.timeOurHandler = window.setTimeout(lang.hitch(this, "show"), 500);
        },

        LockShow : function(isLock)
        {
            this.IsLockShow = isLock;
            if (isLock)
            {
                if (this.timeOurHandler) {
                    window.clearTimeout(this.timeOurHandler);
                }
                this.show();
            }
        },

        close: function () {
            connectUtil.unsubscribe(this._listener);
            this.hide(lang.hitch(this, function () {
                this.destroyRecursive();
            }));
        },


        destroy: function () {
            this.inherited(arguments);
        }

    });

    return MapFixedPane;

});