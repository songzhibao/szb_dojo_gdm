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

    return declare('egis/Share/component/OrgTree/OrgCBTree', [Tree], {

        orgTreesData: null,

        baseClass: 'orgTree',

        checkBoxes: true,

        defaultChecked: false,

        //item数组，指定了这个值后这些项目将被初始设为勾选，OrgTree数据结构
        checkedItems: null,

        postCreate: function () {
            var store = cache.newOrgTreeStore();
           
            //var sortOptions = [{ attribute: 'OrderNumber', descending: false}];
            this.model = new ForestStoreModel({
                store: store,
                //options: { sort: sortOptions },
                //query: { parent: null },
                query: { id: appEnv.appConfig.GetRootOrgId() },
                checkedAll: true,
                checkedRoot: false
            });
            this.showRoot = false;
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
                    attribute: "OrgLevel",
                    descending: false
                },
                {
                    attribute: "OrderNumber",
                    descending: false
                }]
            });
        },

        getCheckedIdList: function () {
            var orgs = this.getChecked();
            var orgIds = [];
            array.forEach(orgs, function (orgItem) {

                orgIds.push(orgItem.orgId);

            });

            return orgIds;
        },

        //获取勾选该用户最高级别机构列表信息
        getTopLevelCheckedList: function (userLevel) {
            var orgs = this.getChecked();

            var orgIds = [];
            var orgLevel = 4;
            array.forEach(orgs, function (orgItem) {
                if (orgItem.OrgLevel <= orgLevel) {
                    orgLevel = orgItem.OrgLevel;
                    if (orgLevel == 0) {
                        orgLevel = 1;
                    }
                    if (orgLevel < userLevel) {
                        orgLevel = userLevel;
                    }
                }
            });

            array.forEach(orgs, function (orgItem) {
                if (orgItem.OrgLevel == orgLevel) {
                    orgIds.push(orgItem.OrgId);
                }
            });

            return { orgIds: orgIds, orgLevel: orgLevel };
        },

        getIconClass: function (item, opened) {
            return opened ? "dijitFolderOpened" : "dijitFolderClosed";
        }

    });

});