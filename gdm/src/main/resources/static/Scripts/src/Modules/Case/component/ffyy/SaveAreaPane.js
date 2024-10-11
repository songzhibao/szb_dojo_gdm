/**
* User: yangcheng
* Date: 16-2-19
*/
define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/Evented",
    "dojo/aspect",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dojo/store/Memory",
    "dojo/topic",
    'dojo/_base/array',
    "dojo/on",
    'dojo/request',
    "dijit/Dialog",
    "egis/component/jwqTree",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    'dijit/form/Textarea',
    'egis/business/userManager',
    "egis/component/ffyy/ConfirmDialogOK",
    'dojo/text!./SaveAreaPane.html'
], function (declare, lang, Evented, aspect, domStyle, domConstruct, Memory, topic, array, on, request, Dialog, jwqTree,
                _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Textarea, userManager, ConfirmDialogOK, template) {

    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {

        templateString: template,

        jwqTree: null,

        fromType:'',
        initName:'',
        valStrs:'',

        startup: function () {


            var me = this;

            this.inherited(arguments);


            this.submitButton.on("click", lang.hitch(this, this._SubmitButtonClick));
            // 初始化组织结构树
            this.jwqTree = new jwqTree({
                checkBoxes: false,
                style: " height:280px; width:240px; overflow-x:hidden;"
            }, this.orgNode);


            this.jwqTree.on("click", function (e) {

                if (e.OrgLevel == 4) {
                    me.orgName.set("value", e.name);
                }
            });


            this.regionName.set("value", this.initName);
            this.createUser.set("value", userManager.user.Name);

        },
        _SubmitButtonClick: function () {

            var name = this.regionName.value;
            var username = this.createUser.value;
            var sqsq = this.sqsq.get('displayedValue');
            var orgName = this.orgName.value;
            var orgId = this.jwqTree.selectedItem.OrgId;
            var remark = this.remarkText.value;

            if (name != "" && orgName != "") {

                request.post("/ffyy_CaseInfo/CreateAreas", {
                    data: {
                        name: name,
                        username: username,
                        sqsq: sqsq,
                        orgId: orgId,
                        orgName: orgName,
                        remark: remark,
                        valStrs: this.valStrs
                    },
                    handleAs: "json"
                }).then(
                    lang.hitch(this, function (data) {

                        var cd = new ConfirmDialogOK({
                            message: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;保存成功！&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;",
                            yes: lang.hitch(this, function () {

                                if (this.fromType == 'JQGL') {
                                    topic.publish('sh/component/ffyy/SaveAreaPane_JQGL', this);
                                }
                                if (this.fromType == 'QYHZ') {
                                    topic.publish('sh/component/ffyy/SaveAreaPane_QYHZ', this);
                                }
                            })
                        });
                        cd.show();

                        return;
                    })
                );
            }
            else {

                var cd = new ConfirmDialogOK({
                    message: "&nbsp;&nbsp;名称和组织机构不能为空！&nbsp;&nbsp;",
                    yes: lang.hitch(this, function () { })
                });
                cd.show();
                return;
            }
        }
    });
});
