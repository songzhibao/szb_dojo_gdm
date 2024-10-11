define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/topic",

    "dijit/_Widget",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",

    "dojo/text!./RoleSearchView.html"
], function (declare, lang, topic, _Widget, _TemplatedMixin, _WidgetsInTemplateMixin, template) {

    return declare([_Widget, _TemplatedMixin, _WidgetsInTemplateMixin], {

        templateString: template,

        widgetsInTemplate: true,

        tableFieldHeight: 59,

        toolbarFieldHeight: 25,

        postMixInProperties: function () {
            this.gridHeight = document.getElementById("operateGrid").clientHeight - this.tableFieldHeight - this.toolbarFieldHeight;
        },

        startup: function () {
            this.inherited(arguments);

            this.queryBtn.onclick = lang.hitch(this, function () {
                this._queryRoles();
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

        buildInputFields: function (item) {
            if (!item) return;

            this.roleName_node.set("value", item.roleName);
            this.valid_node.set("value", item.valid);
        },

        _queryRoles: function (e) {
            var item = {};
            item.roleName = this.roleName_node.get("value") + '';
            item.valid = this.valid_node.get("value") + '';

            topic.publish("queryRoles", {
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
