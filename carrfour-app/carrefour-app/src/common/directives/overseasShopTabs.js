angular.module('app').directive('cmOverseasShopTabs', function(
    $state, overseasShop
) {
    return {
        restrict: 'E',
        scope: false,
        templateUrl: 'templates/cmOverseasShopTabs.html',

        controller: function($scope, $element, $attrs) {
            var ctrl = this,

                isOwnHasTabs = Object.prototype.hasOwnProperty.call($scope, '$hasTabs'),
                originalHasTabs = $scope.$hasTabs;

            return angular.extend(ctrl, {
                tabItems: undefined,

                selectedTabItem: undefined,

                isShow: undefined,

                init: function() {
                    this.tabItems = $element.find('.tab-item');
                    this.show();
                },

                hide: function() {
                    if (this.isShow) {
                        if (isOwnHasTabs) {
                            $scope.$hasTabs = originalHasTabs;
                        }
                        else {
                            delete $scope.$hasTabs;
                        }

                        $element.hide();
                        this.isShow = false;
                    }
                },

                show: function() {
                    if (!this.isShow) {
                        $scope.$hasTabs = true;
                        $element.show();

                        this.isShow = true;
                    }
                },

                select: function() {
                    var matchTabItem;

                    this.tabItems.each(function(i, el) {
                        var tabItem = $(el),

                            currentStateUrl = $state.current.url,
                            matchUrl = tabItem.data('url');

                        if (currentStateUrl.indexOf(matchUrl) !== -1) {
                            matchTabItem = tabItem;
                            return false;
                        }
                        else {
                            return undefined;
                        }
                    });

                    if (!matchTabItem) {
                        return;
                    }

                    if (this.selectedTabItem) {
                        this.selectedTabItem.removeClass('tab-item-active');
                    }

                    matchTabItem.addClass('tab-item-active');
                    this.selectedTabItem = matchTabItem;
                }
            });
        },

        compile: function($element) {
            $element.addClass('tabs-icon-top overseas-shop-tabs');

            return function($scope, $element, $attrs, tabsCtrl) {
                tabsCtrl.init();
                tabsCtrl.select();

                checkDisplay($state.current);

                $scope.$on('$stateChangeSuccess', function() {
                    tabsCtrl.select();
                });

                function checkDisplay(state) {
                    if ( (state.data && state.data.isHiddenOverseasShopTabs) || overseasShop.isOverseasShopState(state) === false ) {
                        tabsCtrl.hide();
                    }
                    else {
                        tabsCtrl.show();
                    }
                }
            };

        }
    };
});
