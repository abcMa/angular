/**
 * 列表项向父级滚动
 */

angular.module('app.directives').directive('cmAutoScroll', ["utils", "$timeout", function (
    utils, $timeout
) {
    return {
        restrict: 'A',
        link: function ($scope, $el, $attrs) {
            $scope.$watch($attrs.cmAutoScroll, function () {
                if (!$attrs.scrollerHandle) {
                    return;
                }
                var isActive = $scope.$eval($attrs.cmAutoScroll);
                if (isActive) {
                    var el = $el[0];
                    $timeout(function () {
                        utils.getScrollDelegateByName($attrs.scrollerHandle).scrollTo(0, el.offsetTop, true);
                    });
                }
            });
        }
    };
}]);
