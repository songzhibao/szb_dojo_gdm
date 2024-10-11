define([
    "dojo/_base/declare", 

    "dijit/_Widget",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",

    "dojo/text!./RoleEditView.html"
], function (declare, _Widget, _TemplatedMixin, _WidgetsInTemplateMixin, template) {

    return declare([_Widget, _TemplatedMixin, _WidgetsInTemplateMixin], {

        templateString: template,

        widgetsInTemplate: true,

        startup: function () {
            this.inherited(arguments);
        }
    });
});