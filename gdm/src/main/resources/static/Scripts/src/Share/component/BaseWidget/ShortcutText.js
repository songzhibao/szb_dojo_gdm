define([
'dojo/_base/declare',
'dojo/_base/array',
'dojo/_base/lang',
'dijit/_WidgetBase'
], function (declare, array, lang, _WidgetBase) {
    return declare('egis/Share/component/BaseWidget/ShortcutText', [_WidgetBase], {
        baseClass: 'shortcut-text',
        onItemClick: function (item) {
        },
        data: null,
        _setDataAttr: function (data) {
            this.data = data;
            this._buildText();
        },
        _buildText: function () {
            if (!this.data) {
                return;
            }
            $(this.domNode).empty();
            array.forEach(this.data, lang.hitch(this, function (item) {
                var itemNode = $('<span/>');
                item.node = itemNode[0];
                itemNode.text(item.text);
                itemNode.addClass('item');
                itemNode.css('cursor', 'pointer');
                itemNode.appendTo(this.domNode);
                itemNode.on('click', lang.hitch(this, function () {
                    this.onItemClick(item);
                }));
            }));
        },
        buildRendering: function () {
            this.inherited(arguments);
            $(this.domNode).addClass('dijitInline');
            this._buildText();
        },
        startup: function () {
            this.inherited(arguments);
        }
    });
});