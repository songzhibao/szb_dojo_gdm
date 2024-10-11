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

        AlarmType : 1,
        LocateType : 1,
        Id : "",
        Jurisdiction : "",
        PosX : 0,
        PosY : 0,
        PosName : "",
        CaseAddress : "",
        AlarmTime : "",

        constructor: function (args) {
            declare.safeMixin(this, args || {});
        },

        ToXML: function (param) {

        }

    });


});