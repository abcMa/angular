angular.module('app.controllers').controller('viewOrderItemListCtrl', ["$scope", "$state", "stateUtils", "$params", "loadDataMixin", "errorHandling", "globalService", "viewHistory", "modals", "$translate", function(
    $scope, $state, stateUtils, $params, loadDataMixin, errorHandling, globalService,
    viewHistory, modals, $translate
) {

    var ctrl = this;

    angular.extend(ctrl, loadDataMixin, {

        $scope: $scope,

        // 结算订单中商品清单信息
        orderItemList: $params.data,

        itemTypeEnum: {
            1: $translate.instant('checkout.itemList.normal'),
            2: $translate.instant('checkout.itemList.gift'),
            3: $translate.instant('checkout.itemList.limit'),
            5: $translate.instant('checkout.itemList.buy')
        }
    });
    console.debug(ctrl.orderItemList);
}]);
