/**
* Created with JetBrains WebStorm.
* User: chengbin
* Date: 13-4-1
* To change this template use File | Settings | File Templates.
*/
define([
    "dojo/_base/declare",
    "egis/AppLoader",
    "egis/Modules/Map/MapModule",
    "egis/Modules/Guard/GuardModule",
    "egis/Modules/Map/EditMapModule",
    "egis/Modules/Map/GeoMapModule",
    "egis/Modules/Map/ResourceMapModule",
    'egis/MapBuilder',
    'egis/Config/MapConfig',
    'egis/Config/AppConfig'
], function (declare, AppLoader, MapModule, GuardModule, EditMapModule, GeoMapModule, ResourceMapModule, MapBuilder, mapConfig, appConfig) {

    var AppLoader = declare([AppLoader], {
        
        constructor: function (args) {
            declare.safeMixin(this, args || {});

            this.appConfig = appConfig;
            this.mapConfig = mapConfig;

            this.modules = [
                new MapModule({
                    map: this.getDefaultMap()
                }),
                new GeoMapModule(),
                new GuardModule(),
                new EditMapModule(),
                new ResourceMapModule()
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