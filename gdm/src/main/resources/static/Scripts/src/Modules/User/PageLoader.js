/**
* Created with JetBrains WebStorm.
* User: chengbin
* Date: 13-4-1
* To change this template use File | Settings | File Templates.
*/
define([
    "dojo/_base/declare",
    "egis/AppLoader",
    "egis/Modules/User/UserModule",
    'egis/Config/AppConfig'
], function (declare, AppLoader, UserModule, appConfig) {

    var AppLoader = declare([AppLoader], {
        
        constructor: function (args) {
            declare.safeMixin(this, args || {});

            this.appConfig = appConfig;

            this.modules = [
                new UserModule()
            ];
        }

    });
    return AppLoader;
});