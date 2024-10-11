/**
* Created with JetBrains WebStorm.
* User: chengbin
* Date: 13-4-1
* To change this template use File | Settings | File Templates.
*/
define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    'dojo/_base/array',
    "dojo/data/ItemFileWriteStore",
    "dojo/topic",
    "dojo/on",

    "dijit/form/Button",
    "dijit/registry",
    "dijit/layout/TabContainer",
    "dijit/layout/ContentPane",

    "egis/Share/component/Dialog/Dialog",
    "egis/Share/component/Grid/DataGrid",
    "egis/Modules/User/component/role/view/RoleEditView",
    "egis/Modules/User/component/role/view/RoleSearchView",
    "egis/Modules/User/component/role/view/RoleInfoView",
    "egis/Modules/User/component/role/view/RoleUserView"
], function (declare, lang, array, ItemFileWriteStore, topic, on, Button, registry, TabContainer, ContentPane, Dialog, DataGrid, RoleEditView, RoleSearchView, RoleInfoView, RoleUserView) {

    return declare([], {

        dataGrid: null,

        constructor: function (args) {
            declare.safeMixin(this, args || {});

            this.createRoleSearchPane();
        },

        createRoleSearchPane: function (queryCondition) {

            if (!queryCondition) this.queryCondition = queryCondition = {};

            var operateGrid = registry.byId("operateGrid");

            var roleSearchView = new RoleSearchView();

            var roleSearchPane = new ContentPane({
                region: 'center',
                style: 'height:100%; width:100%; padding:0'
            });
            roleSearchPane.addChild(roleSearchView);
            operateGrid.addChild(roleSearchPane);

            roleSearchView.buildInputFields(queryCondition);

            this.dataGrid = new DataGrid({ gridWidget: roleSearchView.resultGrid });

            this._queryRoles(queryCondition);

            on(roleSearchView.createRoleBtn, "click", function (e) {
                topic.publish("createRole");
            });

            on(roleSearchView.deleteBtn, "click", lang.hitch(this, function (e) {
                var items = this.dataGrid.grid.selection.getSelected();

                if (items.length > 0 && items[0].id) {
                    var dialog = new Dialog({
                        title: '提示',
                        message: {
                            type: 'warn',
                            text: '确定删除角色？'
                        }
                    });
                    dialog.show();

                    dialog.okButton.on('click', function () {
                        topic.publish("deleteRoles", {
                            items: items
                        });

                        dialog.hide();
                    });
                }
            }));

            this.subscribe();
        },

        subscribe: function () {
            this.handlers = [

            topic.subscribe("queryRoles", lang.hitch(this, function (e) {
                this._queryRoles(e.item);
                this.queryCondition = e.item;
            })),

            topic.subscribe("createRole", lang.hitch(this, function (e) {
                this._createRolePane("");
            })),
            topic.subscribe("editRole", lang.hitch(this, function (e) {
                this._createRolePane(e.item);
            })),
            topic.subscribe("saveRole", lang.hitch(this, function (e) {
                this.saveOrUpdateRole();
            })),
            topic.subscribe("deleteRoles", lang.hitch(this, function (e) {
                this.deleteRoles(e.items);
            })),

            topic.subscribe("returnRole", lang.hitch(this, function (e) {
                var operateGrid = registry.byId("operateGrid");

                //删除一个子结点之后 其他子结点顺序就会相应变化 导致漏删 所以每次只删除第一个
                var children = operateGrid.containerNode.children;
                array.forEach(children, lang.hitch(this, function () {
                    operateGrid.containerNode.removeChild(operateGrid.containerNode.children[0]);
                }));

                this.unsubscribe();
                this.createRoleSearchPane(this.queryCondition);
            }))

            ];
        },

        unsubscribe: function () {
            array.forEach(this.handlers, function (item) {
                item.remove();
            });
        },

        _createRolePane: function (item) {
            var roleId = "", title;
            if (item) {
                roleId = item.id + "";
                title = "角色【" + item.name + "】";
            } else {
                title = "新建角色";
            }

            var operateGrid = registry.byId("operateGrid");

            //删除一个子结点之后 其他子结点顺序就会相应变化 导致漏删 所以每次只删除第一个
            var children = operateGrid.containerNode.children;
            array.forEach(children, lang.hitch(this, function () {
                operateGrid.containerNode.removeChild(operateGrid.containerNode.children[0]);
            }));

            var editPane = new RoleEditView();

            var tc = new TabContainer({
                style: "width:100%; height:95%;"
            }, document.createElement("div"));

            // 创建角色基本信息tab面板
            var infoPane = new ContentPane({
                title: "角色信息"
            });
            this.roleInfoView = new RoleInfoView({
                roleId: roleId,
                region: 'center',
                style: 'height:100%; width:100%; padding:0'
            });
            infoPane.addChild(this.roleInfoView);
            tc.addChild(infoPane);

            // 创建用户信息tab面板
            var personPane = new ContentPane({
                title: "角色用户"
            });
            this.roleUserView = new RoleUserView({
                roleId: roleId
            });
            personPane.addChild(this.roleUserView);
            tc.addChild(personPane);

            editPane.paneContainer.addChild(tc);

            var saveBtn = new Button({
                label: "保存",
                style: "left: 40%; top: 6px; position: relative;",
                iconClass: 'commonUserIcons dijitIconSave'
            });

            var returnBtn = new Button({
                label: "返回",
                style: "left: 45%; top: 6px; position: relative;",
                iconClass: 'commonUserIcons dijitIconUndo'
            });

            on(saveBtn, "click", function (e) {
                topic.publish("saveRole");
            });

            on(returnBtn, "click", function (e) {
                topic.publish("returnRole");
            });

            editPane.paneContainer.addChild(saveBtn);
            editPane.paneContainer.addChild(returnBtn);
            operateGrid.addChild(editPane);
        },

        _queryRoles: function (item) {
            var self = this;
            console.debug("RoleManager -- queryRoles");

            self.dataGrid.standby.show();
            var xhrArgs = {
                url: "/system/getRoleList",
                postData: dojo.toJson({
                    name: item.roleName ? item.roleName : '',
                    valid: item.valid ? item.valid : 1
                }),
                contentType: "application/json;charset=UTF-8",
                preventCache: true,
                handleAs: "json",
                load: function (data) {
                    // 更新数据列表
                    //console.debug(data);
                    self.showData({identifier:"id",items:data.data});
                    self.dataGrid.standby.hide();
                },
                error: function (error) {
                    console.debug(error);
                }
            };
            var deferred = dojo.xhrPost(xhrArgs);
        },

        showData: function (data) {
            var self = this;

            var gridHeader = [{
                'name': '名称',
                'field': 'name',
                'width': '40%'
            }, {
                'name': '备注',
                'field': 'memo',
                'width': '40%'
            }, {
                'name': '有效性',
                'field': 'valid',
                'width': '14%',
                "formatter": function (value) {
                    if (value == "1") {
                        return "有效";
                    } else {
                        return "无效";
                    }
                }
            }, {
                'name': ' ',
                'width': '16px',
                'field': 'edit',
                "formatter": function (e) {
                    return "<div style='cursor:pointer;width:16px;height:16px;background-position:-144px;background-image:url(/Content/themes/blue/images/commonIconsObjActEnabled.png)'/>";
                }
            },
            {
                'name': ' ',
                'width': '16px',
                'field': 'delete',
                "formatter": function (e) {
                    return "<div style='cursor:pointer;width:16px;height:16px;background-position:-80px;background-image:url(/Content/themes/blue/images/commonIconsObjActEnabled.png)'/>";
                }
            }

            ];

            var store = new ItemFileWriteStore({
                data: data
            });

            self.dataGrid.update(gridHeader, store);
        },

        saveOrUpdateRole: function () {
            console.debug("RoleManager -- saveOrUpdateRole");
            var self = this;

            if (!this.roleInfoView.validator()) {
                var dialog = new Dialog({
                    title: '提示',
                    message: {
                        type: 'error',
                        text: '缺少必填项！'
                    }
                });
                dialog.show();
                return;
            }

            var roleObj = {};
            var oData = this.roleInfoView.getData();
            dojo.mixin(roleObj, oData);
            var pData = this.roleUserView.getData();
            dojo.mixin(roleObj, pData);
            var roleStr = dojo.toJson(roleObj);

            var xhrArgs = {
                url: "/system/saveRoleInfo",
                postData: roleStr,
                contentType: "application/json;charset=UTF-8",
                preventCache: true,
                handleAs: "json",
                load: function (data) {
                    if (data.ok) {
                        var dialog = new Dialog({
                            title: '提示',
                            message: {
                                type: 'info',
                                text: '保存成功！'
                            }
                        });
                        dialog.show();
                    } else {
                        var dialog = new Dialog({
                            title: '提示',
                            message: {
                                type: 'error',
                                text: '保存失败！失败原因：' + data.errorMessage
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

        deleteRoles: function (items) {
            console.debug("RoleManager -- deleteRoles");
            var self = this;

            var roleIds = []
            for (var i = 0; i < items.length; i++) {
                roleIds.push(items[i].id + "");
            }
            var xhrArgs = {
                url: "/system/deleteRoleInfo",
                content: {
                    roleIds: roleIds
                },
                preventCache: true,
                handleAs: "json",
                load: function (data) {
                    if (data.ok) {
                        self.dataGrid.deleteSelectedRows();
                        var dialog = new Dialog({
                            title: '提示',
                            message: {
                                type: 'info',
                                text: '删除成功！'
                            }
                        });
                        dialog.show();
                    } else {
                        var dialog = new Dialog({
                            title: '提示',
                            message: {
                                type: 'error',
                                text: '删除失败！'
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
        }

    });
});