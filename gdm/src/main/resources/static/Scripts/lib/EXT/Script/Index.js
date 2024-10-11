/*!
* PGIS 1.5
* Copyright(c) 2006-2010 DS Inc.
* created by song
* http://www.dscomm.com.cn
*/

//定义主界面对象
Ext.BLANK_IMAGE_URL = '/Scripts/lib/EXT/resources/images/default/s.gif';
var AddNewGJBF = null;
var RemoveOneGJBF = null;

Ext.onReady(function () {

    Ext.state.Manager.setProvider(new Ext.state.CookieProvider());


    ///////////////////////////////////////////////////////////////
    //多轨迹播放代码
    var createNewGJPanel = function (carCode, carTitle, isHighSpeed, imgUrl) {
        var panelONEGJ = new Ext.Panel({
            title: carTitle,
            id: carCode,
            layout: 'fit',
            html: '<iframe src="/Path/OnePathPlayer?code=' + carCode + '&isHighSpeed=' + isHighSpeed + '&imgUrl=' + imgUrl + '"  id="iframe' + carCode + '" width="100%" height="30px" frameborder="0" scrolling="no"></iframe>'
        });
        return panelONEGJ;
    };

    AddNewGJBF = function (carCode, carTitle, isHighSpeed, imgUrl) {

        var removePanel = Ext.getCmp(carCode);
        if (removePanel != null) {
            Ext.getCmp('panelDRGJ').remove(removePanel);
        }
        Ext.getCmp('panelDRGJ').add(createNewGJPanel(carCode, carTitle, isHighSpeed, imgUrl));

        Ext.getCmp('panelDRGJ').doLayout();
    };


    RemoveOneGJBF = function (carCode) {

        var removeObject = { LayerGroup: "播放轨迹", LayerId: carCode, RemoveType: "ID" };
        window.parent.window.dojo.publish("egis/Map/Remove", removeObject);

        var removePanel = Ext.getCmp(carCode);
        if (removePanel != null) {
            Ext.getCmp('panelDRGJ').remove(removePanel);
        }
        Ext.getCmp('panelDRGJ').doLayout();
    };


    var panelDRGJ = new Ext.Panel({
        //split: true,
        id: 'panelDRGJ',
        title: '',
        region: 'center',
        autoScroll: true,
        defaults: { margins: '0 0 5 0' },
        items: []
    });


    var delayTime = new Ext.form.ComboBox({
        mode: 'local',
        width: 60,
        typeAhead: false,
        triggerAction: 'all',
        value: 30,
        id: 'delayTime',
        store: new Ext.data.ArrayStore({
            id: 0,
            fields: [
                                    'val',
                                    'displayText'
            ],
            data: [[10, '10分钟'], [20, '20分钟'], [30, '30分钟'], [60, '1小时'], [120, '2小时']]
        }),
        valueField: 'val',
        displayField: 'displayText'
    });


    var btnGJCXNBF = {
        xtype: 'button',
        text: '查询',
        id: 'btnGJCXNBF',
        rowspan: 2,
        listeners:
        {
            click: function (self, args) {
                finshCount = 0;
                var beginTime = Ext.get("startdt").dom.value;
                var endTime = Ext.get("enddt").dom.value;
                var delayTime = Ext.getCmp('delayTime').value;
                var markPoint = Ext.getCmp('ckBD').checked;

                if (Ext.isEmpty(Ext.getCmp('startdt').getValue()) || Ext.isEmpty(Ext.getCmp('enddt').getValue())) {
                    Ext.MessageBox.alert('操作提示', '请输入查询时间！ ');
                    return;
                }

                var btnText = self.getText();
                var item;
                var items = Ext.getCmp("panelDRGJ").items;
                if (items == null || items.keys.length == 0) {
                    Ext.MessageBox.alert('操作提示', '请先勾选警力上图，选定一个警力在冒泡信息里点击  历史轨迹 添加到这里的查询对象，支持多个同时查看和播放！');
                    return;
                }
                for (var ii = 0; ii < items.keys.length; ii++) {
                    var panelId = items.keys[ii];
                    var mainFrameDocumnet = window.frames["iframe" + panelId].document;
                    var mainFrame = window.frames["iframe" + panelId];
                    if (mainFrameDocumnet == null) {
                        mainFrameDocumnet = window.frames["iframe" + panelId].contentDocument;
                        mainFrame = window.frames["iframe" + panelId].contentWindow;
                    }

                    if (btnText == "查询") {

                        var removeObject = { LayerGroup: "播放轨迹", RemoveType: "GROUP" };
                        window.parent.window.dojo.publish("egis/Map/Remove", removeObject);

                        mainFrame.BeginSelect(beginTime, endTime, delayTime, markPoint);
                        Ext.getCmp("btnGJCXNBF").setText("...");
                        Ext.getCmp("btnGJCXNBF").disabled = true;
                    }
                    else if (btnText == "播放") {
                        Ext.getCmp("btnGJCXNBF").setText("查询");
                        if (mainFrame.kmlPlayer != null) {
                            mainFrame.BeginPlay();
                        }
                    }
                }
            }
        },
        iconCls: ''
    };

    var finshCount = 0;

    FinshRequst = function () {
        finshCount += 1;
        var items = Ext.getCmp("panelDRGJ").items;
        if (items != null && items.length == finshCount) {
            Ext.getCmp("btnGJCXNBF").setText("播放");
            Ext.getCmp("btnGJCXNBF").disabled = false;
        }
    }

    var GJComditionPanel = new Ext.Panel({
        header: false,
        layout: 'table',
        region: 'north',
        height: 60,
        frame: true,
        border: true,
        layoutConfig: {
            columns: 5
        },
        items: [

                        { xtype: 'displayfield', width: 16, style: 'font-size: 10px;', value: '从：' },
                        {
                            xtype: 'textfield',
                            name: 'startdt',
                            id: 'startdt',
                            allowBlank: false,
                            value : ServerBeginTime,
                            width: 120,
                            cls: 'Wdate',
                            listeners:
                              {
                                  focus: function (self, args) {
                                      new WdatePicker(self.el.dom, '%Y-%M-%D %h:%m', true, 'whyGreen');
                                  },
                                  blur: function (self, args) {

                                  }
                              }
                        }
                     ,
                  { xtype: 'displayfield', style: 'font-size: 10px;', value: '停留' }, delayTime, btnGJCXNBF,

                    { xtype: 'displayfield', width: 16, style: 'font-size: 10px;', value: '到：' },
                    {
                        xtype: 'textfield',
                        name: 'enddt',
                        id: 'enddt',
                        allowBlank: false,
                        value : ServerEndTime,
                        width: 120,
                        cls: 'Wdate',
                        listeners:
                        {
                            focus: function (self, args) {
                                new WdatePicker(self.el.dom, '%Y-%M-%D %h:%m', true, 'whyGreen');
                            },
                            blur: function (self, args) {
                            }
                        }
                    }
                    , { xtype: 'displayfield', style: 'font-size: 10px;', value: '标点' }, { xtype: 'checkbox', id: 'ckBD', checked: true }

        ]
    });

    var panelLSJK = new Ext.Panel({
        split: true,
        id: 'panelLSJK',
        title: '',
        region: 'center',
        autoScroll: true,
        height: 215,
        layout: 'border',
        defaults: { margins: '0 0 5 0' },
        items: [
               GJComditionPanel, panelDRGJ
        ]
    });



    var viewport = new Ext.Viewport(
   {
       layout: 'fit',
       border: true,
       margins: '0 0 0 0',
       autoScroll: false,
       items: [panelLSJK]
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

        AddNewGJBF(ServerCodeId, ServerGpsName, ServerIsHighSpeed, ServerImgUrl);

    }
   ;

    hideMask.defer(50);

}
);

