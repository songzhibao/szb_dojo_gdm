define([
'dojo/_base/declare',
'dojo/_base/lang',
'dojo/date',
'dojo/Evented',
'dojo/_base/array',
'dojox/collections/SortedList',
'dojo/store/Memory',
'egis/Share/Player/BasePlayer',
'egis/Share/Player/featureSerializer',
'ol'
], function (declare, lang, dateUtil, Evented, array, SortedList, Memory, BasePlayer, featureSerializer, ol) {
    return declare([BasePlayer, Evented], {
        planInfo: null,
        speed: 20,
        loadOnce: true,
        interval: 1,
        constructor: function (args) {
            this.inherited(arguments);
        },
        _getPathLength: function (lineString) {
            var length = 0;

            // var wgs84Sphere= new ol.Sphere(6378137);

            var vertices = lineString.getCoordinates();
            for (var i = 0; i < vertices.length - 1; ++i) {
                var start = vertices[i];
                var end = vertices[i + 1];
                //length += wgs84Sphere.haversineDistance(start,end);
                length += ol.sphere.getDistance(start,end);
            }
            return length;
        },

        //计算lineString中按比例划分的点坐标
        //OpenLayers.Geometry.LineString
        //0 <= ratio <= 1, 线段中点距离起始点占总长的百分比
        _getInterpolationPoint: function (lineString, ratio, totalLength) {

            //var wgs84Sphere = new ol.Sphere(6378137);

            var vertices = lineString.getCoordinates();
            if (!totalLength) {
                totalLength = this._getPathLength(lineString);
            }
            var dstVertice = null;
            if (vertices.length == 1) {
                return vertices[0];
            } else {
                var dstLength = totalLength * ratio;
                var currLength = 0;
                for (var i = 0; i < vertices.length; ++i) {
                    //如果最后还没找到该点，那么直接返回终点
                    if (i == vertices.length - 1) {
                        dstVertice = new ol.geom.Point([parseFloat(vertices[i][0]), parseFloat(vertices[i][1])]
                        );
                        break;
                    }
                    var start = vertices[i];
                    var end = vertices[i + 1];
                    //var length = wgs84Sphere.haversineDistance(start, end);
                    var length = ol.sphere.getDistance(start,end);
                    if (currLength + length < dstLength) {
                        currLength += length;
                        continue;
                    } else {
                        //目标点在当前线段中，进行插值
                        var l = dstLength - currLength;
                        dstVertice = new ol.geom.Point([
                            parseFloat(start[0]) + (parseFloat(end[0]) - parseFloat(start[0])) * l / length,
                            parseFloat(start[1]) + (parseFloat(end[1]) - parseFloat(start[1])) * l / length]
                        );
                        break;
                    }
                }
            }
            return dstVertice;
        },

        init: function () {
            var playIndexList = this.playIndexList = [];
            var planItems = this.planInfo.planItems;
            array.forEach(planItems, lang.hitch(this, function (item) {
                //item.playIndex = 0;
                if (item.ItemActions && item.ItemActions.length > 0) {
                    item.playIndex = item.ItemActions[0].PlayIndex;
                }
                if (playIndexList.indexOf(item.playIndex) < 0) {
                    playIndexList.push(item.playIndex);
                }
                //反序列化feature
                var points = featureSerializer.deserialize(item.Feature);
                var geoPoints = [];
                var linePoints = [];
                array.forEach(points, function (point) {
                    geoPoints.push(new ol.geom.Point([point[0], point[1]]));
                    linePoints.push([point[0], point[1]]);
                });
                item.points = geoPoints;
                if (item.points.length > 0) {
                    item.lineString = new ol.geom.LineString(linePoints);
                    item.pathLength = this._getPathLength(item.lineString);
                }
            }));
            playIndexList.sort();
            var store = this.store = new Memory({
                data: planItems,
                idProperty: 'PlanItemId'
            });
            var totalPlayTime = 0;
            array.forEach(playIndexList, lang.hitch(this, function (playIndex) {
                var result = store.query({
                    playIndex: playIndex
                });
                totalPlayTime += this._getPlayTime(result);
            }));
            this.minTime = new Date(0);
            this.maxTime = new Date(totalPlayTime * 1000);
            return this.inherited(arguments);
        },

        /**
        * @return {[type]} [description]
        */
        getMetaData: function () {
            var deferred = $.Deferred();
            deferred.resolve({
                minTime: this.minTime,
                maxTime: this.maxTime
            });
            return deferred.promise();
        },

        _getPlayTime: function (planItems) {
            var max = -1;
            array.forEach(planItems, lang.hitch(this, function (item) {
                if (item.lineString) {
                    var length = this._getPathLength(item.lineString);
                    if (length > max) {
                        max = length;
                    }
                }
            }));
            if (max >= 0) {
                return max / this.speed;
            }
            return planItems.length > 0 ? 1 : 0;
        },

        setSpeed: function (speed) {
            this.speed = parseFloat(speed);
        },

        getRemoteFragment: function (startTime, endTime, interval) {
            var deferred = $.Deferred();
            var data = [];
            var currTime = 0;
            var allResult = null;
            var allPlayTime = 0;

            array.forEach(this.playIndexList, lang.hitch(this, function (playIndex) {
                var result = this.store.query({
                    playIndex: playIndex
                });
                if (playIndex == 0)
                {
                    allResult = result;
                    allPlayTime = this._getPlayTime(result);
                    return;
                }
                var startTime = currTime;
                var totalPlayTime = this._getPlayTime(result);
                for (; currTime < startTime + totalPlayTime; ++currTime) {
                    var dataItem = {
                        time: currTime * 1000,
                        data: []
                    };
                    array.forEach(result, lang.hitch(this, function (planItem) {
                        if (planItem.pathLength) {
                            var point = this._getInterpolationPoint(planItem.lineString, this.speed * (currTime - startTime) / planItem.pathLength, planItem.pathLength);
                            dataItem.data.push({
                                planItem: planItem,
                                FirstShow: currTime == startTime,
                                point: point
                            });
                        }
                        else if (currTime == startTime)
                        {
                            dataItem.data.push({
                                planItem: planItem,
                                FirstShow : true,
                                point: null
                            });
                        }
                    }));
                    //插入全场播放帧
                    if (currTime <= allPlayTime) {
                        array.forEach(allResult, lang.hitch(this, function (planItem) {
                            if (planItem.pathLength) {
                                var point = this._getInterpolationPoint(planItem.lineString, this.speed * (currTime) / planItem.pathLength, planItem.pathLength);
                                dataItem.data.push({
                                    planItem: planItem,
                                    FirstShow: currTime == 0,
                                    point: point
                                });
                            } else if (currTime == 0) {
                                dataItem.data.push({
                                    planItem: planItem,
                                    FirstShow: true,
                                    point: null
                                });
                            }
                        }));
                    }
                    data.push(dataItem);
                }
            }));

            if (currTime < allPlayTime)
            {
                for (; currTime < allPlayTime; ++currTime) {
                    var dataItem = {
                        time: currTime * 1000,
                        data: []
                    };

                    array.forEach(allResult, lang.hitch(this, function (planItem) {
                        if (planItem.pathLength) {
                            var point = this._getInterpolationPoint(planItem.lineString, this.speed * (currTime) / planItem.pathLength, planItem.pathLength);
                            dataItem.data.push({
                                planItem: planItem,
                                FirstShow: currTime == 0,
                                point: point
                            });
                        } else if (currTime == 0) {
                            dataItem.data.push({
                                planItem: planItem,
                                FirstShow: true,
                                point: null
                            });
                        }
                    }));
                    data.push(dataItem);
                }
            }

            deferred.resolve(data);
            return deferred.promise();
        }
    });
});