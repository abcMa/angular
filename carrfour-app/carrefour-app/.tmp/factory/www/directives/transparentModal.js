/**
 * 提供一个透明的弹层背景
 */

angular.module('app')
    .directive('transparentModal', function () {

        return {
            link: function ($scope, $element) {
                $element.css({
                    background: 'none'
                });
                $element.parent().prev().css({
                    background: 'none'
                });
            }
        };

    });
