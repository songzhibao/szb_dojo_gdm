define([
    "dojo/_base/declare",
    "dojo/data/ItemFileWriteStore",
    "dojo/Evented",
    "dojo/on",

    "dijit/form/Select",
    "dijit/registry",
    "dijit/Dialog",
    "dijit/form/Button",
    "dijit/Menu",
    "dijit/MenuItem",
    "dijit/MenuSeparator",

    "dojox/widget/Standby",
    "dojox/grid/EnhancedGrid",
    "dojox/grid/enhanced/plugins/Filter",
    "dojox/grid/enhanced/plugins/IndirectSelection",
    "dojox/uuid/generateRandomUuid",

    "cbtree/Tree",
    "cbtree/models/ForestStoreModel",

    "egis/Share/component/Dialog/Dialog",
    "egis/Modules/User/component/JsonData",
    "egis/Modules/User/component/orginfo/DndSource"
], function (declare, ItemFileWriteStore, Evented, on, Select, registry, Dialog, Button, Menu, MenuItem, MenuSeparator,
         Standby, EnhancedGrid, Filter, IndirectSelection, Uuid, Tree, ForestStoreModel, EgisDialog, jsonData, DndSource) {

    return declare([Evented], {

        pane: null,

        select: null,

        tree: null,

        treeMenu: null,

        constructor: function () {
            this.pane = registry.byId("operateGrid");
            //this.select = new Select({
            //    style: "width:100%;height:20px",
            //    region : 'center',
            //    options: jsonData.getOrgTree()
            //});
            //this.pane.addChild(this.select);
            this.changeTree();
            //dojo.connect(this.select, "onChange", this, this.changeTree);
        },

        changeTree: function (value) {
            //console.debug(value);
            this._buildOrgTree(value);
        },

        refreshTree: function () {
            var treeType = this.select.get("value");
            //console.debug(treeType);
            this._buildOrgTree(treeType);
        },

        _buildOrgTree: function (treeType) {
            this.treeId = "org_tree_" + Uuid();
            var self = this;

            if (this.tree != null) {
                this.tree.destroy();
            }

            var store;
            var xhrArgs = {
                url: "/system/getOrgList",
                postData: dojo.toJson({
                    name: '',
                    orgType: 0,
                    code: '',
                    orgLevel: '',
                    valid: 1
                }),
                contentType: "application/json;charset=UTF-8",
                preventCache: true,
                handleAs: "json",
                load: function (data) {
                    var store = new ItemFileWriteStore({ data: {identifier:"id",label:"name",items:data.data} });
                    var model = new ForestStoreModel({
                        store: store,
                        childrenAttrs: ["children"],
                        rootId: "root",
                        rootLabel: '组织结构'
                    });

                    self.tree = new Tree({
                        region: 'center',
                        id: self.treeId,
                        model: model,
                        showRoot: true,
                        checkBoxes: false,
                        openOnClick: false,
                        nodeIcons: true,
                        dndController: DndSource,
                        style: 'height:95%;width:100%; margin-top:20px; overflow:auto'
                    });

                    self.pane.addChild(self.tree);
                    self._buildTreeMenu();
                },
                error: function (error) {
                    console.debug(error);
                }
            };
            var deferred = dojo.xhrPost(xhrArgs);
        },

        _buildTreeMenu: function () {
            var self = this;

            this.treeMenu = new Menu({
                targetNodeIds: [this.treeId]
            });

            this.treeMenu.addChild(new MenuSeparator());

            this.treeMenu.addChild(new MenuItem({
                label: "添加节点",
                iconClass: "commonUserIcons dijitIconNewTask",
                onClick: function (e) {
                    self._showGridDialog(self.tree.dndController.getSelectedTreeNodes());
                }
            }));
            this.treeMenu.addChild(new MenuItem({
                label: "删除节点",
                iconClass: "commonUserIcons dijitIconDelete",
                onClick: function (e) {
                    self.deleteTreeNodes();
                }
            }));

            on(this.tree, "mousedown", function (e) {
                if (e.button == 2) {
                    var node = registry.getEnclosingWidget(e.target);
                    if (node.item) {
                        self.tree.dndController.setSelection([node]);
                    }
                }
            });
        },

        deleteTreeNodes: function () {
            var self = this;

            var dialog = new EgisDialog({
                title: '提示',
                message: {
                    type: 'warn',
                    text: '确定删除该节点？'
                }
            });
            dialog.show();

            dialog.okButton.on('click', function () {
                self._deleteTreeNodes();
            });
        },

        _deleteTreeNodes: function () {
            var self = this;            

            var deletedNodes = self.tree.dndController.getSelectedTreeNodes();
            var deleteIds = [];
            for (var i = 0; i < deletedNodes.length; i++) {
                var node = deletedNodes[i];
                if (node.item.id == "root") {
                    var dialog = new EgisDialog({
                        title: '提示',
                        message: {
                            type: 'warn',
                            text: '无法删除根节点！'
                        }
                    });
                    dialog.show();

                    return;
                }
                // 不能直接删除目录
                if (node.item.children && node.item.children.length > 0) {

                    var dialog = new EgisDialog({
                        title: '提示',
                        message: {
                            type: 'warn',
                            text: '请先删除 [' + node.item.name + '] 下的子节点！'
                        }
                    });
                    dialog.show();

                    return;
                }
                deleteIds.push(node.item.orgId + "");
            }
            var deleteIdsStr = dojo.toJson(deleteIds);
            console.debug(deleteIdsStr);

            var treeType = self.select.get("value");
            var xhrArgs = {
                url: "/Org/DeleteOrgTreeNodes",
                content: {
                    deleteIdsStr: deleteIdsStr,
                    treeType: treeType
                },
                preventCache: true,
                handleAs: "json",
                load: function (data) {
                    if (data.success == "success") {
                        for (var i = 0; i < deletedNodes.length; i++) {
                            self.deleteTreeNode(deletedNodes[i].item);
                        }
                    }
                },
                error: function (error) {
                    console.debug(error);
                }
            };
            var deferred = dojo.xhrPost(xhrArgs);
        },

        _showGridDialog: function (selectedNodes) {
            var self = this;

            if (!selectedNodes && selectedNodes.length == 0) {
                console.debug("no selectedNodes!");
                return;
            }

            var dialog = new Dialog({
                title: "选择组织节点",
                style: "width:460px; height:420px;"
            });
            dialog.show();

            var gridStandby = new Standby({
                target: dialog.domNode
            });
            document.body.appendChild(gridStandby.domNode);
            gridStandby.startup();
            gridStandby.show();

            var xhrArgs = {
                url: "/Org/QuerySimpleOrgInfos",
                url: "/system/getOrgList",
                postData: dojo.toJson({
                    name: '',
                    orgType: 0,
                    code: '',
                    orgLevel: '',
                    valid:1
                }),
                contentType: "application/json;charset=UTF-8",
                preventCache: true,
                handleAs: "json",
                load: function (result) {
                    var data = {identifier: "id",items : result.data};
                    var store = new ItemFileWriteStore({
                        data: data
                    });
                    var layout = [{
                        'name': '名称',
                        'field': 'name',
                        'width': '40%'
                    }, {
                        'name': '代码',
                        'field': 'code',
                        'width': '25%'
                    }, {
                        'name': '类型',
                        'field': 'typeName',
                        'width': '15%'
                    }, {
                        'name': '有效性',
                        'field': 'valid',
                        'width': '15%'
                    }];

                    var grid = new EnhancedGrid({
                        store: store,
                        structure: layout,
                        style: 'width:100%; height:350px;',
                        plugins: {
                            indirectSelection: {
                                headerSelector: true,
                                width: "5%",
                                styles: "text-align:center;"
                            },
                            filter: {
                                closeFilterbarButton: false,
                                ruleCount: 3
                            }
                        }
                    }, document.createElement('div'));

                    //var treeType = self.select.get("value");
                    var treeType = "";
                    var submitButton = new Button({
                        label: '确定',
                        style: 'margin-left: 195px; margin-top:5px;',
                        onClick: function (e) {
                            self._addOrgInfoNode(grid.selection.getSelected(), selectedNodes[0].item, treeType);
                            dialog.destroy();
                            gridStandby.destroy();
                        }
                    });

                    dialog.addChild(grid);
                    dialog.addChild(submitButton);
                    gridStandby.hide();
                },
                error: function (error) {
                    console.debug(error);
                }
            };
            var deferred = dojo.xhrPost(xhrArgs);
        },

        _addOrgInfoNode: function (newItems, parentItem, treeType) {
            var self = this;
            //console.debug("-------------");
            //console.debug(newItems);
            //console.debug(parentItem);

            var results = [];
            var parentOrgId = parentItem.orgId ? (parentItem.orgId + "") : null;
            for (var i = 0; i < newItems.length; i++) {
                var item = newItems[i];
                var org = {
                    orgId: item.orgId + "",
                    name: item.name + "",
                    treeType: treeType,
                    parentOrgId: parentOrgId
                };
                results.push(org);
            }
            // 转换成字符串
            var resultsStr = dojo.toJson(results);
            console.debug(resultsStr);

            var xhrArgs = {
                url: "/Org/CreateOrgTreeNode",
                content: {
                    newOrgStruct: resultsStr
                },
                preventCache: true,
                handleAs: "json",
                load: function (data) {
                    //console.debug(data);
                    if (!data || !data.length || data.length == 0) {
                        var dialog = new EgisDialog({
                            title: '提示',
                            message: {
                                type: 'error',
                                text: '保存失败！'
                            }
                        });
                        dialog.show();
                        return;
                    }

                    if (!parentItem.children) {
                        parentItem.children = [];
                    }
                    var errorMsg = "";
                    for (var i = 0; i < data.length; i++) {
                        var newItem = data[i];
                        if (newItem.success == "success") {
                            self.createTreeNode(newItem, parentItem, 0);
                        } else {
                            errorMsg = errorMsg + " " + newItem.name;
                        }
                    }
                    if (errorMsg != "") {
                        var dialog = new EgisDialog({
                            title: '提示',
                            message: {
                                type: 'warn',
                                text: '存在重复组织:' + errorMsg
                            }
                        });
                        dialog.show();
                    }
                },
                error: function (error) {
                    console.debug(error);
                }
            };
            var deferred = dojo.xhrPost(xhrArgs);
        },

        createTreeNode: function (newItem, parent, insertIndex) {
            this.tree.model.newItem(newItem, parent, insertIndex);
        },

        deleteTreeNode: function (deletedItem) {
            this.tree.model.deleteItem(deletedItem);
        }

    });

});