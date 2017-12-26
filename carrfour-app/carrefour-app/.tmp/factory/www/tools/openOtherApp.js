/**
 * 打开第三方app ，安装了的话，直接打开，没有安装的话，去下载
 */
angular.module('app.services').factory('openOtherApp', function () {

    var openOtherApp = null;

    var openOtherAppService = {

        init: function() {
            openOtherApp = window.CMOpenOtherApp;
        },

        open: function() {
            var hadOpen = openOtherApp.Open();
        }
    };

    if(APP_CONFIG.os !== 'weixin'){
        openOtherAppService.init();
    }
    return openOtherAppService;
});
