angular.module('app.controllers').controller('onlinePaymentCtrl', function (
    $scope, $state, $params, loadDataMixin, errorHandling, payService, modals,
    $timeout, messageCenter, $translate, applePay, stateUtils, $ionicScrollDelegate, utils
) {

    var ctrl = this;

    $params = _.defaults({}, $params, {
        orderId: 0,
        orderNumber: 0,
        price: 0,
        isOverseaseOrder: false,
        newUrl: '',
        successCallback: _.noop
    });

    _.assign(ctrl, loadDataMixin, {
        $scope: $scope,

        applePay: applePay,

        orderId: $params.orderId,

        orderNumber: $params.orderNumber,

        newUrl: $params.newUrl,

        isOverseaseOrder: $params.isOverseaseOrder,

        // 全部金额
        totalAmount: $params.price,

        // 已支付金额
        paidAmount: 0,

        // 剩余金额
        remainingAmount: 0,

        // 是否为二次支付
        secondPay: false,

        // // 有效的支付方式
        // availablePaymethod: [],
        //
        // // 失效的支付方式
        // unavailablePaymethod: [],

        // 整理后的支付方式列表
        payModeList: [],

        // 是否展示更多支付方式
        showFoldPayment: true,

        // 支付宝WAP支付 境外购
        wapPayMode: undefined,

        // 是否立即支付
        payNow: $params.payNow ? $params.payNow : false,

        /**
         * 数据加载
         */
        loadData: function () {
            return payService.getPaymentList(ctrl.orderId)
                .success(function (response) {
                    if (response.secondPay) {
                        ctrl.secondPay = true;
                        ctrl.paidAmount = response.paidAmount || 0;
                        ctrl.remainingAmount = response.remainingAmount || 0;

                        // 是否折叠 刷新列表
                        ctrl.payModeList = [];
                    }

                    // 是否折叠 分为两个组
                    var foldPayMode = _.remove(response.payMode, function (item) {
                        return (item.fold === false);
                    });

                    var unfoldPayMode = response.payMode;

                    response.payMode = [foldPayMode, unfoldPayMode];

                    _.forEach(response.payMode, function (payMode, index) {
                        // 提取无法使用的支付方式
                        var unavailablePaymethod = _.remove(payMode, function (item) {
                            // 二次支付屏蔽福卡(8214)
                            // 优惠券屏蔽支付方式
                            return (ctrl.secondPay && item.code == 8214) || (ctrl.secondPay && item.code == 8214) || !item.enabled;
                        });

                        var availablePaymethod = payMode;

                        if (unavailablePaymethod.length > 0 || availablePaymethod.length > 0) {
                            var temp = {
                                "fold": (index === 1) ? true : false,
                                "unavailablePaymethod": unavailablePaymethod,
                                "availablePaymethod": availablePaymethod
                            };
                            ctrl.payModeList.push(temp);
                        }

                        ctrl.wapPayMode = _.find(ctrl.availablePaymethod, {
                            id: 12
                        });

                        if (ctrl.payNow && ctrl.wapPayMode) {
                            ctrl.choosePayMethod(ctrl.wapPayMode);
                        }
                    });

                })
                .error(errorHandling)
                .finally(function () {
                    // 如果是微信浏览器则调整路由，准备引导弹层。
                    if ($scope.isWeixinBrowser) {
                        $timeout(function () {
                            window.history.replaceState({}, "", ctrl.newUrl);
                        }, 500);
                    }
                });
        },

        choosePayMethod: function (payment) {

            // 微信支付 微信商城
            if (payment && payment.id != 12 && $scope.isWeixinBrowser) {
                ctrl.wechatPay();
                return;
            }

            // 如果是微信浏览器则调整路由，准备引导弹层。
            if (payment && payment.id == 12 && $scope.isWeixinBrowser) {
                modals.onlinePaymentCorverPage.open().then(function(){
                    $timeout(function () {
                        window.history.replaceState({}, "", ctrl.newUrl);
                    }, 500);
                });
                return;
            }

            // 如果是福卡支付
            if (payment && payment.id == 6) {
                // 用户点击下一步后再进入支付方法
                modals.carrefourCardInstruction.open({
                    params: {
                        goNextStep: function () {
                            ctrl.pay(payment);
                        }
                    }
                });
                return;
            }
            ctrl.pay(payment);
        },

        wechatPay: function() {
            payService.wechatPay($params.orderId)
                .success(function(response) {

                    modals.onlinePayment.close();

                    // 否则进入成功页
                    modals.paymentOrderSuccess.open({
                        params: {
                            orderId: $params.orderId,
                            orderNumber: $params.orderNumber,
                            price: ctrl.totalAmount
                        }
                    });

                })
                .error(errorHandling);
        },

        // 支付
        pay: function (payment) {
            payService.pay($params.orderId, payment.id)
                .success(function (response) {

                    // 如果是部分支付则重置支付中心页面
                    if (response.secondPay) {
                        ctrl.refresh();
                        return;
                    }

                    // 否则进入成功页
                    modals.paymentOrderSuccess.open({
                        params: {
                            orderId: $params.orderId,
                            orderNumber: $params.orderNumber,
                            price: response.paidAmount || ctrl.totalAmount,

                            paymentId: payment.id,
                            paymentDiscountAmount: response.paymentDiscountAmount
                        }
                    });

                    // 广播订单
                    messageCenter.publishMessage('AT.payment', {
                        orderId: $params.orderId,
                        paymentId: payment.id
                    });

                    $timeout(function () {
                        modals.onlinePayment.close();
                    }, 1000);
                })
                .error(errorHandling.custom({
                    // 处理其它异常操作
                    other: function (data, status, headers, config, designees) {
                        if (data.stateCode === APP_STATE_CODE.carrefourWallet) {
                            switch (data.message) {
                                case "exit":
                                    break;
                                case "carrefourWalletToIndex":
                                    modals.onlinePayment.close();
                                    stateUtils.goIndex();
                                    break;
                            }
                            return;
                        } else {
                            var defaultOtherHandler = errorHandling.getDefaultErrorHandlers('other');
                            defaultOtherHandler(data, status, headers, config, designees);
                        }
                    }
                }));

        },

        //展示或隐藏 更多支付方式
        showHidePayMode: function () {
            ctrl.showFoldPayment = !ctrl.showFoldPayment;
            $timeout(function() {
                utils.getByHandle($ionicScrollDelegate, 'onlinePaymentScrollHandle').resize();
            });
        }

    });

    // 广播页面Tag
    messageCenter.publishMessage('AT.screen', {
        pageName: 'tunnel::step4_payment_center_pre1',
    });

    ctrl.init();
});
