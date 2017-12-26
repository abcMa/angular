/**
 * 提供一个淡出的关闭效果
 * 一般用来回避无动画弹层关闭时的突兀感和延迟
 *
 * 用法: <ion-modal-view fade-out></ion-modal-view>
 */
angular.module('app.directives').directive('fadeOut', function (
    cartService
) {
    return {
        restrict: 'A',
        link: function ($scope, $el, $attrs) {
            $scope.$on("$destroy", function () {
                $el.hide();
            });
        }
    };
});
