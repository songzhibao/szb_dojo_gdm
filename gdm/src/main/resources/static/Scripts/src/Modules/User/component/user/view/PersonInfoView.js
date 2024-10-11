define([
    "dojo/_base/declare",
    "dojo/data/ItemFileWriteStore",

    "dijit/_Widget",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dijit/Dialog",
    "dijit/form/Button",

    "dojox/form/Uploader",
    "dojox/grid/EnhancedGrid",
    "dojox/grid/enhanced/plugins/Filter",
    "dojox/grid/enhanced/plugins/IndirectSelection",

    "dojo/text!./PersonInfoView.html"
], function (declare, ItemFileWriteStore, _Widget, _TemplatedMixin, _WidgetsInTemplateMixin, Dialog, Button,
        Uploader, EnhancedGrid, Filter, IndirectSelection, template) {

    return declare([_Widget, _TemplatedMixin, _WidgetsInTemplateMixin], {

        templateString: template,

        widgetsInTemplate: true,

        userId: null,

        userObj: null,

        photo: null,

        photoImg: null,

        orgNodeDefaultValue: "点击选择机构...",

        constructor: function (args) {
            declare.safeMixin(this, args || {});
        },

        startup: function () {
            this.inherited(arguments);

            this.org_node.set("disabled", true);
            this.org_node.set("value", this.orgNodeDefaultValue);

            this.buildInputFields(this.userObj);

            dojo.connect(this.uploadPhoto_node, "onComplete", this, this._afterUploadPhoto);
            dojo.connect(this.org_node, "onClick", this, this._showOrgGridDialog);
        },

        _afterUploadPhoto: function (data) {
            console.debug("---------afterUploadPhoto");
            //console.debug(data);

            if (data.success == "fail") {
                alert("上传图片失败！");
                return;
            }

            if (this.photoImg != null) {
                this.photo_node.removeChild(this.photoImg);
            }

            this.photo = {
                photoUrl: data.photoUrl,
                photoName: data.photoName
            };

            this.photoImg = dojo.create("img", {
                src: data.photoUrl,
                style: "width:128px; height:180px; border:1px solid #999; padding:2px; background:#efefef"
            });

            this.photo_node.appendChild(this.photoImg);
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
                    valid:1
                }),
                contentType: "application/json;charset=UTF-8",
                preventCache: true,
                handleAs: "json",
                load: function (result) {
                    var data = {items : result.data};
                    // 判断已选中的行
                    var selectedItems = [];
                    if (self.orgIds != null && self.orgIds.length > 0) {
                        var items = data.items;
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
                        data: data
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
            if (item == null) {
                this.photoImg = dojo.create("img", {
                    src: '/Content/photos/temp/blank.png',
                    style: "width:128px; height:180px; border:1px solid #999; padding:2px; background:#efefef"
                });
                this.photo_node.appendChild(this.photoImg);
                
                return;
            }

            if (item.orgIds != null && item.orgIds.length > 0) {
                this.orgIds = item.orgIds;
            }

            if (item.orgNames != null && item.orgNames.length > 0) {
                var value = "";
                for (var i = 0; i < item.orgNames.length; i++) {
                    value = value + item.orgNames[i] + ",";
                }
                value = value.substring(0, value.length - 1);
                this.org_node.set("value", value);
            }

            this.photoImg = dojo.create("img", {
                src: item.photoUrl ? item.photoUrl : '/Content/photos/temp/blank.png',
                style: "width:128px; height:180px; border:1px solid #999; padding:2px; background:#efefef"
            });
            this.photo_node.appendChild(this.photoImg);

            this.name_node.set("value", item.name);
            this.nickname_node.set("value", item.name);
            this.mobile_node.set("value", item.phone);
            this.password_node.set("value", item.password);
            this.repassword_node.set("value", item.repassword);
            this.valid_node.set("value", item.valid);
            this.memo_node.value = item.memo ? item.memo : "";
        },

        validator: function () {
            var isDataValid = true;
            isDataValid = this.name_node.isValid();
            return isDataValid;
        },

        getData: function () {
            var item = {};
                        
            if (this.photo != null) {
                item.photoUrl = this.photo.photoUrl;
                item.photoName = this.photo.photoName;
            }
            item.orgIds = this.orgIds;
            item.id = this.userId;
            item.name = this.nickname_node.get("value") + '';
            item.phone = this.mobile_node.get("value") + '';
            item.valid = this.valid_node.get("value") + '';
            item.code = this.name_node.get("value") + '';
            item.password = this.password_node.get("value") + '';
            item.repassword = this.repassword_node.get("value") + '';
            item.memo = this.memo_node.value + '';
            return item;
        },

        validator: function () {
            var isDataValid = true;

            isDataValid = this.name_node.isValid() && this.password_node.isValid() && this.repassword_node.isValid();

            var flag = true;
            if (this.password_node.get("value") != this.repassword_node.get("value")) {
                alert("两次密码输入不同！");
                flag = false;
            }
            return isDataValid && flag;
        }
    });
});

