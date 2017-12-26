angular.module('app.controllers').controller('submitOrderSuccessCtrl', ["$scope", "$params", "$state", "stateUtils", "checkoutService", "loading", "toast", "modals", "messageCenter", "$timeout", function(
    $scope, $params, $state, stateUtils, checkoutService, loading, toast, modals,
    messageCenter, $timeout
) {
    var ctrl = this;

    $params = _.defaults({}, $params, {
        orderId: 0,
        orderNumber: 0,
        price: 0,
        successCallback: _.noop
    });

    angular.extend(ctrl, {
        // 订单提交数据

        orderNumber: $params.orderNumber,

        orderId: $params.orderId,

        price: $params.price,

        // 查看订单详情
        goOrderInfo: function() {
            modals.submitOrderSuccess.close();

            $timeout(function() {
                var stateName = stateUtils.getStateNameByCurrentTab('orderInfo');
                $state.go(stateName, {
                    id: ctrl.orderId
                });
            }, 10);

        }
    });
}]);
