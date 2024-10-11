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
    "egis/Modules/Duty/DutyModule",
    "egis/Modules/Alarm/AlarmModule",
    "egis/Modules/Alarm/StalkingModule",
    "egis/Modules/Detector/DetectorModule",
    "egis/Modules/Map/GeoMapModule",
    "egis/Modules/Map/EditMapModule",
    "egis/Modules/Map/ResourceMapModule",
    "egis/Modules/MSG/GpsOtherModule",
    'egis/MapBuilder',
    'egis/Config/MapConfig',
    'egis/Config/AppConfig'
], function (declare, AppLoader, MapModule, DutyModule, AlarmModule, StalkingModule, DetectorModule,GeoMapModule, EditMapModule, ResourceMapModule, GpsOtherModule, MapBuilder, mapConfig, appConfig) {

    var AppLoader = declare([AppLoader], {
        
        constructor: function (args) {
            declare.safeMixin(this, args || {});

            this.appConfig = appConfig;
            this.mapConfig = mapConfig;
            window.IsAccessMsg = true;
            window.IsAccessGPS = true;

            this.modules = [
                new MapModule({
                    map: this.getDefaultMap()
                }),
                new GeoMapModule(),
                new DutyModule({IsShowPane : false}),
                new AlarmModule(),
                new StalkingModule(),
                new DetectorModule(),
                new EditMapModule(),
                new ResourceMapModule()//,
                //new GpsOtherModule()
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