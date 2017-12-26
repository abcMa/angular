/**
 * 延迟图片加载，图片进入可视区时才进行加载
 * loadImmediate  <Boolean>  不检测是否在可视范围内直接开始加载，默认 false
 * animation      <Bollean>  是否启用动画效果，默认 true
 */
angular.module('app.directives')

.directive('cmLazyload', ["$document", function ($document, observer, $timeout) {
    // 延迟加载样式类
    var CLASS_LAZY_LOADING = 'lazyload-loading';
    // 延迟加载样式类
    var CLASS_LOADEND_ANIMATION = 'lazyload-loaded';
    // 占位图片
    var SPACER = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAMAAAAoyzS7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAAZQTFRF////AAAAVcLTfgAAAAF0Uk5TAEDm2GYAAAAMSURBVHjaYmAACDAAAAIAAU9tWeEAAAAASUVORK5CYII=';
    // 加载图片
    function loadImage($element, src, animation) {
        var img = $document[0].createElement('img');
        img.onload = function () {
            ionic.requestAnimationFrame(function() {
                $element.removeClass(CLASS_LAZY_LOADING);
            });
            if (animation) {
                ionic.requestAnimationFrame(function() {
                  $element.addClass(CLASS_LOADEND_ANIMATION);
                });
                $timeout(function () {
                    ionic.requestAnimationFrame(function() {
                      $element.removeClass(CLASS_LOADEND_ANIMATION);
                    });
                }, 500);
            }
            $element[0].src = this.src;
        };
        img.src = src;
    }

    return {
        restrict: 'A',
        scope: false,
        link: function ($scope, $element, $attr) {
            var attr = _.defaults({}, $attr, {
                loadImmediate: false,
                animation: true
            });
            var triggered = false;
            var unsubscribe = angular.noop;
            var src;

            function init() {
                ionic.requestAnimationFrame(function() {
                    if (!src) {
                        $element[0].src = SPACER;
                        return;
                    }

                    // 如果图片没改变则不会显示动画和占位符
                    if ($element[0].src != src) {
                        $element[0].src = SPACER;
                    }
                });

                triggered = false;
                // 直接加载?
                if (attr.loadImmediate) {
                    triggered = true;
                    loadImage($element, src, attr.animation);
                } else {
                    // 注册等进入视口
                    unsubscribe = observer.subscribe($element, function () {
                        if (attr.animation) {
                            ionic.requestAnimationFrame(function() {
                              $element.addClass(CLASS_LAZY_LOADING);
                            });
                        }
                        triggered = true;
                        loadImage($element, src, attr.animation);
                    });
                }
            }
            var listener = $scope.$watch($attr.cmLazyload, function (newValue) {
                if (newValue == src) {
                    return;
                }
                // 初次加载或已触发过时
                if (triggered || !src) {
                    src = newValue;
                    init();
                } else {
                    // 已注册但尚未加载
                    src = newValue;
                }
            });
            $scope.$on('$destroy', function () {
                listener();
                unsubscribe();
            });
        }
    };
}]);
