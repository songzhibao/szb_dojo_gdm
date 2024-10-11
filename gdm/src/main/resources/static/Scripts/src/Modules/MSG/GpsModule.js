define([
'dojo/_base/declare',
'dojo/_base/array',
'dojo/_base/lang',
'dojo/aspect',
'dojo/json',
'dojo/topic',
'egis/Modules/_Module',
'egis/appEnv'

], function (declare, array, lang, aspect, JSON, topic, _Module, appEnv) {
    return declare([_Module], {

        constructor: function () {

        },


        startup: function () {

            var me = this;

            
            var wsImpl = window.WebSocket || window.MozWebSocket;

            window.gpsListen = new wsImpl(appEnv.appConfig.GpsServerConnectString);

            gpsListen.onmessage = function (evt) {
                me.ParseMessage(evt.data);
            };

            gpsListen.onopen = function (evt) {

            };

            gpsListen.onclose = function () {
                
            }
        },


        ParseMessage : function (msgString) {

            var array = msgString.split('@');
            if (array.length == 8) {
                if (array[0] == "GPS") {
                    if (array[2] == "-1" && array[3] == "-1")
                    {
                        return;
                    }
                    appEnv.publishMainPane("egis/gps/updategps", { GPSId: array[1], Lon: array[2], Lat: array[3], Speed: array[4], Angle: array[5], GpsTime: array[6], Status: array[7] }, "GPS");
                }
                else if (array[0] == "STATUS")
                {
                    appEnv.publishMainPane("egis/gps/updatestatus", { GPSId: array[1], Lon: array[2], Lat: array[3], Speed: array[4], Angle: array[5], GpsTime: array[6], Status: array[7] }, "GPS");
                }
            }
        }


    });
});