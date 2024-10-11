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
    'dojo/_base/connect',
    "dijit/form/Select",
    "dijit/form/Button",
    "dijit/layout/ContentPane",
    "dijit/_WidgetsInTemplateMixin",
    "dijit/popup",
    'dojox/timing',
    "dojox/grid/EnhancedGrid",
    "egis/Share/component/Dialog/Dialog",
    "egis/Modules/Detector/component/DetectorCarInfoItem",
    "egis/Share/component/MapFloatPane/MapFloatingPane",
    'egis/appEnv',
    "dojo/text!./DetectorCarRealTimePane.html"
], function (declare, lang, Evented, array, topic, on, Memory, request, ItemFileWriteStore, connect, Select,
             Button, ContentPane, _WidgetsInTemplateMixin, popup, timing, EnhancedGrid, Dialog, DetectorCarInfoItem, MapFloatingPane,
             appEnv, template) {

    return declare([MapFloatingPane, _WidgetsInTemplateMixin, Evented], {

        templateString: template,

        widgetsInTemplate: true,

        t: null,

        lastPassTime: null,

        selectItem : null,

        data: null,

        zoomRate: 5,

        postCreate: function () {
            this.inherited(arguments);
        },

        startup: function () {
            this.inherited(arguments);

            this.zoomImage.style.width = this.srcImage.style.width * this.zoomRate;
            this.zoomImage.style.height = this.srcImage.style.height * this.zoomRate;

            this.srcImage.onmousemove = lang.hitch(this, function (event) {

                var elm = event.srcElement;
                h = elm.offsetHeight;
                w = elm.offsetWidth;
                var x = event.offsetX - elm.offsetLeft;
                this.zoomImage.style.marginLeft = ((-x/w) * this.zoomImage.width + w/2) + 'px';
                var y = event.offsetY - elm.offsetTop;
                this.zoomImage.style.marginTop = ((-y/h) * this.zoomImage.height + h/2) + 'px';

            });

            if (this.selectItem) {
                this.addItem(this.selectItem);
                this.srcImage.src = encodeURI(this.selectItem.imagePath);
                this.zoomImage.src = this.srcImage.src;
            }
            else {
                //前台时间轮询
                this.t = new timing.Timer();
                this.t.setInterval(30000);
                this.t.onTick = lang.hitch(this, this.loadData);

                this.t.start();

                this.loadData();
            }
        },


        loadData: function () {

            var startTime = null;
            var mapPane = appEnv.getCurrentPane();
            mapPane.showProcess("查询处理中...");

            if (this.lastPassTime) {
                startTime = new Date(this.lastPassTime).toJSON();
            }

            request.post("/Alarm/QueryRecentDetectorAlarmList", {
                data: {
                    detectorSiteCode: this.data.CODE,
                    startTime: startTime
                },
                handleAs: "json"
            }).then(
                lang.hitch(this, function (data) {
                    var results = null;
                    if (data != null) {
                        results = data.items;
                        if (results.length > 0) {
                            this.lastPassTime = results[0].passTime;
                            this.srcImage.src = encodeURI(results[0].imagePath);
                            this.zoomImage.src = this.srcImage.src;
                        }

                        for (var i = results.length - 1; i >= 0; i--) {
                            this.addItem(results[i]);
                        }
                    }
                    mapPane.hideProgress();
                })
            )

        },

        addItem: function (result) {
            var cc = new DetectorCarInfoItem({ data: result });
            cc.on("click", lang.hitch(this, function () {
                this.srcImage.src = encodeURI(result.imagePath);
                this.zoomImage.src = this.srcImage.src;
            }));
            this.topNode.addChild(cc, 0);
        },

        destroy: function () {
            if (this.t) {
                this.t.stop();
            }
        }

    });
});