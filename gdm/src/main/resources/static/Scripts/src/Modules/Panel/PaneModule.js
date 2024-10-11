define([
'dojo/_base/declare',
'dojo/_base/array',
"dojo/_base/lang",
'egis/appEnv',
'egis/Modules/_Module',
"egis/Share/component/MainPane",
'dojo/topic'

], function (declare, array, lang, appEnv, _Module, MainPane, topic) {
    var cmp = declare([_Module], {
        title: '',
        map: null,
        pane: null,
        closable: true,
        constructor: function (args) {
            this.pane = new MainPane({
                dockable: this.dockable,
                map: this.map,
                title: this.title,
                style: "width:100%; height:100%; padding:0px; overflow:hidden;"
            });
        },

        postCreate: function () {
            this.inherited(arguments);
        },

        startup: function () {
            this.inherited(arguments);
            this.pane.closable = this.closable;
            appEnv.stackContainer.addChild(this.pane);
        },

        destroy: function () {
            this.pane.destroy();
            this.pane = null;
        }
    });
    return cmp;
});