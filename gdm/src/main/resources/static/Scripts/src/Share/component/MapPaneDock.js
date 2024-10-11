/**
* Created with JetBrains WebStorm.
* User: chengbin
* Date: 13-4-24
* To change this template use File | Settings | File Templates.
*/
define([
    "dojo/_base/declare",
    "dojo/dom-construct",
    'dojo/topic',
    'dojo/_base/lang',
    "dijit/_Widget",
    "dijit/_TemplatedMixin",

    "dojox/layout/Dock"
], function (declare, domConstruct,topic,lang, _Widget, _TemplatedMixin, Dock) {

    var dock = declare([Dock], {

        LayerList: null,

        templateString: '<div class="mapPaneDock"><ul dojoAttachPoint="containerNode" class="mapPaneDockList"></ul></div>',


        constructor: function (config) {

            this.LayerList = new Object();
            //响应清除事件
            topic.subscribe("egis/Map/Remove", lang.hitch(this, function (data) {

                if (data.RemoveType == "ALL") {
                    this.RemoveAll();
                }
                else if (data.RemoveType == "GROUP") {
                    this.RemoveByGroupName(data.LayerGroup);
                }
                else if (data.RemoveType == "ID") {
                    this.RemoveByID(data.LayerGroup + ":" + data.LayerId);
                }
            }));
        },

        RemoveAll: function () {
            for (var key in this.LayerList) {
                this.RemoveByID(key);
                key = null;
            }
        },

        RemoveByGroupName: function (layerGroup) {
            for (var key in this.LayerList) {
                if (key.toString().indexOf(layerGroup + ":") == 0) {
                    this.RemoveByID(key);
                }
                key = null;
            }
        },

        RemoveByID: function (key) {

            var layerInfo = this.LayerList[key];
            if (layerInfo != null) {
                layerInfo.Dock.paneRef.close();
                layerInfo.Dock.destroy();
                layerInfo.Dock = null;
                delete this.LayerList[key];
                layerInfo = null;
            }
        },

        AddDock: function (layerGroup, layerId, dock) {
            var layerInfo = new Object();
            var layerKey = layerGroup + ":" + layerId;

            layerInfo.Dock = dock;

            this.LayerList[layerKey] = layerInfo;

            return layerInfo;
        },
        /**
        * @override
        */
        addNode: function (refNode) {
            var div = domConstruct.create('li', null, this.containerNode),
			node = new DockNode({
			    title: refNode.title,
			    LayerGroup: refNode.LayerGroup,
			    LayerId : refNode.LayerId,
			    paneRef: refNode
			}, div);

            node.startup();
            refNode.mapPane.resultGridPane = null;

            this.AddDock(refNode.LayerGroup, refNode.LayerId, node);
            return node;
        },

        /**
        * @override
        */
        startup: function () {
            this.inherited(arguments);
        }

    });

    var DockNode = declare("egis.common._MapPaneDockNode", [_Widget, _TemplatedMixin], {
        // summary:
        //		dojox.layout._DockNode is a private widget used to keep track of
        //		which pane is docked.

        // title: String
        //		Shown in dock icon. should read parent iconSrc?
        title: "",

        LayerGroup: null,

        LayerId: null,
        // paneRef: Widget
        //		reference to the FloatingPane we reprasent in any given dock
        paneRef: null,

        templateString:
		'<li class="PaneDockNode">' +
			'<input class="PaneDockCheckNode" dojoAttachEvent="onchange: changeShowLayer" dojoAttachPoint="checkNode" checked type="checkbox" />' +
			'<span class="PaneDockTitleNode"  dojoAttachEvent="onclick: restore" dojoAttachPoint="titleNode">${title}</span><span  class="PaneDockCloseButton" dojoAttachEvent="onclick: close"></span>' +
		'</li>',


        restore: function () {
            // summary:
            //		remove this dock item from parent dock, and call show() on reffed floatingpane
            this.paneRef.show();
            //this.paneRef.bringToTop();
            this.destroy();
        },

        changeShowLayer : function (evt) {

            if (!this.LayerGroup && !this.LayerId)
            {
                return;
            }
            var type = "HIDE";
            if (!this.LayerId) {
                if (this.checkNode.checked) {
                    type = "GROUPSHOW";
                }
                else {
                    type = "GROUPHIDE";
                }
            }
            else {
                if (this.checkNode.checked) {
                    type = "SHOW";
                }
            }
            var paramObj = { LayerGroup: this.LayerGroup, LayerId: this.LayerId, RemoveType: type };
            //先清空原先的标注点
            topic.publish("egis/Map/Remove", paramObj);
        },

        close: function () {
            var type = "ID";
            if (!this.LayerId) {
                type = "GROUP";
            }
            var paramObj = { LayerGroup: this.LayerGroup, LayerId: this.LayerId, RemoveType: type };
            //先清空原先的标注点
            topic.publish("egis/Map/Remove", paramObj);
            this.paneRef.close();
            this.destroy();
        }

    });

    return dock;

});