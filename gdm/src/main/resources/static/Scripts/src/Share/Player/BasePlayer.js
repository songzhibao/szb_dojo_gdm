define([
	'dojo/_base/declare',
	'dojo/_base/lang',
	'dojo/date',
	'dojo/Evented',
	'dojo/_base/array',
	'dojox/collections/Dictionary'], function (declare, lang, dateUtil, Evented, array, Dictionary) {
	    return declare(Evented, {
	        /**
	        * 快照数据字典，以时间为key e.g.
	        * {
	        * 	(timestamp 如1368604278000): [
	        * 		{
	        * 			wl_clxx: 车辆信息数据结构,
	        * 			carGPS: 车辆位置数据结构
	        * 		},{
	        * 			wl_clxx: 车辆信息数据结构,
	        * 			carGPS: 车辆位置数据结构
	        * 		}
	        * 	]
	        * }
	        * @type {[Dictionary]}
	        */
	        _snapshots: null,
	        _timerId: null,
	        reverse: false,
	        speedRatio: 1,
	        inited: false,
	        currentTime: null,
	        lastTime: null,
	        /**
	        * 警情播放每帧之间真实时间间隔秒数
	        * @type {Number}
	        */
	        interval: 10,
	        isPlaying: false,
	        paused: false,
	        stopped: true,
	        metaData: null,
	        /**
	        * 只读取一次，读取metaData后，loadRemoteFragment从服务器读取所有数据（如车辆历史轨迹需要绘制轨迹的）
	        * @type {Boolean}
	        */
	        loadOnce: false,
	        /**
	        * 每次读取时间相对于interval的倍数，也就是播放一个片段的真实时间（_getLoadSpan）
	        * @type {Number}
	        */
	        loadIntervalRatio: 20,
	        constructor: function (args) {
	            declare.safeMixin(this, args || {});
	            this._snapshots = new Dictionary();
	        },
	        /**
	        * 需要继承的方法，获取元数据，里面至少需要有minTime和maxTime 2个字段
	        * @return {[type]} [description]
	        */
	        getMetaData: function () {
	            throw 'Need to be derived';
	        },
	        /**
	        * 需要继承的方法，获取远端快照数据
	        * @param  {[type]} startTime [description]
	        * @param  {[type]} endTime   [description]
	        * @param  {[type]} interval  [description]
	        * @return {[type]}           [description]
	        */
	        getRemoteFragment: function (startTime, endTime, interval) {
	            throw 'Need to be derived';
	        },
	        getLocalFragment: function (startTime, endTime, interval) {
	            var fragment = [];
	            var it = this._snapshots.getIterator();
	            while (!it.atEnd()) {
	                var item = it.get();
	                if (item.key >= startTime && item.key <= endTime) {
	                    fragment.push(this._getSnapshot(item.key));
	                }
	            }
	            return fragment;
	        },
	        init: function () {
	            var deferred = $.Deferred();
	            this.emit('init');
	            this.getMetaData().done(lang.hitch(this, function (metaData) {
	                this.metaData = metaData;
	                if (this.loadOnce) {
	                    this._loadRemoteFragment(metaData.minTime, metaData.maxTime, this.interval)
					.done(lang.hitch(this, function () {
					    this.inited = true;
					    this.emit('inited');
					    this.setTime(metaData.minTime);
					    deferred.resolve();
					}));
	                } else {
	                    this.inited = true;
	                    this.emit('inited');
	                    this.setTime(metaData.minTime);
	                    deferred.resolve();
	                }
	            })).fail(lang.hitch(this, function () {
	                deferred.reject();
	            }));
	            return deferred.promise();
	        },
	        _getSnapshot: function (time) {
	            var intervalSpan = this.interval * 1000;
	            var times = Math.floor((time - this.getMinTime()) / intervalSpan);
	            realTime = new Date(Date.parse(this.getMinTime()) + times * intervalSpan);
	            var stamp = Date.parse(realTime);
	            var data = this._snapshots.item(stamp);
	            return data ? {
	                time: time,
	                data: data
	            } : null;
	        },
	        /**
	        * 所有需要获取片段的操作都应该调用这个方法，以保证读取的数据是对齐的（类似于windows的4K对齐），达到最优性能，不会重复读取。
	        * @param  {[type]} time [description]
	        * @return {[type]}      [description]
	        */
	        _getLoadSpan: function (time) {
	            if (time < this.getMinTime() || time > this.getMaxTime()) {
	                throw 'time could not less than minTime or greater than maxTime';
	            }
	            var span = Date.parse(time) - Date.parse(this.getMinTime());
	            var times = Math.floor(span / (this.interval * this.loadIntervalRatio * 1000));
	            var startTime = dateUtil.add(this.getMinTime(), 'second', times * this.interval * this.loadIntervalRatio);
	            var endTime = dateUtil.add(this.getMinTime(), 'second', (times + 1) * this.interval * this.loadIntervalRatio);


	            endTime = endTime <= this.getMaxTime() ? endTime : this.getMaxTime();
	            return [startTime, endTime];
	        },
	        _getNextLoadSpan: function (time) {
	            var span = this._getLoadSpan(time);
	            var startTime = dateUtil.add(span[0], 'second', this.interval * this.loadIntervalRatio);
	            var endTime = dateUtil.add(span[1], 'second', this.interval * this.loadIntervalRatio);
	            if (startTime > this.getMaxTime()) {
	                return null;
	            } else {
	                return [startTime, endTime <= this.getMaxTime() ? endTime : this.getMaxTime()];
	            }
	        },
	        _preloadFragment: function () {
	            var span = this._getLoadSpan(this.currentTime);
	            if (span !== null) {
	                this._loadRemoteFragment(span[0], span[1], this.interval);
	            }
	            span = this._getNextLoadSpan(this.currentTime);
	            if (span !== null) {
	                this._loadRemoteFragment(span[0], span[1], this.interval);
	            }
	        },
	        _loadRemoteFragment: function (startTime, endTime, interval) {
	            var me = this;
	            if (this._testFragment(startTime, endTime, interval)) {
	                var deferred = $.Deferred();
	                deferred.resolve();
	                return deferred.promise();
	            } else {
	                return this.getRemoteFragment(startTime, endTime, interval)
					.done(function (fragment) {
					    array.forEach(fragment, function (snapshot) {
					        var time = new Date(parseInt(snapshot.time, 10));
					        me._addSnapshot(time, snapshot.data);
					    });
					});
	            }
	        },
	        _addSnapshot: function (time, data) {
	            var stamp = Date.parse(time);
	            if (!this._snapshots.containsKey(stamp)) {
	                this._snapshots.add(stamp, data);
	            }
	        },
	        _testFragment: function (startTime, endTime, interval) {
	            var startTimeTicks = Date.parse(startTime);
	            var endTimeTicks = Date.parse(endTime);
	            for (var i = startTimeTicks; i <= endTimeTicks; i += interval * 1000) {
	                if (!this._snapshots.item(i)) {
	                    return false;
	                }
	            }
	            return true;
	        },
	        _playCallback: function () {
	            var time = dateUtil.add(this.currentTime, 'second', this.reverse ? -this.interval : this.interval);
	            if (time <= this.getMaxTime()) {
	                this.setTime(time);
	            } else if (this.currentTime <= this.getMaxTime() && time > this.getMaxTime()) {
	                //边界处理，显示最后一帧，不管是否是interval的整数值
	                this.setTime(this.getMaxTime());
	            } else {
	                this.pause();
	            }
	            // } else {
	            // 	this.pause();
	            // 	var span = this._getLoadSpan(this.currentTime);
	            // 	this._loadRemoteFragment(span[0], span[1], this.interval).done(lang.hitch(this, function() {
	            // 		this.play();
	            // 	}));
	            // }
	        },
	        play: function () {
	            if (!this.isPlaying) {
	                this.paused = false;
	                this.stopped = false;
	                if (this.currentTime - this.getMaxTime() >= 0) {
	                    this.currentTime = new Date(this.getMinTime());
	                }
	                this._timerId = setInterval(lang.hitch(this, this._playCallback), 1000);
	                this.isPlaying = true;
	                this.emit('play');
	            }
	        },
	        pause: function () {
	            if (this.isPlaying) {
	                if (this._timerId) {
	                    clearInterval(this._timerId);
	                }
	                this.isPlaying = false;
	                this.paused = true;
	                this.stopped = false;
	                this.emit('pause');
	            }
	        },
	        stop: function () {
	            this.pause();
	            this.stopped = true;
	            this.setTime(this.getMinTime());
	            this.emit('stop');
	        },
	        setTime: function (time) {
	            if (time < this.getMinTime()) {
	                time = this.getMinTime();
	            } else if (time > this.getMaxTime()) {
	                time = this.getMaxTime();
	            }
	            if (!this.currentTime || this.currentTime - time !== 0) {
	                this.lastTime = this.currentTime;
	                this.currentTime = new Date(time);
	                if (this.currentTime - this.getMaxTime() === 0) {
	                    this.pause();
	                }
	                this._preloadFragment();
	                this.emit('timechanged', {
	                    time: this.currentTime,
	                    lastTime: this.lastTime
	                });
	                var snapshot = this._getSnapshot(this.currentTime);
	                if (snapshot) {
	                    this.emit('show', {
	                        snapshot: snapshot
	                    });
	                } else {
	                    var span = this._getLoadSpan(this.currentTime);
	                    if (this.isPlaying) {
	                        this.stop();
	                        //this._loadRemoteFragment(span[0], span[1], this.interval).done(lang.hitch(this, function () {
	                        //    snapshot = this._getSnapshot(this.currentTime);
	                        //    if (snapshot) {
	                        //        this.emit('show', {
	                        //            snapshot: snapshot
	                        //        });
	                        //        this.play();
	                        //    }
	                        //}));
	                    } else {
	                        this._loadRemoteFragment(span[0], span[1], this.interval).done(lang.hitch(this, function () {
	                            snapshot = this._getSnapshot(this.currentTime);
	                            if (snapshot) {
	                                this.emit('show', {
	                                    snapshot: snapshot
	                                });
	                            }
	                        }));
	                    }
	                }
	            }
	        },
	        addTime: function (seconds) {
	            var time = dateUtil.add(this.currentTime, 'second', seconds);
	        },
	        getMinTime: function () {
	            return this.metaData.minTime;
	        },
	        getMaxTime: function () {
	            return this.metaData.maxTime;
	        },
	        getTotalTime: function () {
	            return this.getMaxTime() - this.getMinTime();
	        },
	        setInterval: function (interval) {
	            if (this.interval != interval) {
	                this.interval = interval;
	                this._preloadFragment();
	                this.emit('intervalchanged', {
	                    interval: this.interval
	                });
	            }
	        },
	        getInterval: function () {
	            return this.interval;
	        },
	        setSpeedRatio: function (speedRatio) {
	            if (this.isPlaying && this._timerId) {
	                clearInterval(this._timerId);
	                this._timerId = setInterval(lang.hitch(this, this._playCallback), 1000 / speedRatio);
	            }
	            this.speedRatio = speedRatio;
	        },
	        setReverse: function (reverse) {
	            this.reverse = reverse;
	        },
	        destroy: function () {
	            this.pause();
	        }
	    });
	});