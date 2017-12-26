/**
 * Tabs 的控制器
 */
angular.module('app.controllers').controller('searchCtrl', function(
    $scope, $state, $stateParams, searchHistory, stateUtils, globalService,
    loading, $ionicScrollDelegate, messageCenter
) {
    var ctrl = this;

    _.assign(ctrl, {
        // 搜索关键字
        keyword: undefined,

        // 历史搜索关键字
        historyKeywords: undefined,

        // 搜索热词
        hotKeywords: undefined,

        init: function () {
            loading.open();
            ctrl.historyKeywords = searchHistory.getAll();

            globalService.getKeywords(6)
                .success(function (data) {
                    $scope.hotKeywords = data;
                })
                .finally(function () {
                    loading.close();
                });
        },

        /**
         * 开始搜索功能
         */
        search: function (keyword) {
            keyword = _.trim(keyword);

            if (keyword) {
                ctrl.keyword = keyword;
            }

            if (ctrl.keyword) {
                searchHistory.add(ctrl.keyword);
                stateUtils.goProductList({
                    keyword: ctrl.keyword
                });
            }
        },

        /**
         * 清空搜索历史记录
         */
        clearHistory: function () {
            searchHistory.clear();
            $ionicScrollDelegate.resize();
        }
    });

    // 重新进入页面时清理搜索内容
    $scope.$on('$ionicView.afterEnter', function() {
        ctrl.keyword = '';
    });

    $scope.$on('$ionicView.afterEnter',function () {
        // 广播页面Tag
        messageCenter.publishMessage('AT.screen', {
            pageName: 'search'
        });
    });

    var deregistration = $scope.$on('$ionicView.afterEnter', function() {
        ctrl.init();
        deregistration();

        $scope.$on('$ionicView.afterEnter', function () {
            ctrl.init();
        });
    });
});
