/**
 * 根据不同的平台来区分应用原生分享或微信/wap浏览器自带分享
 * share-data:              分享data
 * share-type：             分享类型
 */

angular.module('app.directives').directive('cmShare', ["shareService", "modals", function (shareService, modals) {
    return {
        restrict: 'A',
        link: function ($scope, $el, $attrs) {
            // 隐藏按钮
            $el.css({'visibility': 'hidden', 'display': 'none'});
            var shareType = $attrs.shareType;

            if (window.CMShare && APP_CONFIG.wechat_installed || shareType === 'app') {
                $scope.$watch($attrs.shareAble, function () {
                    if($scope.$eval($attrs.shareAble) === false){
                        // 隐藏按钮
                        $el.css({'visibility': 'hidden', 'display': 'none'});
                    }else {
                        //显示分享按钮
                        $el.parents("body").addClass("more-btns-right");
                        $el.css({'visibility': 'visible', 'display': 'block'});
                    }
                });
                // 添加click事件
                $el.on('click', function () {
                    var shareData = $scope.$eval($attrs.shareData);
                    // 需分享的数据及类型
                    var config = {
                        params: {
                            shareType: shareType,
                            shareData: shareData
                        }
                    }
                    modals.share.open(config);
                });
            }
        }
    };
}]);
