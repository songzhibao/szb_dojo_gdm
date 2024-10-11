define([
'dojo/_base/declare',
'dojo/_base/array',
'dojo/_base/lang',
'dojo/aspect',
'dojo/json',
'dojo/store/Memory',
"cbtree/model/ForestStoreModel",
"cbtree/Tree",
"egis/cache",
'egis/appEnv'
], function (declare, array, lang, aspect, JSON, Memory, ForestStoreModel, Tree, cache, appEnv) {

    return declare('egis/Share/component/OrgTree/CBTree', [Tree], {

        orgTreesData: null,

        baseClass: 'orgTree',

        checkBoxes: true,

        defaultChecked: false,

        //item数组，指定了这个值后这些项目将被初始设为勾选，OrgTree数据结构
        checkedItems: null,

        ParentId : null,

        data : null,

        postCreate: function () {
            var sortOptions = [{ attribute: 'treeId', descending: false}];
            var me = this;
            var store = new Memory({
                idProperty: "treeId",
                data: this.data,
                getChildren: function (object) {
                    // 需要添加path用于搜索定位
                    if (object.parent == me.ParentId) {
                        object.path = object.treeId;
                    }
                    if (object.checked == null) {
                        object.checked = true;
                    }
                    var children = this.query({ parent: object.treeId });
                    for (var i = 0; i < children.length; i++) {
                        var child = children[i];
                        child.path = object.path + "," + child.treeId;
                    }
                    return children;
                }
            });

            this.model = new ForestStoreModel({
                store: store,
                checkedAll: true,
                options: { sort: sortOptions },
                labelAttr: "MC",
                showRoot: false,
                query: { parent: this.ParentId }
            });

            this.inherited(arguments);

            // 展开第一级节点
            this.expandFirstLevel();
        },

        expandFirstLevel: function () {
            var treeNodes = this.rootNode.getChildren();
            if (treeNodes && treeNodes.length > 0) {
                this._expandNode(treeNodes[0]);
            }
        },

        getChecked: function () {
            return this.model.store.query({
                checked: true
            }, {
                sort: [{ 
                    attribute: "treeId",
                    descending: false
                }]
            });
        },


        getIconClass: function (item, opened) {
            return opened ? "dijitFolderOpened" : "dijitFolderClosed";
        }

    });

});