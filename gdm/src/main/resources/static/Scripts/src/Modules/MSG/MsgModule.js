define([
'dojo/_base/declare',
'dojo/_base/array',
'dojo/_base/lang',
'dojo/aspect',
'dojo/request',
'dojo/cookie',
'dojo/json',
'dojo/topic',
"dijit/Dialog",
"dijit/form/TextBox",
"dijit/form/Button",
'egis/Modules/_Module',
'egis/Share/MSG/msgParser',
"egis/Share/component/Dialog/ConfirmDialog",
'egis/appEnv'

], function (declare, array, lang, aspect,request, cookie, JSON, topic, Dialog, TextBox, Button, _Module,  msgParser,ConfirmDialog, appEnv) {
    return declare([_Module], {

        parser: null,

        deskInfo: null,

        contextMsgMain: null,

        locateParam : null,

        constructor: function () {
            this.parser = new msgParser();

            var me = this;

            me.dialog = new Dialog({
                title: "请登记台号",
                closable : false,
                style: "width:200px; height:80px;"
            });

            me.textbox = new TextBox({
                style: "width:90px; margin-left:15px; margin-top:4px; float:left;",
                value : "0"
            });
            me.dialog.addChild(me.textbox);

            var submitBtn = new Button({
                label: "确定",
                style: "margin-left:15px; float:left;",
                onClick: function () {
                    
                    var value = parseInt(me.textbox.get("value"));
                    if (value != 0) {
                        me.RegDeskNum(value);

                        cookie('dsDeskInfo', JSON.stringify({ DeskNum: value }, { expires: 600 }));
                    }
                    else {
                        me.SetOnlinAndDeskNumInfo(value, 1);
                    }
                    me.dialog.hide();
                }
            });
            me.dialog.addChild(submitBtn);
        },


        GetDeskInfoFromCookie : function()
        {
            if (this.deskInfo == null && cookie('dsDeskInfo')) {
                this.deskInfo = JSON.parse(cookie('dsDeskInfo'));
            }
            return this.deskInfo;
        },

        SetOnlinAndDeskNumInfo: function (deskNum,isLock)
        {
            request.post("/Home/SetDeskNumByIP", {
                data: { deskNum: deskNum, isLock: isLock },
                handleAs: "json"
            }).then(lang.hitch(this, function (data) {
                cookie('dsDeskInfo', JSON.stringify({ DeskNum: deskNum }, { expires: 600 }));
            }));
        },

        startup: function () {

            var me = this;

            window.onbeforeunload = function ()
            {
                var deskNum = 0;
                var deskInfo = me.GetDeskInfoFromCookie();
                if (deskInfo != null) {
                    deskNum = deskInfo.DeskNum;
                }
                me.SetOnlinAndDeskNumInfo(deskNum, 0);
            }

            var wsImpl = window.WebSocket || window.MozWebSocket;

            window.ws = new wsImpl(appEnv.appConfig.MsgServerConnectString);

            ws.onmessage = function (evt) {
                me.ParseMessage(evt.data);
            };

            ws.onopen = function (evt) {              
                var deskInfo = me.GetDeskInfoFromCookie();
                if (deskInfo == null) {
                    request.post("/Home/GetDeskNumByIP", {
                        handleAs: "json"
                    }).then(lang.hitch(this, function (data) {                        
                        if (data.deskNum == 0) {
                            //me.dialog.show();
                        }
                        else {
                            me.RegDeskNum(data.deskNum);
                        }
                    }));
                }
                else if(deskInfo.DeskNum != "0"){ 
                    me.RegDeskNum(deskInfo.DeskNum);
                }
            };

            ws.onclose = function () {
                var deskNum = 0;
                var deskInfo = me.GetDeskInfoFromCookie();
                if (deskInfo != null) {
                    deskNum = deskInfo.DeskNum;
                }
                me.SetOnlinAndDeskNumInfo(deskNum, 0);
            };

            topic.subscribe("egis/Home/SetDeskNum", lang.hitch(this, function () {
                
                me.dialog.show();

            }));

            topic.subscribe("egis/Home/Locate", lang.hitch(this, function () {

                var paramObject = { HelpMsg: '单击选定报警定位点!', EventType: 'egis/Map/SelectPoint/Alarm' };
                appEnv.publishMainPane("egis/Map/SelectPoint", paramObject, "MSG");

            }));

            topic.subscribe("egis/Map/SelectPoint/Alarm", lang.hitch(this, function (evt) {

                if (evt.SelectPoint)
                {
                    var strX = evt.SelectPoint[0];
                    var strY = evt.SelectPoint[1];
                    var sjdbh = "13124881756"
                    var ShowText = "13124881756";
                    var iconUrl = "/Content/themes/blue/images/map/locate/mobileLocate.png";

                    var paramObject = { LayerGroup: "报警定位", RemoveType: "GROUP" };
                    //先清空原先的标注点
                    appEnv.publishMainPane("egis/Map/Remove", paramObject);

                    var paramObject = { LayerGroup: "报警定位", LayerId: "案件标注点", ImgUrl: iconUrl, ShowText: ShowText, LonLat: [strX, strY], Code: "BJDW_ZXD3988" };
                    appEnv.publishMainPane("egis/Map/AddMarker", paramObject, "MSG");

                    var paramObject = { LayerGroup: "报警定位", LayerId: "案件周边范围", Radius: appEnv.appConfig.caseLocateSearchRadius, LonLat: [parseFloat(strX), parseFloat(strY)] };
                    appEnv.publishMainPane("egis/Map/DrawCircle", paramObject, "MSG");

                    appEnv.publishMainPane("egis/Map/Locate", { Lon: parseFloat(strX), Lat: parseFloat(strY), Zoom: 9 }, "MSG");

                    this.GetResource(parseFloat(strX), parseFloat(strY), appEnv.appConfig.caseLocateSearchRadius, mainFrame);

                    this.ReplayMsgInfo(parseFloat(strX), parseFloat(strY), appEnv.appConfig.deskNum, "8210", "9388", sjdbh);
                    //保存定位视频信息
                    this.UpCaseLocateInfo(parseFloat(strX), parseFloat(strY), appEnv.appConfig.caseLocateSearchRadius, appEnv.appConfig.deskNum, sjdbh, ShowText);
                }

            }));

            topic.subscribe("egis/MSG/Send9389", lang.hitch(this, function (evt) {

                me.ReplayMsgInfo(parseFloat(evt.Lon), parseFloat(evt.Lat), appEnv.appConfig.deskNum, "8210", "9389", evt.CaseID);

            }));

            topic.subscribe("egis/MSG/CallMsg", lang.hitch(this, function (evt) {
                if (evt.CallerList != null && evt.CallerList.length > 0)
                {
                    if (evt.CallerList[0].CallNumber) {
                        me.SendCallMsg(appEnv.appConfig.deskNum, evt);
                        topic.publish("egis/messageNotification", { type: "info", text: "操作提示:呼叫信息已经发送到调度台，请务必调度台先摘机!" });
                        return;
                    }
                }
                topic.publish("egis/messageNotification", { type: "info", text: "操作提示:呼叫号码不能为空!" });
            }));

            topic.subscribe("egis/Manual/SubmitLocate", lang.hitch(this, function (evt) {

                me.SendCommonMsg(appEnv.appConfig.deskNum, "8210", "9308", evt.code + "@" + evt.Lon + "@" + evt.Lat);

            }));
        },

        RegDeskNum : function(deskNum)
        {
            var me = this;
            request.post("/Home/CheckDeskInfo", {
                data: { deskNum: deskNum, IsReg: false },
                handleAs: "json"
            }).then(lang.hitch(this, function (data) {
                if (data.success) {
                    
                    if (appEnv.appConfig.deskNum)
                    {
                        me.UnRegDeskNum(appEnv.appConfig.deskNum);
                    }

                    str = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
                    "<mainmsg vdr=\"ds\">" +
                    "<head ver=\"1.0\">" +
                    "<src addr=\"\" type=\"8230\" id=\"" + deskNum + "\" />" +
                    "<dst addr=\"\" type=\"8210\" id=\"" + deskNum + "\" />" +
                    "<msg code=\"0000\" sendtime=\"2010-01-01 12:30\" transtype=\"SeatMember\" ver=\"1.0\" />" +
                    "</head>" +
                    "<body>" +
                    "</body>" +
                    "</mainmsg>";
                    window.ws.send(str);
                    console.debug("注册成功，本机台号:[" + deskNum + "]");
                    appEnv.appConfig.deskNum = deskNum;
                    window.document.title = appEnv.appConfig.orgRootName + "[" + deskNum + "]";
                    window.deskNum = deskNum;
                    me.textbox.setValue(deskNum);

                    me.SetOnlinAndDeskNumInfo(deskNum, 1);
                }
                if (data.msg != "") {

                    var dialog = new ConfirmDialog({

                        message: "注册提示:" + data.msg + "  是否强行注册,请确认？",
                        yes: lang.hitch(this, function () {
                            
                            request.post("/Home/CheckDeskInfo", {
                                data: {deskNum : deskNum, IsReg : true},
                                handleAs: "json"
                            }).then(lang.hitch(this, function (data) {
                                if (data.success) {

                                    if (appEnv.appConfig.deskNum) {
                                        me.UnRegDeskNum(appEnv.appConfig.deskNum);
                                    }
                                    str = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
                                    "<mainmsg vdr=\"ds\">" +
                                    "<head ver=\"1.0\">" +
                                    "<src addr=\"\" type=\"8230\" id=\"" + deskNum + "\" />" +
                                    "<dst addr=\"\" type=\"8210\" id=\"" + deskNum + "\" />" +
                                    "<msg code=\"0000\" sendtime=\"2010-01-01 12:30\" transtype=\"SeatMember\" ver=\"1.0\" />" +
                                    "</head>" +
                                    "<body>" +
                                    "</body>" +
                                    "</mainmsg>";
                                    window.ws.send(str);
                                    appEnv.appConfig.deskNum = deskNum;
                                    window.document.title = appEnv.appConfig.orgRootName + "[" + deskNum + "]";
                                    window.deskNum = deskNum;
                                    me.textbox.setValue(deskNum);

                                    me.SetOnlinAndDeskNumInfo(deskNum, 1);
                                }
                                if (data.msg != "")
                                {
                                    topic.publish("egis/messageNotification", { type: "info", text: "注册提示:" + data.msg });
                                }
                            }));

                        }),
                        no: lang.hitch(this, function () {
                            topic.publish("egis/messageNotification", { type: "info", text: "您可以选择不注册或者注册其他台号，只有注册了和接处警台对应的台号才能与之通信！"});
                        })
                    });
                    dialog.show();
                }
            }));
        },



        UnRegDeskNum: function (deskNum) {

            str = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
                "<mainmsg vdr=\"ds\">" +
                "<head ver=\"1.0\">" +
                "<src addr=\"\" type=\"8230\" id=\"" + deskNum + "\" />" +
                "<dst addr=\"\" type=\"8210\" id=\"" + deskNum + "\" />" +
                "<msg code=\"9999\" sendtime=\"2010-01-01 12:30\" transtype=\"SeatMember\" ver=\"1.0\" />" +
                "</head>" +
                "<body>" +
                "</body>" +
                "</mainmsg>";


            window.ws.send(str);
        },


        SendCallMsg: function (dstId, msgJson) {
            str = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
                "<mainmsg vdr=\"ds\">" +
                "<head ver=\"1.0\">" +
                "<src addr=\"\" type=\"8230\" id=\"" + dstId + "\" />" +
                "<dst addr=\"\" type=\"8220\" id=\"" + dstId + "\" />" +
                "<msg code=\"0433\" sendtime=\"2010-01-01 12:30\" transtype=\"SeatMember\" ver=\"1.0\" />" +
                "</head>" +
                "<body><MsgBodyContent>" +
                JSON.stringify(msgJson) +
                "</MsgBodyContent></body>" +
                "</mainmsg>";

            window.ws.send(str);
        },


        SendCommonMsg: function (dstId,dstType,msgid,msgContent) {
            str = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
                "<mainmsg vdr=\"ds\">" +
                "<head ver=\"1.0\">" +
                "<src addr=\"\" type=\"8230\" id=\"" + dstId + "\" />" +
                "<dst addr=\"\" type=\"" + dstType + "\" id=\"" + dstId + "\" />" +
                "<msg code=\"" + msgid + "\" sendtime=\"2010-01-01 12:30\" transtype=\"SeatMember\" ver=\"1.0\" />" +
                "</head>" +
                "<body><MsgBodyContent>" +
                msgContent +
                "</MsgBodyContent></body>" +
                "</mainmsg>";

            window.ws.send(str);
        },

        ParseMessage : function (msgString) {

            try {

                var msgmain = this.parser.ParseMsgXmlString(msgString);
                switch (msgmain.Head.Msg.Code) {
                    case "0901": //地图台定位成功后的反馈消息 1 - 一次定位， 2 - 二次定位， 3 - 手机定位， 4 - 灯杆定位。
                        this.contextMsgMain = msgmain;
                        this.locateParam = msgString;
                        this.ProcessMsg9001(msgmain, msgString);
                        break;
                    case "3915": //未定位警情
                    case "3908": //山东手动定位消息
                        this.ProcessMsg3915(msgmain, msgString);
                        break;
                    case "3937": //联动报警
                        this.ProcessMsg3937(msgmain, msgString);
                        break;
                    case "3907": //地图台标注
                    case "3913": //地图台标注
                        this.ProcessMsg3907(msgmain, msgString);
                        break;
                    case "3988": //地图台标注
                        this.ProcessMsg3988(msgmain, msgString);
                        //var str = '<?xml version="1.0" encoding="gb2312"?><MainMsg Vdr="DS"><Head><Src Id="2" Type="8230" /><Dst Id="2" Type="8210" /><Msg Code="9388" SendTime="2017/3/3 14:34:29" /></Head><Body><MsgBodyContent>000000009388:20170303143427843002@867384012199527#867384012199525#867384012199526@</MsgBodyContent></Body></MainMsg>';
                        //window.ws.send(str);
                        break;
                }
            }
            catch (e) {
                console.log(e);
            }
        },


        ProcessMsg3907: function (msgMain, msgString) {

            var content = msgMain.Body.Content;
            if (content.indexOf(':') > 0) {
                content = content.split(':')[1];
            }
            var array = content.split('@');
            if (array != null && array.length > 1) {
                var caseInfo = {  Lon: 0, Lat: 0 };
                if (array.length > 1 && array[0] != "" && array[1] != "") {
                    caseInfo.Lon = parseFloat(array[0]);
                    caseInfo.Lat = parseFloat(array[1]);
                    appEnv.publishMainPane("egis/Map/Locate", { Lon: parseFloat(caseInfo.Lon), Lat: parseFloat(caseInfo.Lat), Zoom: 9 }, "MSG");
                    //先清空原先的标注点
                    var paramObject = { LayerGroup: "报警定位", RemoveType: "GROUP" };
                    appEnv.publishMainPane("egis/Map/Remove", paramObject);

                    var strTitle = "";
                    var iconUrl = "/Content/themes/blue/images/red-pin.gif";
                    var paramObject = { LayerGroup: "报警定位", LayerId: "案件标注点", ImgUrl: iconUrl, ShowText: strTitle, LonLat: [caseInfo.Lon, caseInfo.Lat], Code: "BJDW_ZXD9001" };
                    appEnv.publishMainPane("egis/Map/AddMarker", paramObject, "MSG");
                }
            }
        },

        ProcessMsg3915: function (msgMain, msgString) {

            var content = msgMain.Body.Content;
            if (content.indexOf(':') > 0)
            {
                content = content.split(':')[1];
            }
            var array = content.split('@');
            if (array != null && array.length > 1) {
                var caseInfo = { code: array[0], address: array[1], Lon: 0, Lat:  0};
                if (array.length > 3 && array[2] != "" && array[3] != "")
                {
                    caseInfo.Lon = parseFloat(array[2]);
                    caseInfo.Lat = parseFloat(array[3]);
                }
                appEnv.publishMainPane("egis/Manual/MarkMySlef", caseInfo, "MSG");
            }
        },

        ProcessMsg3988: function (msgMain, msgString) {

            var content = msgMain.Body.Content;

            var array = content.split('@');
            if (array != null && array.length > 5) {

                var strX = array[3];
                var strY = array[4];
                if (strX == null || strX == "" || strX == "0" || strY == null || strY == "" || strY == "0")
                {
                    topic.publish("egis/messageNotification", { type: "info", text: "操作提示:警情无坐标，无法定位!" });
                    return;
                }
                var iconUrl = "/Content/themes/blue/images/map/locate/mobileLocate.png";

                var paramObject = { LayerGroup: "报警定位", RemoveType: "GROUP" };
                //先清空原先的标注点
                appEnv.publishMainPane("egis/Map/Remove", paramObject);

                var paramObject = { LayerGroup: "报警定位", LayerId: "案件标注点", ImgUrl: iconUrl, ShowText: array[1], LonLat: [strX, strY], Code: "BJDW_ZXD3988" };
                appEnv.publishMainPane("egis/Map/AddMarker", paramObject,"MSG");

                var paramObject = { LayerGroup: "报警定位", LayerId: "案件周边范围", Radius: appEnv.appConfig.caseLocateSearchRadius, LonLat: [parseFloat(strX), parseFloat(strY)] };
                appEnv.publishMainPane("egis/Map/DrawCircle", paramObject, "MSG");
                
                appEnv.publishMainPane("egis/Map/Locate", { Lon: parseFloat(strX), Lat: parseFloat(strY), Zoom: 9 }, "MSG");

                this.GetResource(parseFloat(strX), parseFloat(strY), appEnv.appConfig.caseLocateSearchRadius, mainFrame);

                this.ReplayMsgInfo(parseFloat(strX), parseFloat(strY), appEnv.appConfig.deskNum, "8210", "9388", array[0].split(':')[1]);
                //保存定位视频信息
                this.UpCaseLocateInfo(parseFloat(strX), parseFloat(strY), appEnv.appConfig.caseLocateSearchRadius, appEnv.appConfig.deskNum, array[0].split(':')[1], array[1]);

            }
        },
        

        ProcessMsg9001: function (msgMain, msgString) {
            if (msgMain.Body != null) {
                var strTitle = "";
                var iconUrl = "";
                switch (msgMain.Body.LocateType) {
                    case "1":
                        iconUrl = "/Content/themes/blue/images/map/locate/mobileLocate.png";
                        break;
                    case "2":
                        iconUrl = "images/located.gif";
                        break;
                    case "3":
                        iconUrl = "/Content/themes/blue/images/map/locate/mobileLocate.png";
                        strTitle = msgMain.Body.Data.Mobile;
                        break;
                    case "4":
                        iconUrl = "/Content/themes/blue/images/red-pin.gif";
                        break;
                    case "5":
                        iconUrl = "images/bigCase.png";
                        break;
                }

                var paramObject = { LayerGroup: "报警定位", RemoveType: "GROUP" };
                //先清空原先的标注点
                appEnv.publishMainPane("egis/Map/Remove", paramObject);

                var paramObject = { LayerGroup: "报警定位", LayerId: "案件标注点", ImgUrl: iconUrl, ShowText: strTitle, LonLat: [msgMain.Body.Data.Longitude, msgMain.Body.Data.Latitude],Code : "BJDW_ZXD9001" };
                appEnv.publishMainPane("egis/Map/AddMarker", paramObject, "MSG");

                var paramObject = { LayerGroup: "报警定位", LayerId: "案件周边范围", Radius: appEnv.appConfig.caseLocateSearchRadius, LonLat: [parseFloat(msgMain.Body.Data.Longitude), parseFloat(msgMain.Body.Data.Latitude)] };
                appEnv.publishMainPane("egis/Map/DrawCircle", paramObject, "MSG");

                appEnv.publishMainPane("egis/Map/Locate", { Lon: parseFloat(msgMain.Body.Data.Longitude), Lat: parseFloat(msgMain.Body.Data.Latitude), Zoom: 9 }, "MSG");

                this.GetResource(parseFloat(msgMain.Body.Data.Longitude), parseFloat(msgMain.Body.Data.Latitude), appEnv.appConfig.caseLocateSearchRadius, mainFrame);
            }
        },

        GetResource: function (lon, lat, radius, mainFrame)
        {
            //获取周边警力资源
            var paramObj = {
                layersName: "Police",
                actionType: "/Alarm/GetPolice",
                actionExplain: "获取周边警力资源",
                selectType: "circle",
                selectVal: lon + "," + lat + "," + radius,
                checkSTSD: true,
                checkSTBD: false,
                comdition: ""
            };
            var requester = { getDataUrl: "/Alarm/GetResources",LayerGroup: "报警定位", LayerId: "上图警力", actionExplain: paramObj.actionExplain, actionType: paramObj.actionType, paramObject: paramObj };
            appEnv.publishMainPane("egis/Map/Resource/GetResource", requester, "MSG");

            //获取周边视频资源
            var paramObj = {
                layersName: "Video",
                actionType: "/Alarm/GetVideo",
                actionExplain: "获取周边视频资源",
                selectType: "circle",
                selectVal: lon + "," + lat + "," + radius,
                comdition: ""
            };
            var requester = { getDataUrl: "/Alarm/GetResources", LayerGroup: "报警定位", LayerId: "上图视频", actionExplain: paramObj.actionExplain, actionType: paramObj.actionType, paramObject: paramObj};
            appEnv.publishMainPane("egis/Map/Resource/GetVideo", requester, "MSG");

        },

        ReplayMsgInfo: function (lon, lat, dstId, dstType, msgId, sjdbh) {
            //发送回复消息9388
            var me = this;
            var paramObj = {
                lon: lon,
                lat: lat,
                dstId: dstId,
                dstType: dstType,
                msgId: msgId,
                sjdbh: sjdbh
            };
            request.post("/Alarm/GetReplayMsgContent", {
                data: paramObj,
                handleAs: "json"
            }).then(lang.hitch(this, function (data) {
                if (data.success) {
                    me.SendCommonMsg(dstId, dstType, msgId, data.msgContent)
                    if (msgId == "9389")
                    {
                        topic.publish("egis/messageNotification", { type: "info", text: "操作提示:已发送新警情给处警席，请在处警指挥系统进行后续处置!" });
                    }
                }
                else {
                    topic.publish("egis/messageNotification", { type: "info", text: "回复消息:" + msgId + " 失败,原因是 " + data.msgContent });
                }
            }));
        },


        UpCaseLocateInfo: function (lon,lat,radius, deskNum,sjdbh,address)
        {
            //获取周边视频资源
            var paramObj = {
                layersName: "Video",
                actionType: "/Alarm/GetVideo",
                actionExplain: "获取周边视频资源",
                selectType: "circle",
                selectVal: lon + "," + lat + "," + radius,
                comdition: ""
            };
            request.post("/Alarm/GetResources", {
                data: paramObj,
                handleAs: "json"
            }).then(lang.hitch(this, function (data) {
                var videoIdList = "";
                if (data != null && data.length > 0) {
                    for (var num = 0; num < data.length; num++)
                    {
                        if (videoIdList != "")
                        {
                            videoIdList += ",";
                        }
                        videoIdList += data[num].Code;
                    }
                }

                if (videoIdList == "") {
                    return;
                }

                if (!deskNum) {
                    topic.publish("egis/messageNotification", { type: "info", text: "操作提示:请先登录地图坐席!" });
                    return;
                }

                // request.post("/Action/RequestContentByWeb", {
                //     data: {
                //         strParam: '{id:"' + GetTimeIDString() + '",deskid:"' + deskNum + '",jqbh:"' + sjdbh + '",address:"' + address + '",videos:"' + videoIdList + '",xzb:' + lon + ',yzb:' + lat + '}',
                //         strQueryUrl: appEnv.appConfig.PostLocateVideoToKDUrl,
                //         postMethod: "POST"
                //     },
                //     handleAs: "json"
                // }).then(lang.hitch(this, function (data) {
                //     if (!data.code) {
                //         topic.publish("egis/messageNotification", { type: "info", text: "推送播放视频信息失败！" });
                //     }
                //     else {
                //         topic.publish("egis/messageNotification", { type: "info", text: "视频点位数据已经推送到视频平台,请开始巡检!" });
                //     }
                // }));

                return;
                request.post("/Alarm/SaveCaseLocateInfo", {
                    data: {
                        th: deskNum,
                        sjdbh: sjdbh,
                        address: address,
                        videoIdList: videoIdList,
                        lon: lon,
                        lat : lat
                    },
                    handleAs: "json"
                }).then(lang.hitch(this, function (data) {
                    if (!data.success)
                    {
                        topic.publish("egis/messageNotification", { type: "info", text: "保存定位视频信息失败！" });
                    }
                }));

            }));
        },


        ProcessMsg9009: function (msgMain, msgString) {

            //定位失败
            if (msgMain.Body != null) {
                //Ext.ExtDSUtility.msg('定位操作：', "未匹配到定位坐标！");
            }
        }



    });
});