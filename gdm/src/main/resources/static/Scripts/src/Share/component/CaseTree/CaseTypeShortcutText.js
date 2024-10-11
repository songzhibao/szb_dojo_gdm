define([
'dojo/_base/declare',
'dojo/_base/array',
'dojo/_base/lang',
'dojo/json',
'dojo/date',
'egis/Share/component/BaseWidget/ShortcutText',
'egis/appEnv',
"egis/cache"
], function (declare, array, lang, JSON, dateUtil, ShortcutText, appEnv, cache) {

    return declare('egis/Share/component/CaseTree/CaseTypeShortcutText', [ShortcutText], {

        baseClass: 'shortcut-text casetype-shortcut-text',

        textBox: null,

        data: null,

        caseTypeTreeStore: null,

        postCreate: function () {
            this.inherited(arguments);
            this.caseTypeTreeStore = cache.newCaseTypeTreeStore();
        },

        _setTextBoxAttr: function (textBox) {
            this.textBox = textBox;
             //优先使用this.data，否则使用appConfig中定义的数据，最后使用默认数据
             var data = this.data || appEnv.appConfig.caseTypeTextBoxShortcutData || this.defaultData;
             if (data) {
                 data = lang.clone(data);
                 array.forEach(data, lang.hitch(this, function (item) {
                     var newValue = [];
                     array.forEach(item.value, lang.hitch(this, function (id) {
                         var result = this.caseTypeTreeStore.query({
                             id: id
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