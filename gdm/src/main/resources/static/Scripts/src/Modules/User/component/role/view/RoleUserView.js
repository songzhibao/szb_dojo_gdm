/**
* Created with JetBrains WebStorm.
* User: chengbin
* Date: 13-4-1
* To change this template use File | Settings | File Templates.
*/
define([
    "dojo/_base/declare",

    "dijit/_Widget",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",

    "dojo/dnd/Source",
    "dojo/text!./RoleUserView.html"
], function (declare, _Widget, _TemplatedMixin, _WidgetsInTemplateMixin, Source, template) {

    return declare([_Widget, _TemplatedMixin, _WidgetsInTemplateMixin], {

        templateString: template,

        widgetsInTemplate: true,

        roleId: null,

        toContainer: null,

        fromContainer: null,

        constructor: function (args) {
            declare.safeMixin(this, args || {});
        },

        startup: function () {
            this.inherited(arguments);

            this.loadSourceData();
            this.loadTargetData();
        },

        /*
        *  查询所有用户，把数据传入到弹出窗口的“待选用户”中
        */
        loadSourceData: function () {
            console.debug("RoleUserView -- QueryRoleUsers");
            var self = this;
            self.fromContainer = new Source(self.from_node, {
                isSource: true,
                copyOnly: false,
                selfCopy: false,
                selfAccept: false
            });

            var url = "/system/getUserList";
            var xhrArgs = {
                url: url,
                postData: dojo.toJson({
                    roleId: self.roleId
                }),
                contentType: "application/json;charset=UTF-8",
                preventCache: true,
                handleAs: "json",
                load: function (result) {
                    var data = result.data;
                    for (var i = 0; i < data.length; i++) {
                        data[i].toString = function () {
                            return this.name;
                        };
                    }
                    self.fromContainer.insertNodes(false, data);
                },
                error: function (error) {
                    console.debug(error);
                }
            };
            var deferred = dojo.xhrPost(xhrArgs);
        },

        /*
        *  查询角色ID下的所有用户，把数据传入到弹出窗口的“已选用户”中
        */
        loadTargetData: function () {
            console.debug("RoleUserView -- QueryRoleUserByRoleId");
            var self = this;
            self.toContainer = new Source(self.to_node, {
                isSource: true,
                copyOnly: false,
                selfCopy: false,
                selfAccept: false
            });
            // 新建组织，“已选用户”为空
            if (self.roleId == null) {
                return;
            }
            var xhrArgs = {
                url: "/system/getUserList",
                postData: dojo.toJson({
                    roleId: self.roleId
                }),
                contentType: "application/json;charset=UTF-8",
                preventCache: true,
                handleAs: "json",
                load: function (result) {
                    var data = result.data;
                    for (var i = 0; i < data.length; i++) {
                        data[i].toString = function () {
                            return this.name;
                        };
                    }
                    self.toContainer.insertNodes(false, data);
                },
                error: function (error) {
                    console.debug(error);
                }
            };
            var deferred = dojo.xhrPost(xhrArgs);
        },

        getData: function () {
            var data = {};
            data.users = [];
            this.toContainer.forInItems(function (item, id) {
                data.users.push(item.data.userId + '');
            });
            //console.debug(data);
            return data;
        }

    });

});
