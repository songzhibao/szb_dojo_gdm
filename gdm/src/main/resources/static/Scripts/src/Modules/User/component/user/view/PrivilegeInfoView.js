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

    "dojo/text!./PrivilegeInfoView.html"
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

            this.loadPrivileges();
        },

        loadPrivileges: function () {
            console.debug("TabPrivilegeSetting -- loadPrivileges");
            var self = this;

            var url = "/system/getPrivilegeList";
            var xhrArgs = {
                url: url,
                postData: dojo.toJson({
                    userId: self.userId
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

        getData: function () {
            var item = {};
            if (this.userId != null) {
                item.userId = this.userId + '';
            }
            item.privileges = [];
            if (this.checkBoxGroup) {
                item.privileges = this.checkBoxGroup.getCheckedItems();
            }
            return item;
        }

    });
});
