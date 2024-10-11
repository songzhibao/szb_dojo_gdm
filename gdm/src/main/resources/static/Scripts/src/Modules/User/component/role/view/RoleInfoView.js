/**
* Created with JetBrains WebStorm.
* User: chengbin
* Date: 13-4-1
* To change this template use File | Settings | File Templates.
*/
define([
    "dojo/_base/declare",
    "dojo/_base/array",

    "dijit/_Widget",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",

    "egis/Modules/User/component/CheckBoxGroup",

    "dojo/text!./RoleInfoView.html"
], function (declare, array, _Widget, _TemplatedMixin, _WidgetsInTemplateMixin, CheckBoxGroup, template) {

    return declare([_Widget, _TemplatedMixin, _WidgetsInTemplateMixin], {

        templateString: template,

        widgetsInTemplate: true,

        roleId: null,

        constructor: function (args) {
            declare.safeMixin(this, args || {});
        },

        startup: function () {
            this.inherited(arguments);

            this.loadRoleInfo();
            this.loadPrivileges();
        },

        loadRoleInfo: function () {
            console.debug("RoleInfoView -- queryRoleInfoByOrgId");
            var self = this;
            // 新建角色，“角色信息”为空
            if (self.roleId == null) {
                return;
            }
            var xhrArgs = {
                url: "/system/getOneRoleInfo",
                content: {
                    roleId: self.roleId
                },
                preventCache: true,
                handleAs: "json",
                load: function (data) {
                    self.buildInputFields(data.data);
                },
                error: function (error) {
                    console.debug(error);
                }
            };
            var deferred = dojo.xhrPost(xhrArgs);
        },

        buildInputFields: function (item) {
            this.roleName_node.set("value", item.name);
            this.valid_node.set("value", item.valid);

            this.memo_node.value = item.memo;
        },

        loadPrivileges: function () {
            console.debug("RoleInfoView -- loadPrivileges");
            var self = this;

            var url = "/system/getPrivilegeList";
            var xhrArgs = {
                url: url,
                postData: dojo.toJson({
                    roleId: self.roleId
                }),
                contentType: "application/json;charset=UTF-8",
                preventCache: true,
                handleAs: "json",
                load: function (data) {
                    self.buildPrivilegeCheckBoxes({items:data.data});
                },
                error: function (error) {
                    console.debug(error);
                }
            };
            var deferred = dojo.xhrPost(xhrArgs);
        },

        buildPrivilegeCheckBoxes: function (data) {
            var newData = [];

            array.forEach(data.items, function (item) {
                array.forEach(item.children, function (child) {
                    newData.push({
                        name: child.name,
                        type: child.privilegeId,
                        checked: child.isChecked
                    });
                });
            });

            this.checkBoxGroup = new CheckBoxGroup({ data: newData });

            this.privilege_node.addChild(this.checkBoxGroup);
        },

        validator: function () {
            var isDataValid = true;
            isDataValid = this.roleName_node.isValid();
            return isDataValid;
        },

        getData: function () {
            var item = {};
            if (this.roleId != null) {
                item.id = this.roleId + '';
            }
            item.name = this.roleName_node.get("value");
            item.valid = this.valid_node.get("value");
            item.memo = this.memo_node.value + '';

            if (this.checkBoxGroup) {
                item.privileges = this.checkBoxGroup.getCheckedItems();
            }

            return item;
        }
    });
});
