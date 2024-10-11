define([
    'dojo/_base/declare',
    "dojo/_base/lang",
    'dojo/_base/array',
    'egis/appEnv',
    'egis/Modules/Panel/PaneModule',
    'egis/Share/component/MapPane'

], function (declare, lang, array,appEnv, PaneModule, MapPane) {
    var cmp = declare([PaneModule], {

        title: '',
        map: null,
        builder : null,
        closable: true,
        hasMapOverview: true,
        layerSwitchControl: null,
        zIndexManagerControl: null,
        constructor: function () {
            this.pane = new MapPane({
                map: this.map,
                //builder : this.builder,
                title: this.title
            });
            
        },

        startup: function () {
            this.inherited(arguments);
        },

        destroy: function () {
            //this.map = null;
            array.forEach(this.popups, function (popup) {
                popup.destroy();
            });
            this.inherited(arguments);
        }
    });
    return cmp;
});