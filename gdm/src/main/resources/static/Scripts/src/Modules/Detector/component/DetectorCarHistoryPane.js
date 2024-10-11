define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/Evented",
    'dojo/_base/array',
    'dojo/topic',
    'dojo/on',
    "dojo/store/Memory",
    "dojo/request",
    "dojo/data/ItemFileWriteStore",
    "dijit/form/Select",
    "dijit/form/Button",
    "dijit/layout/ContentPane",
    "dijit/_WidgetsInTemplateMixin",
    "dijit/popup",

    "dojox/grid/EnhancedGrid",
    "egis/Share/component/Dialog/Dialog",
    "egis/Share/component/DateTime/DateTimePicker",
    "egis/Modules/Detector/component/DetectorCarInfoItem",
    "egis/Share/component/MapFloatPane/MapFloatingPane",
    'egis/appEnv',
    "dojo/text!./DetectorCarHistoryPane.html"
], function (declare, lang, Evented, array, topic, on, Memory, request, ItemFileWriteStore, Select,
             Button, ContentPane, _WidgetsInTemplateMixin, popup, EnhancedGrid, Dialog,DateTimePicker, DetectorCarInfoItem, MapFloatingPane,
             appEnv, template) {

    return declare([MapFloatingPane, _WidgetsInTemplateMixin, Evented], {

        templateString: template,

        widgetsInTemplate: true,

        currentItem: null,

        zoomRate: 5,

        postCreate: function () {
            this.inherited(arguments);
        },

        startup: function () {
            var me = this;
            this.inherited(arguments);

            currentItem = this.data;

            var st = new Date();
            st.setMinutes(st.getMinutes() - 10);
            this.startTimeNode.set("value", st);
            this.queryButton.on("click", lang.hitch(this, this._queryHistoryData));

            this.zoomImage.style.width = this.srcImage.style.width * this.zoomRate;
            this.zoomImage.style.height = this.srcImage.style.height * this.zoomRate;

            this.srcImage.onmousemove = lang.hitch(this, function (event) {

                var elm = event.srcElement;
                h = elm.offsetHeight;
                w = elm.offsetWidth;
                var x = event.offsetX - elm.offsetLeft;
                this.zoomImage.style.marginLeft = ((-x / w) * this.zoomImage.width + w / 2) + 'px';
                var y = event.offsetY - elm.offsetTop;
                this.zoomImage.style.marginTop = ((-y / h) * this.zoomImage.height + h / 2) + 'px';
            });
        },

        _queryHistoryData: function () {

            var me = this;
            var mapPane = appEnv.getCurrentPane();
            mapPane.showProcess("查询处理中...");

            if (this.topNode.getChildren().length > 0) {

                array.forEach(this.topNode.getChildren(), function (item) {
                    me.topNode.removeChild(item);
                });
            }

            var results = null;
            var code = "";
            if (typeof (currentItem.CODE) == "string")
                code = currentItem.CODE;
            else
                code = currentItem.CODE[0];

            request.post("/Alarm/QueryPassedCars", {
                data: {
                    detectorSiteCode: code,
                    carPlateNumber: this.carNumberNode.get("value"),
                    startTime: new Date(this.startTimeNode.get("value")).toJSON(),
                    endTime: new Date(this.endTimeNode.get("value")).toJSON()
                },
                handleAs: "json"
            }).then(
                lang.hitch(this, function (data) {

                    if (data != null) {
                        results = data;

                        if (results.length == 0) {
                            var errorDialog = new Dialog({
                                title: "提示",
                                content: "未查询到历史过车图片",
                                style: "width: 200px;height:100px;font-size:14px"
                            });
                            errorDialog.show();
                            return;
                        }


                        this.srcImage.src = encodeURI(results[0].imagePath);
                        this.zoomImage.src = encodeURI(results[0].imagePath);

                        for (var i = 0; i < results.length; i++) {
                            me.addItem(results[i]);
                        }
                    }

                    mapPane.hideProgress();
                })
            );
        },

        addItem: function (result) {
            var cc = new DetectorCarInfoItem({ data: result });
            cc.on("click", lang.hitch(this, function () {

                this.srcImage.src = encodeURI(result.imagePath);
                this.zoomImage.src =encodeURI(result.imagePath);
            }));
            this.topNode.addChild(cc);
        }
    });
});