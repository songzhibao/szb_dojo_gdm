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
    "egis/Modules/Duty/component/RegionInfoItem",
    'egis/appEnv',
    'dojo/text!./SaveRegionPane.html'
], function (declare, lang, Evented, aspect, domStyle, domConstruct, Memory, topic, array, on, request,ColorPicker, Dialog,
                _WidgetBase, _WidgetsInTemplateMixin, ColorPalette, Textarea, TextBox, Select, DropDownButton, TooltipDialog, ComboButton, MapFloatingPane, OrgTree, CBTree,RegionInfoItem, appEnv, template) {

    return declare([MapFloatingPane,_WidgetsInTemplateMixin, Evented], {

        templateString: template,

        widgetsInTemplate: true,

        orgTree: null,

        item: null,

        pointString: "",

        OrgId: "",

        startup: function () {
            var me = this;
            this.inherited(arguments);

            this.submitButton.on("click", lang.hitch(this, this._SubmitButtonClick));
            this.cacelButton.on("click", lang.hitch(this, this._CancelButtonClick));
            this.regionColorPicker.on("change", lang.hitch(this, this.colorPickerOnChange));
            //this.regionType.on("change", lang.hitch(this, this.regionTypeOnChange));



            // 初始化组织结构树
            this.orgTree = new OrgTree({
                checkBoxes: true,
                state: "Loaded",
                showRoot : true,
                style: " height:220px; width:240px; overflow-x:hidden;"
            }, this.orgNode);


            this.orgTree.on("click", function (e) {
                me.orgName.set("value", e.name);
                var selectOrg = me.orgTree.getSelectedOrgInfo(1);
                me.ShowJWTTree(selectOrg.orgId, selectOrg.OrgPid);
            });

            if (this.item != null) {
                this.OrgId = this.item.orgId;
                this.orgName.setValue(this.item.orgName);
                this.regionType.setValue(this.item.type);
                this.pointString = this.item.regionContent != null ? this.item.regionContent : "";
                this.regionColor.setValue(this.item.fillcolor);
                this.regionColor.domNode.style.backgroundColor = this.item.fillcolor;
                this.remarkText.setRangeText(this.item.memo != null ? this.item.memo : "");
                this.regionZRLD.setValue(this.item.zrld);
                //this.regionLXDH.setValue(this.item.lxdh);
                this.regionDWBH.setValue(this.item.code);
                this.regionName.setValue(this.item.name);
                //this.regionDWDZ.setValue(this.item.address);
                if (this.item.xlry != null && this.item.xlry !="" ) {
                    var xlzArray = this.item.xlry.split('~');
                    array.forEach(xlzArray, function (o) {
                        var sp = new RegionInfoItem({ data: o ,parentNode : me.gridNode });
                        me.gridNode.addChild(sp);
                    });
                }
                this.ShowJWTTree(this.OrgId, this.item.orgId == this.item.orgLevel2 ? this.item.orgLevel1 : this.item.orgLevel2);
            }
            //this.regionTypeOnChange();

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
                    debugger;
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

        regionTypeOnChange: function () {
            var type = this.regionType.value;
            var color = "";
            if (type != "0") {
                switch (type) {
                    case "1":
                        color = "#ff0000";
                        break;
                    case "3":
                        color = "#a349a4";
                        break;
                    case "5":
                        color = "#00ffff";
                        break;
                    case "10":
                        color = "#ffff00";
                        break;
                    case "15":
                        color = "#830602";
                        break;
                }
            }
            if (color != "") {
                this.regionColor.setValue(color);
                this.regionColorPicker.setValue(color);
                //this.regionName.set("readonly", true);
            }
        },

        colorPickerOnChange: function (color) {

            this.regionColor.domNode.style.backgroundColor = color;
            this.regionColor.setValue(color);

        },

        _CancelButtonClick: function () {
            topic.publish('egis/Duty/SaveRegion', null);
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
                    selectOrg = { orgLevel1: this.item.orgLevel1, orgLevel2: this.item.orgLevel2, orgId: this.item.orgId };
                }
                else {
                    msg = "操作失败： 请选择责任单位！";
                }
            }
            else {
                if (selectOrg.name != this.orgName.value) {
                    if (this.item != null) {
                        selectOrg = { orgLevel1: this.item.orgLevel1, orgLevel2: this.item.orgLevel2, orgId: this.item.orgId };
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
                name: this.regionName.value,
                regionContent: this.pointString,
                fillcolor: this.regionColor.value,
                type: this.regionType.value,
                memo: this.remarkText.value,
                zrld: this.regionZRLD.value,
                lxdh: "",//this.regionLXDH.value,
                code: this.regionDWBH.value,
                address: "",//this.regionDWDZ.value,
                xlry : xlry
            };

            if (param.name != "" && param.orgId != "") {
                var url = "/duty/saveRegionInfo";
                if (this.item != null) {
                    param.id = this.item.id;
                }
                request.post(url, {
                    data: dojo.toJson(param),
                    headers: { 'Content-Type': "application/json;charset=UTF-8" },
                    handleAs: "json"
                }).then(
                    lang.hitch(this, function (data) {
                        var showMsg = "保存成功！";
                        if(data.ok) {
                            this.close();
                            topic.publish('egis/Duty/SaveRegion', null);
                        } else {
                            showMsg = "保存失败：" + data.msg;
                        }
                        var successDialog = new Dialog({
                            title: "提示",
                            content: showMsg,
                            style: "width: 200px;height:100px;font-size:14px"
                        });
                        successDialog.show();
                        return;
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
