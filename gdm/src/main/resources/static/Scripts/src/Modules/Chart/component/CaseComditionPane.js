/**
* Created with JetBrains WebStorm.
* User: chengbin
* Date: 13-4-24
* To change this template use File | Settings | File Templates.
*/
define([
    "dojo/_base/declare",
    "dojo/_base/fx",
    "dojo/_base/lang",
    'dojo/_base/array',
    "dojo/dom-class",
    "dojo/dom-geometry",
    "dojo/Evented",
    "dojo/on",
    'dojo/topic',
    'dojo/date',
    "dijit/_TemplatedMixin",
    'dijit/_WidgetsInTemplateMixin',
    "dojox/layout/ContentPane",
    "dojox/widget/Standby",
    'dijit/form/TextBox',
    "dijit/_WidgetBase",
    'dijit/form/Button',
    'dijit/TooltipDialog',
    'dijit/form/DropDownButton',
    "dojo/text!./CaseComditionPane.html",
    "egis/Share/component/DateTime/DateTimeInfoTextBox",
    "egis/Share/component/DateTime/DateTimeInfoShortcutText",
    "egis/Share/component/CaseTree/CaseTypeTextBox",
    "egis/Share/component/CaseTree/CaseTypeShortcutText",
    "egis/Share/component/OrgTree/OrganizationTextBox",
    "egis/Share/component/OrgTree/OrganizationShortcutText",
    "egis/appEnv"

], function (declare, baseFx, lang, array, domClass, domGeom, Evented, on, topic, dateUtil, TemplatedMixin, _WidgetsInTemplateMixin, ContentPane, Standby, TextBox, _WidgetBase, Button, TooltipDialog, DropDownButton, template,
    DateTimeInfoTextBox,DateTimeInfoShortcutText,CaseTypeTextBox,CaseTypeShortcutText,OrganizationTextBox,OrganizationShortcutText, appEnv) {

    var FixedPane = declare([_WidgetBase, TemplatedMixin, _WidgetsInTemplateMixin, Evented], {

        standby: null,

        templateString: template,

        LikeVal: "",

        title: "",

        currentRequest : null,

        buildRendering: function () {
            this.inherited(arguments);
            this.dateTimeInfoShortcutText.set('textBox', this.dateTimeInfoTextBox);
            this.dateTimeInfoTextBox.SetCurrentValue({
                timeSpan: [dateUtil.add(new Date(), 'month', -1), new Date()],
                periods: [1, 2, 3, 4]
            });
            //this.caseTypeShortcutText.set('textBox', this.caseTypeTextBox);
            //this.organizationShortcutText.set('textBox', this.organizationTextBox);
        },

        postCreate: function () {
            this.inherited(arguments);

        },

        startup: function () {
            var me = this;
            this.inherited(arguments);

            this.connect(this.CK_CASE_TB, "change", lang.hitch(this, this._check_Change));
            this.connect(this.CK_CASE_HB, "change", lang.hitch(this, this._check_Change));

            this.dateTimeInfoTextBox.on("LockShow", function (IsLock) {
                me.emit("LockShow",IsLock);
            });
            this.dateTimeInfoTextBox.on("change", lang.hitch(this, this._check_Change));
            this.caseTypeTextBox.on("LockShow", function (IsLock) {
                me.emit("LockShow", IsLock);
            });
            this.caseTypeTextBox.on("mouseout", function () {
                me.emit("mouseout");
            });
            this.caseTypeTextBox.on("mouseover", function () {
                me.emit("mouseover");
            });

            this.caseTypeTextBox.on("change", lang.hitch(this, this._check_Change));
            this.organizationTextBox.on("LockShow", function (IsLock) {
                me.emit("LockShow", IsLock);
            });
            this.organizationTextBox.on("mouseout", function () {
                me.emit("mouseout");
            });
            this.organizationTextBox.on("mouseover", function () {
                me.emit("mouseover");
            });
            this.organizationTextBox.on("change", lang.hitch(this, this._check_Change));
            me._check_Change();
        },


        _check_Change : function()
        {
            var dateTimeInfo = this.dateTimeInfoTextBox.GetCurrentValue();
            var caseTypes = this.caseTypeTextBox.GetCurrentValue();
            var orgs = this.organizationTextBox.GetCurrentValue();
            var caseTypeIds = [];
            var caseTypeLevel = 4;
            var caseRootCount = 0;
            array.forEach(caseTypes, function (caseType) {
                if (caseType.CaseTypeLevel <= caseTypeLevel) {
                    caseTypeLevel = caseType.CaseTypeLevel;
                    caseRootCount++;
                };
            });

            array.forEach(caseTypes, function (caseType) {
                if (caseType.CaseTypeLevel == caseTypeLevel) {
                    caseTypeIds.push(caseType.CaseTypeId)
                };
            });

            var orgIds = [];
            var orgLevel = 4;
            var orgRootCount = 0;
            array.forEach(orgs, function (orgItem) {
                if (orgItem.OrgLevel <= orgLevel) {
                    orgLevel = orgItem.OrgLevel;
                    orgRootCount++;
                }
            });
            array.forEach(orgs, function (orgItem) {
                if (orgLevel == 0) {
                    orgLevel = 1;
                }
                if (orgLevel < orgItem.userLevel) {
                    orgLevel = orgItem.userLevel;
                }
                if (orgItem.OrgLevel == orgLevel) {
                    orgIds.push(orgItem.OrgId);
                }
            });


            var start = dateTimeInfo.timeSpan[0].toLocaleDateString().replaceAll('/', '-') + " " + dateTimeInfo.timeSpan[0].toLocaleTimeString();
            var end = dateTimeInfo.timeSpan[1].toLocaleDateString().replaceAll('/', '-') + " " + dateTimeInfo.timeSpan[1].toLocaleTimeString();

            //获取周边警力资源
            var paramObj = {
                actionType: "/caseinfo/getCaseInfoStat",
                actionExplain: this.title,
                startTime: start,
                endTime: end,
                caseTypes: caseTypeIds,
                caseTypeLevel: caseTypeLevel,
                orgCodes: orgIds,
                OrgLevel: orgLevel,
                isCheckTB: this.CK_CASE_TB.checked,
                isCheckHB: this.CK_CASE_HB.checked
            };
            this.currentRequest = { getDataUrl: "/caseinfo/getCaseInfoStat", LayerGroup: "警情上图", LayerId: "上图警情", actionExplain: paramObj.actionExplain, actionType: paramObj.actionType, paramObject: paramObj };

            this.emit("onCheckChange", this.currentRequest);
        },

        getCurrentRequest : function()
        {
            return this.currentRequest;
        },

        destroy: function () {
            this.inherited(arguments);
        }

    });

    return FixedPane;

});