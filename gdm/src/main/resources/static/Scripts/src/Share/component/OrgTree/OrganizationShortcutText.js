define([
'dojo/_base/declare',
'dojo/_base/array',
'dojo/_base/lang',
'dojo/json',
'dojo/date',
'dojo/request/xhr',
'egis/Share/component/BaseWidget/ShortcutText',
'egis/appEnv',
'egis/cache'
], function (declare, array, lang, JSON, dateUtil, xhr, ShortcutText, appEnv, cache) {

    return declare([ShortcutText], {

        baseClass: 'shortcut-text datetimeinfo-shortcut-text',

        textBox: null,

        data: null,

        orgTreeStore: null,

        postCreate: function () {
            this.inherited(arguments);
            this.orgTreeStore = cache.newOrgTreeStore();
        },

        _setTextBoxAttr: function (textBox) {
            this.textBox = textBox;
            //优先使用this.data，否则使用appConfig中定义的数据，最后使用默认数据
            var data = this.data || appEnv.appConfig.organizationTextBoxShortcutData || this.defaultData;
            if (data) {
                data = lang.clone(data);
                array.forEach(data, lang.hitch(this, function (item) {
                    var newValue = [];
                    array.forEach(item.value, lang.hitch(this, function (id) {
                        var result = this.orgTreeStore.query({
                            OrgId: id
                        });
                        if (result.length > 0) {
                            newValue.push(result[0]);
                        }
                    }));
                    item.value = newValue;
                }));
                this.set('data', data);
            }
        },

        onItemClick: function (item) {
            if (this.textBox) {
                this.textBox.set('value', item.value);
            }
        }

    });

});