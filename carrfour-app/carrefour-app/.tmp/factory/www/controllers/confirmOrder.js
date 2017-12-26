angular.module('app.services').controller('confirmOrderCtrl', ["$scope", "$state", "$params", "loading", "errorHandling", "$timeout", "$translate", "toast", "messageCenter", "checkoutService", "cartService", "userService", "utils", "payService", "modals", "stateUtils", "$ionicScrollDelegate", "$ionicHistory", "globalService", function (
    $scope, $state, $params, loading, errorHandling, $timeout, $translate,
    toast, messageCenter, checkoutService, cartService, userService, utils,
    payService, modals, stateUtils, $ionicScrollDelegate, $ionicHistory, globalService
) {
    var ctrl = this;

    angular.extend(ctrl, messageCenter, {
        $scope: $scope,

        // 订单是否在刷新数据中
        isUpdate: false,

        // 是否同意全球购协议
        isConfirmAgreement: false,

        // 是否展示运费详情
        freight: false,

        isPresell: undefined,

        //海关提示
        customsHint: true,

        // 点击切换展示运费详情
        freightFn: function () {
            ctrl.freight = !ctrl.freight;
            // hack
            // https://github.com/driftyco/ionic/issues/2754
            var oldHistoryId = $scope.$historyId;
            $scope.$historyId = $ionicHistory.currentHistoryId();
            $ionicScrollDelegate.$getByHandle('confirmOrderScroll').scrollBottom(true);
            $scope.$historyId = oldHistoryId;
        },

        // 是否禁用选择优惠券
        disabledSelectCoupons: false,

        allItemList: false,

        // 提交锁，防止连点按钮
        lock: false,

        // 是否展开所有商品清单
        showAllItems: function () {
            ctrl.allItemList = !ctrl.allItemList;
        },

        /**
         * 初始化事件
         */
        init: function () {
            // 加载数据
            this.loadData();
        },

        /**
         * 加载数据
         */
        loadData: function () {
            var data = ctrl.data = $params.data;

            // 处理购物车信息
            if (data.cart) {
                data.cart = {
                    baskets: data.cart
                };

                data.cart = cartService.processingCartData(data.cart);
            }

            // 设置是否使用积分抵运费
            data.useIntegralToFreight = false;

            // 设置用户所选择优惠券的 ID 数组
            data.selectedCouponIds = data.selectedCouponIds || [];

            // 设置默认的配送方式
            _.forEach(data.deliveryModes, function (deliveryMode) {
                if (deliveryMode.selected) {
                    data.selectedDeliveryMode = deliveryMode;
                }
            });
            //
            // 设置默认支付方式
            _.forEach(data.payModeTypes, function (payModeType) {
                if (payModeType.selected) {
                    data.selectedPayment = payModeType;
                }
            });

            // 默认地址
            data.selectedConsignee = data.consignee;

            //展示新地址 (地址库升级后,后台接口为了向下兼容,没有更改data.consignee数据,so增加一个字段,展示新地址,不展示旧地址)
            data.showConsignee = data.noConsignee;

            // 默认不开发票
            data.invoice = {
                status: 0
            };

            // 将订单数据放入结算服务中，以共享给其它页面
            checkoutService.setOrder(data);

            ctrl.isPresell = data.isPresell;
        },

        /**
         * 服务协议
         */
        openServiceAgreement: function () {
            globalService.getArticleByStructure('register').success(function (data) {
                modals.registerAgreement.data = data;
                modals.registerAgreement.open({
                    backdropClickToClose: false
                });
            });
        },

        /**
         * 判断当前订单提交数据是否是有效的
         */

        // 验证收货人
        isSelectedConsignee: function () {
            if (!this.data.selectedConsignee) {
                toast.open($translate.instant('checkout.needConsignee'));
                return false;
            } else {
                return true;
            }
        },

        // 验证身份证
        isOverseasIdCard: function () {
            if (this.data.isOverseasShop && !this.data.idCard) {
                toast.open($translate.instant('validator.idCard'));
                return false;
            } else {
                return true;
            }
        },

        // 验证支付方式
        isSelectedPayment: function () {
            if (!this.data.selectedPayment) {
                toast.open($translate.instant('checkout.needPayment'));
                return false;
            } else {
                return true;
            }
        },

        // 验证配送方式
        isSelectedDeliveryMode: function () {
            if (!this.data.selectedDeliveryMode) {
                toast.open($translate.instant('checkout.needDelivery'));
                return false;
            } else {
                return true;
            }
        },

        // 更新提货信息验证
        isValidForUpdate: function () {
            return this.isSelectedConsignee() &&
                this.isSelectedPayment() &&
                this.isSelectedDeliveryMode();

            // } else if (this.data.remark && this.data.remark.length > 45) {
            //     toast.open('订单备注的长度应在 45 个字以内');
            //     return false;
            // }
        },

        // 提交信息验证
        isValidSublime: function () {
            return this.isSelectedConsignee() && this.isOverseasIdCard() && this.isSelectedPayment() && this.isSelectedDeliveryMode() && !ctrl.lock;
        },

        /**
         * 刷新结算数据
         */
        update: function (processing) {
            if (processing) {
                return undefined;
            }
            // 只有在所选提货人信息，支付方式及配送方式三者都存在时，才能刷新结算数据。
            if (!this.isValidForUpdate()) {
                return undefined;
            }

            this.isUpdate = true;

            var params = {
                consigneeId: this.data.selectedConsignee.id,
                paymentModeType: this.data.selectedPayment.paymentModeType,
                deliveryModeId: this.data.selectedDeliveryMode.id,
                integralToFreight: this.data.useIntegralToFreight ? this.data.integralLimit : 0,
                couponIds: this.data.selectedCouponIds,
                deliveryOntimeId: this.data.selectedDeliveryOntime ? this.data.selectedDeliveryOntime.id : undefined,
                ownDeliveryAddrId: this.data.selectedDeliveryMode.id == 18 ? this.data.selectedPickupId : undefined,
                deliveryOntimeDate: this.data.selectedDeliveryOntime ? this.data.selectedDeliveryOntime.date : undefined,
                presell: ctrl.presell
            };

            loading.open();

            return checkoutService.update(params)
                .success(function (data) {
                    angular.extend(ctrl.data, data);
                })
                .error(errorHandling)
                .finally(function () {
                    loading.close();
                    ctrl.isUpdate = false;
                });
        },

        //提交订单
        submitOrder: function () {

            if (ctrl.isValidSublime()) {
                this.lock = true;
                ctrl.submit();
            }

            // 由于update需要支付方式类型参数 而微信商城支付方式类型是最后一步流程 所以提交订单前必须update
            // ctrl.update().success(function(data) {
            // 提交订单
            // ctrl.submit();
            // }).error(errorHandling);

        },

        /**
         * 提交订单
         */
        submit: function () {
            var params = {
                consigneeId: this.data.selectedConsignee.id,
                couponIds: this.data.selectedCouponIds,
                accountIntegral: this.data.useIntegralToFreight ? this.data.integralLimit : 0,
                invoice: this.data.invoice,
                remark: this.data.remark,
                paymentModeType: this.data.selectedPayment.paymentModeType,
                deliveryModeId: this.data.selectedDeliveryMode.id,
                payableAmount: ctrl.data.info.payableAmount,
                origin: this.data.origin,
                ownDeliveryAddrId: this.data.selectedDeliveryMode.id == 18 ? this.data.selectedPickupId : undefined,
                deliveryOntimeId: this.data.selectedDeliveryOntime ? this.data.selectedDeliveryOntime.id : undefined,
                deliveryOntimeDate: this.data.selectedDeliveryOntime ? this.data.selectedDeliveryOntime.date : undefined,
                idCard: this.data.idCard,
                presell: ctrl.isPresell
            };

            loading.open();
            return checkoutService.submit(params)
                .success(function (data) {
                    loading.close();
                    ctrl.quit();

                    // 广播订单生成
                    messageCenter.publishMessage('checkout.success', {
                        orderId: data.orderId,
                        orderNumber: data.orderNumber,
                        payableAmount: params.payableAmount,
                        paymentModeType: params.paymentModeType
                    });

                    // 广播订单
                    messageCenter.publishMessage('AT.createOrder', {
                        orderId: data.orderId
                    });

                    // 广播页面Tag
                    messageCenter.publishMessage('AT.screen', {
                        pageName: 'tunnel::step8_order_confirmation'
                    });

                    //货到付款
                    if (params.paymentModeType == 1) {
                        // 跳转下单成功
                        $scope.modals.submitOrderSuccess.open({
                            params: {
                                orderNumber: data.orderNumber,
                                orderId: data.orderId,
                                price: params.payableAmount
                            }
                        });
                        return;
                    }

                    if ($scope.isWeixinBrowser && ctrl.data.isOverseasShop) {
                        //跳转到订单详情并立即支付
                        $timeout(function () {
                            stateUtils.goOrderInfo(data.orderId, ctrl.data.isOverseasShop, true);
                        });
                        return;
                    }
                    $timeout(function () {
                        stateUtils.goOrderInfo(data.orderId, ctrl.data.isOverseasShop);
                    });

                    // 释放时间片
                    $timeout(function () {
                        // 跳转支付中心
                        modals.onlinePayment.open({
                            params: {
                                orderNumber: data.orderNumber,
                                orderId: data.orderId,
                                price: params.payableAmount,
                                isOverseaseOrder: ctrl.data.isOverseasShop
                            }
                        });
                    });

                }).error(function () {
                    messageCenter.publishMessage('cart.refresh');
                    ctrl.lock = false;
                })
                .error(errorHandling)
                .finally(function () {
                    loading.close();
                    ctrl.lock = false;
                });

        },

        /**
         * 获取提货人信息的显示地址，需要拼接其地区信息及街道地址
         */
        getShowAddress: function (consignee) {
            var region = consignee && consignee.region,
                regionsName = '';

            _.forEach(region, function (r) {
                if (typeof (r) === 'string') {
                    regionsName += r;
                } else {
                    regionsName += r.name;
                }
            });

            return regionsName;
        },

        /**
         * 进入选择提货人信息视图
         */
        goSelectConsignee: function () {

            var config = {
                params: {
                    selectedId: this.data.selectedConsignee && this.data.selectedConsignee.id,
                    successCallback: utils.proxy(this, 'setSelectedConsignee')
                }
            };
            $scope.modals.selectConsignee.open(config);

        },

        /**
         * 进入添加提货人信息视图
         */
        goAddConsignee: function () {
            var config = {
                params: {
                    successCallback: utils.proxy(this, 'setSelectedConsignee')
                }
            };

            $scope.modals.editConsigneeInfo.open(config);
        },

        /*
         * 进入填写身份证信息页面
         */
        goeditIdCard: function () {
            $scope.modals.editIdCard.open({
                params: {
                    // 当编辑弹出层内保存身份证号成功后，调用的回调函数
                    successCallback: function (idCard) {
                        // 保存身份证信息
                        idCard = idCard.slice(0, 4) + '********' + idCard.slice(-4);
                        ctrl.data.idCard = idCard;
                    }
                }
            });
        },

        /**
         * 进入选择优惠券页面
         */
        goSelectCoupons: function () {
            // 只有在所选提货人信息，支付方式及配送方式三者都存在时，才能选择优惠券
            if (!ctrl.isValidForUpdate()) {
                return;
            }
            var config = {
                params: {
                    confirmCallback: function (newSelectedCouponIds, priceInfo) {
                        ctrl.data.selectedCouponIds = newSelectedCouponIds;
                        ctrl.selectedCouponCount = newSelectedCouponIds.length;

                        // 更新结算金额信息
                        _.assign(ctrl.data.info, priceInfo);
                    },
                    selectedCouponIds: ctrl.data.selectedCouponIds,
                    consigneeId: ctrl.data.selectedConsignee.id,
                    deliveryModeId: ctrl.data.selectedDeliveryMode.id,
                    paymentModeType: ctrl.data.selectedPayment.paymentModeType,
                    deliveryOntimeId: ctrl.data.selectedDeliveryOntime && ctrl.data.selectedDeliveryOntime.id || undefined,
                    ownDeliveryAddrId: this.data.selectedDeliveryMode.id == 18 ? this.data.selectedPickupId : undefined,
                    deliveryOntimeDate: ctrl.data.selectedDeliveryOntime ? ctrl.data.selectedDeliveryOntime.date : undefined,
                    presell: ctrl.isPresell
                }
            };

            $scope.modals.selectCoupons.open(config);
        },

        /**
         * 查看购物篮信息
         */
        goBrowseBasket: function (basket) {
            $scope.modals.browseBasket.open({
                params: {
                    basket: basket
                }
            });
        },

        /**
         * 进入编辑发票信息视图
         */
        goInvoice: function () {

            if (ctrl.data.isOverseasShop) {
                return false;
            }

            $scope.modals.invoice.open({
                params: {
                    data: ctrl.data.invoice,
                    invoiceCategorys: ctrl.data.invoices.invoiceCategorys,
                    callback: function (invoice) {
                        ctrl.data.invoice = invoice;
                    }
                }
            });
        },

        /**
         * 进入商品清单视图
         */
        goOrderItemList: function () {
            //处理里面的特殊分类
            _.forEach(ctrl.data.basket.items, function (items) {
                _.forEach(items.specialCategory, function (item, index) {
                    if (!item.showOrNot) {
                        items.specialCategory.splice(index, 1);
                    }
                });
            });

            $scope.modals.viewOrderItemList.open({
                params: {
                    data: ctrl.data.basket
                }
            });
        },

        /**
         * 进入选择支付、配送方式视图
         */
        goSelectPayDelivery: function () {

            if (ctrl.data.isOverseasShop) {
                return false;
            }

            var deliveryModes = _.cloneDeep(ctrl.data.deliveryModes);
            var payModeTypes = _.cloneDeep(ctrl.data.payModeTypes);
            var selectedPickupId = _.cloneDeep(ctrl.data.selectedPickupId);
            var selectedDeliveryOntime = _.cloneDeep(ctrl.data.selectedDeliveryOntime);

            // 增加两种不同的标记
            if (ctrl.data.selectedPayment || ctrl.data.selectedDeliveryMode) {
                // 广播页面Tag
                messageCenter.publishMessage('AT.screen', {
                    pageName: 'tunnel::step5_recap_payment_delivery'
                });
            } else {
                // 广播页面Tag
                messageCenter.publishMessage('AT.screen', {
                    pageName: 'tunnel::step3_select_payment_delivery'
                });
            }

            $scope.modals.selectPayDelivery.open({
                params: {
                    consigneeId: ctrl.data.selectedConsignee.id,
                    deliveryModes: deliveryModes,
                    payModeTypes: payModeTypes,
                    selectedPickupId: selectedPickupId,
                    selectedDeliveryOntime: selectedDeliveryOntime,
                    selectedConsigneeId: ctrl.data.selectedConsignee.id,
                    //准时达改版 20160704 specialCategory

                    selectedCallBack: function (deliveryModes, payModes, pickupId, deliveryOntime) {
                        ctrl.data.payModeTypes = payModes;
                        ctrl.data.deliveryModes = deliveryModes;

                        //设置支付方式
                        ctrl.data.selectedPayment = _.find(payModes, {
                            selected: true
                        });

                        //设置配送方式
                        ctrl.data.selectedDeliveryMode = _.find(deliveryModes, {
                            selected: true
                        });

                        ctrl.data.selectedPickupId = pickupId;
                        ctrl.data.selectedDeliveryOntime = deliveryOntime;
                        // 清除已选的优惠券
                        if (ctrl.data.selectedCouponIds) {
                            ctrl.data.selectedCouponIds = undefined;
                            ctrl.selectedCouponCount = undefined;
                        }
                        ctrl.update();
                    }
                }
            });
        },

        /**
         * 海外购配送方式提示
         */
        selectPayDeliveryInfo: function () {
            $scope.modals.promptInfo.open({
                params: {
                    title: $translate.instant('checkout.selectPayDelivery.info.title'),
                    content: $translate.instant('checkout.selectPayDelivery.info.content'),
                    type: 1
                }
            });
        },

        /**
         * 海外购不支持发票提示
         */
        goInvoiceInfo: function () {
            $scope.modals.promptInfo.open({
                params: {
                    title: $translate.instant('checkout.invoice.info.title'),
                    content: $translate.instant('checkout.invoice.info.content'),
                    type: 2
                }
            });
        },

        /**
         * 海外购税费提示
         */
        goTaxRateInfo: function () {
            $scope.modals.promptInfo.open({
                params: {
                    title: $translate.instant('taxAmountInfo.title'),
                    content: $translate.instant('taxAmountInfo.content'),
                    content2: $translate.instant('taxAmountInfo.content2'),
                    content3: $translate.instant('taxAmountInfo.content3'),
                    content4: $translate.instant('taxAmountInfo.content4'),
                    content5: $translate.instant('taxAmountInfo.content5'),
                    type: 3
                }
            });
        },

        /**
         * 设置已选择的提货人信息
         */
        setSelectedConsignee: function (consignee) {
            var beforeSelectedConsignee = this.data.selectedConsignee;
            this.data.selectedConsignee = consignee;
            //代表地址可用 showConsignee = false
            this.data.showConsignee = false;

            // 若所选提货人信息的地区与当前所选的地区不同，则需要清除当前所选则的支付方式及配送方式
            if (!this.data.isOverseasShop) {
                if (!this.data.isPresell && beforeSelectedConsignee && this.getShowAddress(beforeSelectedConsignee) !== this.getShowAddress(consignee) &&
                    (this.data.selectedDeliveryMode || this.data.selectedPayment)) {
                    toast.open($translate.instant('checkout.selectPayDelivery.reselectForConsigneeChange'));
                    this.clearPaymentAndDelivery();
                }
                // 若无其它操作，则默认刷新结算信息
                else {
                    this.update(true);
                }
            }

        },

        /**
         * 清除所选的支付方式，配送方式，以及相关的极速达自提点和准时达信息。
         */
        clearPaymentAndDelivery: function () {
            _.forEach(ctrl.data && ctrl.data.deliveryModes, function (deliveryMode) {
                deliveryMode.selected = false;
            });

            _.forEach(ctrl.data && ctrl.data.payModeTypes, function (payModeType) {
                payModeType.selected = false;
            });

            this.data.selectedDeliveryMode = undefined;
            this.data.selectedPayment = undefined;
            this.data.selectedPickupId = undefined;
            this.data.selectedDeliveryOntime = undefined;
        },

        /**
         * 退出结算流程
         */
        quit: function () {
            $scope.modals.confirmOrder.close();
        },

        //关闭海关提示
        closeCustomsHint: function() {
            ctrl.customsHint = false;
        }

    });

    // 监听收货人地址删除事件
    ctrl.subscribeMessage('consignee.remove', function (event, removedConsigneeId) {
        // 清空已选地址
        if (ctrl.data.selectedConsignee && ctrl.data.selectedConsignee.id == removedConsigneeId) {
            ctrl.data.selectedConsignee = undefined;
        }
    });

    // 监听收货人改变事件
    ctrl.subscribeMessage('consignee.change', function (event) {
        // 清除支付配送方式
        if (ctrl.data.selectedPayment) {
            ctrl.data.selectedPayment = undefined;
            // 设置默认支付方式
            _.forEach(ctrl.data.payModeTypes, function (payModeType) {
                if (payModeType.selected) {
                    ctrl.data.selectedPayment = payModeType;
                }
            });
        }
        if (ctrl.data.selectedDeliveryMode) {
            ctrl.data.selectedDeliveryMode = undefined;
            // 设置默认的配送方式
            _.forEach(ctrl.data.deliveryModes, function (deliveryMode) {
                if (deliveryMode.selected) {
                    ctrl.data.selectedDeliveryMode = deliveryMode;
                }
            });
        }

        // 清除已选的优惠券
        if (ctrl.data.selectedCouponIds) {
            ctrl.data.selectedCouponIds = undefined;
            ctrl.selectedCouponCount = undefined;
        }

        ctrl.update();
    });

    // 广播页面Tag
    messageCenter.publishMessage('AT.screen', {
        pageName: 'tunnel::step2_check_order'
    });

    ctrl.init();
}]);
