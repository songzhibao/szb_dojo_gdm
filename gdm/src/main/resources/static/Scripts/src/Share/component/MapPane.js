/**
* Created with JetBrains WebStorm.
* User: song
* Date: 16-12-30
*/
define([
    "dojo/_base/declare",
    'dojo/_base/array',
    "dojo/_base/lang",
    "dojo/_base/window",
    "dojo/ready",
    "dojo/on",
    "dojo/has",
    "dojo/dom-construct",
    "dojo/dom-style",
    "dojo/aspect",
    'dojo/request',
    "dojo/data/ItemFileWriteStore",
    "dijit/Menu",
    "dijit/popup",
    "dijit/ProgressBar",

    "egis/Share/component/MainPane",
    'egis/appEnv',
    "egis/Share/component/MapPaneDock",
    'ol'
], function (declare, array, lang, win, ready, on, has, domConstruct, domStyle, aspect, request, ItemFileWriteStore,Menu, popup, ProgressBar, MainPane,
               appEnv, MapPaneDock, ol) {

    return declare([MainPane], {


        builder: null,

        constructor: function () {

        },

        postCreate: function () {
            this.inherited(arguments);
        },

        startup: function () {
            this.inherited(arguments);

            this._initProgressBar();
          
            this._initMap();

            this._initMapContextMenu();
        },

        /**
        * 初始化openlayers地图实例
        */
        _initMap: function () {
            var mapNode = domConstruct.create('div');
            domStyle.set(mapNode, {
                width: "100%",
                height: "100%",
                opacity: 0.99,
                position: 'absolute',
                'z-index': 0
            });
            $(mapNode).appendTo(this.domNode);

            this.map.setTarget(mapNode);

            //this.domNode.appendTo(appEnv.stackContainer);

            this.on('show', lang.hitch(this, function () {
                setTimeout(lang.hitch(this, function () {
                    //TODO:ol3
                    this.map.updateSize();
                }), 2000);
            }));
            // 延迟更新地图，防止IE8下页面卡死
            this.resizeHandler = on(window, "resize", lang.hitch(this, function () {
                setTimeout(lang.hitch(this, function () {
                    this.map.updateSize();
                }, 100));
            }));
        },

        _initMapContextMenu: function () {
            this.contextMenu = new Menu({
                //map: this.map,
                //targetNodeIds: [this.id],
                //style: "width:80px;"
            });
            this.contextMenu.bindDomNode(this.domNode);
            this.contextMenu.startup();

            //  TODO ie下鼠标右键不会自动消失
            if (has("ie")) {
                this.map.events.register("movestart", this, lang.hitch(this, function (e) {
                    if (this.contextMenu) {
                        popup.close(this.contextMenu);
                    }
                }));
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

        destroy: function () {
            if (this.resizeHandler) {
                this.resizeHandler.remove();
                this.resizeHandler = null;
            }
            if (this.map) {
                //this.map.destroy();
                this.map = null;
            }
            this.inherited(arguments);
        }

    });
});