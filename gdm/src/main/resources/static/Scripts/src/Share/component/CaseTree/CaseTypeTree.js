define([
'dojo/_base/declare',
'dojo/_base/array',
'dojo/_base/lang',
'dojo/aspect',
'dojo/json',
"dojo/store/Memory",
"cbtree/model/ForestStoreModel",
"cbtree/Tree",
"egis/cache"
], function (declare, array, lang, aspect, JSON, Memory, ForestStoreModel, Tree, cache) {

    return declare('egis/Share/component/CaseTree/CaseTypeTree', [Tree], {

        caseTypesData: null,

        baseClass: 'caseTypeTree',

        defaultChecked: false,

        //item数组，指定了这个值后这些项目将被初始设为勾选
        checkedItems: null,

        postCreate: function () {
            var store = cache.newCaseTypeTreeStore();
            //var sortOptions = [{ attribute: 'OrderNumber', descending: false}];
            this.model = new ForestStoreModel({
                store: store,
                query: { parent: null },
                //options: { sort: sortOptions },
                rootId: "caseTypeTreeRoot",
                rootLabel: '灾害类型',
                checkedAll: true,
                checkedRoot: true
            });
            this.checkBoxes = true;
            this.showRoot = true;
            this.inherited(arguments);
        },        

        getChecked: function () {
            return this.model.store.query({
                checked: true
            }, {
                sort: [{ 
                    attribute: "id",
                    descending: false
                }]
            });
        },

        getIconClass: function (item, opened) {
            return opened ? "dijitFolderOpened" : "dijitFolderClosed";
        }

    });

});