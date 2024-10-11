define([
'dojo/_base/lang',
'dojo/aspect',
'egis/Config/AppConfig',
"dijit/layout/ContentPane",
'egis/Share/Manager/userManager',
"egis/Share/component/MapFloatPane/MapFloatingPane",
'dijit/Dialog',
'egis/appEnv'
]
, function (lang,aspect, appConfig,ContentPane, userManager, MapFloatingPane, Dialog, appEnv) {

    return lang.mixin(appConfig, {

        orgWmsUrl: "http://192.168.7.85:6080/arcgis/services/shfire_fenju/MapServer/WMSServer?",

        PostUserPWDToCenterUrl: "http://41.246.119.23/mit-web/rest/xgmm",

        PostLocateVideoToKDUrl: "http://10.123.8.8:8080/trafficevent/rest/caselocate",

        PostDutyVideoToKDUrl: "http://10.123.8.8:8080/trafficevent/rest/dutycheck",

        footerHeight: 46,

        orgRootName: "山东省自然资源局",

        MsgServerConnectString: 'ws://41.246.119.21:8181/',

        GpsServerConnectString: 'ws://41.246.119.21:8282/',

        GpsOtherConnectString: 'ws://41.246.119.21:8383/',
        //手机前缀
        SJQZ: "0",
        //手台前缀
        STQZ: "8",

        orgTreeDisplayLevel: 3,

        OrgDefaultCheck : true,

        //查询警情的时间范围（分钟） 
        caseTimeSpan: 30,

        //GPS离线时间范围（分钟） 
        GPSOffTime: 10,

        //警情定位搜索半径
        caseLocateSearchRadius: 500 / 111194,

        //是否处于派警状态
        IsDoCase: false,
        //不聚合的分辨率
        nonClusterResoultion: 0.000003814697265625,

        GetCallNumber: function (number,callType) {
            if (number)
            {
                if (callType == "sj") {
                    return this.SJQZ + number;
                }
                else {
                    return this.STQZ + number;
                }
            }
            return null;
        },

        GetRootOrgId: function () {
            var user = userManager.getUser();
            if (user != null)
            {
                if(user.OrgId) {
                    return user.OrgId;
                }
            }
            return "202305042030";
        },

        IsGranted: function (moduleID, moduleName) {
            if (moduleID) {
                if (!userManager.isGranted(moduleID)) {
                    dojo.publish("egis/messageNotification", { type: "info", text: "操作提示:对不起，您没有操作 " + moduleName + " 的权限!" });
                    return false;
                }
            }
            return true;
        },

        //视频调用地址
        ShowVideo: function (codelist) {

            var url = "http://10.123.8.8:8080/ezView/LinkShell.html?UserName=admin&PageNo=ZJSP63&DeviceNo=" + codelist + "&Size=600,420&Report/PlayVideo/";
            window.open(url, "openVideo", "width=600,height=450,top=150,left=150,resizable=no,scrollbars=none,location=no");
            //var url = "/Content/themes/blue/Animation.gif";
            //window.open(url, "openVideo", "width=600,height=350,top=150,left=150,resizable=no,scrollbars=none,location=no");
        },


        ShowLSVideo: function (codelist) {

            var url = "/Other/Video/vics/lsvideo.html?ip=10.46.142.244&port=9696&tnum=" + codelist + "&mtype=2&ptzctrl=1";

            window.open(url, 'videopane', "width=800,height=600,top=150,left=150,resizable=no,scrollbars=no,location=no");
            
            //var url = "/Content/themes/blue/Animation.gif";
            //window.open(url, "openVideo", "width=600,height=350,top=150,left=150,resizable=no,scrollbars=none,location=no");
        },

        //多路视频调用地址
        ShowMutiVideo: function (videoList) {

	        for(var num=0 ;num < videoList.length;num++)
	        {
	            var url = "Report/PlayVideo/ShowVideoForKD_JLST.aspx?camid=" + videoList[num].code;
	            window.open(url, videoList[num].code, "width=600,height=420,top=150,left=150,resizable=no,scrollbars=none,location=no");
	            //var url = "/Content/themes/blue/Animation.gif";
                //window.open(url, videoList[num].code, "width=600,height=350,top=150,left=150,resizable=no,scrollbars=none,location=no");
            }
        },

        ShowCarVideo: function (resource) {

            var url = "http://10.123.8.8:8080/ezView/LinkShell.html?UserName=admin&PageNo=ZJSP63&DeviceNo=" + resource.CODE + "&Size=600,420&Report/PlayVideo/";
            window.open(url, "openVideo", "width=600,height=420,top=150,left=150,resizable=no,scrollbars=none,location=no");
            //var url = "/Content/themes/blue/Animation.gif";
            //window.open(url, "openVideo", "width=600,height=350,top=150,left=150,resizable=no,scrollbars=none,location=no");
        },

        ShowMutiPath: function (resource,isHighSpeed, imgUrl) {
            var iframeDocumnet = null;
            var iframe = null;
            if (document.getElementById("iframeMutiPath")) {
                iframeDocumnet = document.getElementById("iframeMutiPath").document;
                iframe = document.getElementById("iframeMutiPath")
                if (iframeDocumnet == null) {
                    iframeDocumnet = document.getElementById("iframeMutiPath").contentDocument;
                    iframe = document.getElementById("iframeMutiPath").contentWindow;
                }
            }
            if (iframe != null)
            {
                iframe.AddNewGJBF(resource.CODE, resource.SHOWTEXT, isHighSpeed, imgUrl);
                return;
            }

            var mapPane = appEnv.getCurrentPane();
            if (mapPane.ShowPathPane == null) {
                mapPane.ShowPathPane = new MapFloatingPane({
                    title: '多人历史轨迹回放',
                    style: 'position:absolute; left:25px; top:120px; width:300px;height:285px;',
                    dockTo: mapPane.dockTo,
                    //initPosition: 'lt'
                });

                var content = new ContentPane({
                    style: 'width:100%;height:235px;padding: 0px;overflow: hidden;',
                });

                content.set('content', '<iframe src="/Path/Index?code=' + resource.CODE + '&name=' + resource.SHOWTEXT + '&isHighSpeed=' + isHighSpeed + '&imgUrl=' + imgUrl + '" id="iframeMutiPath" width="100%" height="100%"  frameborder="0" scrolling="no"></iframe>');

                mapPane.ShowPathPane.addChild(content);

                aspect.after(mapPane.ShowPathPane, 'close', lang.hitch(this, function () {
                    mapPane.ShowPathPane = null;
                    var removeObject = { LayerGroup: "播放轨迹", RemoveType: "GROUP" };
                    window.dojo.publish("egis/Map/Remove", removeObject);
                }));

                mapPane.addFloatingPane(mapPane.ShowPathPane);
            }
        },

        //视频调用地址
        ShowCaseUrl: function (caseInfo) {

            var url = "http://41.246.119.30/dswebcxtj/WebDetail/SearchList.aspx?BH=" + caseInfo.case_code + "&Type=jjzhd";

            var dialog = new Dialog({
                title: '警情详情 - ' + caseInfo.case_code,
                content: '<iframe src="' + url + '" width="800" height="550" scrolling="auto"></iframe>',
                style: "width:800px; height:600px;"
            });
            dialog.show();
        },

        //实时过车信息
        ShowBlockPass: function (name, code) {

            var dialog = new Dialog({
                title: '实时过车信息--' + name,
                content: '<iframe src="http://10.109.40.16/APP.Query/KKXX/ShowBlockScanInfo.aspx?KKID=' + code + '" width="900" height="600"/>',
                style: "width: 600px; height: 480px;"
            });
            dialog.show();
        },

        //显示过车照片
        ShowOnePassImage: function (detectorSite) {

            var dialog = new Dialog({
                title: '查看过车照片--' + detectorSite.name[0],
                content: '<img src="http://10.106.33.189/ImageQuery/PassImage.aspx?deviceNbr=' + detectorSite.showGCZP[0].split(',')[0] + '&snapNbr=' + detectorSite.showGCZP[0].split(',')[1] + '" width="800" height="600"/>',
                style: "width: 800px; height: 620px;"
            });
            dialog.show();
        },

        //历史过车信息
        ShowBlockOldPass: function (name,code) {

            var dialog = new Dialog({
                title: '历史过车信息--' + name,
                content: '<iframe src="http://10.109.40.16/APP.Query/KKXX/KKScanInfo.aspx?KKID=' + code + '" width="900" height="600"/>',
                style: "width: 920px; height: 650px;"
            });
            dialog.show();
        },

        //卡口视频地址
//        ShowBlockVideo: function (detectorSite) {

//            var url = "http://10.130.36.140/pgis/vehicle_video.jsp?bayonetUnid=" + detectorSite.code;

//            window.open(url, 'videopane', "width=600,height=420,top=150,left=150,resizable=no,scrollbars=none,location=no");

//        },

        //警务通视频调用
        ShowJWTVideo: function (resource) {
            var timestamp = new Date().getTime();
            var url = "http://41.246.119.32:801/videoplay/chrome/videoplay_chrome.html?ip=10.123.69.32&port=9290&mtype=0&ttype=1&tnum=" + resource.CODE;
            window.open(url, timestamp, "width=420,height=480,top=150,left=150,resizable=no,scrollbars=none,location=no");
        },


        policeForceIcons: {
            url: [
                {
                    type: 'carother', 
                    Name: "警车",
                    IsUsed : false,
                    statusIcons: [{
                        status: 1, //（上岗）
                        icon: "/Content/themes/blue/images/police/car_other_onduty.gif"
                    }, {
                        status: 3, //（下岗）
                        icon: "/Content/themes/blue/images/police/car_other_offduty.gif"
                    }, {
                        status: 2, //（巡逻）
                        icon: "/Content/themes/blue/images/police/car_other_onduty.gif"
                    }, {
                        status: 8,  //（接警）
                        icon: "/Content/themes/blue/images/police/car_other_chu.gif"
                    }, {
                        status: 5,  //
                        icon: "/Content/themes/blue/images/police/car_other_onduty.gif"
                    }, {
                        status: 9,  //（到场）
                        icon: "/Content/themes/blue/images/police/car_other_xian.gif"
                    }, {
                        status: null,  //（默认）（离线）
                        icon: "/Content/themes/blue/images/police/car_other_offline.gif"
                    }]
                },
               {
                   type: 'car110',
                   Name: "110警车",
                   IsUsed: false,
                   statusIcons: 
                    [
                        { status: 3, icon: "/Content/themes/blue/images/police/110jc_5.gif" }, //离岗（下岗）
                        { status: 1, icon: "/Content/themes/blue/images/police/110jc_1.gif" }, //备勤（上岗）   
                        { status: 2, icon: "/Content/themes/blue/images/police/110jc_2.gif" }, //巡逻（巡逻）
                        { status: 8, icon: "/Content/themes/blue/images/police/110jc_8.gif" }, //出警
                        { status: 9, icon: "/Content/themes/blue/images/police/110jc_9.gif" }, //处警（到达现场）
                        { status: 5, icon: "/Content/themes/blue/images/police/110jc_5.gif"},   //处警结束
                        { status: null, icon: "/Content/themes/blue/images/police/110jc_3.gif" } //默认 离线状态
                    ]
                }
                , 
                {
                    type: 'car119',
                    Name: "消防车",
                    IsUsed: false,
                    statusIcons:
                    [
                        { status: 3, icon: "/Content/themes/blue/images/police/xfc_5.gif" }, //离岗（下岗）
                        { status: 1, icon: "/Content/themes/blue/images/police/xfc_1.gif" }, //备勤（上岗）
                        { status: 2, icon: "/Content/themes/blue/images/police/xfc_2.gif" }, //巡逻（巡逻）
                        { status: 8, icon: "/Content/themes/blue/images/police/xfc_8.gif" }, //出警
                        { status: 9, icon: "/Content/themes/blue/images/police/xfc_9.gif" }, //处警（到达现场）
                        { status: 5, icon: "/Content/themes/blue/images/police/xfc_5.gif" },   //处警结束
                        {status: null, icon: "/Content/themes/blue/images/police/xfc_3.gif"}   //默认 离线状态
                    ]
                }, 
               {
                    type: 'car122', 
                    Name: "交警车",
                    IsUsed: false,
                    statusIcons: [{
                    status: 3,  //离岗（下岗）
                    icon: "/Content/themes/blue/images/police/122jc_5.gif"
                }, {
                    status: 1,  //备勤（上岗）
                    icon: "/Content/themes/blue/images/police/122jc_1.gif"
                }, {
                    status: 2,  //巡逻（巡逻）
                    icon: "/Content/themes/blue/images/police/122jc_2.gif"
                }, {
                    status: 8,  //出警
                    icon: "/Content/themes/blue/images/police/122jc_8.gif"
                }, {
                    status: 9,  //处警（到达现场）
                    icon: "/Content/themes/blue/images/police/122jc_9.gif"
                }, {
                    status: 5,  //处警结束
                    icon: "/Content/themes/blue/images/police/122jc_5.gif"
                }, {
                    status: null,  //（默认）离线状态
                    icon: "/Content/themes/blue/images/police/122jc_3.gif"
                }]
               },
               {
                   type: 'car_122',
                   Name: "交警车",
                   IsUsed: true,
                   statusIcons: [{
                       status: 3,  //离岗（下岗）
                       icon: "/Content/themes/blue/images/police/4G-Online-32.png"
                   }, {
                       status: 1,  //备勤（上岗）
                       icon: "/Content/themes/blue/images/police/4G-Online-32.png"
                   }, {
                       status: 2,  //巡逻（巡逻）
                       icon: "/Content/themes/blue/images/police/4G-Online-32.png"
                   }, {
                       status: 8,  //出警
                       icon: "/Content/themes/blue/images/police/4G-Online-32.png"
                   }, {
                       status: 9,  //处警（到达现场）
                       icon: "/Content/themes/blue/images/police/4G-Online-32.png"
                   }, {
                       status: 5,  //处警结束
                       icon: "/Content/themes/blue/images/police/4G-Online-32.png"
                   }, {
                       status: null,  //（默认）离线状态
                       icon: "/Content/themes/blue/images/police/4G-Offline-32.png"
                   }]
               },
            {
                type: 'carroom', 
                Name: "警务室",
                IsUsed: false,
                statusIcons: [{
                    status: 3,  //离岗（下岗）
                    icon: "/Content/themes/blue/images/police/qws_5.gif"
                }, {
                    status: 1,  //备勤（上岗）
                    icon: "/Content/themes/blue/images/police/qws_1.gif"
                }, {
                    status: 2,  //巡逻（巡逻）
                    icon: "/Content/themes/blue/images/police/qws_2.gif"
                }, {
                    status: 8,  //出警
                    icon: "/Content/themes/blue/images/police/qws_8.gif"
                }, {
                    status: 9,  //处警（到达现场）
                    icon: "/Content/themes/blue/images/police/qws_9.gif"
                }, {
                    status: 5,  //处警结束
                    icon: "/Content/themes/blue/images/police/qws_5.gif"
                }, {
                    status: null,  //（默认） 离线状态
                    icon: "/Content/themes/blue/images/police/qws_3.gif"
                }]
            }, {
                type: 'cart',
                Name: "特警车",
                IsUsed: false,
                statusIcons: [{
                    status: 3,  //离岗（下岗）
                    icon: "/Content/themes/blue/images/police/tjc_5.gif"
                }, {
                    status: 1,  //备勤（上岗）
                    icon: "/Content/themes/blue/images/police/tjc_1.gif"
                }, {
                    status: 2,  //巡逻（巡逻）     
                    icon: "/Content/themes/blue/images/police/tjc_2.gif"
                }, {
                    status: 8,  //出警             
                    icon: "/Content/themes/blue/images/police/tjc_8.gif"
                }, {
                    status: 9,  //处警（到达现场） 
                    icon: "/Content/themes/blue/images/police/tjc_9.gif"
                }, {
                    status: 5,  //处警结束         
                    icon: "/Content/themes/blue/images/police/tjc_5.gif"
                }, {
                    status: null,  //（默认） 离线状态
                    icon: "/Content/themes/blue/images/police/tjc_3.gif"
                }]
            }, {
                type: 'carwj',
                Name: "武警车",
                IsUsed: false,
                statusIcons: [{
                    status: 3,  //离岗（下岗）
                    icon: "/Content/themes/blue/images/police/wjc_5.gif"
                }, {
                    status: 1,  //备勤（上岗）
                    icon: "/Content/themes/blue/images/police/wjc_1.gif"
                }, {
                    status: 2,  //巡逻（巡逻）
                    icon: "/Content/themes/blue/images/police/wjc_2.gif"
                }, {
                    status: 8,  //出警
                    icon: "/Content/themes/blue/images/police/wjc_8.gif"
                }, {
                    status: 9,  //处警（到达现场）
                    icon: "/Content/themes/blue/images/police/wjc_9.gif"
                }, {
                    status: 5,  //处警结束
                    icon: "/Content/themes/blue/images/police/wjc_5.gif"
                }, {
                    status: null,  //（默认） 离线状态
                    icon: "/Content/themes/blue/images/police/wjc_3.gif"
                }]
            }, {
                type: 'carm',
                Name: "摩托车",
                IsUsed: false,
                statusIcons: [{
                    status: 3,  //离岗（下岗）
                    icon: "/Content/themes/blue/images/police/mtc_5.gif"
                }, {
                    status: 1,  //备勤（上岗）
                    icon: "/Content/themes/blue/images/police/mtc_1.gif"
                }, {
                    status: 2,  //巡逻（巡逻）
                    icon: "/Content/themes/blue/images/police/mtc_2.gif"
                }, {
                    status: 8,  //出警
                    icon: "/Content/themes/blue/images/police/mtc_8.gif"
                }, {
                    status: 9,  //处警（到达现场）
                    icon: "/Content/themes/blue/images/police/mtc_9.gif"
                }, {
                    status: 5,  //处警结束
                    icon: "/Content/themes/blue/images/police/mtc_5.gif"
                }, {
                    status: null,  //（默认） 离线状态
                    icon: "/Content/themes/blue/images/police/mtc_3.gif"
                }]
            }, {
                type: 'manother', 
                Name: "一般民警",
                IsUsed: false,
                statusIcons: [{
                    status: 3,  //离岗（下岗）
                    icon: "/Content/themes/blue/images/police/ybmj_5.gif"
                }, {
                    status: 1,  //备勤（上岗）
                    icon: "/Content/themes/blue/images/police/ybmj_1.gif"
                }, {
                    status: 2,  //巡逻（巡逻）
                    icon: "/Content/themes/blue/images/police/ybmj_2.gif"
                }, {
                    status: 8,  //出警
                    icon: "/Content/themes/blue/images/police/ybmj_8.gif"
                }, {
                    status: 9,  //处警（到达现场）
                    icon: "/Content/themes/blue/images/police/ybmj_9.gif"
                }, {
                    status: 5,  //处警结束
                    icon: "/Content/themes/blue/images/police/ybmj_5.gif"
                }, {
                    status: null,  //（默认） 离线状态
                    icon: "/Content/themes/blue/images/police/ybmj_3.gif"
                }]
            }, {
                type: 'man110', 
                Name: "110民警",
                IsUsed: false,
                statusIcons: [{
                    status: 3,  //离岗（下岗）
                    icon: "/Content/themes/blue/images/police/110mj_5.gif"
                }, {
                    status: 1,  //备勤（上岗）
                    icon: "/Content/themes/blue/images/police/110mj_1.gif"
                }, {
                    status: 2,  //巡逻（巡逻）
                    icon: "/Content/themes/blue/images/police/110mj_2.gif"
                }, {
                    status: 8,  //出警
                    icon: "/Content/themes/blue/images/police/110mj_8.gif"
                }, {
                    status: 9,  //处警（到达现场）
                    icon: "/Content/themes/blue/images/police/110mj_9.gif"
                }, {
                    status: 5,  //处警结束
                    icon: "/Content/themes/blue/images/police/110mj_5.gif"
                }, {
                    status: null,  //（默认） 离线状态
                    icon: "/Content/themes/blue/images/police/110mj_3.gif"
                }]
            }, {
                type: 'man119',
                Name: "消防民警",
                IsUsed: false,
                statusIcons: [{
                    status: 3,  //离岗（下岗）
                    icon: "/Content/themes/blue/images/police/xfmj_5.gif"
                }, {
                    status: 1,  //备勤（上岗）
                    icon: "/Content/themes/blue/images/police/xfmj_1.gif"
                }, {
                    status: 2,  //巡逻（巡逻）
                    icon: "/Content/themes/blue/images/police/xfmj_2.gif"
                }, {
                    status: 8,  //出警
                    icon: "/Content/themes/blue/images/police/xfmj_8.gif"
                }, {
                    status: 9,  //处警（到达现场）
                    icon: "/Content/themes/blue/images/police/xfmj_9.gif"
                }, {
                    status: 5,  //处警结束
                    icon: "/Content/themes/blue/images/police/xfmj_5.gif"
                }, {
                    status: null,  //（默认） 离线状态
                    icon: "/Content/themes/blue/images/police/xfmj_3.gif"
                }]
            }, {
                type: 'manJWT',
                Name: "警务通民警",
                IsUsed: true,
                statusIcons: [{
                    status: 3,  //离岗（下岗）
                    icon: "/Content/themes/blue/images/police/p32.png"
                }, {
                    status: 1,  //备勤（上岗）
                    icon: "/Content/themes/blue/images/police/p32.png"
                }, {
                    status: 2,  //巡逻（巡逻）
                    icon: "/Content/themes/blue/images/police/p32.png"
                }, {
                    status: 8,  //出警
                    icon: "/Content/themes/blue/images/police/p32.png"
                }, {
                    status: 9,  //处警（到达现场）
                    icon: "/Content/themes/blue/images/police/p32.png"
                }, {
                    status: 5,  //处警结束
                    icon: "/Content/themes/blue/images/police/p32.png"
                }, {
                    status: null,  //（默认） 离线状态
                    icon: "/Content/themes/blue/images/police/p-b-32.png"
                }]
            }, {
                type: 'manxjJWT',
                Name: "警务通辅警",
                IsUsed: true,
                statusIcons: [{
                    status: 3,  //离岗（下岗）
                    icon: "/Content/themes/blue/images/police/f32.png"
                }, {
                    status: 1,  //备勤（上岗）
                    icon: "/Content/themes/blue/images/police/f32.png"
                }, {
                    status: 2,  //巡逻（巡逻）
                    icon: "/Content/themes/blue/images/police/f32.png"
                }, {
                    status: 8,  //出警
                    icon: "/Content/themes/blue/images/police/f32.png"
                }, {
                    status: 9,  //处警（到达现场）
                    icon: "/Content/themes/blue/images/police/f32.png"
                }, {
                    status: 5,  //处警结束
                    icon: "/Content/themes/blue/images/police/f32.png"
                }, {
                    status: null,  //（默认） 离线状态
                    icon: "/Content/themes/blue/images/police/f-b-32.png"
                }]
            }, {
                type: 'man122', 
                Name: "交警民警",
                IsUsed: false,
                statusIcons: [{
                    status: 3,  //离岗（下岗）
                    icon: "/Content/themes/blue/images/police/jwtmj_5.gif"
                }, {
                    status: 1,  //备勤（上岗）
                    icon: "/Content/themes/blue/images/police/jwtmj_1.gif"
                }, {
                    status: 2,  //巡逻（巡逻）
                    icon: "/Content/themes/blue/images/police/jwtmj_2.gif"
                }, {
                    status: 8,  //出警
                    icon: "/Content/themes/blue/images/police/jwtmj_8.gif"
                }, {
                    status: 9,  //处警（到达现场）
                    icon: "/Content/themes/blue/images/police/jwtmj_9.gif"
                }, {
                    status: 5,  //处警结束
                    icon: "/Content/themes/blue/images/police/jwtmj_5.gif"
                }, {
                    status: null,  //（默认） 离线状态
                    icon: "/Content/themes/blue/images/police/jwtmj_3.gif"
                }]
            }, {
                type: 'man_122',
                Name: "交警民警",
                IsUsed: true,
                statusIcons: [{
                    status: 3,  //离岗（下岗）
                    icon: "/Content/themes/blue/images/police/p-32.png"
                }, {
                    status: 1,  //备勤（上岗）
                    icon: "/Content/themes/blue/images/police/p-32.png"
                }, {
                    status: 2,  //巡逻（巡逻）
                    icon: "/Content/themes/blue/images/police/p-32.png"
                }, {
                    status: 8,  //出警
                    icon: "/Content/themes/blue/images/police/p-32.png"
                }, {
                    status: 9,  //处警（到达现场）
                    icon: "/Content/themes/blue/images/police/p-32.png"
                }, {
                    status: 5,  //处警结束
                    icon: "/Content/themes/blue/images/police/p-32.png"
                }, {
                    status: null,  //（默认） 离线状态
                    icon: "/Content/themes/blue/images/police/peo-gray-32.png"
                }]
            },
             {
                 type: 'man_xj',
                 Name: "交警协警",
                 IsUsed: true,
                 statusIcons: [{
                     status: 3,  //离岗（下岗）
                     icon: "/Content/themes/blue/images/police/f-32.png"
                 }, {
                     status: 1,  //备勤（上岗）
                     icon: "/Content/themes/blue/images/police/f-32.png"
                 }, {
                     status: 2,  //巡逻（巡逻）
                     icon: "/Content/themes/blue/images/police/f-32.png"
                 }, {
                     status: 8,  //出警
                     icon: "/Content/themes/blue/images/police/f-32.png"
                 }, {
                     status: 9,  //处警（到达现场）
                     icon: "/Content/themes/blue/images/police/f-32.png"
                 }, {
                     status: 5,  //处警结束
                     icon: "/Content/themes/blue/images/police/f-32.png"
                 }, {
                     status: null,  //（默认） 离线状态
                     icon: "/Content/themes/blue/images/police/fu-gray-32.png"
                 }]
             },
            {
                type: 'man_zg',
                Name: "交警协警",
                IsUsed: false,
                statusIcons: [{
                    status: 3,  //离岗（下岗）
                    icon: "/Content/themes/blue/images/police/f-32.png"
                }, {
                    status: 1,  //备勤（上岗）
                    icon: "/Content/themes/blue/images/police/f-32.png"
                }, {
                    status: 2,  //巡逻（巡逻）
                    icon: "/Content/themes/blue/images/police/f-32.png"
                }, {
                    status: 8,  //出警
                    icon: "/Content/themes/blue/images/police/f-32.png"
                }, {
                    status: 9,  //处警（到达现场）
                    icon: "/Content/themes/blue/images/police/f-32.png"
                }, {
                    status: 5,  //处警结束
                    icon: "/Content/themes/blue/images/police/f-32.png"
                }, {
                    status: null,  //（默认） 离线状态
                    icon: "/Content/themes/blue/images/police/fu-gray-32.png"
                }]
            }, {
                type: 'man_ld', 
                Name: "交警民警",
                IsUsed: false,
                statusIcons: [{
                    status: 3,  //离岗（下岗）
                    icon: "/Content/themes/blue/images/police/p-32.png"
                }, {
                    status: 1,  //备勤（上岗）
                    icon: "/Content/themes/blue/images/police/p-32.png"
                }, {
                    status: 2,  //巡逻（巡逻）
                    icon: "/Content/themes/blue/images/police/p-32.png"
                }, {
                    status: 8,  //出警
                    icon: "/Content/themes/blue/images/police/p-32.png"
                }, {
                    status: 9,  //处警（到达现场）
                    icon: "/Content/themes/blue/images/police/p-32.png"
                }, {
                    status: 5,  //处警结束
                    icon: "/Content/themes/blue/images/police/p-32.png"
                }, {
                    status: null,  //（默认） 离线状态
                    icon: "/Content/themes/blue/images/police/peo-gray-32.png"
                }]
            }
            //    {
            //    type: 'man_xj', //交警民警
            //    statusIcons: [{
            //        status: 3,  //离岗（下岗）
            //        icon: "/Content/themes/blue/images/police/f-32.png"
            //    }, {
            //        status: 1,  //备勤（上岗）
            //        icon: "/Content/themes/blue/images/police/f-32.png"
            //    }, {
            //        status: 2,  //巡逻（巡逻）
            //        icon: "/Content/themes/blue/images/police/f-32.png"
            //    }, {
            //        status: 8,  //出警
            //        icon: "/Content/themes/blue/images/police/f-32.png"
            //    }, {
            //        status: 9,  //处警（到达现场）
            //        icon: "/Content/themes/blue/images/police/f-32.png"
            //    }, {
            //        status: 5,  //处警结束
            //        icon: "/Content/themes/blue/images/police/f-32.png"
            //    }, {
            //        status: null,  //（默认） 离线状态
            //        icon: "/Content/themes/blue/images/police/f-32.png"
            //    }]
            //},
            //{
            //    type: 'man_xj', //交警民警
            //    statusIcons: [{
            //        status: 3,  //离岗（下岗）
            //        icon: "/Content/themes/blue/images/police/单兵-正常.png"
            //    }, {
            //        status: 1,  //备勤（上岗）
            //        icon: "/Content/themes/blue/images/police/单兵-报.png"
            //    }, {
            //        status: 2,  //巡逻（巡逻）
            //        icon: "/Content/themes/blue/images/police/单兵-巡.png"
            //    }, {
            //        status: 8,  //出警
            //        icon: "/Content/themes/blue/images/police/单兵-接.png"
            //    }, {
            //        status: 9,  //处警（到达现场）
            //        icon: "/Content/themes/blue/images/police/单兵-处.png"
            //    }, {
            //        status: 5,  //处警结束
            //        icon: "/Content/themes/blue/images/police/单兵-报.png"
            //    }, {
            //        status: null,  //（默认） 离线状态
            //        icon: "/Content/themes/blue/images/police/单兵-正常.png"
            //    }]
            //},
            //{
            //    type: 'man_zg', //交警民警
            //    statusIcons: [{
            //        status: 3,  //离岗（下岗）
            //        icon: "/Content/themes/blue/images/police/单兵-正常.png"
            //    }, {
            //        status: 1,  //备勤（上岗）
            //        icon: "/Content/themes/blue/images/police/单兵-报.png"
            //    }, {
            //        status: 2,  //巡逻（巡逻）
            //        icon: "/Content/themes/blue/images/police/单兵-巡.png"
            //    }, {
            //        status: 8,  //出警
            //        icon: "/Content/themes/blue/images/police/单兵-接.png"
            //    }, {
            //        status: 9,  //处警（到达现场）
            //        icon: "/Content/themes/blue/images/police/单兵-处.png"
            //    }, {
            //        status: 5,  //处警结束
            //        icon: "/Content/themes/blue/images/police/单兵-报.png"
            //    }, {
            //        status: null,  //（默认） 离线状态
            //        icon: "/Content/themes/blue/images/police/单兵-正常.png"
            //    }]
            //}, {
            //    type: 'man_ld', //交警民警
            //    statusIcons: [{
            //        status: 3,  //离岗（下岗）
            //        icon: "/Content/themes/blue/images/police/局长.png"
            //    }, {
            //        status: 1,  //备勤（上岗）
            //        icon: "/Content/themes/blue/images/police/局长.png"
            //    }, {
            //        status: 2,  //巡逻（巡逻）
            //        icon: "/Content/themes/blue/images/police/局长.png"
            //    }, {
            //        status: 8,  //出警
            //        icon: "/Content/themes/blue/images/police/局长.png"
            //    }, {
            //        status: 9,  //处警（到达现场）
            //        icon: "/Content/themes/blue/images/police/局长.png"
            //    }, {
            //        status: 5,  //处警结束
            //        icon: "/Content/themes/blue/images/police/局长.png"
            //    }, {
            //        status: null,  //（默认） 离线状态
            //        icon: "/Content/themes/blue/images/police/局长.png"
            //    }]
            //}

            ]
        }
    });
});