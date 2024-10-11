/**
* User: shenyi
* Date: 2013-8-28
* 模块抽象类
*/
define([
    "dojo/_base/declare",
    "dojo/dom",
    "dojo/_base/lang",
    "dijit/registry",
    "dojo/Evented"
], function (declare, dom, lang, registry, Evented) {

    return declare([Evented], {
        statics: {
            idCounter: 0
        },

        _started: false,
        moduleId: null,
        constructor: function (args) {
            //插件依赖类型
            this.dependencies = [];
            declare.safeMixin(this, args || {});
        },

        postscript: function (args) {
            if (!this.moduleId) {
                this.moduleId = 'module_' + this.statics.idCounter++;
            }
            this.postCreate();
        },

        postCreate: function () {
        },

        startup: function () {
            this._started = true;
        },

        destroy: function () {
        }
    });
});