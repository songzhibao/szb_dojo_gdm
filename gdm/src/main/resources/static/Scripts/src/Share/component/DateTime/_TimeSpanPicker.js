/* File Created: 十月 10, 2013 */
/* 时间范围组件实现接口 */
define([
"dojo/_base/declare"], function (declare) {
    return declare([], {
        /* 返回数组[startTime, endTime], or null */
        getTimeSpan: function () {
            return null;
        }
    });
});