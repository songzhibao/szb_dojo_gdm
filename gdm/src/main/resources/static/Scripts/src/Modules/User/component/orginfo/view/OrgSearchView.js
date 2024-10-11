/**
* Created with JetBrains WebStorm.
* User: chengbin
* Date: 13-4-1
* To change this template use File | Settings | File Templates.
*/
define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/data/ItemFileWriteStore",
    "dojo/topic",

    "dijit/_Widget",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dijit/form/Button",
    "dijit/form/FilteringSelect",
    "dijit/form/TextBox",
    "dijit/form/Select",
    "dijit/layout/ContentPane",
    "egis/Modules/User/component/JsonData",
    "dojo/text!./OrgSearchView.html"
], function (declare, lang, ItemFileWriteStore, topic, _Widget, _TemplatedMixin, _WidgetsInTemplateMixin,Button,FilteringSelect,TextBox,Select,ContentPane, jsonData, template) {

    return declare([_Widget, _TemplatedMixin, _WidgetsInTemplateMixin], {

        templateString: template,

        widgetsInTemplate: true,

        tableFieldHeight: 87,

        toolbarFieldHeight: 25,

        gridHeight: null,

        postMixInProperties: function () {
            this.gridHeight = document.getElementById("operateGrid").clientHeight - this.tableFieldHeight - this.toolbarFieldHeight;
        },

        startup: function () {
            this.inherited(arguments);

            var policeTypeStore = new ItemFileWriteStore({ data: jsonData.getPoliceType() });
            this.policeType_node.set("store", policeTypeStore);

            dojo.connect(this.policeType_node, "onChange", this, this.changeOrgLevelStore);

            this.queryBtn.onclick = lang.hitch(this, function () {
                this._queryOrgs();
            });

            this.subscribe();
        },

        subscribe: function () {
            var self = this;

            this.handler = topic.subscribe("onSelectedCount", function (e) {
                if (e.count == 1) {
                    self.deleteBtn.set("disabled", false);
                } else if (e.count == 0) {
                    self.deleteBtn.set("disabled", true);
                } else if (e.count > 1) {
                    self.deleteBtn.set("disabled", false);
                } else {
                    console.debug("deleteBtn status error!");
                }
            });
        },

        changeOrgLevelStore: function (value) {
            this.orgLevel_node.set("disabled", false);
            this.orgLevel_node.reset();

            var orgLevelStore = new ItemFileWriteStore({ data: jsonData.getOrgLevelByType(value) });
            this.orgLevel_node.set("store", orgLevelStore);
        },

        buildInputFields: function (item) {
            if (!item) return;

            this.orgName_node.set("value", item.orgName);
            this.orgCode_node.set("value", item.orgCode);
            this.valid_node.set("value", item.valid);

            this.policeType_node.set("value", item.policeType, false);
            this.changeOrgLevelStore(item.policeType);
            this.orgLevel_node.set("value", item.orgLevel, false);
        },

        _queryOrgs: function (e) {
            var item = {};
            item.orgName = this.orgName_node.get("value") + '';
            item.policeType = this.policeType_node.get("value") + '';
            item.orgCode = this.orgCode_node.get("value") + '';
            item.orgLevel = this.orgLevel_node.get("value") + '';
            item.valid = this.valid_node.get("value") + '';

            topic.publish("queryOrgs", {
                item: item
            });
        },

        destroy: function () {
            this.inherited(arguments);

            if (this.handler) {
                this.handler.remove();
            }
        }
    });
});