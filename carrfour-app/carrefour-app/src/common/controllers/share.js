/**
 * 分享方式
 */
angular.module('app.controllers').controller('shareCtrl', function(
    $scope, $params, modals, shareService, $translate
) {
    var ctrl = this;

    $params = _.defaults({}, $params, {
        shareType: null,
        shareData: null
    });

    angular.extend(ctrl, {
        // 分享类型
        shareType: $params.shareType,
        // 分享数据
        shareData: $params.shareData,

        wechat_installed: APP_CONFIG.wechat_installed,

        QQ_installed: APP_CONFIG.QQ_installed,

        platform: {
            wechat: shareService.SHARE_PLATFORM.WECHAT,
            moments: shareService.SHARE_PLATFORM.WECHAT_MOMENTS,
            qq: shareService.SHARE_PLATFORM.QQ,
            qzone: shareService.SHARE_PLATFORM.QQ_ZONE,
            weibo: shareService.SHARE_PLATFORM.WEIBO
        },
        // 分享
        share: function(platform) {
            shareService.shareByType(ctrl.shareType, ctrl.shareData, platform);
        }
    });

});
