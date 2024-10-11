/**
* User: yangcheng
* Date: 16-2-19
*/
define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    'dojo/_base/array',
    "dojo/dom-style",
    'dojo/topic',
    'dojo/json',
    'dojo/request',
    "dojo/aspect",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "egis/Share/component/Button/ImageButton",
    'egis/appEnv',
    "dojo/text!./WorkStationItem.html"

], function (declare, lang, array, domStyle, topic, JSON, request, aspect, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin,
              ImageButton, appEnv, template) {

    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {


        templateString: template,

        widgetsInTemplate: true,

        name: null,

        imgsrc: null,

        WorkStation: null,

        WorkIframe : null,

        postCreate: function () {

            this.inherited(arguments);

        },

        startup: function () {
            this.inherited(arguments);
                
            this.connect(this.cardName, "click", lang.hitch(this, this._itemSelected));
            this.connect(this.cardDelete, "click", this._itemDeleted);
        },

        _itemDeleted: function () {
            
            if (this.WorkStation)
            {
                this.WorkStation.DeleteChild(this);
                if (this.WorkIframe)
                {
                    delete this.WorkIframe;
                    this.WorkIframe =null;
                }
            }
        },

        _itemSelected: function () {
            
            if (this.WorkStation) {
                this.WorkStation.switchDesktop(this);
            }            
        },


        destroy: function () {
            this.inherited(arguments);


        }
    });
});