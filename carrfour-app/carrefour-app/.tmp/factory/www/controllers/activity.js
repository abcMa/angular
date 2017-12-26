angular.module('app.controllers').controller('activityCtrl', ["$scope", "$stateParams", "activityService", "activityLoader", "loadDataMixin", "stateUtils", "api", "$ionicScrollDelegate", "$compile", "$timeout", "shareService", "$state", "$interval", "messageCenter", function(
    $scope, $stateParams, activityService, activityLoader,
    loadDataMixin, stateUtils, api, $ionicScrollDelegate, $compile,
    $timeout, shareService, $state, $interval, messageCenter
) {

    var ctrl = this;

    _.assign(ctrl, loadDataMixin, stateUtils, {
        $scope: $scope,

        articleId: $stateParams.articleId,

        title: $stateParams.title || '活动页',

        activityContent: '',

        empty: false,

        countDown: 3,

        // 加载活动内容
        loadData: function() {
            // 设置微信分享的信息
            shareService.wechatShareInfo('article', $stateParams.articleId);

            return activityService.getActivityInfo($stateParams.articleId).then(function(response) {

                if(!response.data) {
                    ctrl.empty = true;
                    refreshTimer();
                    return response;
                }

                // 用hash作为ctrl名
                var controllerName = "activityPageCtrl_" + _hash(response.data);

                //传给directive
                ctrl.activityContent = $("<div>" + response.data + "</div>")
                    .attr("ng-controller", controllerName);

                // 构造一个供给活动页调用的加载器
                window._activityLoader = activityLoader.getActivityLoader(controllerName);

                return response;
            });
        },

        // 跳首页
        goIndex: function () {
            $state.go('tabs.index');
        }
    });

    function refreshTimer() {

        var tickPromise = undefined;

        // 当视图离开时（进入到下一个视图或返回到上一个视图），重置为默认分享信息
        var scopeClear = $scope.$on('$ionicView.beforeLeave', function() {
            $interval.cancel(tickPromise);
        });
        tickPromise = $interval(function () {
            ctrl.countDown -= 1;
            if (ctrl.countDown <= 0) {
                ctrl.countDown = 0;
                $interval.cancel(tickPromise);
                $scope.$on('$destroy', function() {
                    scopeClear();
                });
                $state.go('tabs.index');
            }
        }, 1000);

    }

    // 据说性能超高的文本hash计算器
    var I64BIT_TABLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-'.split('');

    function _hash(input) {
        var hash = 5381;
        var i = input.length - 1;
        if (typeof input == 'string') {
            for (; i > -1; i--)
                hash += (hash << 5) + input.charCodeAt(i);
        } else {
            for (; i > -1; i--)
                hash += (hash << 5) + input[i];
        }
        var value = hash & 0x7FFFFFFF;
        var retValue = '';
        do {
            retValue += I64BIT_TABLE[value & 0x3F];
        }
        while (value >>= 6);
        return retValue;
    }

    $timeout(function () {
        $scope.$broadcast('$ionicHeader.align');
    });

    var deregistration = $scope.$on('$ionicView.afterEnter', function() {
        // 加载数据
        ctrl.init();
        deregistration();
    });

    // 当视图离开时（进入到下一个视图或返回到上一个视图），重置为默认分享信息
    $scope.$on('$ionicView.beforeLeave', function() {
        shareService.defaultShareInfo();
    });

    // 分站信息变化后，刷新数据
    messageCenter.subscribeMessage('subsite.change', function () {
        ctrl.refresh({
            showLoading: false,
            emptyData: false
        });
    }, $scope);

}]);
