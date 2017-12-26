angular.module('app.controllers').controller('commentListCtrl', ["$scope", "$params", "loadDataMixin", "commentService", "$ionicScrollDelegate", function(
    $scope, $params, loadDataMixin, commentService, $ionicScrollDelegate
) {

    var ctrl = this;

    angular.extend(ctrl, loadDataMixin, {

        $scope: $scope,

        productId: $params.productId,

        // 评价类型
        type: $params.type || 3,

        // 加载分页
        loadPage: function(page, pageCount) {
            return commentService.list(ctrl.productId, ctrl.type, page, pageCount);
        },

        // 切换筛选
        onChangeType: function(type) {
            ctrl.type = type;
            ctrl.refresh({
                showLoading: false,
                emptyData: true
            });
            $ionicScrollDelegate.resize();
        }
    });
    ctrl.init();
}]);
