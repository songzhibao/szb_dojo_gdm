/* File Created: 九月 24, 2013 */
define([
'dojo/_base/declare',
'dojo/_base/array',
'dojo/_base/lang',
'dijit/layout/ContentPane',
'dijit/layout/BorderContainer',
"dojox/collections/Dictionary",
'./InfoPopup'], function (declare, array, lang, ContentPane, BorderContainer, Dictionary, InfoPopup) {
    return declare([InfoPopup], {
        baseClass: null,
        data: null,
        nameKey: 'name',
        valueKey: 'value',

        type: null,
        resuouceId: null,

        //format:{key:this.type + '_' + this.resuouceId + '_' + fieldname,value:fieldname}
        dic: new Dictionary(),

        constructor: function () {
            this.baseClass += ' tableInfoPopup';
        },

        update: function (data) {

            this.data = data;
            if (this.dic) {

                array.forEach(data, lang.hitch(this, function (row) {

                    var name = row[this.nameKey];
                    var value = row[this.valueKey]
                    if (name) {



                        var td = this.dic.item(name);
                        if (value) {
                            $("#" + td).html(value);
                        }
                    }
                }));
            }
        },

        postCreate: function () {
            this.inherited(arguments);
            var table = $('<table/>');
            if (this.data != null) {
                array.forEach(this.data, lang.hitch(this, function (row) {
                    var tr = $('<tr/>');
                    var name = row[this.nameKey] || '无';
                    var value = row[this.valueKey] || '无';
                    var tdName = $('<td class=name><b>' + name + '：</b></td>');

                    //原来的设计弹出框不支持table中的项值更新，没有ID，无法直接或间接获取，
                    //现为每一个值td添加id属性，并且与字段名称组成字典保存，
                    //这样更新时根据字段名称，找到对应的ID，即可通过JQuery获取到对应的td更新内容
                    //修改信息：黎波，2015-07-03
                    var id = this.type + '_' + this.resuouceId + '_' + name;
                    var tdValue = $('<td id=' + id + ' class=value>' + value + '</td>');

                    this.dic.add(name, id);

                    tr.append(tdName);
                    tr.append(tdValue);
                    table.append(tr);
                }));
            }
            $(this.containerNode).append(table);
        }
    });
});