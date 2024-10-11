define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    'dojo/_base/array',
    "dojo/data/ItemFileWriteStore",
    "dojo/topic",
    "dojo/on",
    "dojo/io/script",
    'dojo/request',
    "dijit/form/Button",
    "dijit/registry",
    "dijit/layout/TabContainer",
    "dijit/layout/ContentPane",
    'egis/appEnv',
    "egis/Share/component/Dialog/Dialog",
    "egis/Share/component/Grid/DataGrid",
    "egis/Modules/User/component/user/view/UserEditView",
    "egis/Modules/User/component/user/view/UserSearchView",

    "egis/Modules/User/component/user/view/PersonInfoView",
    "egis/Modules/User/component/user/view/OthersInfoView",
    "egis/Modules/User/component/user/view/PrivilegeInfoView",
    "egis/Modules/User/component/user/view/RoleInfoView"
], function (declare, lang, array, ItemFileWriteStore, topic, on, ioScript,request, Button, registry, TabContainer, ContentPane, appEnv, Dialog, DataGrid, UserEditView, UserSearchView,
            PersonInfoView, OthersInfoView, PrivilegeInfoView, RoleInfoView) {

    return declare([], {

        dataGrid: null,

        constructor: function (args) {
            declare.safeMixin(this, args || {});

            this.createUserSearchPane();
        },

        createUserSearchPane: function (queryCondition) {

            if (!queryCondition) this.queryCondition = queryCondition = {};

            var operateGrid = registry.byId("operateGrid");

            var userSearchView = new UserSearchView();

            var userSearchPane = new ContentPane({
                region: 'center',
                style: 'height:100%; width:100%; padding:0'
            });
            userSearchPane.addChild(userSearchView);
            operateGrid.addChild(userSearchPane);

            userSearchView.buildInputFields(queryCondition);

            this.dataGrid = new DataGrid({ gridWidget: userSearchView.resultGrid });

            this._queryUsers(queryCondition);

            on(userSearchView.createUserBtn, "click", function (e) {
                topic.publish("createUser");
            });

            on(userSearchView.deleteBtn, "click", lang.hitch(this, function (e) {
                var items = this.dataGrid.grid.selection.getSelected();

                if (items.length > 0 && items[0].userId) {
                    var dialog = new Dialog({
                        title: '提示',
                        message: {
                            type: 'warn',
                            text: '确定删除用户？'
                        }
                    });
                    dialog.show();

                    dialog.okButton.on('click', function () {
                        topic.publish("deleteUsers", {
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

            topic.subscribe("queryUsers", lang.hitch(this, function (e) {
                this._queryUsers(e.item);
                this.queryCondition = e.item;
            })),

            topic.subscribe("createUser", lang.hitch(this, function (e) {
                this._createUserPane(null);
            })),
            topic.subscribe("editUser", lang.hitch(this, function (e) {
                this._createUserPane(e.item);
            })),
            topic.subscribe("saveUser", lang.hitch(this, function (e) {
                this.saveOrUpdateUser();
            })),
            topic.subscribe("deleteUsers", lang.hitch(this, function (e) {
                this.deleteUsers(e.items);
            })),

            topic.subscribe("returnUser", lang.hitch(this, function (e) {
                var operateGrid = registry.byId("operateGrid");

                //删除一个子结点之后 其他子结点顺序就会相应变化 导致漏删 所以每次只删除第一个
                var children = operateGrid.containerNode.children;
                array.forEach(children, lang.hitch(this, function () {
                    operateGrid.containerNode.removeChild(operateGrid.containerNode.children[0]);
                }));

                this.unsubscribe();
                this.createUserSearchPane(this.queryCondition);
            }))

            ];
        },

        unsubscribe: function () {
            array.forEach(this.handlers, function (item) {
                item.remove();
            });
        },

        _createUserPane: function (item) {
            var userId, userObj;
            if (item) {
                userId = item.id;
                userObj = this._getUserInfoById(userId);
                userId = userObj.id;
                console.log("开始编辑用户[" + item.name + "]");
            } else {

                console.log("开始新建用户");
            }

            var operateGrid = registry.byId("operateGrid");

            //删除一个子结点之后 其他子结点顺序就会相应变化 导致漏删 所以每次只删除第一个
            var children = operateGrid.containerNode.children;
            array.forEach(children, lang.hitch(this, function () {
                operateGrid.containerNode.removeChild(operateGrid.containerNode.children[0]);
            }));

            var editPane = new UserEditView({
                region: 'center',
                style: 'height:100%; width:100%; padding:0'
            });

            var tc = new TabContainer({
                style: "width:100%; height:95%;"
            }, document.createElement("div"));

            /////////
            var personInfoPane = new ContentPane({
                title: "账户信息"
            });
            this.personInfoView = new PersonInfoView({
                userObj: userObj,
                userId: userId
            });
            personInfoPane.addChild(this.personInfoView);
            tc.addChild(personInfoPane);

            //////////// 
            var privilegeInfoPane = new ContentPane({
                title: "权限设置"
            });
            this.privilegeInfoView = new PrivilegeInfoView({
                userObj: userObj,
                userId: userId
            });
            privilegeInfoPane.addChild(this.privilegeInfoView);
            tc.addChild(privilegeInfoPane);

            //////////// 
            var roleInfoPane = new ContentPane({
                title: "角色设置"
            });
            this.roleInfoView = new RoleInfoView({
                userObj: userObj,
                userId: userId
            });
            roleInfoPane.addChild(this.roleInfoView);
            tc.addChild(roleInfoPane);

            ///////////
            var othersInfoPane = new ContentPane({
                title: "其他设置"
            });
            this.othersInfoView = new OthersInfoView({
                userObj: userObj,
                userId: userId
            });
            othersInfoPane.addChild(this.othersInfoView);
            //tc.addChild(othersInfoPane);

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
                topic.publish("saveUser");
            });

            on(returnBtn, "click", function (e) {
                topic.publish("returnUser");
            });

            editPane.paneContainer.addChild(saveBtn);
            editPane.paneContainer.addChild(returnBtn);
            operateGrid.addChild(editPane);
        },

        _getUserInfoById: function (userId) {
            var self = this;

            var userObj;
            var xhrArgs = {
                url: "/system/getOneUserInfo",
                content: {
                    userId: userId
                },
                // 同步执行
                sync: true,
                preventCache: true,
                handleAs: "json",
                load: function (data) {
                    userObj = data.data;
                },
                error: function (error) {
                    console.debug(error);
                }
            };
            var deferred = dojo.xhrPost(xhrArgs);
            return userObj;
        },

        _queryUsers: function (item) {
            var self = this;
            console.debug("UserManager -- queryUsers");

            self.dataGrid.standby.show();
            var xhrArgs = {
                url: "/system/getUserList",
                postData: dojo.toJson({
                    code: item.personName ? item.personName : '',
                    name: item.name ? item.name : '',
                    policeType: item.policeType ? item.policeType : '',
                    policeNumber: item.policeNumber ? item.policeNumber : '',
                    orgIds: item.orgIds ? item.orgIds : [],
                    phone: item.mobile ? item.mobile : '',
                    valid: item.valid ? item.valid : 0
                }),
                contentType: "application/json;charset=UTF-8",
                preventCache: true,
                handleAs: "json",
                load: function (data) {
                    // 更新数据列表
                    //console.debug(data);
                    self.showData({identifier:"id",items:data.data});
                    self.dataGrid.standby.hide();

                    //console.log("查询用户数据成功");
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
                'name': '登陆名',
                'field': 'code',
                'width': '10%'
            }, {
                'name': '昵称',
                'field': 'name',
                'width': '10%'
            }, {
                'name': '手机',
                'field': 'phone',
                'width': '10%'
            }, {
                'name': '所有权限',
                'field': 'privilegeName',
                'width': '30%'
            }, {
                'name': '所有角色',
                'field': 'roleName',
                'width': '10%'
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
                'field': 'editUser',
                "formatter": function (e) {
                    return "<div style='cursor:pointer;width:16px;height:16px;background-position:-144px;background-image:url(/Content/themes/blue/images/commonIconsObjActEnabled.png)'/>";
                }
            },
            {
                'name': ' ',
                'width': '16px',
                'field': 'deleteUser',
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

        saveOrUpdateUser: function () {
            console.debug("UserManager -- saveUser");
            var self = this;
            var userObj = {};

            if (!this.personInfoView.validator()) {
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

            item = this.personInfoView.getData();
            userObj.id = item.userId;
            userObj.name = item.nickname;
            userObj.code = item.name;
            userObj.password = item.password;
            userObj.memo = item.memo;
            userObj.valid = item.valid;
            userObj.phone = item.mobile;
            userObj.orgId = item.orgIds;

            item = this.privilegeInfoView.getData();
            userObj.privilegeIds = item.privileges;

            item = this.roleInfoView.getData();
            userObj.roleIds = item.roles;

            var url = "/system/saveUserInfo";
            if (appEnv.appConfig.PostUserPWDToCenterUrl !="")
            {
                // request.post("/Action/RequestContentByWeb", {
                //     data: {
                //         strParam: '{username:"' + userObj.name + '",password:"' + userObj.password + '",source:1}',
                //         strQueryUrl: appEnv.appConfig.PostUserPWDToCenterUrl,
                //         postMethod: "POST"
                //     },
                //     handleAs: "json"
                // }).then(lang.hitch(this, function (data) {
                //     if (!data.state) {
                //         topic.publish("egis/messageNotification", { type: "info", text: "推送密码修改失败！" });
                //     }
                // }));
            }

            var userStr = dojo.toJson(userObj);
            var xhrArgs = {
                url: url,
                postData: userStr,
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

        deleteUsers: function (items) {
            console.debug("UserManager -- deleteUsers");
            var self = this;
            var userIds = []
            for (var i = 0; i < items.length; i++) {
                userIds.push(items[i].userId + "");
            }
            var userIdsStr = dojo.toJson(userIds);
            var xhrArgs = {
                url: "/system/deleteUserInfo",
                content: {
                    userIds: userIdsStr
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