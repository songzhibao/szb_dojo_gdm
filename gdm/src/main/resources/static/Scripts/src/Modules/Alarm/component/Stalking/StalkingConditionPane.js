define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/request",
    "dojo/topic",
    "dojo/date",
    'dojo/aspect',
    "dojo/data/ItemFileWriteStore",
    "dojox/grid/EnhancedGrid",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    'dijit/layout/ContentPane',
    'dijit/layout/TabContainer',
    "dijit/form/Button",
    'dijit/form/ValidationTextBox',
    'dijit/Toolbar',
    'egis/appEnv',
    "egis/Share/component/MapFloatPane/MapFloatingPane",
    'ol',
    "dojo/text!./StalkingConditionPane.html"
], function (declare, lang, request, topic, dateUtil, aspect, ItemFileWriteStore, EnhancedGrid, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, ContentPane, TabContainer, Button, VTBox, Toolbar, appEnv, MapFloatingPane, ol, template) {
    return declare([MapFloatingPane, _WidgetsInTemplateMixin], {
        
        templateString: template,

        widgetsInTemplate: true,

        timePursue_1: null,

        timePursue_2: null,

        timePursue_3: null,

        stalkingLon: null,

        stalkingLat: null,

        speed: 100,

        constant: 60 * 1000 / 3600,

        CASE_LAYER_ID: '资源撒点图层',

        tabContainer: null,

        constructor: function () {
            this.queryButton = new Button({ label: '重堵' });
            this.buttons = [this.queryButton];
        },


        postCreate: function () {
            this.inherited(arguments);
        },

        StalkingSourceShow: function (args) {

            if (this.checkNodeVideo.checked)
            {
                topic.publish("egis/Stalking/ResourceShow", { type: this.checkNodeVideo.value, checked: this.checkNodeVideo.checked });
            }
            if (this.checkNodeDetector.checked) {
                topic.publish("egis/Stalking/ResourceShow", { type: this.checkNodeDetector.value, checked: this.checkNodeDetector.checked });
            }
            if (this.checkNodePolice.checked) {
                topic.publish("egis/Stalking/ResourceShow", { type: this.checkNodePolice.value, checked: this.checkNodePolice.checked });
            }

        },

        startup: function () {
            this.inherited(arguments);
            this.timePursue_1.set('value', 5);
            this.timePursue_2.set('value', 10);
            this.timePursue_3.set('value', 15);
            //this.speed.set('value', 10);

            this.SaveButton = new Button({ label: '重绘' });
            this.SaveButton.placeAt(this.brNode, 'right');
            this.SaveButton.on("click", lang.hitch(this, function () {
                topic.publish("egis/Stalking/ReBlock", {});
            }));
        },


        ShowResultGrid: function (type, url, param, LayerGroup, LayerId) {

            var mapPane = appEnv.getCurrentPane();
            request.post(url, {
                data: dojo.toJson(param),
                headers: {'Content-Type': "application/json;charset=UTF-8" },
                handleAs: "json"
            }).then(lang.hitch(this, function (result) {
                var data = result.data;
                if (data != null && data.length > 0) {
                    this.buildGridPane(data, type, LayerGroup, LayerId);
                }
            }));
        },


        removeTabContainer: function (tabId) {
            //清楚上次的查询结果
            if (this.tabContainer != null) {
                var childs = this.tabContainer.getChildren();
                for (var num = 0; num < childs.length; num++) {
                    if (childs[num].id == tabId) {
                        this.tabContainer.removeChild(childs[num]);
                    }
                }
            }
        },

        buildGridPane: function (data, type, LayerGroup, LayerId) {

            if (!data.length || data.length == 0) {
                return;
            }
            var gridData = this._buildGridData(data, type);
            var pane = new ContentPane({
                title: gridData.title
            });

            var plugin = { indirectSelection: { headerSelector: true, width: "18px"} };
            var grid = new EnhancedGrid({
                structure: gridData.layout,
                style: "width:100%; height:220px;",
                plugins: plugin
            }, document.createElement("div"));
            grid.startup();
            grid.setStore(gridData.store);

            //添加工具条
            var toolBar = new Toolbar({}, "toolbar");

            if (type == "Police") {
                var buttonSchedul = this.BuildSchedulButton(grid, type);
                toolBar.addChild(buttonSchedul);
            }
            if (type == "Video") {
                var videoButton = this.BuildVideoButton(grid, type);
                toolBar.addChild(videoButton);
            }
            if (type == "Detector") {
                var videoButton = this.BuildDetectorVideoButton(grid, type);
                toolBar.addChild(videoButton);

                var passButton = this.BuildDetectorPassButton(grid, type);
                toolBar.addChild(passButton);
            }
            if (toolBar.hasChildren()) {
                pane.addChild(toolBar);
            }

            pane.addChild(grid);
            pane.id = type;
            this.tabContainer.addChild(pane);

            grid.on("cellClick", lang.hitch(this, function (e) {
                //若第一列不能有点击事件则取消定位
                if (e.cellIndex == 0) return;

                var item = grid.getItem(e.rowIndex);
                topic.publish("egis/Map/Locate", { Lon: item.lon, Lat: item.lat });
                
            }));
        },

        _buildGridData: function (data, type) {
            var layout, title, store;

            if (type == "Police") {
                title = "重点单位[" + data.length + "]";
                layout = [{
                    name: '名称',
                    field: 'MC',
                    width: "70%"
                },  {
                    name: '编号',
                    field: 'BH',
                    width: "30%"
                }];
                var items = [];
                for (var i = 0; i < data.length; i++) {
                    var orgName = " ";
                    if (data[i].Organization) {
                        orgName = data[i].Organization.Name;
                    }
                    items.push({
                        id: data[i].code,
                        MC: data[i].showText,
                        BH: data[i].code,
                        lon: data[i].lon,
                        lat: data[i].lat
                    });
                }

                store = new ItemFileWriteStore({
                    data: {
                        identifier: "id",
                        items: items
                    }
                });

            } else if (type == "Video") {
                title = "视频[" + data.length + "]";
                layout = [{
                    name: '名称',
                    field: 'MC',
                    width: "60%"
                }, {
                    name: '编号',
                    field: 'BH',
                    width: "40%"
                }];
                var items = [];
                for (var i = 0; i < data.length; i++) {
                    items.push({
                        id: data[i].code,
                        MC: data[i].name,
                        BH: data[i].code,
                        Address: data[i].address,
                        lon: data[i].lon,
                        lat: data[i].lat
                    });
                }
                store = new ItemFileWriteStore({
                    data: {
                        identifier: "id",
                        items: items
                    }
                });

            } else if (type == "GIS") {
                title = "地理[" + data.length + "]";
                layout = [{
                    name: '名称',
                    field: 'MC',
                    width: "60%"
                }, {
                    name: '编号',
                    field: 'BH',
                    width: "40%"
                }];
                var items = [];
                for (var i = 0; i < data.length; i++) {
                    items.push({
                        id: data[i].id,
                        MC: data[i].name,
                        BH: data[i].id,
                        lon: data[i].lonx,
                        lat: data[i].laty
                    });
                }
                store = new ItemFileWriteStore({
                    data: {
                        identifier: "id",
                        items: items
                    }
                });

            } else if (type == "Detector") {
                title = "物资存放点";
                layout = [{
                    name: '名称',
                    field: 'name',
                    width: "70%"
                }, {
                    name: '编号',
                    field: 'code',
                    width: "30%"
                }];
                var items = [];
                for (var i = 0; i < data.length; i++) {
                    items.push({
                        id: data[i].Id,
                        name: data[i].showText,
                        code: data[i].code,
                        lon: data[i].lon,
                        lat: data[i].lat
                    });
                }
                store = new ItemFileWriteStore({
                    data: {
                        identifier: "id",
                        items: items
                    }
                });

            } else if (type == "Block") {
                title = "堵控点";
                layout = [{
                    name: '类型名称',
                    field: 'name',
                    width: "30%"
                }, {
                    name: '所属机构',
                    field: 'orgName',
                    width: "35%"
                }, {
                    name: '编号',
                    field: 'code',
                    width: "30%"
                }];
                var items = [];
                for (var i = 0; i < data.length; i++) {
                    var orgName = " ";
                    if (data[i].Data.Organization) {
                        orgName = data[i].Data.Organization.Name;
                    }
                    items.push({
                        id: data[i].Id,
                        name: data[i].Data.Name,
                        orgName: orgName,
                        code: data[i].Data.Code,
                        lon: data[i].Location.X,
                        lat: data[i].Location.Y
                    });
                }
                store = new ItemFileWriteStore({
                    data: {
                        identifier: "id",
                        items: items
                    }
                });

            } else {
                title = "无资源";
                layout = [{
                    name: '无',
                    field: 'default',
                    width: "15%"
                }];
            }
            return {
                layout: layout,
                title: title,
                store: store
            };
        },

        //创建卡口过车按钮
        BuildDetectorPassButton: function (grid, type) {
            var buttonPlay = new Button({ label: '过车查看', style: "z-index:110;" });
            buttonPlay.on("click", lang.hitch(this, function () {

                var items = grid.selection.getSelected();
                if (items.length == 0) return;

                appEnv.appConfig.ShowBlockPass(items[0]);

            }));

            return buttonPlay;
        },

        //创建卡口视频按钮
        BuildDetectorVideoButton: function (grid, type) {
            var buttonPlay = new Button({ label: '视频播放', style: "z-index:110;" });
            buttonPlay.on("click", lang.hitch(this, function () {

                var items = grid.selection.getSelected();
                if (items.length == 0) return;

                appEnv.appConfig.ShowBlockVideo(items[0]);
            }));

            return buttonPlay;
        },

        //创建视频按钮
        BuildVideoButton: function (grid, type) {
            var buttonPlay = new Button({ label: '播放', style: "z-index:110;" });
            buttonPlay.on("click", lang.hitch(this, function () {

                var items = grid.selection.getSelected();
                if (items.length == 0) return;

                if (items.length == 1) {
                    appEnv.appConfig.ShowVideo(items[0].code);
                }
                else {
                    appEnv.appConfig.ShowMutiVideo(items);
                }

            }));

            return buttonPlay;
        },

        //创建呼叫按钮
        BuildSchedulButton: function (grid, type) {
            var buttonSchedul = new Button({ label: '呼叫', style: "z-index:110;" });
            buttonSchedul.on("click", lang.hitch(this, function () {

                var items = grid.selection.getSelected();
                if (items.length == 0) return;
                var infors = [];
                if (type == "car") {
                    for (var i = 0; i < items.length; i++) {
                        infors.push({ phone: items[i].carPhone[0], name: items[i].carPlateNumber[0] });
                    }
                }
                else if (type == "man") {
                    for (var i = 0; i < items.length; i++) {
                        infors.push({ phone: items[i].mobile[0], name: items[i].name[0] });
                    }
                }
                for (var i = 0; i < infors.length; i++) {
                    pushService.send({
                        DDTH: appEnv.appConfig.deskNum,
                        HHMT: "1",
                        PhoneNames: infors[i].name,
                        PhoneNumbers: infors[i].phone
                    }, 'DispathRequired').done(function (data) {
                        var type = '';
                        var info = '';
                        if (data && data.success) {
                            info = '呼叫 ' + data.args.PhoneNames + ' 消息发送成功！';
                            type = 'info';
                        }
                        else {
                            info = '呼叫 ' + data.args.PhoneNames + ' 消息发送失败！';
                            type = 'warm';
                        }
                        topic.publish("egis/messageNotification", { type: type, text: info });
                    });
                }
            }));

            return buttonSchedul;
        }

    });
});