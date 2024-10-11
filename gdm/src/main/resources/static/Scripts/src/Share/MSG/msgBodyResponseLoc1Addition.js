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

        Name : "",
        Telephone :"",
        Addr : "",

        Type : "",

        Id : "",
        Street : "",
        Location : "",
        Pressure : "",
        Flow : "",
        Diameter : "",
        Shape : "",

        constructor: function (args) {
            declare.safeMixin(this, args || {});
        },

        ToXML: function (param) {

        }

    });


});