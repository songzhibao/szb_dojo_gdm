/**
* Created with JetBrains WebStorm.
* User: chengbin
* Date: 13-4-1
* To change this template use File | Settings | File Templates.
*/
define([
    "dojo/_base/declare",
    "dojo/data/ItemFileWriteStore",

    "dijit/_Widget",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dijit/form/ValidationTextBox",
    "dijit/form/FilteringSelect",
    "dijit/form/TextBox",
    "dijit/form/Select",
    "egis/Modules/User/component/JsonData",
    "dojo/text!./OrgInfoView.html"
], function (declare, ItemFileWriteStore, _Widget, _TemplatedMixin, _WidgetsInTemplateMixin,ValidationTextBox,FilteringSelect,TextBox,Select, jsonData, template) {

    return declare([_Widget, _TemplatedMixin, _WidgetsInTemplateMixin], {

        templateString: template,

        widgetsInTemplate: true,

        orgId: null,

        constructor: function (args) {
            declare.safeMixin(this, args || {});
        },

        startup: function () {
            this.inherited(arguments);

            var self = this;

            var policeTypeStore = new ItemFileWriteStore({ data: jsonData.getPoliceType() });
            self.policeType_node.set("store", policeTypeStore);

            dojo.connect(self.policeType_node, "onChange", self, self.changeOrgLevelStore);

            self.loadOrgInfo();
        },

        loadOrgInfo: function () {
            console.debug("TabOrgInfoView -- queryOrgInfoByOrgId");
            var self = this;
            // 新建组织，“组织信息”为空
            if (self.orgId == null) {
                return;
            }
            var xhrArgs = {
                url: "/system/getOrgInfoById",
                content: {
                    orgId: self.orgId
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

            this.orgCode_node.set("value", item.code);
            this.orgName_node.set("value", item.name);
            this.orderNumber_node.set("value", item.orderNumber);
            this.tel_node.set("value", item.tel);
            this.valid_node.set("value", item.valid);

            this.memo_node.value = item.memo;

            this.policeType_node.set("value", item.typeId, false);
            this.changeOrgLevelStore(item.orgLevel);
            this.orgLevel_node.set("value", item.orgLevel, false);
        },

        changeOrgLevelStore: function (value) {
            this.orgLevel_node.set("disabled", false);
            this.orgLevel_node.reset();

            var orgLevelStore = new ItemFileWriteStore({ data: jsonData.getOrgLevelByType(value) });
            this.orgLevel_node.set("store", orgLevelStore);
        },

        validator: function () {
            var isDataValid = true;
            isDataValid = this.orgCode_node.isValid() && this.orgName_node.isValid();
            return isDataValid;
        },

        getData: function () {
            var item = {};
            if (this.id != null) {
                item.id = this.orgId + '';
            }
            item.code = this.orgCode_node.get("value") + '';
            item.name = this.orgName_node.get("value") + '';
            item.typeId = this.policeType_node.get("value") + '';
            item.orgLevel = this.orgLevel_node.get("value") + '';
            if (!isNaN(this.orderNumber_node.get("value"))) {
                item.orderNumber = this.orderNumber_node.get("value") + '';
            }
            item.tel = this.tel_node.get("value") + '';
            item.valid = this.valid_node.get("value") + '';

            item.memo = this.memo_node.value + '';

            return item;
        }

    });
});