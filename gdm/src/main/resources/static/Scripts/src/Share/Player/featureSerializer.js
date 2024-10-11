define([
'dojo/_base/array'
], function (array) {
    return {
        serialize: function (points) {
            var ret = '';
            for (var i = 0; i < points.length; ++i) {
                if (i == 0) {
                    ret += points[i][0] + ',' + points[i][1];
                } else {
                    ret += ',' + points[i][0] + ',' + points[i][1];
                }
            }
            return ret;
        },
        deserialize: function (feature) {
            var points = [];
            if (!feature) return points;
            var pointArr = feature.split(',');
            for (var i = 0; i < pointArr.length; i++) {
                points.push([parseFloat(pointArr[i]), parseFloat(pointArr[i + 1])]);
                i++;
            }
            return points;
        }
    }
});