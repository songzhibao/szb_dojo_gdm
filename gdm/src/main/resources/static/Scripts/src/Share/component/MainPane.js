//自定义ContentPane，能够作为一张空白面板添加到主窗口，但可以放置任何东西（类似MapPane，但MapPane只能是地图）
define([
    "dojo/_base/declare",
    'dojo/_base/array',
    "dojo/_base/lang",
    "dojo/_base/window",
    "dojo/ready",
    "dojo/on",
    "dojo/dom-construct",
    "dojo/dom-style",
    "dojo/aspect",
    'egis/appEnv',
    "dijit/layout/ContentPane",
    "dijit/ProgressBar",
    "egis/Share/component/MapPaneDock"
], function (declare, array, lang,win, ready, on, domConstruct, domStyle, aspect, appEnv, ContentPane,ProgressBar, MapPaneDock) {

    return declare([ContentPane], {

        /**
        *openlayers地图实例
        */
        map: null,
        /**
        * dock实例	
        */
        _dock: null,

        dockTo: null,

        dockable: true,

        style: "width:100%; height:100%; padding:0px; overflow:hidden;",

        floatingPanes: null,

        toolbarButtons: null,

        constructor: function () {
            this.floatingPanes = [];
            this.toolbarButtons = [];
        },

        postCreate: function () {
            this.inherited(arguments);

            // 释放资源
            this.on('close', lang.hitch(this, function () {
                array.forEach(this.toolbarButtons, lang.hitch(this, function (b) {
                    appEnv.toolBarContainer.removeChild(b);
                    b.destroy();
                }));
                this.toolbarButtons = null;

                //删除浮动面板
                array.forEach(this.floatingPanes, lang.hitch(this, function (pane) {
                    $(pane.domNode).remove();
                    pane.destroy();
                    this.removeFloatingPane(pane);
                }));
                this.floatingPanes = [];
            }));

            // 切换面板
            this.on('show', lang.hitch(this, function () {
                array.forEach(this.toolbarButtons, lang.hitch(this, function (b) {
                    appEnv.toolBarContainer.addChild(b);
                }));

                array.forEach(this.floatingPanes, lang.hitch(this, function (pane) {
                    if (pane.domNode.oldShowDisplay) {
                        $(pane.domNode).css('display', pane.domNode.oldShowDisplay);
                    }
                }));
            }));
            this.on('hide', lang.hitch(this, function () {
                array.forEach(this.toolbarButtons, lang.hitch(this, function (b) {
                    appEnv.toolBarContainer.removeChild(b);
                }));

                array.forEach(this.floatingPanes, lang.hitch(this, function (pane) {
                    pane.domNode.oldShowDisplay = $(pane.domNode).css('display');
                    $(pane.domNode).css('display', 'none');
                }));
            }));
        },

        addFloatingPane: function (floatingPane) {
            this.floatingPanes.push(floatingPane);
            aspect.after(floatingPane, 'close', lang.hitch(this, function () {
                this.removeFloatingPane(floatingPane);
                floatingPane = null;
            }));
            $(document.body).append(floatingPane.domNode);
            floatingPane.startup();
        },

        removeFloatingPane: function (floatingPane) {
            var idx = this.floatingPanes.indexOf(floatingPane);
            if (idx >= 0) {
                this.floatingPanes.splice(idx, 1);
            }
        },

        _initProgressBar: function () {

            var left = document.body.clientWidth / 2 - 130;
            this.progressBar = new ProgressBar({
                style: "position:absolute; left:" + left + "px; bottom:80px; width:280px; z-index:9999;display:none"
            }).placeAt(win.body());
        },

        showProcess: function (/*string*/message) {
            if (this.progressBar) {
                $(this.progressBar.domNode).css("display", "block");
                this.progressBar.update({ 'indeterminate': true, label: message });
            }
        },

        hideProgress: function () {
            if (this.progressBar) {
                $(this.progressBar.domNode).css("display", "none");
            }
        },

        startup: function () {
            this.inherited(arguments);

            this._initProgressBar();

            if (this.dockable) {
                this._initDock();
            }

            console.debug("[" + this.title + "] startup, id: " + this.id);
        },

        _initDock: function () {
            this.dockTo = "dock_" + this.id;
            this._dock = new MapPaneDock({
                id: this.dockTo
            });
            this.addChild(this._dock);
        },

        destroy: function () {
            console.debug("MainContentPane destroy, id: " + this.id);
            this.inherited(arguments);
        }
    });
});