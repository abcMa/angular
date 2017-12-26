angular.module('app.controllers').controller('orderListCtrl', function (
    $scope, $state, $stateParams, loadDataMixin, orderService, stateUtils, cartService,
    modals, errorHandling, payService, messageCenter, $translate, api, loading, $ionicHistory,
    $timeout
) {

    var ctrl = this;

    angular.extend(ctrl, loadDataMixin, stateUtils, {
        $scope: $scope,

        // 订单类型
        type: $stateParams.type || 0,

        historyPrevPage: !!$ionicHistory.backView(),

        // 获取订单类型名称
        getOrderStatusName: function (orderStatus) {
            return $translate.instant('orderStatus.' + orderStatus);
        },

        /** 加载分页 */
        loadPage: function (page, pageCount) {

            return orderService.list(APP_USER.id, ctrl.type, page, pageCount).success(function (response) {
                // //在这里直接计算出应该展示哪个按钮
                // angular.forEach(response.items, function(order, index, array) {
                //
                //     // 已下单 && 在线支付
                //     if (order.orderStatus == 1 && order.payType == 2) {
                //         order.button = 0;
                //         return;
                //     }
                //
                //     // 已下单 || 已支付
                //     if (order.orderStatus < 3) {
                //         order.button = 1;
                //         return;
                //     }
                //
                //     // 货到付款 || 已发货
                //     if (order.payType == 1 || (order.payType == 2 && order.orderStatus >= 2)) {
                //         order.button = 3;
                //         return;
                //     }
                // });

                // angular.forEach(response.items, function (order, index, array) {
                //     // 把后台状态'已复核'从前台隐藏掉
                //     if (order.orderStatus == 3) {
                //         if (order.payType == 1) {
                //             order.orderStatus = 1;
                //         } else {
                //             order.orderStatus = 2;
                //         }
                //     }
                // });
            }).error(errorHandling);

        },

        // 支付订单
        paymentOrder: function (order, $event) {
            $event.stopPropagation();

            if ($scope.isWeixinBrowser && order.isOverseasShop) {
                stateUtils.goOrderInfo(order.id, order.isOverseasShop, true);
                return;
            }

            $timeout(function () {
                stateUtils.goOrderInfo(order.id, order.isOverseasShop);
            });

            // 跳转支付中心
            modals.onlinePayment.open({
                params: {
                    orderId: order.id,
                    orderNumber: order.orderNumber,
                    price: order.payableAmount,
                    isOverseaseOrder: order.isOverseasShop
                }
            });
        },

        // 再次购买订单中商品
        reBuy: function (orderId, isOverseasShop) {
            cartService.rebuy(orderId, isOverseasShop).success(function (response) {
                if (isOverseasShop) {
                    stateUtils.goOverseasShopCart();
                } else {
                    stateUtils.goStateByCurrentTab('shoppingCart');
                }
            }).error(errorHandling);
        },

        // 取消订单
        cancelOrder: function (orderId) {
            $scope.modals.cancelOrder.open({
                params: {
                    orderId: orderId,
                    successCallback: function () {
                        ctrl.init();
                    }
                }
            });
        },

        // 去评价列表
        goOrderCommentList: function (orderId, isOverseasShop) {
            if (isOverseasShop === true) {
                APP_CONFIG.isInOverseasShopView = true;
            }

            $scope.modals.orderCommentList.open({
                params: {
                    orderId: orderId
                }
            });
        },

        //关闭理由
        openRejectReason: function (rejectReason, colseReason) {
            $scope.modals.rejectReason.open({
                params: {
                    rejectReason: rejectReason,
                    colseReason: colseReason
                }
            });
        }
    });

    // 订阅登录消息
    messageCenter.subscribeMessage('login', function () {
        ctrl.refresh({
            emptyData: false,
            showLoading: true
        });
    }, $scope);

    //订阅支付成功消息 刷新列表
    messageCenter.subscribeMessage('pay.success', function () {
        ctrl.refresh();
    }, $scope);

    $scope.$on('$ionicView.afterEnter', function () {
        var name;
        switch (parseInt(ctrl.type)) {
            case orderService.ORDER_TYPES.ALL:
                name = "all_my_orders";
                break;
            case orderService.ORDER_TYPES.WAITING_PAYMENT:
                name = "to_be_paid";
                break;
        }

        if (name) {
            // 广播页面Tag
            messageCenter.publishMessage('AT.screen', {
                pageName: 'personal_space::' + name
            });
        }
    });


    $timeout(function () {
        $scope.$broadcast('$ionicHeader.align');
    });

    var deregistration = $scope.$on('$ionicView.afterEnter', function () {
        ctrl.init();
        deregistration();

        $scope.$on('$ionicView.afterEnter', function () {
            ctrl.refresh({
                showLoading: false
            });
        });
    });

});
