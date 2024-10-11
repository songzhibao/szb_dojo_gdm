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
    'dojo/json',
    "dojo/request",
    "dijit/registry",
    'egis/appEnv'

], function (declare, array, ready, dom, lang, topic, JSON, request, registry, appEnv) {

    return declare([], {


        constructor: function (args) {
            declare.safeMixin(this, args || {});

            this.init();
        },

        init: function () {

            //GeoJson 上图事件
            topic.subscribe("egis/Map/Resource/GeoJson", lang.hitch(this, function (requester) {

                this.GetDataFromServer(requester, "egis/Map/Resource/GeoJson");

            }));

            // 响应资源查询
            topic.subscribe("egis/Map/Resource/GetResource", lang.hitch(this, function (requester) {

                this.GetDataFromServer(requester, "egis/Map/Resource/GetResource");

            }));

            // 响应警情查询
            topic.subscribe("egis/Map/Resource/GetCase", lang.hitch(this, function (requester) {

                this.GetDataFromServer(requester, "egis/Map/Resource/GetCase");

            }));

            // 响应四色预警
            topic.subscribe("egis/Map/Resource/ShowSSYJ", lang.hitch(this, function (requester) {

                this.GetDataFromServer(requester, "egis/Map/Resource/ShowSSYJ");

            }));

            // 响应视频查询
            topic.subscribe("egis/Map/Resource/GetVideo", lang.hitch(this, function (requester) {

                this.GetDataFromServer(requester, "egis/Map/Resource/GetVideo");

            }));

            //清楚地图某图层数据
            topic.subscribe("egis/Map/Resource/LayerClear", lang.hitch(this, function (requester) {

                var eventType = "egis/Map/Resource/LayerClear";
                var paramObject = { Requester: requester };
                //操作记录
                //add here

                topic.publish(eventType + "/ToMap", paramObject);

            }));


            // 响应勤务排班查询
            topic.subscribe("egis/Duty/Region", lang.hitch(this, function (requester) {

                this.GetDataFromServer(requester, "egis/Duty/Region");

            }));

            topic.subscribe("egis/Guard/Region", lang.hitch(this, function (requester) {

                this.GetDataFromServer(requester, "egis/Guard/Region");

            }));

            topic.subscribe("egis/Deduce/Region", lang.hitch(this, function (requester) {

                this.GetDataFromServer(requester, "egis/Deduce/Region");

            }));
        },


        GetDataFromServer: function (requester,eventType) {
            if (!requester.getDataUrl)
            {
                alert("requester 对象未定义 getDataUrl 属性!");
                return;
            }
            if (!requester.actionExplain) {
                alert("requester 对象未定义 actionExplain 属性!");
                return;
            }
            if (!requester.actionType) {
                alert("requester 对象未定义 actionType 属性!");
                return;
            }
            if (!requester.paramObject) {
                alert("requester 对象未定义 paramObject 对象!");
                return;
            }

            var me = this;
            //还需定义 requester 的 eventID  、 eventName 、 userName 
            var param =  {
                data: requester.paramObject,
                handleAs: "json"
            };
            if(requester.IsPostJson) {
                param =  {
                    data: dojo.toJson(requester.paramObject),
                    headers: {'Content-Type': "application/json;charset=UTF-8" },
                    handleAs: "json"
                };
            }

            request.post(requester.getDataUrl,param).then(
                function (resultData) {
                    var paramObject = { Requester: requester, ResultData: resultData.data };
                    topic.publish(eventType + "/ToMap", paramObject);
                    //操作记录
                    //me.SaveAction(requester.actionExplain, requester.actionKey,requester.actionType, "", "", eventType, JSON.stringify(requester));
                },
                function (error) {
                    alert("请求 " + requester.getDataUrl + " 地址报错 :" + error.message);
                }
            );
        },

        SaveAction: function (actionExplain, actionKey, actionType, EVENTID, EVENTNAME,EVENTPath, paramObject)
        {
            var param = {
                actionExplain: actionExplain,
                actionKey: actionKey,
                actionType: actionType,
                EVENTID: EVENTID,
                EVENTNAME: EVENTNAME,
                EVENTPath : EVENTPath,
                paramObject : paramObject
            };
            request.post("/Action/SaveRequest", {
                data: param,
                handleAs: "json"
            }).then(
            function (resultData) {

            });
        },

        destroy: function () {
            array.forEach(this.modules, function (module) {
                module.destroy();
            });
        }

    });

});