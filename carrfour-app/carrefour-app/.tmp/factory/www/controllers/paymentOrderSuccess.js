angular.module('app.controllers').controller('paymentOrderSuccessCtrl', ["$scope", "$params", "modals", "stateUtils", "$state", "$timeout", "orderService", "errorHandling", "loadDataMixin", "popup", "$translate", function(
    $scope, $params, modals, stateUtils, $state, $timeout, orderService, errorHandling, loadDataMixin, popup, $translate
) {

    var ctrl = this;

    $params = _.defaults({}, $params, {
        orderId: 0,
        orderNumber: 0,
        price: 0,
        paymentId: undefined,
        paymentDiscountAmount: undefined
    });

    _.assign(ctrl, loadDataMixin, {

        $scope: $scope,

        orderNumber: $params.orderNumber,

        orderId: $params.orderId,

        price: $params.price,

        orderRewardPoints: 0,

        // 是否使用 Apple Pay 进行支付
        isApplePay: $params.paymentId === 13,

        // 使用 Apple Pay 进行支付后的优惠金额
        paymentDiscountAmount: $params.paymentDiscountAmount,

        loadData: function() {
            orderService.getOrderRewardPoints($params.orderId).success(function(data){
                ctrl.orderRewardPoints = data;
            });

            ctrl.isWap = isWapPage();
            return orderService.paySuccessAdv().success(function(response) {

            }).error(errorHandling);
        },

        // wap 的话，样子有变化
        isWap: false,

        // 查看订单详情
        goOrderInfo: function() {
            // TODO:: 这不是一个完善的微信流程修复方案，权宜之策，有空的时候重新梳理回来。
            // if ($scope.isWeixinBrowser) {
            //     modals.paymentOrderSuccess.close();
            //     $timeout(function () {
            //         var stateName = stateUtils.getStateNameByCurrentTab('orderInfo');
            //         $state.go(stateName, {
            //             id: ctrl.orderId
            //         });
            //     });
            // }
            $timeout(function() {
                modals.paymentOrderSuccess.close();
            });
        },

        // 跳转外部链接
        goAdv: function(param) {
            if(window.cordova && window.cordova.InAppBrowser) {
                window.cordova.InAppBrowser.open(param.url, '_system');
            }else{
                window.open(param.url);
            }
        },

        // 积分提示
        pointsTip: function(){
            popup.alert($translate.instant('checkout.paySuccess.alertPointsTip'));
        }
    });

    function isWapPage() {
         if (!$scope.isWeixinBrowser && APP_CONFIG.os == "weixin") {
             return true;
         }else {
             return false;
         }
    }

    ctrl.init();
}]);
