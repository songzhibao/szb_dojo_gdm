/**
* Created with JetBrains WebStorm.
* User: song
* Date: 16-12-30
* To change this template use File | Settings | File Templates.
*/
define([
    "dojo/_base/declare",
    "dojo/_base/array",
    "dojo/ready",
    "dojo/dom",
    "dojo/_base/lang",
    "dojo/topic",
    "dijit/registry",
    "dijit/layout/StackContainer",
    'egis/appEnv',
    'egis/Map/Action/ActionRunner',
    'egis/Share/component/MessageNotifier/MessageNotifier'

], function (declare, array, ready, dom, lang, topic, registry, StackContainer,appEnv, ActionRunner, MessageNotifier) {

    return declare([], {

        started: false,

        modules: null,

        appConfig: null,

        mapConfig: null,

        constructor: function (args) {
            declare.safeMixin(this, args || {});
        },

        load: function () {
            //注册应用配置config
            appEnv.appLoader = this;
            appEnv.appConfig = this.appConfig;
            appEnv.mapConfig = this.mapConfig;

            window.appEnv = appEnv;
            //启动操作行者
            appEnv.actionRunner = new ActionRunner();

            var messageNotifier = new MessageNotifier();

            // 当前台组件加载完毕后才进行初始化
            ready(lang.hitch(this, function () {
                // 初始化环境文件
                this._prepareEnv();
                // 启动业务模块
                array.forEach(this.modules, function (module) {
                    module.startup();
                });

                messageNotifier.startup();

                this.started = true;
            }));

            //TODO:可将消息提示，进度提示，统一启动处理
            //订阅全局提示消息，可统一切换，避免类似进度提示每个界面中包含，替换时耗时耗力
            topic.subscribe("egis/messageNotification", lang.hitch(this, function (rdata) {

                if (rdata != null) {
                    messageNotifier.notify({
                        type: rdata.type,
                        text: rdata.text
                    });
                }

                //user simple:topic.publish("egis/messageNotification", { type: "info", text: "111" });
                // type:info,warm,error
            }));
        },

        addModules: function (modules) {
            if (!this.started) {
                this.modules.push(modules);
            } else {
                array.forEach(modules, function (module) {
                    module.appEnv = appEnv;
                    module.startup();
                });
            }
        },

        _prepareEnv: function () {
            appEnv.stackContainer = registry.byId('stackContainer');

            return appEnv;
        },

        // 每一个继承类都必须要实现该方法
        getDefaultMap: function () {

        },

        destroy: function () {
            array.forEach(this.modules, function (module) {
                module.destroy();
            });
        }

    });

});


//自己定位方法工具


function GetTimeIDString() {
    var showDate = new Date();
    var curYear = showDate.getFullYear();
    var curMonth = showDate.getMonth() + 1;
    var curDay = showDate.getDate();

    var showMinute = showDate.getMinutes();
    var showHour = showDate.getHours();
    var showSecond = showDate.getSeconds();
    if (showMinute < 10) {
        showMinute = "0" + showMinute;
    }
    if (showHour < 10) {
        showHour = "0" + showHour;
    }
    var millionSecond = showDate.getMilliseconds();

    return curYear + "" + curMonth + "" + curDay + "" + showHour + "" + showMinute + "" + showSecond + "" + millionSecond;
};


/* 
* 获得时间差,时间格式为 年-月-日 小时:分钟:秒 或者 年/月/日 小时：分钟：秒 
* 其中，年月日为全格式，例如 ： 2010-10-12 01:00:00 
* 返回精度为：秒，分，小时，天
*/

function GetCurrentTimeString() {
    var showDate = new Date();
    var curYear = showDate.getFullYear();
    var curMonth = showDate.getMonth() + 1;
    var curDay = showDate.getDate();

    var showMinute = showDate.getMinutes();
    var showHour = showDate.getHours();
    var showSecond = showDate.getSeconds();
    if (showMinute < 10) {
        showMinute = "0" + showMinute;
    }
    if (showHour < 10) {
        showHour = "0" + showHour;
    }
    return curYear + "-" + curMonth + "-" + curDay + " " + showHour + ":" + showMinute + ":" + showSecond;
};


function GetDateDiff(startTime, endTime, diffType) {
    try
    {
        //将xxxx-xx-xx的时间格式，转换为 xxxx/xx/xx的格式 
        startTime = startTime.replace(/\-/g, "/").replace("T", " ");
        endTime = endTime.replace(/\-/g, "/").replace("T", " ");

        //将计算间隔类性字符转换为小写
        diffType = diffType.toLowerCase();
        var sTime = new Date(startTime);      //开始时间
        var eTime = new Date(endTime);  //结束时间
        //作为除数的数字
        var divNum = 1;
        switch (diffType) {
            case "second":
                divNum = 1000;
                break;
            case "minute":
                divNum = 1000 * 60;
                break;
            case "hour":
                divNum = 1000 * 3600;
                break;
            case "day":
                divNum = 1000 * 3600 * 24;
                break;
            default:
                break;
        }
        return parseInt((eTime.getTime() - sTime.getTime()) / parseInt(divNum));
    }
    catch (ex)
    {
        console.debug(ex.message + " " + startTime);
        return 0;
    }
};


//-------------------------------------
//十六进制颜色值的正则表达式
var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
/*RGB颜色转换为16进制*/
String.prototype.colorHex = function () {
    var that = this;
    if (/^(rgb|RGB)/.test(that)) {
        var aColor = that.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",");
        var strHex = "#";
        for (var i = 0; i < aColor.length; i++) {
            var hex = Number(aColor[i]).toString(16);
            if (hex === "0") {
                hex += hex;
            }
            strHex += hex;
        }
        if (strHex.length !== 7) {
            strHex = that;
        }
        return strHex;
    } else if (reg.test(that)) {
        var aNum = that.replace(/#/, "").split("");
        if (aNum.length === 6) {
            return that;
        } else if (aNum.length === 3) {
            var numHex = "#";
            for (var i = 0; i < aNum.length; i += 1) {
                numHex += (aNum[i] + aNum[i]);
            }
            return numHex;
        }
    } else {
        return that;
    }
};

//-------------------------------------------------

/*16进制颜色转为RGB格式*/
String.prototype.colorRgb = function (alpa) {
    var sColor = this.toLowerCase();
    if (sColor && reg.test(sColor)) {
        if (sColor.length === 4) {
            var sColorNew = "#";
            for (var i = 1; i < 4; i += 1) {
                sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
            }
            sColor = sColorNew;
        }
        //处理六位的颜色值
        var sColorChange = [];
        for (var i = 1; i < 7; i += 2) {
            sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
        }
        return "RGBA(" + sColorChange.join(",") + "," + alpa + ")";
    } else {
        return sColor;
    }
};

