/*!
* PGIS 1.5
* Copyright(c) 2006-2010 DS Inc.
* created by song
* http://www.dscomm.com.cn
*/



//定义主界面对象
Ext.BLANK_IMAGE_URL = '../JavaScript/EXT/resources/images/default/s.gif';
var kmlPlayer = null;
var BeginSelect = null;
var BeginPlay = null;

Ext.onReady(function () {

    Ext.state.Manager.setProvider(new Ext.state.CookieProvider());


    //构造播放器
    ////////////////////////////////////////////////////////////////////////
    var bfTip = new Ext.slider.Tip({
        getText: function (thumb) {
            return String.format('<b>{0}% </b>', thumb.value);
        }
    });

    var bfSlider = new Ext.Slider({
        width: 105,
        clickToChange: false,
        increment: 1,
        minValue: 0,
        maxValue: 100,
        plugins: bfTip
    });

    BeginPlay = function () {

        kmlPlayer.Play();
        btnBF.setIconClass('GJ_ZT');

    };

    //构造播放按钮
    var btnBF = new Ext.Action({
        iconCls: 'GJ_BF',
        listeners:
          {
              click: function (btn, args) {
                  if (kmlPlayer == null) {
                      window.parent.window.Ext.MessageBox.alert('操作提示', '请先查询后点击播放！');
                      return;
                  }
                  if (kmlPlayer.IsPlayNow) {
                      kmlPlayer.Stop();
                      btnBF.setIconClass('GJ_BF');
                  }
                  else {
                      kmlPlayer.Play();
                      btnBF.setIconClass('GJ_ZT');
                  }
              }
          }
    });
    //构造重播按钮
    var btnCB = new Ext.Action({
        iconCls: 'GJ_CB',
        listeners:
          {
              click: function (btn, args) {
                  if (kmlPlayer == null) {
                      window.parent.window.Ext.MessageBox.alert('操作提示', '请先查询后点击播放！');
                      return;
                  }
                  if (kmlPlayer.GetPlayAgain()) {
                      kmlPlayer.SetPlayAgain(false);
                      btnCB.setIconClass('GJ_CB');
                  }
                  else {
                      kmlPlayer.SetPlayAgain(true);
                      btnCB.setIconClass('GJ_YCB');
                  }
              }
          }
    });

    //构造移除按钮
    var btnYC = new Ext.Action({
        iconCls: 'GJ_YC',
        listeners:
          {
              click: function (btn, args) {
                  window.parent.window.RemoveOneGJBF(ServerCodeId);
              }
          }
    });

    //够着播放面板
    var playBox = new Ext.FormPanel(
           {
               region: 'center',
               header: false,
               layout: 'hbox',
               split: true,
               collapsible: true,
               margins: '1 1 1 1',
               tbar: [
                      {
                          xtype: 'button',
                          iconCls: 'GJ_KT',
                          listeners:
                          {
                              click: function (self, args) {
                                  kmlPlayer.Slower();
                              }
                          }
                      },
                      '-',
                      btnBF,
                      '-',
                      {
                          xtype: 'button',
                          iconCls: 'GJ_KJ',
                          listeners:
                          {
                              click: function (self, args) {
                                  kmlPlayer.Speeder();
                              }
                          }
                      }, '-', bfSlider, '-', btnCB, '-', btnYC
                ]
           }
    );

    //显示播放器面板
    var gjShowPlayBoard = function (param) {

        var playFun = function (player) {
            var playSum = player.PlayList.length;
            if (playSum != bfSlider.maxValue) {
                bfSlider.maxValue = playSum;
            }
            window.status = player.currentStep;
            bfSlider.setValue(player.currentStep);

            if (player.KMLDocument != null && player.KMLDocument.DrawObject != null) {
                var feature = player.PlayList[player.currentStep];
                if (feature != null) {
                    if (feature instanceof skPlacemark) {
                        //绘制这个点
                        feature.ToDraw(feature,
                        {
                            BelongDocument: player.KMLDocument
                        }
                        );
                    }
                    else if (feature instanceof skUpdater) {
                        var oldPM = player.KMLDocument.IDFeatures[feature.Change.targetId];
                        if (oldPM != null) {
                            if (oldPM.Geometry.Coordinates != feature.Change.Feature.Geometry.Coordinates) {

                                player.KMLDocument.DrawObject.UpdateGpsAndName(feature.Change.targetId,parseFloat(feature.Change.Feature.Geometry.x),parseFloat(feature.Change.Feature.Geometry.y),feature.Change.Feature.Name );

                            }
                        }
                    }
                }
            }
        };

        var playStop = function (player) {
            btnBF.setIconClass('GJ_BF');
            bfSlider.setValue(bfSlider.maxValue);
        };

        var playBegin = function (player) {
            if (currentLayerManager != null) {
                if (player.KMLDocument != null && player.KMLDocument.DrawObject != null) {
                    player.KMLDocument.DrawObject.ClearAll(ServerCodeId);
                }
            }
        };

        kmlPlayer = new JSPlayer(param.PlayList, param.ParsedDocument);
        kmlPlayer.AddPlayStepEvent("playFun", playFun);
        kmlPlayer.AddPlayStopEvent("playStop", playStop);
        kmlPlayer.AddPlayBeginEvent("playBegin", playBegin);

    };

    //轨迹查询回调函数
    var gjSelectCallBack = function (param, success, response) {

        window.parent.window.FinshRequst();
        if (success) {
            if (param.params.MySelf.KMLDocument != null) {
                param.params.MySelf.KMLDocument.DrawObject.ClearAll(ServerCodeId);
                delete param.params.MySelf.KMLDocument.DrawObject;
                param.params.MySelf.KMLDocument.DrawObject = null;

                delete param.params.MySelf.KMLDocument;
                param.params.MySelf.KMLDocument = null;
            }
            if (response.responseText == "") {
                window.parent.window.Ext.MessageBox.alert('轨迹查询信息提示', '这个时间段没有轨迹数据！');
                return;
            }
            var kmlParse = new skKmlParse();
            kmlParse.AddNeedPlayEvent("gjShowPlayBoard", gjShowPlayBoard);

            param.params.MySelf.KMLDocument = kmlParse.ParseKmlString(kmlParse, response.responseText);
            param.params.MySelf.KMLDocument.Name = "轨迹查询";
            param.params.MySelf.KMLDocument.DrawObject = new MapDrawByWebGis();

            delete kmlParse;
            kmlParse = null;
        }
        else {
            Ext.MessageBox.alert('轨迹查询信息提示', '与服务器端交互出错，请重试看看！');
        }
    };




    BeginSelect = function (beginTime, endTime, delayTime, markPoint) {

        if (kmlPlayer != null) {
            kmlPlayer.Cancel();
            btnBF.setIconClass('GJ_BF');
        }

        Ext.Ajax.request(
        {
            url: "/Path/GetOnePath",
            callback: gjSelectCallBack,
            method: "POST",
            timeout: 60000,
            params:
            {
                begin: beginTime,
                end: endTime,
                gpscode: ServerCodeId,
                delaytime: delayTime,
                ismarker : markPoint,
                isHighSpeed: ServerIsHighSpeed,
                imgUrl: ServerImgUrl,
                MySelf: self
            }
        }
        );
    }



    var viewport = new Ext.Viewport(
   {
       layout: 'fit',
       border: true,
       margins: '0 0 0 0',
       autoScroll: false,
       items: [playBox]
   }
   );




    //页面出错显示函数
    var firebugWarning = function () {
        var cp = new Ext.state.CookieProvider();

        if (window.console && window.console.firebug && !cp.get('hideFBWarning')) {
            var tpl = new Ext.Template(
         '<div id="fb" style="border: 1px solid #FF0000; background-color:#FFAAAA; display:none; padding:15px; color:#000000;"><b>Warning: </b> Firebug is known to cause performance issues with Ext JS. <a href="#" id="hideWarning">[ Hide ]</a></div>'
         );
            var newEl = tpl.insertFirst('all-demos');

            Ext.fly('hideWarning').on('click', function () {
                Ext.fly(newEl).slideOut('t',
            {
                remove: true
            }
            );
                cp.set('hideFBWarning', true);
                doResize();
            }
         );
            Ext.fly(newEl).slideIn();
            doResize();
        }
    }
   ;

    var hideMask = function () {
        Ext.get('loading').remove();
        Ext.fly('loading-mask').fadeOut(
      {
          remove: true,
          callback: firebugWarning
      }
      );

    }
   ;

    hideMask.defer(50);

}
);

