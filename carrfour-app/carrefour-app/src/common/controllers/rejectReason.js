/**
 * 订单关闭原因弹出层控制器
 */
angular.module('app.controllers').controller('rejectReasonCtrl', function(
    $scope, $params, modals, $translate
) {
    var ctrl = this;

    $params = _.defaults({}, $params, {
        rejectReason: null,
        colseReason: null
    });
    
    angular.extend(ctrl, {
        rejectReason: $params.rejectReason,
        colseReason: $params.colseReason
    });
});
