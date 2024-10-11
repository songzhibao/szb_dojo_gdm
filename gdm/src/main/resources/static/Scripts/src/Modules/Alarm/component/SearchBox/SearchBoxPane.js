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
	"dijit/_TemplatedMixin",
    "dijit/_Widget",
    "dijit/BackgroundIframe",
	"dijit/registry",
    "dojo/dnd/Moveable",
    "dojox/layout/ContentPane",
    "dojox/layout/ResizeHandle",
    'dijit/form/Select',
    "dojo/text!./SearchBoxPane.html",
    "egis/Share/component/Button/ImageButton",
    "egis/Modules/Alarm/component/SearchBox/ListBoxPane",
    'egis/appEnv'

], function (
	kernel, lang, winUtil, declare, baseFx, connectUtil, arrayUtil,
	has, windowLib, dom, domClass, domGeom, domConstruct, touch,topic, TemplatedMixin, Widget, BackgroundIframe,
	registry, Moveable, ContentPane, ResizeHandle, Select, template, ImageButton,ListBoxPane, appEnv) {

    kernel.experimental("dojox.layout.FloatingPane");

    return declare("egis.layout.SearchBoxPane", [ContentPane, TemplatedMixin], {

        duration: 400,

        contentClass: "",

        InputFocusHandler: null,

        SearchButtonClickHandler: null,

        OtherButtonClickHandler : null,

        templateString: template,

        selectButton: "rect",

        selectTimeHadler : null,

        postCreate: function () {
            this.inherited(arguments);

        },

        startup: function () {

            this.inherited(arguments);
            var me = this;

            domClass.add(this.otherbutton, this.selectButton);

            this.InputFocusHandler = this.connect(this.searchinput, touch.press, function (evt) {
                topic.publish("egis/Modules/Alarm/SearchBoxPress", { Self: this.searchinput, value: this.searchinput.value });
            });

            this.SearchButtonClickHandler = this.connect(this.searchbutton, touch.press, function (evt) {
                topic.publish("egis/Modules/Alarm/SearchButtonClick", { Self: this.searchinput, value: this.searchinput.value });
            });

            this.OtherButtonClickHandler = this.connect(this.otherbutton, touch.press, lang.hitch(this, this._SelectOneQuery));

            this.connect(this.otherbutton, touch.over, function (evt) {                
                var mapPane = appEnv.getCurrentPane();
                if (mapPane.ListBoxPane) {
                    mapPane.ListBoxPane.show();
                }
                else {
                    mapPane.ListBoxPane = new ListBoxPane({
                        title: '空间查询列表',
                        style: 'position:absolute; left:346px; top:119px;width:39px;z-index: 200;padding: 0px;'
                    });
                    mapPane.ListBoxPane.on("onCheckChange", lang.hitch(this, this._ButtonChange));
                    mapPane.addFloatingPane(mapPane.ListBoxPane);
                }
            });

            this.connect(this.otherbutton, touch.out, function (evt) {

                var mapPane = appEnv.getCurrentPane();
                if (mapPane.ListBoxPane) {
                    mapPane.ListBoxPane.mouseout();
                }
            });
            
            this.searchinput.value = currentLocateCase.CaseAddress;
        },

        ButtonCancel: function () {
            var queryInfo = { LayerGroup: "交互图层", LayerId: "空间查询" };
            topic.publish("egis/Map/CancelGeometryQuery", queryInfo);
            domClass.replace(this.otherbutton, this.selectButton, this.selectButton + "Select");
        },

        _SelectOneQuery : function()
        {
            topic.publish("egis/Map/Remove", { LayerGroup: "交互图层", LayerId: "空间查询", RemoveType: "ID" });

            var queryInfo = { LayerGroup: "交互图层", LayerId: "空间查询", DrawType: this.selectButton, value: this.searchinput.value };

            if (domClass.contains(this.otherbutton, this.selectButton)) {
                topic.publish("egis/Map/BeginGeometryQuery", queryInfo);
                domClass.replace(this.otherbutton, this.selectButton + "Select", this.selectButton);
            }
            else {
                topic.publish("egis/Map/CancelGeometryQuery", queryInfo);
                domClass.replace(this.otherbutton, this.selectButton, this.selectButton + "Select");
            }
        },

        _ButtonChange : function(gemoType)
        {
            domClass.remove(this.otherbutton, this.selectButton);
            this.selectButton = gemoType;
            domClass.add(this.otherbutton, this.selectButton);

            this._SelectOneQuery();
        },

        close: function () {

            if (!this.closable) { return; }
            connectUtil.unsubscribe(this._listener);
            this.hide(lang.hitch(this, function () {
                this.destroyRecursive();
            }));
        },

        changePlaceHolder : function(holderText)
        {
            this.searchinput.setAttribute("placeholder", holderText);
        },

        bringToTop: function () {

            var windows = arrayUtil.filter(
                this._allFPs,
                function (i) {
                    return i !== this;
                },
            this);
            windows.sort(function (a, b) {
                return a.domNode.style.zIndex - b.domNode.style.zIndex;
            });
            windows.push(this);

            arrayUtil.forEach(windows, function (w, x) {
                w.domNode.style.zIndex = this._startZ + (x * 2);
                domClass.remove(w.domNode, "searchbox-container_default");
            }, this);
            domClass.add(this.domNode, "searchbox-container_default");
        },

        destroy: function () {

            this._allFPs.splice(arrayUtil.indexOf(this._allFPs, this), 1);
            if (this._resizeHandle) {
                this._resizeHandle.destroy();
            }
            this.inherited(arguments);
        }
    });

});
