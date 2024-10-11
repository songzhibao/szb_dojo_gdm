/**
* Created with JetBrains WebStorm.
* User: chengbin
* Date: 13-4-1
* To change this template use File | Settings | File Templates.
*/
define([
    "dojo/_base/declare",
    "dojo/dnd/Source",

    "dijit/_Widget",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dijit/TitlePane",
    "dojo/text!./OrgPersonView.html"
], function (declare, Source, _Widget, _TemplatedMixin, _WidgetsInTemplateMixin,TitlePane, template) {

    return declare([_Widget, _TemplatedMixin, _WidgetsInTemplateMixin], {

        templateString: template,

        widgetsInTemplate: true,

        orgId: null,

        toContainer: null,

        fromContainer: null,

        constructor: function (args) {
            declare.safeMixin(this, args || {});
        },

        startup: function () {
            this.inherited(arguments);
            this.loadSourceData();
            this.loadTargetData();
        },

        /*
        *  查询所有组织人员，把数据传入到弹出窗口的“待选人员”中
        */
        loadSourceData: function () {
            console.debug("TabOrgPersonView -- queryOrgPeople");
            var self = this;
            self.fromContainer = new Source(self.from_node, {
                isSource: true,
                copyOnly: false,
                selfCopy: false,
                selfAccept: false
            });
            var xhrArgs = {
                url: "/system/getUserList",
                preventCache: true,
                handleAs: "json",
                load: function (result) {
                    var data = result.data;
                    for (var i = 0; i < data.length; i++) {
                        data[i].toString = function () {
                            return this.name;
                        };
                    }
                    self.fromContainer.insertNodes(false, data);
                },
                error: function (error) {
                    console.debug(error);
                }
            };
            var deferred = dojo.xhrPost(xhrArgs);
        },

        /*
        *  查询组织ID下的所有组织人员，把数据传入到弹出窗口的“已选人员”中
        */
        loadTargetData: function () {
            console.debug("TabOrgPersonView -- queryOrgPeopleByOrgId");
            var self = this;
            self.toContainer = new Source(self.to_node, {
                isSource: true,
                copyOnly: false,
                selfCopy: false,
                selfAccept: false
            });
            // 新建组织，“已选人员”为空
            if (self.orgId == null) {
                return;
            }
            var xhrArgs = {
                url: "/system/getUserList",
                postData: dojo.toJson({
                    orgIds: self.orgId ? [self.orgId] : []
                }),
                contentType: "application/json;charset=UTF-8",
                preventCache: true,
                handleAs: "json",
                load: function (result) {
                    var data = result.data;
                    for (var i = 0; i < data.length; i++) {
                        data[i].toString = function () {
                            return this.name;
                        };
                    }
                    self.toContainer.insertNodes(false, data);
                },
                error: function (error) {
                    console.debug(error);
                }
            };
            var deferred = dojo.xhrPost(xhrArgs);
        },

        getData: function () {
            var data = {};
            data.persons = [];
            this.toContainer.forInItems(function (item, id) {
                data.persons.push(item.data.personId + '');
            });
            //console.debug(data);
            return data;
        }

    });
});