angular.module('app.controllers').controller('cancelOrderCtrl', function(
    $scope, $state, $params, categoryService, loadDataMixin, stateUtils, orderService, loading, errorHandling, toast, $translate
) {

    var ctrl = this;

    $params = _.defaults({}, $params, {
        successCallback: _.noop
    });

    _.assign(ctrl, loadDataMixin, {
        $scope: $scope,

        selectedReasonId: 0,

        /**
         * 数据加载
         */
        loadData: function() {
            return orderService.findReason();
        },

        onConfirm: function() {
            if (ctrl.selectedReasonId) {
                loading.open();
                orderService.cancel(ctrl.selectedReasonId, $params.orderId)
                    .error(errorHandling)
                    .finally(function() {
                        loading.close();
                        $scope.modals.cancelOrder.close();
                        $params.successCallback();
                    });
            } else {
                toast.open($translate.instant('user.cancelOrder.popupTxt'));
                return;
            }
        }
    });

    ctrl.init();
});
