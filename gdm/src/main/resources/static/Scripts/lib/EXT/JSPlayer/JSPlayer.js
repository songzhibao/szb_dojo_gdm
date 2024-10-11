/*!
* JS Player 
* Copyright(c) 2006-2010 DS Inc.
* created by song
* http://www.dscomm.com.cn
*/


function JSPlayer(playList,kmlDocument) {

    /** 加入监听器支持 */
    ListenerSupport.apply(this);
    var me = this;

    /** 播放数据源 */
    this.PlayList = playList;
    this.KMLDocument = kmlDocument;

    /** 播放器事件 */
    this.events = new Object();
    this.playAgain = false;
    this.speed = 500;
    this.currentStep = 0;
    this.lastTimeId = null;
    this.IsPlayNow = false;

    /** 构造方法 */
    {
        this.addListener(PlayerEvents.PlayStep, this);
        this.addListener(PlayerEvents.PlayAgain, this);
        this.addListener(PlayerEvents.PlayBegin, this);
        this.addListener(PlayerEvents.PlayStop, this);
        this.addListener(PlayerEvents.PlayPause, this);

        this.events[PlayerEvents.PlayStep] = new Object();
        this.events[PlayerEvents.PlayAgain] = new Object();
        this.events[PlayerEvents.PlayBegin] = new Object();
        this.events[PlayerEvents.PlayStop] = new Object();
        this.events[PlayerEvents.PlayPause] = new Object();
    }

    this.propertyChange = function(param, newValue) {

        var p = param;
        if (param == PlayerEvents.PlayStep)
        {
            me.fireEvents(param);
        }
        else if (param == PlayerEvents.PlayStep)
        {
            me.fireEvents(param);
        }
        else if (param == PlayerEvents.PlayAgain)
        {
            me.fireEvents(param);
        }
        else if (param == PlayerEvents.PlayBegin)
        {
            me.fireEvents(param);
        }
        else if (param == PlayerEvents.PlayPause)
        {
            me.IsPlayNow = false;
            me.fireEvents(param);
        }
        else if (param == PlayerEvents.PlayStop)
        {
            me.currentStep = 0;
            me.IsPlayNow = false;
            me.fireEvents(param);
        }
    };

    this.fireEvents = function(param) {
        //响应事件
        var someEvents = me.events[param];
        if (someEvents != null)
        {
            for (eventName in someEvents)
            {
                someEvents[eventName](me, param);
            }
        }
    };

    this.runPlay = function() {
        if (me.currentStep >= me.PlayList.length)
        {
            if (!me.playAgain)
            {
                me.notifyListeners(PlayerEvents.PlayStop, me.currentStep);
                return;
            }
            else
            {
                me.currentStep = 0;
                me.notifyListeners(PlayerEvents.PlayBegin, me);
            }
        }

        var stepParam = me.PlayList[me.currentStep];
        me.notifyListeners(PlayerEvents.PlayStep, stepParam);
        me.currentStep++;
        me.lastTimeId = window.setTimeout(me.runPlay, me.speed);
    };

    //增加播放开始事件
    this.AddPlayBeginEvent = function(fnName, fn) {
        var events = me.events[PlayerEvents.PlayBegin];
        if (events == null)
        {
            events = new Object();
        }
        events[fnName] = fn;
    };

    //增加播放帧事件
    this.AddPlayStepEvent = function(fnName, fn) {
        var events = me.events[PlayerEvents.PlayStep];
        if (events == null)
        {
            events = new Object();
        }
        events[fnName] = fn;
    };

    //增加停止事件
    this.AddPlayStopEvent = function(fnName, fn) {
        var events = me.events[PlayerEvents.PlayStop];
        if (events == null)
        {
            events = new Object();
        }
        events[fnName] = fn;
    };

    /** 加快速度 */
    this.Speeder = function() {
        if (me.speed <= 100)
        {
            me.speed = me.speed - 20;
        }
        else
        {
            me.speed = me.speed - 100;
        }
        if (me.speed <= 20)
        {
            me.speed = 20;
        }
    };

    this.Slower = function() {
        if (me.speed < 100)
        {
            me.speed = 100;
        }
        else
        {
            me.speed = me.speed + 100;
        }
        if (me.speed >= 2000)
        {
            me.speed = 2000;
        }
    };

    /** 设定重播 */
    this.SetPlayAgain = function(bPlayAgain) {
        me.playAgain = bPlayAgain;
    };
    /** 获取重播 */
    this.GetPlayAgain = function() {
        return me.playAgain;
    };

    /** 开始播放 */
    this.Play = function() {
        if (me.currentStep == 0)
        {
            me.notifyListeners(PlayerEvents.PlayBegin, me);
        }
        me.runPlay();
        me.IsPlayNow = true;
    };
    /** 暂停播放 */
    this.Stop = function() {
        if (me.lastTimeId != null)
        {
            window.clearTimeout(me.lastTimeId);
        }
        me.notifyListeners(PlayerEvents.PlayPause, me);
    };
    
    this.Cancel = function () {
        if (me.lastTimeId != null) {
            window.clearTimeout(me.lastTimeId);
        }
        me.currentStep = 0;
    };

}