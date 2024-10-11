/**
* Author: shenyi
* Email: shenyi@dscomm.com.cn
* Date: 13-4-11
*/
define(['dojo/_base/declare', 'dojo/cookie', 'dojo/json'], function (declare, cookie, JSON) {
    var cmp = declare(null, {
        user: null,
        constructor: function (args) {
            declare.safeMixin(this, args || {});
        },
        setUser: function (user) {
            this.user = user;
        },
        getUser: function () {
            if (this.user == null && cookie('dsAuthenticationUser')) {
                this.user = JSON.parse(cookie('dsAuthenticationUser'));
            }
            return this.user;
        },
        isGranted: function (arg) {
            var perms = [];
            if (typeof (arg) === 'string') {
                perms.push(arg);
            } else {
                //arg为数组
                perms = perms.concat(arg);
            }
            return this._isGranted(perms);
        },
        _isGranted: function (perms) {
            var me = this;
            var user = me.getUser();
            if (user != null) {
                for (var i = 0; i < perms.length; ++i) {
                    var perm = perms[i];
                    if ($.inArray(perm, user.Privileges) < 0) return false;
                }
                return true;
            }
            return false;
        }
    });
    return new cmp();
});