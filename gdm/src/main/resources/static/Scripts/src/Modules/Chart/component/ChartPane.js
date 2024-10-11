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
    'dojo/request',
    "dojo/on",
    'dojo/topic',
    "dijit/_TemplatedMixin",
    'dijit/_WidgetsInTemplateMixin',
    "dojox/layout/ContentPane",
    "dijit/layout/BorderContainer",
    "dojox/widget/Standby",
    'dijit/form/TextBox',
    "dijit/_WidgetBase",
    'dijit/form/Button',
    'dijit/TooltipDialog',
    'dijit/form/DropDownButton',
    "dojo/text!./ChartPane.html",
    "egis/appEnv"

], function (declare, baseFx, lang, array, domClass, domGeom, Evented,request, on, topic, TemplatedMixin, _WidgetsInTemplateMixin, ContentPane,BorderContainer,

    Standby, TextBox, _WidgetBase, Button, TooltipDialog, DropDownButton, template,appEnv) {

    var ChartPane = declare([_WidgetBase, TemplatedMixin, _WidgetsInTemplateMixin, Evented], {

        standby: null,

        templateString: template,

        buildRendering: function () {
            this.inherited(arguments);

        },

        postCreate: function () {
            this.inherited(arguments);

        },

        startup: function () {
            var me = this;
            this.inherited(arguments);

            this._initChart();


            // 响应警情查询
            topic.subscribe("egis/Chart/ShowChart", lang.hitch(this, function (requester) {

                request.post(requester.getDataUrl, {
                    data: dojo.toJson(requester.paramObject),
                    headers: { 'Content-Type': "application/json;charset=UTF-8" },
                    handleAs: "json"
                }).then(
                    function (resultData) {
                        if (requester.actionExplain == "柱状分析") {
                            me.showColumn(resultData.data);
                        }
                        else if (requester.actionExplain == "饼状分析") {
                            me.showPie(resultData.data);
                        }
                        else {
                            me.showLine(resultData.data);
                        }
                    },
                    function (error) {
                        alert("请求 " + requester.getDataUrl + " 地址报错 :" + error.message);
                    }
                );

            }));


            topic.subscribe("egis/Chart/RemoveChart", lang.hitch(this, function (paramObject) {

                if (paramObject.actionExplain == "柱状分析") {
                    this.columnDiv.clear();
                }
                else if (paramObject.actionExplain == "饼状分析") {
                    this.pieDiv.clear();
                }
                else {
                    this.lineDiv.clear();
                }

            }));
        },


        _initChart: function () {
            if (!this.columnDiv) {
                this.columnDiv = echarts.init(document.getElementById('columnDiv'));

                //this.chart.on('click', lang.hitch(this, function (params) {
                //    var evtData = this._getClickData(params.name);

                //    var type;
                //    if (params.seriesName == '警情类型') {
                //        type = '当前';
                //    }
                //    else {
                //        type = params.seriesName;
                //    }

                //    this.selectFeatures(type, this.showType.get('value'), evtData.ays);
                //}));

                //this.chart.on('legendselectchanged', lang.hitch(this, function (params) {
                //    var obj = params.selected;
                //    for (var i in obj) {
                //        if (obj.hasOwnProperty(i) && typeof (obj[i]) != "function") {
                //            if (i == params.name) {
                //                this.showHideLayer(i, obj[i]);
                //            }
                //        }
                //    }
                //}));
            }
            if (!this.pieDiv) {
                this.pieDiv = echarts.init(document.getElementById('pieDiv'));
            }
            if (!this.lineDiv) {
                this.lineDiv = echarts.init(document.getElementById('lineDiv'));
            }
        },

        showPie: function (CaseSum) {
            this.pieDiv.clear();
            var option = {
                title: {
                    text: '',
                    subtext: CaseSum.legend[0],
                    x: 'left'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                toolbox: {
                    show: true,
                    feature: {
                        mark: { show: false },
                        dataView: { show: false, readOnly: false },
                        magicType: {
                            show: false,
                            type: ['pie', 'funnel'],
                            option: {
                                funnel: {
                                    x: '25%',
                                    width: '50%',
                                    funnelAlign: 'left',
                                    max: 1548
                                }
                            }
                        },
                        restore: { show: false },
                        saveAsImage: { show: true }
                    }
                },
                calculable: false,
                series: [{
                    name: '警情类型',
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '60%'],
                    data: [],
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }]
            };

            for (var i = 0; i < CaseSum.children.length; i++) {
                if (CaseSum.children[i].counts > 0) {
                    option.series[0].data.push({ value: CaseSum.children[i].counts, name: CaseSum.children[i].name });
                }
            }

            this.pieDiv.setOption(option);
        },

        showColumn: function (CaseSum) {
            //初始化
            this.columnDiv.clear();

            var option = {
                //color: ['#0000ff', '#cccccc', '#808080'],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                legend: {
                    data: CaseSum.legend
                },
                toolbox: {
                    show: true,
                    feature: {
                        mark: { show: false },
                        dataView: { show: false, readOnly: false },
                        magicType: { show: true, type: ['line', 'bar'] },
                        restore: { show: false },
                        saveAsImage: { show: true }
                    }
                },
                xAxis: [
                    {
                        type: 'category',
                        axisLabel: {
                            formatter: function (val) {
                                return val;
                                //return val.split("").join("\n");
                            }
                        },
                        data: []
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: '灾害数',
                        min: 0
                    }
                ],
                series: [],
                animationEasing: 'elasticOut',
                animationDelayUpdate: function (idx) {
                    return idx * 5;
                }
            };

            //构造x轴
            for (var i = 0; i < CaseSum.children.length; i++) {
                option.xAxis[0].data.push(CaseSum.children[i].name);
            }

            //加入图表数据
            for (var i = 0; i < option.legend.data.length; i++) {
                var item = {
                    name: option.legend.data[i],
                    type: "bar",
                    data: []
                };
                for (var j = 0; j < CaseSum.children.length; j++) {
                    if (item.name.indexOf("当前") >= 0) {
                        item.data.push(CaseSum.children[j].counts);
                    } else if (item.name.indexOf("同比") >= 0) {
                        item.data.push(CaseSum.children[j].counts_tb);
                    } else if (item.name.indexOf("环比") >= 0) {
                        item.data.push(CaseSum.children[j].counts_hb);
                    } else {
                        item.data.push(0);
                    }
                }
                option.series.push(item);
            }
            this.columnDiv.setOption(option);
        },


        showLine: function (CaseSum) {
            //初始化
            this.lineDiv.clear();

            var option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                legend: {
                    data: CaseSum.legend
                },
                toolbox: {
                    show: true,
                    feature: {
                        mark: { show: false },
                        dataView: { show: false, readOnly: false },
                        magicType: { show: true, type: ['line', 'bar'] },
                        restore: { show: false },
                        saveAsImage: { show: true }
                    }
                },
                xAxis: [
                    {
                        type: 'category',
                        axisLabel: {
                            formatter: function (val) {
                                return val;
                                //return val.split("").join("\n");
                            }
                        },
                        data: []
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: '灾害数',
                        min: 0
                    }
                ],
                series: [],
                animationEasing: 'elasticOut',
                animationDelayUpdate: function (idx) {
                    return idx * 5;
                }
            };

            //构造x轴
            for (var i = 0; i < 24; i++) {
                var num = i.toString() + "时";
                if (i < 10)
                {
                    num = "0" + i + "时";
                }
                option.xAxis[0].data.push(num);
            }

            //加入图表数据
            for (var i = 0; i < option.legend.data.length; i++) {
                var item = {
                    name: option.legend.data[i],
                    type: "line",
                    markPoint: {
                        data: [
                            { type: 'max', name: '最大值' },
                            { type: 'min', name: '最小值' }
                        ]
                    },
                    markLine: {
                        data: [
                            { type: 'average', name: '平均值' }
                        ]
                    },
                    data: []
                };
                for (var ii = 0; ii < 24; ii++) {
                    var isHave = false;
                    for (var j = 0; j < CaseSum.children.length; j++) {
                        if (parseInt(CaseSum.children[j].code) == ii) {
                            if (item.name.indexOf("当前") >= 0) {
                                item.data.push(CaseSum.children[j].counts);
                            } else if (item.name.indexOf("同比") >= 0) {
                                item.data.push(CaseSum.children[j].counts_tb);
                            } else if (item.name.indexOf("环比") >= 0) {
                                item.data.push(CaseSum.children[j].counts_hb);
                            } else {
                                item.data.push(0);
                            }
                            isHave = true;
                        }
                    }
                    if (!isHave)
                    {
                        item.data.push(0);
                    }
                }
                option.series.push(item);
            }



            //option = {
            //    //title: {
            //    //    text: '未来一周气温变化',
            //    //    subtext: '纯属虚构'
            //    //},
            //    tooltip: {
            //        trigger: 'axis'
            //    },
            //    legend: {
            //        data: ['最高气温', '最低气温']
            //    },
            //    toolbox: {
            //        show: true,
            //        feature: {
            //            mark: { show: false },
            //            dataView: { show: false, readOnly: false },
            //            magicType: { show: true, type: ['line', 'bar','pie'] },
            //            restore: { show: false },
            //            saveAsImage: { show: true }
            //        }
            //    },
            //    calculable: true,
            //    xAxis: [
            //        {
            //            type: 'category',
            //            boundaryGap: false,
            //            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
            //        }
            //    ],
            //    yAxis: [
            //        {
            //            type: 'value',
            //            axisLabel: {
            //                formatter: '{value} °C'
            //            }
            //        }
            //    ],
            //    series: [
            //        {
            //            name: '最高气温',
            //            type: 'line',
            //            data: [11, 11, 15, 13, 12, 13, 10],
            //            markPoint: {
            //                data: [
            //                    { type: 'max', name: '最大值' },
            //                    { type: 'min', name: '最小值' }
            //                ]
            //            },
            //            markLine: {
            //                data: [
            //                    { type: 'average', name: '平均值' }
            //                ]
            //            }
            //        },
            //        {
            //            name: '最低气温',
            //            type: 'line',
            //            data: [1, -2, 2, 5, 3, 2, 0],
            //            markPoint: {
            //                data: [
            //                    { name: '周最低', value: -2, xAxis: 1, yAxis: -1.5 }
            //                ]
            //            },
            //            markLine: {
            //                data: [
            //                    { type: 'average', name: '平均值' }
            //                ]
            //            }
            //        }
            //    ]
            //};


            this.lineDiv.setOption(option);
        },


        destroy: function () {
            this.inherited(arguments);
        }

    });

    return ChartPane;

});