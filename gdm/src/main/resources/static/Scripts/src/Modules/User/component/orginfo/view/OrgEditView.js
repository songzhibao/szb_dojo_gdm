define([
    "dojo/_base/declare",

    "dijit/_Widget",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dijit/layout/AccordionContainer",
    "dijit/layout/ContentPane",
    "dojo/text!./OrgEditView.html"
], function (declare, _Widget, _TemplatedMixin, _WidgetsInTemplateMixin,AccordionContainer,ContentPane, template) {

    return declare([_Widget, _TemplatedMixin, _WidgetsInTemplateMixin], {

        templateString: template,

        widgetsInTemplate: true,

        startup: function () {
            this.inherited(arguments);
        }
    });
});