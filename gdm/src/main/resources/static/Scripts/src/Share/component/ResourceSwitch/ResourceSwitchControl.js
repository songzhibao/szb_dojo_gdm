/**
 * Author: shenyi
 * Email: shenyi@dsomm.com.cn
 * Date: 2013-04-28 	'egis/Share/component/ResourceSwitch/HoverMenu',
 */
define([
	'dojo/_base/declare',
	'dojo/_base/lang',
	'dojo/_base/array',
	'dojo/Stateful',
	'dijit/_WidgetBase',
	'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
	'dijit/_Container',
	'dojo/text!./ResourceSwitchControl.html',
	'dojo/dom-style',
	'dojo/dom-class',
    'dijit/Menu',
	'dijit/MenuItem',
	'dijit/CheckedMenuItem',
	'dijit/PopupMenuItem',
	'egis/Share/component/ResourceSwitch/CheckedPopupMenuItem',
	'dojo/store/Memory',
    "dojo/request",
    "dojo/topic",
	'dojo/store/Observable'], function (declare, lang, array, Stateful, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, _Container, template, domStyle, domClass, Menu, MenuItem, CheckedMenuItem, PopupMenuItem, CheckedPopupMenuItem, Memory, request, topic, Observable) {
	    return declare([_WidgetBase, _TemplatedMixin, _Container, _WidgetsInTemplateMixin], {
	        templateString: template,
	        expanded: false,
	        menu: null,
	        plugins: [],
	        /**
	        * 存储图层数据结构
	        * 数据形如：
	        * data: [
	        * 	{
	        * 		id: '驻防管理',
	        * 		layers: [OpenLayers图层实例数组],
	        * 		visilibity: [Boolean],
	        * 		parent: '综合业务'
	        * 	},
	        * 	{
	        * 		id: '综合业务'
	        * 	},
	        * 	{
	        * 		id: '消火栓',
	        * 		layers: [],
	        * 		visibility: [Boolean],
	        * 		parent: '基础图层'
	        * 	},
	        * 	{
	        * 		id: '基础图层'
	        * 	}
	        * ]
	        * @type {[type]}
	        */
	        store: null,
	        /**
	        * 被监视的数据，视图会根据数据变化
	        * @type {[type]}
	        */
	        map: null,
	        results: null,
	        observeHandle: null,
	        constructor: function (args) {
	            var me = this;
	            me.inherited(arguments);
	            declare.safeMixin(me, args);
	            me.store = new Observable(new Memory());
	            me.store.getChildren = function (object) {
	                return this.query({
	                    parent: this.getIdentity(object)
	                });
	            },
			    me.results = me.store.query();
	            me.observeHandle = me.results.observe(lang.hitch(me, me._onStoreChanged));
	            array.forEach(me.plugins, function (plugin) {
	                plugin.init(me);
	            });
	        },
	        onAddMenuItem: function () {

	        },
	        /**
	        * store仅仅关联视图，所有与store相关的操作都会直接反应到视图上去，没有其他职责。
	        * @param  {[type]} layerConfig  [description]
	        * @param  {[type]} removedFrom  [description]
	        * @param  {[type]} insertedInto [description]
	        * @return {[type]}              [description]
	        */
	        _onStoreChanged: function (layerConfig, removedFrom, insertedInto) {
	            var me = this;
	            if (removedFrom > -1) {
	                me._removeMenuItem(layerConfig);
	            }
	            if (insertedInto > -1) {
	                me._addMenuItem(layerConfig);
	            }
	        },
	        _onLayerAdded: function (event) {
	            var layer = event.layer;
	            if (layer.layerConfig) {
	                this._addLayerConfig(layer.layerConfig, layer);
	            }
	        },
	        _onLayerRemoved: function (event) {
	            var layer = event.layer;
	            if (layer.layerConfig) {
	                this._removeLayerConfig(layer.layerConfig, layer);
	            }
	        },
	        /**
	        * 地图图层状态变化
	        * @param  {[type]} event [description]
	        * @return {[type]}       [description]
	        */
	        _onLayerChanged: function (event) {
	            if (event.property == 'visibility' && event.layer.layerConfig) {
	                var me = this,
					layer,
					layerConfigs;
	                layer = event.layer;
	                layerConfigs = me.store.query({
	                    id: layer.layerConfig.id
	                });
	                if (layerConfigs.length > 0) {
	                    var layerConfig;
	                    layerConfig = layerConfigs[0];
	                    layerConfig.menuItem.setCheckedIcon(me._getLayersVisibility(layerConfig.layers));
	                }
	            }
	        },
	        /**
	        * 添加layerConfig的方法，这里的操作最终会反应到_onStoreChanged中，但这里会增加一些额外的逻辑处理，如级联添加、级联删除等特性。
	        */
	        _addLayerConfig: function (layerConfig, dataStore) {
	            var me = this,
				results;
	            //如果config中有父节点，则需要查询该父节点是否存在，如果不存在则需要自动建立
	            if (layerConfig.parent) {
	                var parents = me.store.query({
	                    Id: layerConfig.parent
	                });
	                if (parents.length === 0) {

	                    var parent = dataStore.query({
	                        Id: layerConfig.parent
	                    });
	                    if (parent.length > 0) {
	                        me._addLayerConfig(parent[0], dataStore);
	                    }
	                }
	            }
	            results = me.store.query({
	                Id: layerConfig.Id
	            });
	            //如果已有节点，则将新的layers添加到原有layers数组
	            if (results.length > 0) {
	                //	                var resultLayerConfig;
	                //	                resultLayerConfig = results[0];
	                //	                if (layer) {
	                //	                    resultLayerConfig.layers.push(layer);
	                //	                    resultLayerConfig.visibility = me._getLayersVisibility(resultLayerConfig.layers);
	                //	                }
	            } else {
	                //	                layerConfig.layers = layer ? [layer] : [];
	                //	                layerConfig.visibility = me._getLayersVisibility(layerConfig.layers);
	                //包装为stateful对象，可添加对象监视
	                layerConfig = new Stateful(layerConfig);
	                //原生的回调中无法获取被监视对象本身的实例，如果直接在回调用使用this(layerConfig），则无法获取到当前控件的实例。封装回调，添加layerConfig实例。
	                layerConfig.watch(function (name, oldValue, value) {
	                    me._onLayerConfigChanged.call(me, layerConfig, name, oldValue, value);
	                });

	                me.store.put(layerConfig);
	            }
	        },

	        /**
	        * 删除layerConfig的方法，这里的操作最终会反应到_onStoreChanged中，但这里会增加一些额外的逻辑处理。
	        * 如本方法不会直接删除id为layerConfig.id的图层，如果store中存在，则会减去layers中的图层。
	        * 如删除节点后判断是否还有兄弟节点，如果没有则删除父节点。
	        */
	        _removeLayerConfig: function (layerConfig, layer) {
	            var me = this,
				results;
	            results = me.store.query({
	                id: layerConfig.id
	            });
	            //如果已有节点，则删除原有的layers数组中存在的元素
	            if (results.length > 0) {
	                var resultLayerConfig = results[0];
	                if (layer) {
	                    var idxInResult = array.indexOf(resultLayerConfig.layers, layer);
	                    if (idxInResult > -1) {
	                        resultLayerConfig.layers.splice(idxInResult, 1);
	                    }
	                }
	                //如果layers已为空，则删除本节点
	                if (resultLayerConfig.layers.length === 0) {
	                    me.store.remove(resultLayerConfig.id);
	                    //如果存在父节点，则判断父节点是否还有儿子节点，如果没有则删除父节点
	                    if (resultLayerConfig.parent) {
	                        var children;
	                        children = me.store.query({
	                            parent: resultLayerConfig.parent
	                        });
	                        if (children.length === 0) {
	                            var parents;
	                            parents = me.store.query({
	                                id: resultLayerConfig.parent
	                            });
	                            if (parents.length > 0) {
	                                var parent;
	                                parent = parents[0];
	                                me._removeLayerConfig(parent);
	                            }
	                        }
	                    }
	                }
	            }
	        },
	        _onLayerConfigChanged: function (layerConfig, name, oldValue, value) {
	            var me = this;
	            if (name == 'checked' && layerConfig) {
	                topic.publish("egis/Map/Resource/ShowDLZY", layerConfig);
	            }
	        },
	        _getLayersVisibility: function (layers) {
	            return array.some(layers, function (layer) {
	                return layer.visibility;
	            });
	        },
	        _setExpandedAttr: function ( /*Boolean*/expanded) {
	            if (expanded) {
	                domClass.remove(this.expandImgNode, 'menu-collapse');
	                domStyle.set(this.menu.domNode, {
	                    display: 'block'
	                });
	                //this.menu.set('display', 'block');
	            } else {
	                domClass.add(this.expandImgNode, 'menu-collapse');
	                domStyle.set(this.menu.domNode, {
	                    display: 'none'
	                });
	                //this.menu.set('display', 'none');
	            }
	            this._set('expanded', expanded);
	        },
	        _onOpenerClick: function (evt) {
	            this.set('expanded', !this.expanded);
	            evt.stopPropagation();
	        },
	        _onOpenerDblClick: function (evt) {
	            evt.stopPropagation();
	        },
	        buildRendering: function () {
	            this.inherited(arguments);
	            this.menu = new Menu({
	                baseClass: 'mainMenu',
	                leftClickToOpen : true
	            }, this.menuNode);
	            this.menu.leftClickToOpen = true;
	            // this.addChild(me.menu);
	        },
	        postCreate: function () {
	            this.inherited(arguments);
	        },
	        _addMenuItem: function (layerConfig) {
	            var me = this,
				parentMenu;
	            if (layerConfig.parent) {
	                me._searchMenuItem(me.menu, function (widget) {
	                    if (widget.isInstanceOf(CheckedPopupMenuItem) && widget.layerConfig && widget.layerConfig.Id == layerConfig.parent) {
	                        parentMenu = widget.popup;
	                        widget.ChangeGroupMark(true);
	                        return false;
	                    }
	                });
	            } else {
	                parentMenu = me.menu;
	            }
	            if (parentMenu) {
	                var item = new CheckedPopupMenuItem({
	                    label: layerConfig.MC,
	                    layerConfig: layerConfig,
	                    popup: new Menu({
	                        baseClass: 'layer-switch-popup-menu'
	                    }),
	                    checked: layerConfig.checked
	                });
	                layerConfig.menuItem = item;
	                item.popup.item = item;
	                if (layerConfig.order) {
	                    parentMenu.addChild(item, me._getChildIndex(parentMenu, layerConfig.order));
	                } else {
	                    parentMenu.addChild(item);
	                }
	                if (array.every(parentMenu.getChildren(), function (item) {
	                    return item.get('checked');
	                })) {
	                    if (parentMenu.item) {
	                        parentMenu.item.set('checked', true);
	                    }
	                }
	                me.onAddMenuItem(item);
	                item.on('change', function (checked) {
	                    item.layerConfig.set('checked', checked);
	                });
	            }
	        },
	        /**
	        * 获取菜单项指定order的子项位置（模型与addChild中的index不一样，order指相对位置，index指绝对位置）
	        * @param  {[type]} menu  [description]
	        * @param  {[type]} order [description]
	        * @return {[type]}       [description]
	        */
	        _getChildIndex: function (menu, order) {
	            var index = 0;
	            array.forEach(menu.getChildren(), function (item, idx) {
	                if (item.layerConfig && item.layerConfig.order && item.layerConfig.order <= order) {
	                    index = idx + 1;
	                }
	            });
	            return index;
	        },
	        /**
	        * 查询菜单下符合条件的menuItem，递归方法，会寻找popup属性来判断是否存在子菜单
	        * @param  {[type]} menu        [description]
	        * @param  {[type]} layerConfig [description]
	        * @return {[type]}             [description]
	        */
	        _removeMenuItem: function (layerConfig) {
	            var me = this,
				menuItem;
	            me._searchMenuItem(me.menu, function (widget) {
	                if (widget.isInstanceOf(CheckedPopupMenuItem) && widget.layerConfig && widget.layerConfig.id == layerConfig.id) {
	                    menuItem = widget;
	                    return false;
	                }
	            });
	            if (menuItem) {
	                menuItem.layerConfig = null;
	                layerConfig.menuItem = null;
	                menuItem.destroy();
	            }
	        },
	        /**
	        * 遍历菜单项及其子菜单项，由于弹出菜单并不是某一个menuItem的child，所以为菜单单独写递归搜索的方法
	        * @param  {[type]}   menu     [description]
	        * @param  {Function} callback 返回false停止遍历
	        * @return {[type]}            [description]
	        */
	        _searchMenuItem: function (menu, callback, stop) {
	            var me = this;
	            if (stop !== true) {
	                array.forEach(menu.getChildren(), function (item) {
	                    var toStop = callback(item) === false;
	                    if (item.popup) {
	                        me._searchMenuItem(item.popup, callback, toStop);
	                    }
	                });
	            }
	        },
	        startup: function () {
	            this.inherited(arguments);
	            this.menu.startup();
	            //this.setPosition();
	            var me = this;

	            request.post("/Alarm/QueryLayes", {
	                data: { showwhere: "ZY" },
	                handleAs: "json"
	            }).then(function (layers) {

	                var store = new Memory({
	                    idProperty: "treeId",
	                    data: layers,
	                    getChildren: function (object) {
	                        // 需要添加path用于搜索定位
	                        if (object.parent == null) {
	                            object.path = object.treeId;
	                        }
	                        if (object.checked == null) {
	                            object.checked = true;
	                        }
	                        var children = this.query({ parent: object.treeId });
	                        for (var i = 0; i < children.length; i++) {
	                            var child = children[i];
	                            child.path = object.path + "," + child.treeId;
	                        }
	                        return children;
	                    }
	                });

	                array.forEach(layers, function (layer) {
	                    if (layer) {
	                        me._addLayerConfig(layer, store);
	                    }
	                });
	            }, function (error) {
	            });

	            this.set('expanded', this.expanded);
	        },
	        // setPosition: function() {
	        // 	domStyle.set(this.menu.domNode, {
	        // 		position: 'absolute',
	        // 		right: 0
	        // 	});
	        // },
	        destroy: function () {
	            array.forEach(this.plugins, function (plugin) {
	                if (plugin.destroy) {
	                    plugin.destroy();
	                }
	            });
	            if (this.observeHandle) this.observeHandle.cancel();
	            this.inherited(arguments);
	        }
	    });
	});