/**
 * 滚动到元素高度时将元素设置为在视口顶部浮动
 */
angular.module('app.directives')

.directive('cmScrollFixed', ["$document", "$ionicScrollDelegate", "utils", function ($document, $ionicScrollDelegate, utils) {

    return {
        restrict: 'A',
        scope: false,
        link: function ($scope, $element, $attr) {
            var customStyle = $attr.customStyle;

            setTimeout(function () {
                var headerHeight = 0,
                    barHeight = $('.bar-header').css('height');

                if (barHeight) {
                    headerHeight = +barHeight.slice(0, -2);
                }

                var starty = $element.parent().offset().top;

                var scrollPanel = $element.parents('.ionic-scroll').eq(0);
                starty += headerHeight;

                if (ionic.Platform.isIOS() && ionic.Platform.isWebView()) {
                    starty -= 20;
                }
                if (!customStyle) {
                    $element.wrap(document.createElement('div')).css({
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        zIndex: 20,
                        width: '100%'
                    });
                } else {
                    $element.wrap(document.createElement('div')).css({
                        position: 'absolute'
                    });
                }

                var container = $element.parent().css({
                    position: 'relative',
                    height: $element.height()
                });

                var view = $element.parents('ion-view').eq(0);
                if (!view[0] ) {
                    view = $element.parents('ion-modal-view').eq(0);
                }

                var fixed = false;

                scrollPanel.on('scroll', function (e) {

                    // 获取高度
                    starty = utils.getElementRect($element).offsetTop;

                    var scrollTop = 0;
                    var event = e.originalEvent;
                    if (event.detail && event.detail.scrollTop) {
                        scrollTop = event.detail.scrollTop;
                    } else {
                        scrollTop = event.target.scrollTop;
                    }

                    if (!fixed && scrollTop > starty) {
                        if (headerHeight > 45) {
                            $element.css('height', ($element.height() + headerHeight - 45) + 'px');
                            $element.css('padding-top', (headerHeight - 45) + 'px');
                        }
                        $element.appendTo(view);
                        fixed = true;
                        $element.addClass("fixed");
                        // switchStatusBarDefault();
                    }
                    if (fixed && scrollTop <= starty) {
                        if (headerHeight > 45) {
                            $element.css('height', '');
                            $element.css('padding-top', '');
                        }
                        $element.appendTo(container);
                        fixed = false;
                        $element.removeClass("fixed");
                        // switchStatusBarLight();
                    }
                });

                // function switchStatusBarDefault() {
                //     if (window.StatusBar) {
                //         StatusBar.styleDefault();
                //     }
                // }

                // function switchStatusBarLight() {
                //     if (window.StatusBar) {
                //         StatusBar.styleLightContent();
                //     }
                // }

                var scope = $scope.$parent.$parent;
                // scope.$on('$ionicView.beforeEnter', function(event, info) {
                //     if (fixed) {
                //         var deregistration = $scope.$on('$stateChangeSuccess', function(event, info) {
                //             if (info.name == 'tabs.index') {
                //                 switchStatusBarDefault();
                //             }
                //             deregistration();
                //         });
                //     }
                // });

                // scope.$on('$ionicView.beforeLeave', function(event, info) {
                //     if (fixed) {
                //         switchStatusBarLight();
                //     }
                // });
            });

        }
    };
}]);
