define([
'dojo/_base/declare',
'dojo/_base/array',
'dojo/_base/lang',
'dojo/aspect',
'dojo/json',
'dojo/topic',
'dojo/ready',
'dojo/request',
"dojo/on",
'dijit/form/Button',
"egis/cache",
'egis/Modules/_Module',
'egis/Modules/Home/component/WorkStation/WorkStationSwitch',
'egis/appEnv'

], function (declare, array, lang, aspect, JSON, topic, ready, request, on, Button, cache, _Module, WorkStationSwitch, appEnv) {
    return declare([_Module], {

        constructor: function () {

        },
        startup: function () {

            var mapPane = appEnv.getRootPane();
            var me = this;

            mapPane.WorkStation = new WorkStationSwitch({
                style: 'position: absolute; right: 7px; bottom: 0px; z-index: 100;padding: 0px;'
            });
            mapPane.addChild(mapPane.WorkStation);


            topic.subscribe("egis/Home/AddDesktop", lang.hitch(this, function (param) {
                //this.AddNewStation("警情处置", "/Content/themes/blue/images/index/sp-dt2.png");

                //this.AddNewStation("全市分析", "/Content/themes/blue/images/index/sp-tb2.png");
                mapPane.WorkStation.AddNewStation(param);
            }));


            // 初始化前台缓存
            cache.init();
            topic.subscribe("egis/cache/FinishLoad", lang.hitch(this, function (data) {

                SwitchModule("/Alarm/Index", "灾害展示", "/Content/themes/blue/images/index/sp-dt2.png");

            }));
            topic.subscribe("egis/Home/SwitchDesktop", lang.hitch(this, function (data) {

                var mainFrame = document.getElementById("mainFrame");
                if (mainFrame) {
                    for (var num = 0; num < mainFrame.children.length; num++) {
                        mainFrame.children[num].style.display = "none";
                    }
                    data.WorkIframe.style.display = "block";
                }

            }));

            topic.subscribe("egis/Home/RemoveDesktop", lang.hitch(this, function (data) {

                var mainFrame = document.getElementById("mainFrame");
                if (mainFrame) {
                    mainFrame.removeChild(data.WorkIframe);
                }

            }));

            // window.setInterval(lang.hitch(this, function () {

            //     request.post("/Alarm/GetPoliceSumShow", {
            //         data: { GPSOffTime: appEnv.appConfig.GPSOffTime },
            //         handleAs: "json"
            //     }).then(lang.hitch(this, function (data) {
            //         appEnv.publishMainPane("egis/Alarm/SumShowUpdate", data);
            //         if (data.OnlineCount)
            //         {
            //             document.getElementById("SystemOnlineCount").innerHTML = "当前在线：" + data.OnlineCount + "人";
            //         }
            //     }));

            // }), 60000);
        }

    });
});