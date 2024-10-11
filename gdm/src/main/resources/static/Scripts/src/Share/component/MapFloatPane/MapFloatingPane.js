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
    "dojo/dom-geometry",
    "dojo/dnd/move",

    "dojox/layout/FloatingPane",
    "dojox/widget/Standby",
    "dojo/text!./MapFloatingPane.html",
    "egis/appEnv"

], function (declare, baseFx, lang, domGeom, move, FloatingPane, Standby, template, appEnv) {

    var MapFloatingPane = declare([FloatingPane], {
        //直接替换模板中__contentTemplateString__字符，作为内容模板
        contentTemplateString: null,

        //'lb' -> left bottom, 'mm' -> middle middle, 'lt' -> left top
        initPosition: null,

        resizable: false,

        dockable: true,

        standby: null,

        templateString: template,

        baseClass: "mapFloatingPane",

        //窗口关闭提示
        closeTip: null,

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

            // 创建等待提示
            this.standby = new Standby({
                target: this.domNode
            });
            document.body.appendChild(this.standby.domNode);
            this.standby.startup();

            // 设置面板可拖动范围
            new move.boxConstrainedMoveable(this.domNode, {
                handle: this.focusNode,
                box: {
                    l: 0,
                    t: 0,
                    w: document.body.clientWidth - $(this.domNode).outerWidth(),
                    h: document.body.clientHeight - $(this.domNode).outerHeight()
                },
                within: false
            });
        },

        startup: function () {
            this.inherited(arguments);
            if (this.initPosition == 'lb') {
                $(this.domNode).css({
                    left: 10,
                    top: document.body.clientHeight - $(this.domNode).outerHeight() - appEnv.appConfig.footerHeight || 0
                });
            } else if (this.initPosition == 'lbm') {
                $(this.domNode).css({
                    left: 10,
                    top: document.body.clientHeight - $(this.domNode).outerHeight() - appEnv.appConfig.footerHeight - 120 || 0
                });
            } else if (this.initPosition == 'lt') {
                $(this.domNode).css({
                    //left: 90,
                    left: 10,
                    top: 50
                });
            } else if (this.initPosition == 'mm') {
                $(this.domNode).css({
                    left: (document.body.clientWidth - $(this.domNode).outerWidth()) / 2,
                    top: (document.body.clientHeight - $(this.domNode).outerHeight() - appEnv.appConfig.footerHeight || 0) / 2
                });
            }
            else if (this.initPosition == 'lm') {
                $(this.domNode).css({
                    left: (document.body.clientWidth - $(this.domNode).outerWidth() - 20),
                    top: (document.body.clientHeight - $(this.domNode).outerHeight() - appEnv.appConfig.footerHeight || 0) / 2
                });
            }
            else if (this.initPosition == 'lbm_YB') { //xxf add 180820 亚博专用
                $(this.domNode).css({
                    left: 10,
                    top: document.body.clientHeight - $(this.domNode).outerHeight() - appEnv.appConfig.footerHeight - 120 -50|| 0
                });
            }

            this.bringToTop();
        },

        /**
        * @override
        */
        show: function (/* Function? */callback) {
            // summary:
            //		Show the FloatingPane
            var anim = baseFx.fadeIn({ node: this.domNode, duration: this.duration,
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


        resize: function (dim) {
            if (this.resizable) {
                // summary:
                //		Size the FloatingPane and place accordingly
                dim = dim || this._naturalState;
                this._currentState = dim;

                // From the ResizeHandle we only get width and height information
                var dns = this.domNode.style;
                if ("t" in dim) { dns.top = dim.t + "px"; }
                else if ("y" in dim) { dns.top = dim.y + "px"; }
                if ("l" in dim) { dns.left = dim.l + "px"; }
                else if ("x" in dim) { dns.left = dim.x + "px"; }
                dns.width = dim.w + "px";
                dns.height = dim.h + "px";

                // Now resize canvas
                var mbCanvas = { l: 0, t: 0, w: dim.w, h: (dim.h - this.focusNode.offsetHeight) };
                domGeom.setMarginBox(this.canvas, mbCanvas);

                // If the single child can resize, forward resize event to it so it can
                // fit itself properly into the content area
                this._checkIfSingleChild();
                if (this._singleChild && this._singleChild.resize) {
                    this._singleChild.resize(mbCanvas);
                }
            }
        },

        destroy: function () {
            this.standby.destroy();
            this.inherited(arguments);
        }

    });

    return MapFloatingPane;

});