/**
 * 滚动时隐藏导航栏
 */
angular.module('app.directives')

.directive('cmHeaderShrink', ["$ionicScrollDelegate", function($ionicScrollDelegate) {

    var shrink = function(header, content, amt) {
        var fadeAmt = 1 - amt / 44;
        ionic.requestAnimationFrame(function() {
            header.style[ionic.CSS.TRANSFORM] = 'translate3d(0, -' + amt + 'px, 0)';
            for (var i = 0, j = header.children.length; i < j; i++) {
                header.children[i].style.opacity = fadeAmt;
            }
        });
    };

    return {
        restrict: 'A',
        scope: false,
        link: function($scope, $element, $attr) {
            var starty = $scope.$eval($attr.cmHeaderShrink) || 0;
            var shrinkAmt;

            var header = $element.parent()[0].querySelector('.bar-header');
            var headerHeight = + $(header).css('height').slice(0, -2);

            var lastShrinkAmt = 0;

            var animationOnce = $element.hasClass('overflow-scroll');

            if (animationOnce) {
                $(header).css('transition', '0.3s ease-in-out');
                $element.css({
                    top: 0,
                    paddingTop: headerHeight + 'px'
                });
            } else {
                $element.css('overflow', 'visible');
            }

            $element.on('scroll', function(e) {
                var scrollTop = 0;
                var event = e.originalEvent;
                if (event.detail && event.detail.scrollTop) {
                    scrollTop = event.detail.scrollTop;
                } else {
                    scrollTop = event.target.scrollTop;
                }

                if (scrollTop > starty) {
                    // Start shrinking
                    shrinkAmt = headerHeight - Math.max(0, (starty + headerHeight) - scrollTop);
                    shrinkAmt = Math.min(44, shrinkAmt);
                } else {
                    shrinkAmt = 0;
                }

                if (shrinkAmt != lastShrinkAmt) {
                    lastShrinkAmt = shrinkAmt;
                    if (animationOnce) {
                        if (shrinkAmt == headerHeight) {
                            header.style[ionic.CSS.TRANSFORM] = 'translate3d(0, -44px, 0)';
                        } else {
                            header.style[ionic.CSS.TRANSFORM] = 'translate3d(0, 0, 0)';
                        }
                    } else {
                        shrink(header, $element[0], shrinkAmt);
                        // $element.css('top', (headerHeight - shrinkAmt) + 'px');
                    }
                }
            });
        }
    };
}]);
