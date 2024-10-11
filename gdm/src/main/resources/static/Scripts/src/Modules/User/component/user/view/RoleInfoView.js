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

        userId: null,

        constructor: function (args) {
            declare.safeMixin(this, args || {});
        },

        startup: function () {
            this.inherited(arguments);

            this.loadRoles();
        },

        loadRoles: function () {
            console.debug("TabRoleSetting -- loadRoles");
            var self = this;

            var url =  "/system/getRoleList";
            var xhrArgs = {
                url: url,
                postData: dojo.toJson({
                    userId: self.userId ? self.userId : ''
                }),
                contentType: "application/json;charset=UTF-8",
                preventCache: true,
                handleAs: "json",
                load: function (data) {
                    //console.debug(data);
                    self.buildRoleCheckBoxes({identifier:"id",items: data.data});
                },
                error: function (error) {
                    console.debug(error);
                }
            };
            var deferred = dojo.xhrPost(xhrArgs);
        },

        buildRoleCheckBoxes: function (data) {
            var newData = [];

            array.forEach(data.items, function (item) {
                newData.push({
                    name: item.name,
                    type: item.roleId,
                    checked: item.isChecked
                });
            });

            this.checkBoxGroup = new CheckBoxGroup({ data: newData });

            this.role_node.addChild(this.checkBoxGroup);
        },

        getData: function () {
            var item = {};
            if (this.userId != null) {
                item.userId = this.userId + '';
            }
            item.roles = [];
            if (this.checkBoxGroup) {
                item.roles = this.checkBoxGroup.getCheckedItems();
            }
            return item;
        }

    });
});