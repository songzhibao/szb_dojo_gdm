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

        Addr : "",
        Type : "",
        Id : "",

        constructor: function (args) {
            declare.safeMixin(this, args || {});
        },

        ToXML: function (param) {

        }

    });


});