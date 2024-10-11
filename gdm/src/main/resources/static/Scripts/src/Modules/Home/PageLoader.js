/**
* Created with JetBrains WebStorm.
* User: chengbin
* Date: 13-4-1
* To change this template use File | Settings | File Templates.
*/
define([
    "dojo/_base/declare",
    "egis/Modules/MSG/MsgModule",
    "egis/Modules/MSG/GpsModule",
    "egis/Modules/Home/HomeModule",
    "egis/AppLoader",
    'egis/Config/AppConfig'
], function (declare, MsgModule, GpsModule,HomeModule, AppLoader, appConfig) {

    var AppLoader = declare([AppLoader], {
        
        constructor: function (args) {
            declare.safeMixin(this, args || {});

            this.appConfig = appConfig;

            this.modules = [
                //new MsgModule(),
                //new GpsModule(),
                new HomeModule()
            ];

        },
        getDefaultMap: function () {

        }

    });
    return AppLoader;
});