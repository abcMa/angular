/**
 * 设置订单列表页商品滑动容器宽度
 */

angular.module('app')
    .directive('cmAdjustParentWidth', ["$timeout", function ($timeout) {
        return {
            restrict: 'A',
            scope: false,
            link: function($scope, $el, $attrs) {
                if ($scope.$last === true) {
                    $timeout(function () {
                        var width = $el.width(),
                            siblings = $el.siblings();
                        for (var i = 0; i < siblings.length; i++) {
                            width += $(siblings[i]).width();
                        }
                        $el.parent().css('width', width + 'px');
                    });
                }
            }
        };
    }])
;
