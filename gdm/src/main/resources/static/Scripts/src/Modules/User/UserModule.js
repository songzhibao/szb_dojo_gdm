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
"egis/Modules/Panel/PaneModule",
'egis/appEnv',
'egis/Modules/User/component/UserPermission'

], function (declare, array, lang, aspect, JSON, topic, ready, request, on, Button, PaneModule, appEnv, UserPermission) {
    return declare([PaneModule], {

        constructor: function () {

        },
        startup: function () {
            this.inherited(arguments);
            this.UserPermission = new UserPermission();
            this.pane.addChild(this.UserPermission);

        }


    });
});