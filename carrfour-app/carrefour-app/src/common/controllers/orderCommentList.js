angular.module('app.controllers').controller('orderCommentListCtrl', function (
    $scope, $params, $stateParams, loadDataMixin, errorHandling, commentService, stateUtils, $state, modals
) {

    var ctrl = this;

    $params = _.defaults({}, $params, {
        orderId: 0
    });

    angular.extend(ctrl, loadDataMixin, stateUtils, {
        $scope: $scope,

        orderId: $params.orderId,

        loadData: function () {
            return commentService.reviewProduct(ctrl.orderId)
                .error(errorHandling);
        },

        // 填写评价
        goOrderCommentInfo: function (orderGoods, $event) {
            $event && $event.stopImmediatePropagation();
            modals.orderCommentInfo.open({
                params: {
                    orderGoods: orderGoods,
                    successCallback: function () {
                        ctrl.init();
                    }
                }
            });
        },

        goProductInfo: function () {
            modals.orderCommentList.close();
            stateUtils.goProductInfo.apply(this, arguments);
        }
    });

    ctrl.init();
});
