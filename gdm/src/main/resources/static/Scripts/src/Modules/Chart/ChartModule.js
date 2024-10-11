define([
'dojo/_base/declare',
'dojo/_base/array',
'dojo/_base/lang',
'dojo/aspect',
'dojo/json',
'dojo/topic',
'dojo/ready',
'dojo/request',
'dojo/dom-style',
"dojo/on",
"dojo/data/ItemFileWriteStore",
'dijit/Toolbar',
"dojox/grid/EnhancedGrid",
"dojox/grid/enhanced/plugins/Filter",
"dojox/grid/enhanced/plugins/Pagination",
"dojox/grid/enhanced/plugins/IndirectSelection",
"dijit/registry",
'dijit/form/Button',
'dijit/TitlePane',
'egis/Modules/_Module',
'egis/appEnv',
"egis/Share/component/OrgTree/CBTree",
'egis/Share/component/Dialog/Dialog',
"egis/Modules/Chart/component/ChartPane",
"egis/Modules/Chart/component/ChartToolList",
"egis/cache"

], function (declare, array, lang, aspect, JSON, topic, ready, request, domStyle, on, ItemFileWriteStore, Toolbar, EnhancedGrid, Filter, Pagination, IndirectSelection, registry, Button, TitlePane, _Module, appEnv, CBTree, Dialog, ChartPane,ChartToolList, cache) {
    return declare([_Module], {

        constructor: function () {
            
        },
        startup: function () {

            var mapPane = appEnv.getCurrentPane();
            var me = this;
            if (mapPane != null) {
                this.chartPane = new ChartPane({
                    //id: 'ChartPane',
                    style: 'position:absolute; width:100%; height:100%;padding: 0px;border:1px;'
                });
                mapPane.addChild(this.chartPane);
            }

            var toolPane = new ChartToolList({
                id: 'tool-container',
                style: 'position:absolute; right:10px; top:130px;padding: 0px;'
            });
            mapPane.addFloatingPane(toolPane);

        }

    });
});