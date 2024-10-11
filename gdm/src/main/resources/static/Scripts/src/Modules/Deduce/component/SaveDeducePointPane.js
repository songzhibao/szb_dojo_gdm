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
    'dojox/widget/ColorPicker',
    "dijit/Dialog",
    "dijit/_WidgetBase",
    'dijit/_WidgetsInTemplateMixin',
    'dijit/ColorPalette',
    'dijit/form/Textarea',
    'dijit/form/TextBox',
    'dijit/form/Select',
    'dijit/form/DropDownButton',
    'dijit/TooltipDialog',
    'dijit/form/ComboButton',
    "egis/Share/component/MapFloatPane/MapFloatingPane",
    "egis/Share/component/OrgTree/OrgTree",
    "egis/Share/component/OrgTree/CBTree",
    "egis/Modules/Deduce/component/DeducePoliceItem",
    'egis/appEnv',
    'dojo/text!./SaveDeducePointPane.html'
], function (declare, lang, Evented, aspect, domStyle, domConstruct, Memory, topic, array, on, request,ColorPicker, Dialog,
                _WidgetBase, _WidgetsInTemplateMixin, ColorPalette, Textarea, TextBox, Select, DropDownButton, TooltipDialog, ComboButton, MapFloatingPane, OrgTree, CBTree,RegionInfoItem, appEnv, template) {

    return declare([MapFloatingPane,_WidgetsInTemplateMixin, Evented], {

        templateString: template,

        widgetsInTemplate: true,

        orgTree: null,

        item: null,

        lon: 0,

        lat: 0,

        PointType : "",

        OrgId: "",

        TaskID : "",

        startup: function () {
            var me = this;
            this.inherited(arguments);

            this.submitButton.on("click", lang.hitch(this, this._SubmitButtonClick));
            this.cacelButton.on("click", lang.hitch(this, this._CancelButtonClick));
            
            // 初始化组织结构树
            this.orgTree = new OrgTree({
                checkBoxes: true,
                state: "Loaded",
                showRoot : false,
                style: " height:220px; width:240px; overflow-x:hidden;"
            }, this.orgNode);

            this.orgTree.on("click", function (e) {
                me.orgName.set("value", e.name);
                var selectOrg = me.orgTree.getSelectedOrgInfo(1);
                me.ShowJWTTree(selectOrg.orgId, selectOrg.OrgPid);
                me.ShowZRJYTree(selectOrg.orgId, selectOrg.OrgPid);
            });

            if (this.item != null) {
                this.OrgId = this.item.Organization.OrgId;
                this.orgName.setValue(this.item.ORGNAME);
                this.lon = this.item.Lon;
                this.lat = this.item.Lat;
                this.remarkText.setRangeText(this.item.Memo != null ? this.item.Memo : "");
                this.gPointZRLD.setValue(this.item.ZRLD);
                this.gPointLXDH.setValue(this.item.LXDH);
                this.gPointName.setValue(this.item.Name);
                if (this.item.PoliceString != null && this.item.PoliceString != "") {
                    var xlzArray = this.item.PoliceString.split('~');
                    array.forEach(xlzArray, function (o) {
                        var sp = new RegionInfoItem({ data: o ,parentNode : me.gridNode });
                        me.gridNode.addChild(sp);
                    });
                }
                this.ShowJWTTree(this.OrgId, this.item.Organization.OrgPid);
                this.ShowZRJYTree(this.OrgId, this.item.Organization.OrgPid);
            }
        },

        ShowZRJYTree: function (orgId, orgPid) {
            var me = this;
            request.post("/police/getPolicesWithOrg", {
                data: { orgCodes: [orgId], keyWord: '' },
                handleAs: "json"
            }).then(function (layers) {
                if (me.jyTree) {
                    me.jyNode.removeChild(me.jyTree);
                }
                me.jyTree = new CBTree({
                    checkBoxes: false,
                    state: "Loaded",
                    data: layers.data,
                    showRoot: false,
                    ParentId: orgPid,
                    style: " height:230px; width:260px; overflow-x:hidden;"
                });
                me.jyNode.addChild(me.jyTree);

                me.jyTree.on("Click", function (o) {
                    if (o.Code) {
                        me.gPointZRLD.setValue(o.MC);
                        me.gPointLXDH.setValue(o.PhoneNum);
                    }
                });

            }, function (error) {

            });
        },

        ShowJWTTree : function(orgId,orgPid)
        {
            var me = this;
            request.post("/police/getPolicesWithOrg", {
                data: { orgCodes: [orgId], keyWord: '' },
                handleAs: "json"
            }).then(function (layers) {
                if (me.jwtTree)
                {
                    me.jwtNode.removeChild(me.jwtTree);
                }
                me.jwtTree = new CBTree({
                    checkBoxes: true,
                    state: "Loaded",
                    data: layers.data,
                    showRoot: false,
                    ParentId: orgPid,
                    style: " height:230px; width:260px; overflow-x:hidden;"
                });
                me.jwtNode.addChild(me.jwtTree);

                me.jwtTree.on("CheckBoxClick", function (e) {
                    array.forEach(me.gridNode.getChildren(), function (o) {
                        me.gridNode.removeChild(o);
                    });

                    var checkList = me.jwtTree.getChecked();
                    if (checkList == null || checkList.length <= 0) {
                        return;
                    }
                    array.forEach(checkList, function (o) {
                        if (o.Code)
                        {
                            var item = "姓名：" + o.MC + ",职务：" + o.ZW + ",联系电话：" + o.PhoneNum + ",编号：" + o.Code;
                            var sp = new RegionInfoItem({ data: item, parentNode: me.gridNode });
                            me.gridNode.addChild(sp);
                        }
                    });
                });

            }, function (error) {

            });
        },

        _CancelButtonClick: function () {
            topic.publish('egis/Deduce/SaveDeducePoint', null);
            this.close();
        },

        _SubmitButtonClick: function () {
            var me = this;

            var xlry = "";
            array.forEach(me.gridNode.getChildren(), function (o) {
                if (xlry == "") {
                    xlry = o.getValuesString();
                }
                else {
                    xlry += "~" + o.getValuesString();
                }
            });

            var selectOrg = this.orgTree.getSelectedOrgInfo(1);
            var msg = "";
            if (selectOrg == null) {
                if (this.item != null) {
                    selectOrg = { orgLevel1: this.item.orgLevel1, orgLevel2: this.item.orgLevel2, orgId: this.item.Organization.OrgId };
                }
                else {
                    msg = "操作失败： 请选择责任单位！";
                }
            }
            else {
                if (selectOrg.name != this.orgName.value) {
                    if (this.item != null) {
                        selectOrg = { orgLevel1: this.item.orgLevel1, orgLevel2: this.item.orgLevel2, orgId: this.item.Organization.OrgId };
                    }
                    else {
                        msg = "操作失败： 请选择责任单位！";
                    }
                }
                else if (selectOrg.errorMsg != "true") {
                    msg = "操作失败：" + selectOrg.errorMsg;
                }
            }

            if (msg != "") {
                var successDialog = new Dialog({
                    title: "提示",
                    content: msg,
                    style: "width: 200px;height:100px;font-size:14px"
                });
                successDialog.show();
                return;
            }

            var param = {
                orgId: selectOrg.orgId,
                orgLevel1: selectOrg.orgLevel1,
                orgLevel2: selectOrg.orgLevel2,
                orgName: this.orgName.value,
                name: this.gPointName.value,               
                memo: this.remarkText.value,
                zrld: this.gPointZRLD.value,
                lxdh: this.gPointLXDH.value,
                xlry: xlry,
                type : this.PointType,
                taskId : this.TaskID,
                lon: this.lon,
                lat: this.lat
            };

            if (param.rName != "" && param.orgId != "") {
                var url = "/deduce/savePointInfo";
                if (this.item != null) {
                    param.id = this.item.Id;
                }
                request.post(url, {
                    data: dojo.toJson(param),
                    headers: {  'Content-Type': "application/json;charset=UTF-8" },
                    handleAs: "json"
                }).then(
                    lang.hitch(this, function (data) {
                        var msg = "信息保存成功！" ;
                        if(data.ok) {
                            this.close();
                            topic.publish('egis/Deduce/SaveDeducePoint', null);
                        } else {
                            msg ="信息保存失败：" + data.msg; 
                        }
                        topic.publish("egis/messageNotification", { type: "info", text: msg});
                    })
                );
            }
            else {
                var errorDialog = new Dialog({
                    title: "提示",
                    content: "名称和组织机构不能为空！",
                    style: "width: 300px;height:100px;font-size:14px"
                });
                errorDialog.show();
                return;
            }
        }

    });
});
