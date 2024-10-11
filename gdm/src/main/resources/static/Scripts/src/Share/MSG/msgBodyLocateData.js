/**
* User: chengbin
* Date: 13-5-2
*/
define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'egis/Share/MSG/msgObject'

], function (declare, lang, msgObject) {

    return declare([msgObject], {

        Telephone : "",
        Owner : "",
        OwnerAddr : "",
        AlarmAddr : "",

        Mobile : "",
        BaseStation : "",
        StationId : "",
        Longitude : 0,
        Latitude : 0,

        PoleNo : "",
        PosX : 0,
        PosY : 0,

        Name : "",
        ID : "",

        constructor: function (args) {
            declare.safeMixin(this, args || {});
        },

        ToXML: function (param) {

        }

    });


});