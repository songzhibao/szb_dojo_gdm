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
    "egis/Modules/User/component/orginfo/OrgTreeManager",
    "egis/Modules/User/component/orginfo/view/OrgInfoView",
    "egis/Modules/User/component/orginfo/view/OrgEditView",
    "egis/Modules/User/component/orginfo/view/OrgPersonView",
    "egis/Modules/User/component/orginfo/view/OrgSearchView"
], function (declare, lang, array, ItemFileWriteStore, topic, on, Button, registry, TabContainer, ContentPane, Dialog, DataGrid,
                OrgTreeManager, OrgInfoView, OrgEditView, OrgPersonView, OrgSearchView) {

    return declare([], {

        dataGrid: null,

        constructor: function (args) {
            declare.safeMixin(this, args || {});

            this.createOrgSearchPane();
        },

        createOrgSearchPane: function (queryCondition) {

            if (!queryCondition) this.queryCondition = queryCondition = {};

            var operateGrid = registry.byId("operateGrid");

            var orgSearchView = new OrgSearchView();

            var orgSearchPane = new ContentPane({
                style: 'height:100%; width:100%; padding:0',
                region : 'center'
            });
            orgSearchPane.addChild(orgSearchView);
            operateGrid.addChild(orgSearchPane);
                        
            orgSearchView.buildInputFields(queryCondition);

            this.dataGrid = new DataGrid({ gridWidget: orgSearchView.resultGrid });

            this._queryOrgs(queryCondition);

            on(orgSearchView.createOrgInfoBtn, "click", function (e) {
                topic.publish("createOrgInfo");
            });

            on(orgSearchView.deleteBtn, "click", lang.hitch(this, function (e) {
                var items = this.dataGrid.grid.selection.getSelected();

                if (items.length > 0 && items[0].orgId) {
                    var dialog = new Dialog({
                        title: '提示',
                        message: {
                            type: 'warn',
                            text: '确定删除组织？'
                        }
                    });
                    dialog.show();

                    dialog.okButton.on('click', function () {
                        topic.publish("deleteOrgs", {
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

            topic.subscribe("queryOrgs", lang.hitch(this, function (e) {
                this._queryOrgs(e.item);
                this.queryCondition = e.item;
            })),

            topic.subscribe("createOrgInfo", lang.hitch(this, function (e) {
                this._createOrgPane("");
            })),
            topic.subscribe("editOrgInfo", lang.hitch(this, function (e) {
                this._createOrgPane(e.item);
            })),
            topic.subscribe("saveOrgInfo", lang.hitch(this, function (e) {
                this.saveOrUpdateOrg();
            })),
            topic.subscribe("deleteOrgs", lang.hitch(this, function (e) {
                this.deleteOrgs(e.items);
            })),

            topic.subscribe("returnOrgInfo", lang.hitch(this, function (e) {
                var operateGrid = registry.byId("operateGrid");

                //删除一个子结点之后 其他子结点顺序就会相应变化 导致漏删 所以每次只删除第一个
                var children = operateGrid.containerNode.children;
                array.forEach(children, lang.hitch(this, function () {
                    operateGrid.containerNode.removeChild(operateGrid.containerNode.children[0]);
                }));

                this.unsubscribe();
                this.createOrgSearchPane(this.queryCondition);
            }))

            ];
        },

        unsubscribe: function () {
            array.forEach(this.handlers, function (item) {
                item.remove();
            });
        },

        _createOrgPane: function (item) {
            var orgId = "", title;
            if (item) {
                orgId = item.orgId;
                console.log("开始编辑组织[" + item.name + "]");
            } else {
                console.log("开始新建组织");
            }

            var operateGrid = registry.byId("operateGrid");

            //删除一个子结点之后 其他子结点顺序就会相应变化 导致漏删 所以每次只删除第一个
            var children = operateGrid.containerNode.children;
            array.forEach(children, lang.hitch(this, function () {
                operateGrid.containerNode.removeChild(operateGrid.containerNode.children[0]);
            }));

            var editPane = new OrgEditView({
                region: 'center'
            });

            var tc = new TabContainer({
                style: "width:100%; height:95%;"
            }, document.createElement("div"));

            // 创建基本信息tab面板
            var infoPane = new ContentPane({
                title: "基本信息"
            });
            this.orgInfoView = new OrgInfoView({
                orgId: orgId
            });
            infoPane.addChild(this.orgInfoView);
            tc.addChild(infoPane);

            // 创建人员信息tab面板
            var personPane = new ContentPane({
                title: "组织人员"
            });
            this.orgPersonView = new OrgPersonView({
                orgId: orgId
            });
            personPane.addChild(this.orgPersonView);
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
                topic.publish("saveOrgInfo");
            });

            on(returnBtn, "click", function (e) {
                topic.publish("returnOrgInfo");
            });

            editPane.paneContainer.addChild(saveBtn);
            editPane.paneContainer.addChild(returnBtn);
            operateGrid.addChild(editPane);
        },

        _queryOrgs: function (item) {
            var self = this;
            console.debug("OrgInfoManager -- queryOrgs");

            self.dataGrid.standby.show();
            var xhrArgs = {
                url: "/system/getOrgList",
                postData: dojo.toJson({
                    name: item.orgName ? item.orgName : '',
                    orgType: item.policeType ? item.policeType : 0,
                    code: item.orgCode ? item.orgCode : '',
                    orgLevel: item.orgLevel ? item.orgLevel : '',
                    valid: item.valid ? item.valid : 1
                }),
                contentType: "application/json;charset=UTF-8",
                preventCache: true,
                handleAs: "json",
                load: function (data) {
                    // 更新数据列表
                    //console.debug(data);
                    self.showOrgData({identifier:"id",items:data.data});
                    self.dataGrid.standby.hide();

                    console.log("查询组织数据成功");
                },
                error: function (error) {
                    console.debug(error);
                }
            };
            var deferred = dojo.xhrPost(xhrArgs);
        },

        showOrgData: function (data) {
            var self = this;

            var gridHeader = [{
                'name': '代码',
                'field': 'code',
                'width': '20%'
            }, {
                'name': '名称',
                'field': 'name',
                'width': '35%'
            }, {
                'name': '类型',
                'field': 'typeName',
                'width': '5%'
            }, {
                'name': '级别',
                'field': 'orgLevel',
                'width': '5%'
            }, {
                'name': '值班电话',
                'field': 'tel',
                'width': '14%'
            }, {
                'name': '有效性',
                'field': 'valid',
                'width': '5%',
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

        saveOrUpdateOrg: function () {
            console.debug("OrgInfoManager -- saveOrUpdateOrg");
            var self = this;

            if (!this.orgInfoView.validator()) {
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

            var orgObj = {};
            var oData = this.orgInfoView.getData();
            dojo.mixin(orgObj, oData);
            var pData = this.orgPersonView.getData();
            dojo.mixin(orgObj, pData);
            var orgStr = dojo.toJson(orgObj);

            var xhrArgs = {
                url: "/system/saveOrgInfo",
                postData: orgStr,
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

        deleteOrgs: function (items) {
            console.debug("OrgInfoManager -- deleteOrgs");
            var self = this;

            var orgIds = []
            for (var i = 0; i < items.length; i++) {
                orgIds.push(items[i].orgId + "");
            }
            var xhrArgs = {
                url: "/system/deleteOrgInfo",
                content: {
                    orgIds: orgIds.join(",")
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