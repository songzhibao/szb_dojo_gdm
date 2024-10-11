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
    "dojo/text!./ResourceSelectControl.html",
    'ol'
], function (declare, lang, Evented, Deferred, request,topic, Memory, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, AccordionContainer, AccordionPane, ContentPane, LayoutContainer, Button, TextBox,Tree, ForestStoreModel, ImageButton, template, ol) {

    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Evented], {

        templateString: template,

        widgetsInTemplate: true,

        JXCXButton: null,

        YXCXButton: null,

        DBXCXButton: null,

        map: null,

        me: null,

        drawVector: null,

        ResourceCircleHandler: null,

        ResourceBoxHandler: null,

        ResourcePolygonHandler: null,

        LikeVal: "",

        startup: function () {
            this.inherited(arguments);

            var me = this;

            request.post("/Alarm/QueryLayes", {
                data: { showwhere: "DLCX" },
                handleAs: "json"
            }).then(function (layers) {
                me._BuildTree(layers);
            }, function (error) {
            });

            this._addKJCXButtons();


            me.ResourceBoxHandler = new ol.interaction.DragBox({
                condition: ol.events.condition.mouseOnly,
                style: new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: [0, 255, 255, 1]
                    })
                })
            });


            me.ResourceBoxHandler.setActive(false);

            me.ResourceBoxHandler.on('boxend', lang.hitch(this, function (evt) {

                var me = this;

                var box = me.ResourceBoxHandler.getGeometry().getExtent();
                var extent = {
                    left: box[0],
                    top: box[3],
                    right: box[2],
                    bottom: box[1]
                };

                me._onCheckDrawed(extent, "extent", extent.left + "," + extent.top + "," + extent.right + "," + extent.bottom);
                //置回原来的状态
                me._BoxButtonClick(false);

            }));


            me.drawVector = new ol.layer.Vector({
                source: new ol.source.Vector(),
                projection: 'EPSG:4326',
                style: new ol.style.Style({
                    fill: new ol.style.Fill({
                        color: 'rgba(255, 255, 255, 0.2)'
                    }),
                    stroke: new ol.style.Stroke({
                        color: '#ffcc33',
                        width: 2
                    }),
                    image: new ol.style.Circle({
                        radius: 7,
                        fill: new ol.style.Fill({
                            color: '#ffcc33'
                        })
                    })
                })
            });
            me.map.addLayer(me.drawVector);


            //me.ResourceBoxHandler = new ol.interaction.Draw({
            //    source: me.drawVector.getSource(),
            //    type: /** @type {ol.geom.GeometryType} */('LineString'),
            //    geometryFunction: function (coordinates, geometry) {
            //        if (!geometry) {
            //            geometry = new ol.geom.Polygon(null);
            //        }
            //        var start = coordinates[0];
            //        var end = coordinates[1];
            //        geometry.setCoordinates([
            //            [start, [start[0], end[1]], end, [end[0], start[1]], start]
            //        ]);
            //        return geometry;
            //    }
            //});
            //me.ResourceBoxHandler.on('drawend', lang.hitch(this, function (evt) {

            //    var me = this;

            //    var box = evt.feature.getGeometry().getExtent();
            //    var extent = {
            //        left: box[0],
            //        top: box[1],
            //        right: box[2],
            //        bottom: box[3]
            //    };

            //    me._onCheckDrawed(extent, "extent", extent.left + "," + extent.top + "," + extent.right + "," + extent.bottom);
            //    //置回原来的状态
            //    me._BoxButtonClick(false);

            //}));


            me.ResourceCircleHandler = new ol.interaction.Draw({
                source: me.drawVector.getSource(),
                type: /** @type {ol.geom.GeometryType} */('Circle')
            });
            me.ResourceCircleHandler.on('drawend', lang.hitch(this, function (evt) {

                var me = this;
                var box = evt.feature.getGeometry().getExtent();
                var centerX = (box[0] + box[2]) / 2;
                var centerY = (box[1] + box[3]) / 2;
                var valStr = centerX + "," + centerY + "," + (centerX - box[0]);
                me._onCheckDrawed(evt.feature.getGeometry(), "circle", valStr);

                //置回原来的状态
                me._CircleButtonClick(false);
            }));



            me.ResourcePolygonHandler = new ol.interaction.Draw({
                source: me.drawVector.getSource(),
                type: /** @type {ol.geom.GeometryType} */('Polygon')
            });
            me.ResourcePolygonHandler.on('drawend', lang.hitch(this, function (evt) {

                var me = this;

                var coll = evt.feature.getGeometry().getCoordinates();
                var valStr = "";
                if (coll.length > 0) {
                    for (var num = 0; num < coll[0].length; num++) {
                        if (valStr == "") {
                            valStr = coll[0][num][0] + "," + coll[0][num][1];
                        }
                        else {
                            valStr += "," + coll[0][num][0] + "," + coll[0][num][1];
                        }
                    }
                    me._onCheckDrawed(evt.feature.getGeometry(), "polygon", valStr);
                }
                //置回原来的状态
                me._PolygonButtonClick(false);
            }));

        },


        SelectByText: function (txtValue) {
            this.LikeVal = txtValue;
            this._onCheckDrawed('', 'like', txtValue);
        },

        _addKJCXButtons: function () {

            this.JXCXButton = new ImageButton({
                unpressedImg: "/Content/themes/blue/images/rect-1.gif",
                pressedImg: "/Content/themes/blue/images/rect-2.gif",
                text: "矩形",
                style: "padding:8px 30px 30px 30px;",
                layoutAlign: "left",
                enableToggle: true
            });
            this.JXCXButton.on("click", lang.hitch(this, this._BoxButtonClick));
            this.kjcxAccordionPane.addChild(this.JXCXButton);


            this.YXCXButton = new ImageButton({
                unpressedImg: "/Content/themes/blue/images/cir-1.gif",
                pressedImg: "/Content/themes/blue/images/cir-2.gif",
                text: "圆形",
                style: "padding:8px 30px 30px 20px;",
                layoutAlign: "left",
                enableToggle: true
            });
            this.YXCXButton.on("click", lang.hitch(this, this._CircleButtonClick));
            this.kjcxAccordionPane.addChild(this.YXCXButton);

            this.DBXCXButton = new ImageButton({
                unpressedImg: "/Content/themes/blue/images/polyg-1.gif",
                pressedImg: "/Content/themes/blue/images/polyg-2.gif",
                text: "多边形",
                style: "padding:8px 30px 30px 20px;",
                layoutAlign: "left",
                enableToggle: true
            });
            this.DBXCXButton.on("click", lang.hitch(this, this._PolygonButtonClick));
            this.kjcxAccordionPane.addChild(this.DBXCXButton);



        },

        _BoxButtonClick: function (pressed) {
            var me = this;
            me.YXCXButton.UnPressed();
            me.DBXCXButton.UnPressed();
            if (pressed) {
                me.map.addInteraction(me.ResourceBoxHandler);
                me.drawVector.getSource().clear();
                me.ResourceBoxHandler.setActive(true);
            }
            else {
                me.JXCXButton.UnPressed();
                me.map.removeInteraction(me.ResourceBoxHandler)
                me.ResourceBoxHandler.setActive(false);
            }
        },

        _CircleButtonClick: function (pressed) {
            var me = this;
            me.JXCXButton.UnPressed();
            me.DBXCXButton.UnPressed();
            if (pressed) {
                me.map.addInteraction(me.ResourceCircleHandler);
                me.drawVector.getSource().clear();
                me.ResourceCircleHandler.setActive(true)
            }
            else {
                me.YXCXButton.UnPressed();
                me.map.removeInteraction(me.ResourceCircleHandler)
                me.ResourceCircleHandler.setActive(false);
            }
        },

        _PolygonButtonClick: function (pressed) {
            var me = this;
            me.YXCXButton.UnPressed();
            me.JXCXButton.UnPressed();
            if (pressed) {
                me.map.addInteraction(me.ResourcePolygonHandler);
                me.drawVector.getSource().clear();
                me.ResourcePolygonHandler.setActive(true)
            }
            else {
                me.DBXCXButton.UnPressed();
                me.map.removeInteraction(me.ResourcePolygonHandler)
                me.ResourcePolygonHandler.setActive(false);
            }
        },


        _BuildTree: function (layers) {
            var me = this;
            var data = layers;
            var store = new Memory({
                idProperty: "treeId",
                data: data,
                getChildren: function (object) {
                    // 需要添加path用于搜索定位
                    if (object.parent == null) {
                        object.path = object.treeId;
                    }
                    if (object.checked == null) {
                        object.checked = true;
                    }
                    var children = this.query({ parent: object.treeId });
                    for (var i = 0; i < children.length; i++) {
                        var child = children[i];
                        child.path = object.path + "," + child.treeId;
                    }
                    return children;
                }
            });
            var model = new ForestStoreModel({
                store: store,
                checkedAll: true,
                labelAttr: "MC",
                showRoot: false,
                query: { parent: null }
            });

            this.ResourceLayerTree = new Tree({
                model: model,
                checkBoxes: true,
                state: "Loaded",
                showRoot: false,
                style: " height:250px; width:280px; overflow-x:hidden;",
                getIconClass: function (item, opened) {
                    return opened ? "dijitFolderOpened" : "dijitFolderClosed";
                }
            }, this.orgNode);

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


        _onCheckDrawed: function (gemetry, geoType, geoVal) {
            var checkList = this.getTreeChecked();
            this.emit("onCheckDrawed", checkList, geoType, geoVal);
            this.onCheckDrawed(checkList, geoType, geoVal);
        },


        getTreeChecked: function () {
            return this.ResourceLayerTree.model.store.query({
                checked: true
            }, {
                sort: [{
                    attribute: "Id",
                    descending: false
                }]
            });
        },

        destroy: function () {

            me.drawVector.getSource().clear();

            me.map.removeLayer(me.drawVector);
        }

    });
});