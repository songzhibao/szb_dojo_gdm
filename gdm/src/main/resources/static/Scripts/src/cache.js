/**
 * Created with JetBrains WebStorm.
 * User: chengbin
 * Date: 14-4-28
 * To change this template use File | Settings | File Templates.
 */
define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/store/Memory",
    'dojo/request',
    'dojo/topic',
    "egis/appEnv"
], function (declare, lang, Memory, request,topic, appEnv) {

    var cache = declare([], {

        caseTypeTreeRoots: null,

        orgTreeRoots: null,

        init: function () {
            this._initCaseTypeTreeRoots();
            this._initOrgTreeRoots();
            this._initAllOrgTree();
        },

        _initCaseTypeTreeRoots: function () {
            request.get("/system/getCaseTypeDic", {
                // data: {
                //     displayLevel: appEnv.appConfig.orgTreeDisplayLevel,
                //     checkedAll: appEnv.appConfig.OrgDefaultCheck
                // },
                handleAs: "json",
                timeout: 6000000
            }).then(lang.hitch(this, function (data) {
                window.caseTypeTreeRoots = data.data;
                console.debug("[cache] initCaseTypeTreeRoots!");
            }), lang.hitch(this, function (error) {
            }));
        },

        _initAllOrgTree: function () {
            request.post("/system/getOrgInfo", {
                data: {
                    orgCodes: [appEnv.appConfig.GetRootOrgId()]
                },
                handleAs: "json",
                timeout: 6000000
            }).then(lang.hitch(this, function (data) {
                window.orgTreeAll = data.data;
                console.debug("[cache] initOrgTreeAll!");
                topic.publish('egis/cache/FinishLoad', data);
            }), lang.hitch(this, function (error) {
            }));
        },


        _initOrgTreeRoots: function () {
            request.post("/system/getOrgInfo", {
                data: {
                    orgCodes: [appEnv.appConfig.GetRootOrgId()],
                    displayLevel: appEnv.appConfig.orgTreeDisplayLevel,
                    checkedAll: appEnv.appConfig.OrgDefaultCheck
                },
                handleAs: "json",
                timeout: 6000000
            }).then(lang.hitch(this, function (data) {
                window.orgTreeRoots = data.data;
                console.debug("[cache] initOrgTreeRoots!");
            }), lang.hitch(this, function (error) {
            }));
        },

        newCaseTypeTreeStore: function () {
            var typeData = window.caseTypeTreeRoots;
            if (!typeData) {
                typeData = window.parent.window.caseTypeTreeRoots;
            }
            var caseTypeTreeStore = new Memory({
                idProperty: "id",
                data: lang.clone(typeData),
                getChildren: function (object) {
                    //console.debug(object);
                    // 需要添加path用于搜索定位
                    if (object.parentId == null) {
                        object.path = object.id;
                    }
                    var children = this.query({ parentId: this.getIdentity(object) });
                    for (var i = 0; i < children.length; i++) {
                        var child = children[i];
                        child.path = object.path + "," + child.id;
                    }
                    return children;
                }
            });
            return caseTypeTreeStore;
        },


        getOrgChildren: function (rootName) {
            var rootId;
            for (var i = 0; i < this.orgTreeRoots.length; i++) {
                if (this.orgTreeRoots[i].name == rootName) {
                    rootId = this.orgTreeRoots[i].OrgId;
                    break;
                }
            }
            if (rootId == null) {
                return null;
            }

            var orgs = [];
            for (var i = 0; i < this.orgTreeRoots.length; i++) {
                if (this.orgTreeRoots[i].OrgId == rootId || this.orgTreeRoots[i].parent == rootId) {
                    orgs.push(this.orgTreeRoots[i]);
                }
            }
            return orgs;
        },

        GetOrgInfo: function (parentId)
        {
            var orgData = window.orgTreeAll;
            if (!orgData) {
                orgData = window.parent.window.orgTreeAll;
            }
            var orgTreeStore = new Memory({
                idProperty: "id",
                data: lang.clone(orgData)
            });
            var result = orgTreeStore.query({ id : parentId });
            if (result.length >= 0) {
                return result[0];
            }
            else {
                return null;
            }
        },

        newOrgTreeStore: function () {

            var orgData = window.orgTreeRoots;
            if (!orgData)
            {
                orgData = window.parent.window.orgTreeRoots;
            }
            var orgTreeStore = new Memory({
                idProperty: "id",
                data: lang.clone(orgData),
                getChildren: function (object) {

                    // 需要添加path用于搜索定位
                    if (object.parent == null || object.parent == 0) {
                        object.path = object.id;
                    }
                    var children = this.query({ parent: this.getIdentity(object) });
                    for (var i = 0; i < children.length; i++) {
                        var child = children[i];
                        child.path = object.path + "," + child.id;
                    }
                    return children;
                }
            });
            return orgTreeStore;
        }

    });

    return new cache();

});