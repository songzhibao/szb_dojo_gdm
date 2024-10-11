define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    'dojo/_base/array',
    "dojo/dom-style",
    'dojo/topic',
    'dijit/form/Button',
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "egis/Share/component/Button/ImageButton",
    'egis/Share/component/InfoPane/TableInfoPopup',
    "dojo/text!./ManualMarkeItem.html",
    'ol'

], function (declare, lang, array, domStyle, topic, Button, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, ImageButton, TableInfoPopup, template, ol) {

    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {


        templateString: template,

        widgetsInTemplate: true,

        ParentPane: null,

        data : null,

        postCreate: function () {

            this.inherited(arguments);
        },

        startup: function () {
            this.inherited(arguments);
            var mySelf = this;
            if (this.data != null)
            {
                this.caseaddress.innerHTML += this.data.address;
                this.casecode.innerHTML += this.data.code;

                this.closeButton.on("click", lang.hitch(this, function () {
                    var mapPane = appEnv.getCurrentPane();
                    if (mySelf.Feature && mySelf.Feature.popup) {
                        mapPane.map.removeOverlay(mySelf.Feature.popup);
                        mySelf.Feature.dsPoppup = null;
                        mySelf.Feature.popup = null;
                    }
                    if (mySelf.ParentPane) {
                        mySelf.ParentPane.removeChild(mySelf);
                    }
                    var paramObject = { LayerGroup: "报警定位", LayerId: "手动定位点", FObject: mySelf.Feature, RemoveType: "FObject" };
                    topic.publish("egis/Map/Remove", paramObject);
                }));


                this.locationButton.on("click", lang.hitch(this, function () {
                    
                    var markerInfo = { LayerGroup: "报警定位", LayerId: "手动定位点", UsedType: "UseingForManual", Data: this.data, ImgUrl: "/Content/themes/blue/images/manual/light_red_32.png" };
                    topic.publish("egis/Map/BeginDrawMarker", markerInfo);

                }));

                topic.subscribe("egis/Map/DrawMarkerModifyEnd", lang.hitch(this, function (evt) {

                    if (evt.UsedType == "UseingForManual") {
                        mySelf.data.Lon = evt.LonLat[0];
                        mySelf.data.Lat = evt.LonLat[1];
                        mySelf.Feature = evt.Feature;
                        mySelf.ShowPopupInfo(evt);
                    }

                }));
            }
        },


        ShowPopupInfo: function (paramObject) {
            var mapPane = appEnv.getCurrentPane();
            var feature = paramObject.Feature;
            var olPopup =this.getManualCasePopup(paramObject.Data, feature, mapPane);
            if (feature.popup) {
                mapPane.map.removeOverlay(feature.popup);
                feature.dsPoppup = null;
                feature.popup = null;
            }
            var coord = paramObject.LonLat;
            olPopup.on('close', lang.hitch(this, function () {

                mapPane.map.removeOverlay(feature.popup);
                feature.dsPoppup = null;
                feature.popup = null;

            }));

            olPopup.startup();
            olPopup.show();

            var popup = new ol.Overlay({
                element: olPopup.domNode,
                positioning: 'bottom-left',
                offset: [0, 0],
                autoPan: true,
                autoPanAnimation: {
                    duration: 250
                }
            });

            //同时将TabInfoPopup和Overlay绑定到feature，一个用于更新位置，一个用于更新显示信息
            feature.dsPoppup = olPopup;
            feature.popup = popup;

            popup.setPosition(coord);
            if (mapPane.map) {
                mapPane.map.addOverlay(popup);

                topic.publish("egis/Map/LocatePanTo", coord);
            }
        },


        getManualCasePopup: function (resource, feature, mapPane) {

            var data = [
                    { name: '地址', value: resource.address },
                    { name: '编号', value: resource.code },
                    { name: '经度', value: resource.CaseLonX },
                    { name: "纬度", value: resource.CaseLatY }
            ];
            var submitBtn = new Button({
                label: "确定定位"
            });
            var cancelBtn = new Button({
                label: "取消定位"
            });

            var me = this;
            //确定定位->关闭窗体->无法拖动->发送9308消息
            submitBtn.on('click', lang.hitch(this, function () {

                if (feature.popup) {
                    mapPane.map.removeOverlay(feature.popup);
                    feature.dsPoppup = null;
                    feature.popup = null;
                }

                feature.moveable = false;
                resource.status = 1;
                me.statusButton.src = "/Content/themes/blue/images/manual/onlocation.png";

                window.parent.window.dojo.publish('egis/Manual/SubmitLocate', resource);

                var imgUrl = "/Content/themes/blue/images/manual/light_green_32.png";
                var style = feature.getStyle();
                var newStyle = new ol.style.Style({
                    geometry: style.getGeometry(),
                    fill: style.getFill(),
                    image: new ol.style.Icon(({
                        src: imgUrl
                    })),
                    stroke: style.getStroke(),
                    text: style.getText(),
                    zIndex: style.getZIndex()
                });

                feature.setStyle(newStyle);

            }));
            //取消定位->关闭窗体->删除图标
            cancelBtn.on('click', lang.hitch(this, function () {

                if (feature.popup) {
                    mapPane.map.removeOverlay(feature.popup);
                    feature.dsPoppup = null;
                    feature.popup = null;
                }

            }));
            var btnArray = [submitBtn, cancelBtn];

            var popup = new TableInfoPopup({
                title: "手工定位",
                map: this.map,
                data: data,
                buttons: btnArray,
                LinkButtonString: null,
                detailClickHandler: null,
                enableDetail: false
            });
            popup.domNode.style.width = "260px";

            return popup;
        },


        destroy: function () {
            this.inherited(arguments);
        }
    });
});