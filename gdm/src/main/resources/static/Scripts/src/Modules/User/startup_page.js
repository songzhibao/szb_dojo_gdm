/**
* Created with JetBrains WebStorm.
* User: chengbin
* Date: 13-3-25
* To change this template use File | Settings | File Templates.
*/
require([
    "egis/Modules/User/PageLoader"
], function (PageLoader) {
    //console.debug("----------app start----------");
    new PageLoader().load();
});


