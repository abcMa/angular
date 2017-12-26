/**
 * 用于隐藏应用 tabs 的指令
 * <ion-view title="page title" cm-hide-tabs>
 *     <!-- something -->
 * </ion-view>
 */
angular.module('app.directives')
    .directive('cmHideTabsFlag', function() {
        return {
            restrict: 'A',
            link: function($scope) {
                $scope.$isAppTabs = true;
            }
        };
    })
    .directive('cmHideTabs', ["$timeout", function factory($timeout) {
        var count = 0,

            HIDE_CLASS = 'hide-tabs',
            IONIC_HIDE_CLASS = 'tabs-item-hide',
            BODY_HIDE_CLASS = 'hide-app-tabs',

            // data name
            DN_ID = 'cm-hide-tabs-id';

        return {
            restrict: 'A',

            link: function($scope, $el, $attrs) {
                var id = count++,

                    body = angular.element(document.body),
                    appTabs = angular.element('.app-tabs'),

                    set = $attrs.cmHideTabs,

                    isHideTabs,

                    prevIsHide = appTabs.is('.' + HIDE_CLASS),
                    prevHideId = appTabs.data(DN_ID),

                    $appTabsScope = getAppTabsScope($scope);

                appTabs.data(DN_ID, id);

                init();

                function init() {
                    switch (set) {
                        case 'true':
                            isHideTabs = true;
                            hideTabs();
                            break;
                        case 'false':
                            isHideTabs = false;
                            showTabs();
                            break;
                        case 'inherit':
                            if (prevIsHide) {
                                isHideTabs = true;
                                hideTabs();
                            }
                            else {
                                isHideTabs = false;
                                showTabs();
                            }
                            break;
                    }
                }
                function hideTabs() {
                    appTabs.addClass(HIDE_CLASS + ' ' + IONIC_HIDE_CLASS);
                    body.addClass(BODY_HIDE_CLASS);
                }

                function showTabs() {
                    appTabs.removeClass(HIDE_CLASS + ' ' + IONIC_HIDE_CLASS);
                    body.removeClass(BODY_HIDE_CLASS);
                }

                function restore() {
                    appTabs.data(DN_ID, prevHideId);
                    if (prevIsHide === isHideTabs) { return; }

                    if (prevIsHide) {
                        hideTabs();
                    }
                    else {
                        showTabs();
                    }
                }

                function getAppTabsScope($scope) {
                    if (Object.hasOwnProperty.call($scope, '$isAppTabs') && $scope.$isAppTabs === true) {
                        return $scope;
                    }
                    else if ($scope.$parent) {
                        return getAppTabsScope($scope.$parent);
                    }
                    else {
                        return undefined;
                    }
                }

                init();

                $scope.$on('$ionicView.beforeEnter', function(event, info) {
                    var deregistration = $scope.$on('$stateChangeSuccess', function(event, info) {
                        init();
                        deregistration();
                    });
                });
            }
        };
    }]);
