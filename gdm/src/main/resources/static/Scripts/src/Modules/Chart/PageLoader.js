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
    "egis/Modules/Chart/ChartModule",
    'egis/Config/AppConfig'
], function (declare, AppLoader, PaneModule, ChartModule, appConfig) {

    var AppLoader = declare([AppLoader], {
        
        constructor: function (args) {
            declare.safeMixin(this, args || {});

            this.appConfig = appConfig;

            this.modules = [
                new PaneModule({
                    map: this.getDefaultMap()
                }),
                new ChartModule()
            ];
        },


        getDefaultMap: function () {

        }

    });
    return AppLoader;
});