/**
* User: chengbin
* Date: 13-4-1
*/
define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/Evented",
    "dojo/Deferred",

    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",

    "dojo/text!./TreeNodeSearch.html"
], function (declare, lang, Evented, Deferred, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template) {

    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Evented], {

        templateString: template,

        widgetsInTemplate: true,

        tree: null,

        startup: function () {
            this.inherited(arguments);

            if (this.tree && this.tree.model) {
                this.filteringSelect.set("store", this.tree.model.store);
            }

            this.filteringSelect.on("change", lang.hitch(this, function (value) {
                if (!this.tree || !this.tree.model) {
                    return;
                }
                this._searchInTree(value);
            }));
        },

        _searchInTree: function (identity) {
            var result = this.tree.model.store.get(identity);
            //console.debug(result);
            if (result) {
                var pathArr = result.path.split(',');
                var def = new Deferred();
                this._selectPath(pathArr, def);
                def.then(lang.hitch(this, function (lastNode) {
                    //console.debug(lastNode);
                    this.tree.focusNode(lastNode);
                    //this.tree.model.setChecked(lastNode.item, true);
                    lastNode.setSelected(true);
                }));
            }
        },

        _selectPath: function (pathArr, def) {
            var identity = pathArr.shift();
            var node = this._findTreeNode(identity);
            //console.debug(node);
            if (pathArr.length) {
                this.tree._expandNode(node).then(lang.hitch(this, function () {
                    this._selectPath(pathArr, def);
                }));
            } else {
                def.resolve(node);
            }
        },

        _findTreeNode: function (identity) {
            var item = this.tree.model.store.get(identity);
            //console.debug(item);
            if (item) {
                var nodes = this.tree.getNodesByItem(item);
                if (nodes && nodes.length > 0) {
                    return nodes[0];
                }
            }
            return null;
        },

        setTree: function (tree) {
            this.tree = tree;
            this.filteringSelect.set("store", this.tree.model.store);
            //console.debug(this.tree);
        }

    });
});