define([
'dojo/_base/declare',
'dojo/_base/lang',
'dojo/_base/array',
'dijit/form/Button',
'egis/Share/component/BaseWidget/BasicFloatingPane',
'./OrgCBTree',
"./TreeNodeSearch"


], function (declare, lang, array,Button, BasicFloatingPane, OrgTree, TreeNodeSearch) {

    return declare([BasicFloatingPane], {

        style: 'width: 300px;',

        buildRendering: function () {
            this.inherited(arguments);

            this.treeNodeSearch = new TreeNodeSearch({
                baseClass: "orgpicker-search"
            });
            this.addChild(this.treeNodeSearch);

            this.orgTree = new OrgTree({
                style: 'height: 260px; margin-top: 0.5em;',
                openOnClick: true,
                checkedItems: this.value
            });
            this.addChild(this.orgTree);
            this.confirmBtn = new Button({ label: '确认' });
            this.addChild(this.confirmBtn);
        },

        postCreate: function () {
            this.inherited(arguments);
            this.confirmBtn.on('click', lang.hitch(this, function () {
                this.onChange(this.orgTree.getChecked());
            }));
            this.treeNodeSearch.setTree(this.orgTree);
            this.treeNodeSearch.startup();
        },

        cascadeNode: function (node, func) {
            func(node);
            var children = node.getChildren();
            for (var i = 0; i < children.length; i++) {
                this.cascadeNode(children[i], func);
            }
        },

        _getValueAttr: function () {
            return this.orgTree.getChecked();
        },

        getCheckedIdList: function () {
            return this.orgTree.getCheckedIdList();
        },

        getTopLevelCheckedList: function (userLevel) {
            return this.orgTree.getTopLevelCheckedList(userLevel);
        },

        startup: function () {
            this.inherited(arguments);
        },

        onChange: function (value) {
        }

    });

});