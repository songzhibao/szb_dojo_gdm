/**
* Created with JetBrains WebStorm.
* User: chengbin
* Date: 13-4-1
* To change this template use File | Settings | File Templates.
*/
define([
    "dojo/_base/declare",
    "egis/AppLoader",
    "egis/Modules/Panel/PaneModule",
    "egis/Modules/Case/ChartMapModule",
    "egis/Modules/Map/ResourceMapModule",
    'egis/MapBuilder',
    'egis/Config/MapConfig',
    'egis/Config/AppConfig'
], function (declare, AppLoader, PaneModule, ChartMapModule, ResourceMapModule, MapBuilder, mapConfig, appConfig) {

    var AppLoader = declare([AppLoader], {
        
        constructor: function (args) {
            declare.safeMixin(this, args || {});

            this.appConfig = appConfig;
            this.mapConfig = mapConfig;

            this.modules = [
                new PaneModule({
                    map: this.getDefaultMap()
                }),
                new ResourceMapModule(),
                new ChartMapModule()
            ];
        },
        getDefaultMap: function () {
            var mapBuilder = new MapBuilder({
                mapConfig: mapConfig
            });
            return mapBuilder.buildMap();
        }

    });
    return AppLoader;
});