/* File Created: 九月 24, 2013 */
define([
'dojo/_base/declare',
'dojo/_base/array',
'dojo/_base/lang',
'dijit/layout/ContentPane',
'dijit/layout/BorderContainer',
'./Popup'], function (declare, array, lang, ContentPane, BorderContainer, Popup) {
    return declare([Popup], {
        baseClass: null,
        buttonsPane: null,
        buttons: null,
        LinkButtonString: null,
        constructor: function () {
            this.buttons = [];
            this.buttonsPane = new ContentPane({
                baseClass: 'buttonsPane'
            });
            this.baseClass += ' infoPopup';
        },
        postCreate: function () {
            this.inherited(arguments);
            if (this.buttons) {
                array.forEach(this.buttons, lang.hitch(this, function (btn) {
                    btn.set('class', btn.get('class') + ' ' + 'funcButton');
                    this.buttonsPane.addChild(btn);
                }));
                if (this.buttons.length > 0) {
                    $(this.contentNode).append($('<hr class="hr"/>'));
                    this.buttonsPane.placeAt(this.contentNode);
                }
            }
            else if (this.LinkButtonString) {
                $(this.contentNode).append($('<hr class="hr"/>'));
                $(this.contentNode).append($('<table width="100%"><tr><td align="center">' + this.LinkButtonString + "</td></tr></table>"));
            }
        }
    });
});