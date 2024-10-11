define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/topic",

    "dojo/data/ItemFileWriteStore",
    "dijit/Dialog",
    "dijit/_Widget",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dijit/form/Button",

    "dojox/grid/EnhancedGrid",
    "dojox/grid/enhanced/plugins/Filter",
    "dojox/grid/enhanced/plugins/IndirectSelection",
    "dojo/text!./UserSearchView.html"
], function (declare, lang, topic, ItemFileWriteStore, Dialog, _Widget, _TemplatedMixin, _WidgetsInTemplateMixin, Button, EnhancedGrid, Filter, IndirectSelection, template) {

    return declare([_Widget, _TemplatedMixin, _WidgetsInTemplateMixin], {

        templateString: template,

        widgetsInTemplate: true,

        selectedOrgId: "",

        tableFieldHeight: 87,

        toolbarFieldHeight: 25,

        orgNodeDefaultValue: "点击选择机构...",

        postMixInProperties: function () {
            this.gridHeight = document.getElementById("operateGrid").clientHeight - this.tableFieldHeight - this.toolbarFieldHeight;
        },

        startup: function () {
            this.inherited(arguments);

            this.org_node.set("disabled", true);
            this.org_node.set("value", this.orgNodeDefaultValue);

            dojo.connect(this.org_node, "onClick", this, this._showOrgGridDialog);

            this.queryBtn.onclick = lang.hitch(this, function () {
                this._queryUsers();
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

        _showOrgGridDialog: function () {
            var self = this;

            var xhrArgs = {
                url: "/system/getOrgList",
                postData: dojo.toJson({
                    name: '',
                    orgType: 0,
                    code: '',
                    orgLevel: '',
                    valid: 1
                }),
                contentType: "application/json;charset=UTF-8",
                preventCache: true,
                handleAs: "json",
                load: function (data) {
                    //console.debug(data);

                    // 判断已选中的行
                    var selectedItems = [];
                    if (self.orgIds != null && self.orgIds.length > 0) {
                        var items = data.data;
                        for (var i = 0; i < items.length; i++) {
                            var it = items[i];
                            for (var j = 0; j < items.length; j++) {
                                var orgId = self.orgIds[j];
                                if (orgId == it.orgId) {
                                    selectedItems.push(it);
                                }
                            }
                        }
                    }
                    //console.debug(selectedItems);

                    var store = new ItemFileWriteStore({
                        data: {identifier:"id",items:data.data}
                    });
                    var layout = [{
                        'name': '名称',
                        'field': 'name',
                        'width': '40%'
                    }, {
                        'name': '代码',
                        'field': 'code',
                        'width': '40%'
                    }, {
                        'name': '类型',
                        'field': 'typeName',
                        'width': '30%'
                    }];

                    var grid = new EnhancedGrid({
                        store: store,
                        structure: layout,
                        style: 'width:100%; height:350px;',
                        plugins: {
                            indirectSelection: {
                                headerSelector: true,
                                width: "10%",
                                styles: "text-align: center;"
                            },
                            filter: {
                                closeFilterbarButton: false,
                                ruleCount: 3
                            }
                        }
                    }, document.createElement('div'));

                    var dialog = new Dialog({
                        title: "选择组织",
                        style: "width:460px; height:420px; "
                    });
                    dialog.show();

                    var submitButton = new Button({
                        label: '确定',
                        style: 'margin-left: 195px; margin-top:5px;',
                        onClick: function (e) {
                            self.orgIds = [];
                            var items = grid.selection.getSelected();
                            //console.debug(items);
                            if (items.length > 0) {
                                var value = "";
                                for (var i = 0; i < items.length; i++) {
                                    value = value + items[i].name + ",";
                                    self.orgIds.push(items[i].orgId + "");
                                }
                                value = value.substring(0, value.length - 1);
                                self.org_node.set("value", value);
                            } else {
                                self.org_node.set("value", "");
                                //alert("未选择组织");
                            }
                            dialog.destroy();
                        }
                    });

                    dialog.addChild(grid);
                    dialog.addChild(submitButton);

                    for (var i = 0; i < selectedItems.length; i++) {
                        //var idx = grid.getItemIndex(selectedItems[i]);
                        //grid.selection.select(idx);
                        grid.selection.addToSelection(selectedItems[i]);
                    }
                },
                error: function (error) {
                    console.debug(error);
                }
            };
            var deferred = dojo.xhrPost(xhrArgs);
        },

        buildInputFields: function (item) {
            if (!item) return;

            this.personName_node.set("value", item.personName);
            this.name_node.set("value", item.name);
            this.org_node.set("value", item.orgName);
            this.mobile_node.set("value", item.mobile);
            this.valid_node.set("value", item.valid);
        },

        _queryUsers: function () {
            var self = this;
            var item = {};
            item.personName = this.personName_node.get("value");
            item.name = this.name_node.get("value");
            item.orgIds = self.orgIds;
            item.mobile = this.mobile_node.get("value");
            item.valid = this.valid_node.get("value");

            topic.publish("queryUsers", {
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