/**
 * 选项卡头部导航组件
 */
(function() {
    var componentId = 0;
    var components = {};

    angular.module('app')
        .directive('cmDynamicTabs', ["$rootScope", "$ionicScrollDelegate", "utils", "$timeout", function($rootScope, $ionicScrollDelegate, utils, $timeout) {

            return {
                restrict: 'E',
                template:
                '<div class="dynamic-tabs-scroll">' +
                    '<div class="" ng-transclude></div>' +
                '</div>',
                scope: false,
                transclude: true,
                compile: function($el, $attrs) {

                    $el.addClass('dynamic-tabs');

                    var id = 'dynamic-tabs-scroll-' + componentId;
                    componentId++;
                    $el.find('.dynamic-tabs-scroll').attr('delegate-handle', id);

                    var component = {
                        id: id,
                        $el: $el,
                        scrollFixed: $attrs.scrollFixed === 'true',
                        fixed: false,
                    };

                    components[id] = component;

                    return {
                        post: function postLink($scope, $el, $attrs) {
                            var $tabsScroll = $el.find('.dynamic-tabs-scroll');

                            //scroll事件处理方法
                            var scrollfCallback = ionic.throttle(function(e) {
                                var scrollTop = 0;
                                var event = e.originalEvent;
                                if (event.detail && event.detail.scrollTop) {
                                    scrollTop = event.detail.scrollTop;
                                } else {
                                    scrollTop = event.target.scrollTop;
                                }

                                component.headerShrink = component.headerShrink;

                                var starty = utils.getElementRect($el, true).offsetTop +
                                    (component.headerShrink ? 44 : 0);

                                if (!component.fixed && scrollTop > starty ) {
                                    component.enableFixed();
                                }
                                if (component.fixed && scrollTop <= starty) {
                                    component.disableFixed();
                                }
                            }, 100);

                            $scope.$on('$destroy', function() {
                                if(component.$scrollPanel){
                                    component.$scrollPanel.off('scroll',scrollfCallback);
                                }
                                delete components[id];

                            });
                            if (component.scrollFixed) {
                                var $view = $el.closest('ion-modal-view');
                                var $content =$el.closest('.ionic-scroll');

                                component.$scrollPanel = $el.closest('.ionic-scroll');

                                component.headerShrink = component.$scrollPanel[0].hasAttribute('cm-header-shrink') &&
                                    !component.$scrollPanel.hasClass('overflow-scroll');
                                component.$scrollPanel.on('scroll', scrollfCallback);
                            }

                            component.enableFixed = function() {
                                var top = 0;
                                var marginTop = component.$scrollPanel.css('margin-top');
                                if (component.headerShrink) {
                                    top = ionic.Platform.isIOS() && ionic.Platform.isWebView() ? 20 : 0;
                                } else {
                                    top = component.$scrollPanel.css('top');
                                }
                                $tabsScroll.remove();
                                $tabsScroll.css({
                                    'position': 'absolute',
                                    'top': top,
                                    'margin-top': marginTop
                                }).appendTo($view);

                                this.fixed = true;
                            };

                            component.disableFixed = function() {
                                $view.children('.dynamic-tabs-scroll').remove();
                                $tabsScroll.css({
                                    'position': 'relative',
                                    'top': 0,
                                    'margin-top': 0
                                }).appendTo($el);
                                this.fixed = false;
                            };
                        }
                    };
                }
            };
        }]);

})();
