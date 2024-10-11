/**
* User: chengbin
* Date: 13-4-1
*/
define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/Evented",
    "dojo/on",
    "dojo/aspect",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dojo/dom-geometry",
    'dojo/_base/array',

    "dijit/registry",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dijit/layout/BorderContainer",
    "dijit/layout/AccordionContainer",
    "dijit/layout/ContentPane",
    "dojo/text!./UserPermission.html",

    "egis/Modules/User/component/orginfo/OrgInfoManager",
    "egis/Modules/User/component/orginfo/OrgTreeManager",
    "egis/Modules/User/component/user/UserManager",
    "egis/Modules/User/component/role/RoleManager"
], function (declare, lang, Evented, on, aspect, domStyle, domConstruct, domGeometry, array, registry,
                _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin,BorderContainer,AccordionContainer,ContentPane, template,
                OrgInfoManager, OrgTreeManager, UserManager, RoleManager) {

    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Evented], {

        templateString: template,

        widgetsInTemplate: true,

        topPaneHeight: 120,

        bottomPaneHeight: 50,

        iframeWidth: null,

        iframeHeight: null,

        postMixInProperties: function () {
            this.iframeWidth = document.body.clientWidth;
            this.iframeHeight = document.body.clientHeight - this.topPaneHeight - this.bottomPaneHeight;
        },

        postCreate: function () {
            this.inherited(arguments);
        },

        startup: function () {
            this.inherited(arguments);

            if (!this.panes) {
                this.panes = [this.orgSearchPane, this.orgTreePane, this.roleSearchPane, this.userSearchPane];

                array.forEach(this.panes, lang.hitch(this, function (pane) {
                    this._initAction(pane);
                }));
            }
            
            this.panes[0].click();
        },

        _initAction: function (pane) {
            on(pane, "click", lang.hitch(this, function () {
                this._changeClickStatus(pane);

                var operateGrid = registry.byId("operateGrid");

                //删除一个子结点之后 其他子结点顺序就会相应变化 导致漏删 所以每次只删除第一个
                var children = operateGrid.containerNode.children;
                array.forEach(children, lang.hitch(this, function () {
                    operateGrid.containerNode.removeChild(operateGrid.containerNode.children[0]);
                }));

                if (pane.id == 'orgSearchPane') {
                    if (!this.orgInfoManager) {
                        this.orgInfoManager = new OrgInfoManager();
                    }
                    else {
                        this.orgInfoManager.unsubscribe();
                        this.orgInfoManager.createOrgSearchPane();
                    }
                }
                else if (pane.id == 'orgTreePane') {
                    this.orgTreeManager = new OrgTreeManager();
                }
                else if (pane.id == 'roleSearchPane') {
                    if (!this.roleManager) {
                        this.roleManager = new RoleManager();
                    }
                    else {
                        this.roleManager.unsubscribe();
                        this.roleManager.createRoleSearchPane();
                    }
                }
                else if (pane.id == 'userSearchPane') {
                    if (!this.userManager) {
                        this.userManager = new UserManager();
                    }
                    else {
                        this.userManager.unsubscribe();
                        this.userManager.createUserSearchPane();
                    }
                }
            }));
        },

        _changeClickStatus: function (item) {
            array.forEach(this.panes, lang.hitch(this, function (pane) {
                pane.style.background = null;
                pane.style.color = null;
            }));

            item.style.background = '#304A83';
            item.style.color = '#FFFFFF';
        },

        destroy: function () {
            this.inherited(arguments);
        }
    });
});