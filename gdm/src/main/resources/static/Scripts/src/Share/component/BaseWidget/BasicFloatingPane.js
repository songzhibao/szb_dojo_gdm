/* File Created: 九月 27, 2013 */
define([
    "dojo/_base/declare",
    'dojo/_base/array',
    'dojo/_base/lang',
    'dojo/aspect',
    'dojo/topic',
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dijit/_Container",
    "dijit/layout/ContentPane",
    "dojo/text!./BasicFloatingPane.html",
    "dojox/widget/Standby"

], function (declare, array, lang, aspect, topic, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, _Container, ContentPane, template, Standby) {
    return declare([ContentPane, _TemplatedMixin], {
        templateString: template,
        title: '',
        standby: null,
        postCreate: function () {
            this.inherited(arguments);
            this.standby = new Standby({
                target: this.domNode
            });
            $(this.closeNode).click(lang.hitch(this, function () {
                this.close();
            }));
        },
        onClose: function () {
        },
        close: function () {
            this.domNode.remove();
            this.onClose();
        }
    });
});