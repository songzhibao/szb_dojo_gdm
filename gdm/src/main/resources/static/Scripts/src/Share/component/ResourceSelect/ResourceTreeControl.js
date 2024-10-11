/**
* User: chengbin
* Date: 13-4-1
*/
define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/Evented",
    "dojo/Deferred",
    "dojo/request",
    'dojo/topic',
    'dojo/store/Memory',
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dijit/layout/AccordionContainer",
    "dijit/layout/AccordionPane",
    "dijit/layout/ContentPane",
    "dijit/layout/LayoutContainer",
    "dijit/form/Button",
    "dijit/form/TextBox",
    "cbtree/Tree",
    "cbtree/model/ForestStoreModel",
    "egis/Share/component/Button/ImageButton",
    "egis/Share/component/OrgTree/CBTree",
    "dojo/text!./ResourceTreeControl.html",
    'ol'
], function (declare, lang, Evented, Deferred, request,topic, Memory, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, AccordionContainer, AccordionPane, ContentPane, LayoutContainer, Button, TextBox,Tree, ForestStoreModel, ImageButton,CBTree, template, ol) {

    return declare([ContentPane, _TemplatedMixin, _WidgetsInTemplateMixin, Evented], {

        templateString: template,

        widgetsInTemplate: true,

        map: null,

        me: null,

        LikeVal: "",

        startup: function () {
            this.inherited(arguments);

            var me = this;

            request.post("/Alarm/QueryLayes", {
                data: { showwhere: "DLCX" },
                handleAs: "json"
            }).then(function (layers) {

                me.ResourceLayerTree = new CBTree({
                    checkBoxes: true,
                    state: "Loaded",
                    data : layers,
                    showRoot: false,
                    style: " height:100px; width:240px; overflow-x:hidden;"
                }, me.orgNode);

                me.ResourceLayerTree.on("CheckBoxClick", function (e) {
                    //var checkList = me.ResourceLayerTree.getChecked();
                    //if (checkList == null || checkList.length <= 0) {
                    //    return;
                    //}
                    //me.emit("onCheckDrawed", checkList, 'like', this.LikeVal);
                    //me.onCheckDrawed(checkList, 'like', this.LikeVal);
                });

            }, function (error) {
            });

        },


        SelectByText: function (txtValue) {
            this.LikeVal = txtValue;
            this._onCheckDrawed('', 'like', this.LikeVal);
        },

        onCheckDrawed: function (checkList, geoType, geoVal) {
            if (checkList == null || checkList.length <= 0) {
                topic.publish("egis/messageNotification", { type: "info", text: "请先购选查询图层！" });
                return;
            }
            var layerGroup = "资源展现";
            var paramObject = { LayerGroup: layerGroup, RemoveType: "GROUP" };
            //先清空原先的查询点
            topic.publish("egis/Map/Remove", paramObject);

            var nameList = "";
            for (var num = 0; num < checkList.length; num++) {
                if (!checkList[num].DisplayField || !checkList[num].name || !checkList[num].type) {
                    continue;
                }
                var paramObj = {
                    layersName: checkList[num].name,
                    selectType: geoType,
                    selectVal: geoVal,
                    comdition: ""
                };
                if (nameList != "")
                {
                    nameList += ",";
                }
                nameList += checkList[num].name;
                var requester = { getDataUrl: "/Alarm/QueryOneLayerResourcesByGeoJSON", actionExplain: "地理模糊查询", actionType: "/Alarm/SelectLike", paramObject: paramObj, LayerGroup: layerGroup, LayerId: paramObj.layersName };
                topic.publish("egis/Map/Resource/GeoJson", requester);
            }

            var param = {
                layersNameList: nameList,
                selectType: geoType,
                selectVal: geoVal,
                comdition: ""
            };

            this.emit("onCheckChange", param, layerGroup);
        },

        getChecked : function()
        {
            return this.ResourceLayerTree.getChecked();
        },

        _onCheckDrawed: function (gemetry, geoType, geoVal) {
            var checkList = this.ResourceLayerTree.getChecked();
            this.emit("onCheckDrawed", checkList, geoType, geoVal);
            this.onCheckDrawed(checkList, geoType, geoVal);
        },

        destroy: function () {

            me.drawVector.getSource().clear();

            me.map.removeLayer(me.drawVector);
        }

    });
});