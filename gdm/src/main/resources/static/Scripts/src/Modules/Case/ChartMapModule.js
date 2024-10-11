define([
'dojo/_base/declare',
'dojo/_base/array',
'dojo/_base/lang',
'dojo/aspect',
'dojo/json',
'dojo/topic',
'dojo/ready',
'dojo/request',
"dojo/on",
'dijit/form/Button',
'egis/Modules/_Module',
'egis/appEnv',
'egis/Share/component/InfoPane/TableInfoPopup',
'egis/Share/component/Dialog/Dialog',
'egis/Modules/Case/component/ChartMap/ChartMapPane',
'ol'

], function (declare, array, lang, aspect, JSON, topic, ready, request, on, Button, _Module, appEnv, TableInfoPopup, Dialog, ChartMapPane, ol) {
    return declare([_Module], {

        constructor: function () {

        },
        startup: function () {

            var pane = appEnv.getCurrentPane();
            if (pane != null)
            {
                this.ChartMapPane = new ChartMapPane();
                pane.addChild(this.ChartMapPane);
            }
        }


    });
});