define([
'dojo/_base/declare',
'dojo/_base/lang',
'dojo/_base/array',
'egis/Share/component/BaseWidget/BasicFloatingPane',
'./CaseTypeTree',
"egis/Share/component/Search/TreeNodeSearch",
'dijit/form/Button'
], function (declare, lang, array, BasicFloatingPane, CaseTypeTree, TreeNodeSearch, Button) {

    return declare([BasicFloatingPane], {

        buildRendering: function () {
            this.inherited(arguments);

            this.treeNodeSearch = new TreeNodeSearch({
                baseClass: "casetypepicker-search"
            });
            this.addChild(this.treeNodeSearch);

            this.caseTypeTree = new CaseTypeTree({
                style: 'height:180px; width:245px; overflow-x:hidden;',
                openOnClick: true
            });
            this.addChild(this.caseTypeTree);

            this.confirmBtn = new Button({ label: '确认' });
            this.addChild(this.confirmBtn);
        },

        postCreate: function () {
            this.inherited(arguments);
            this.confirmBtn.on('click', lang.hitch(this, function () {
                this.onChange(this.caseTypeTree.getChecked());
            }));
            this.treeNodeSearch.setTree(this.caseTypeTree);
            this.treeNodeSearch.startup();
        },

        _getValueAttr: function () {
            return this.caseTypeTree.getChecked();
        },

        startup: function () {
            this.inherited(arguments);
        },

        onChange: function (value) {
        }

    });
});