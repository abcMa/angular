angular.module('app.controllers').controller('shoppingCartCtrl', function (
    $scope, $state, $stateParams, $q, $translate, $ionicScrollDelegate, cartService, toast,
    popup, loadDataMixin, checkoutService, messageCenter, loading, userService, errorHandling, stateUtils,
    collectService, modals, api, $ionicHistory, $timeout
) {
    var ctrl = this;

    // 操作模式
    var OPMODES = {
        VIEW: 0,
        EDIT: 1
    };
    $scope.OPMODES = OPMODES;

    // 购物车中基本所有操作在运行时都要屏蔽用户操作。
    // 因此这里提供一个包装器，用其包装后的操作方法，可以在操作执行前开启一个 loading 控件，
    // 并在操作结束后关闭它。
    function wrapper(fun) {
        return function () {
            loading.open();
            var promise = fun.apply(ctrl, arguments);

            if (promise && promise.finally) {
                promise.finally(function () {
                    loading.close();
                });
            }

            return promise;
        };
    }

    angular.extend(ctrl, loadDataMixin, stateUtils, {

        $scope: $scope,

        // 所显示的购物篮的名称
        showBasketName: undefined,

        opMode: OPMODES.VIEW,

        //有无上级页面
        historyPrevPage: !!$ionicHistory.backView(),

        // 当前所显示的购物篮
        basket: undefined,

        loadData: function () {
            return cartService.refresh()
                .success(function (data) {
                    ctrl.basket = data.baskets[ctrl.showBasketName];
                })
                .error(errorHandling);
        },

        ///////////////////////////////////////////////////////
        /// 浏览模式
        ///////////////////////////////////////////////////////

        // 选择商品
        onItemSelect: wrapper(function (item) {
            if (item.selected) {
                return cartService.select(ctrl.basket.id, item.id)
                    .error(errorHandling);
            } else {
                return cartService.unselect(ctrl.basket.id, item.id)
                    .error(errorHandling);
            }
        }),

        // 全选
        onItemSelectAll: wrapper(function () {
            if (ctrl.basket.selectedAll) {
                return cartService.selectAll(ctrl.basket.id)
                    .error(errorHandling);
            } else {
                return cartService.unselectAll(ctrl.basket.id)
                    .error(errorHandling);
            }
        }),

        ///////////////////////////////////////////////////////
        /// 编辑模式
        ///////////////////////////////////////////////////////

        // 选中商品
        onItemOperationSelect: function (item) {
            // 所有商品都选中的时候，就更新为已全选状态
            ctrl.basket.opSelectedAll = _.every(ctrl.basket.mainItemsMap, {
                opSelected: true
            });
        },

        // 全选
        onItemOperationSelectAll: function () {
            var isSelected = ctrl.basket.opSelectedAll;
            _.forEach(ctrl.basket.mainItemsMap, function (item) {
                item.opSelected = isSelected;
            });
        },

        // 删除商品
        onDeleteItem: function (item) {
            popup.confirm($translate.instant('cart.removeSingleItem'))
                .then(function (response) {
                    if (response) {
                        loading.open();
                        cartService.removeGoods(item.id)
                            .success(function (data) {
                                if (!ctrl.basket) {
                                    ctrl.toggleOperationMode();
                                }
                            })
                            .error(errorHandling)
                            .finally(function () {
                                loading.close();
                            });
                    }
                });
        },

        // 收藏商品
        onCollectItem: wrapper(function (item) {

            if (!APP_USER.id) {
                modals.login.open();
                return api.when();
            }

            loading.open();
            if (item.collect) {
                return collectService.removeByGoodsId(item.goodsId)
                    .success(function (response) {
                        toast.open(response);
                        item.collect = false;
                    }).error(errorHandling)
                    .finally(function () {
                        loading.close();
                    });
            } else {
                return collectService.add(item.goodsId)
                    .success(function (response) {
                        // 广播收藏事件
                        messageCenter.publishMessage('AT.addToCart', {
                            type: "add_to_wishlist",
                            goodsId: item.goodsId,
                            number: 1,
                            fromLocation: "cart",
                        });
                        toast.open(response);
                        item.collect = true;
                    }).error(errorHandling)
                    .finally(function () {
                        loading.close();
                    });
            }
        }),

        // 批量删除
        onDeleteItemList: function () {

            var items = _.filter(ctrl.basket.mainItemsMap, {
                opSelected: true
            });
            var itemIds = _.pluck(items, 'id');

            if (!itemIds.length) {
                toast.open($translate.instant('cart.notSelectedProductYet'));
                return;
            }
            popup.confirm(
                    $translate.instant('cart.removeConfrimBefore') + ' ' +
                    itemIds.length + ' ' +
                    $translate.instant('cart.removeConfrimAfter')
                )
                .then(function (res) {
                    if (!res) {
                        return;
                    }
                    loading.open();
                    cartService.removeGoods(itemIds)
                        .success(function (data) {
                            if (!data.basket) {
                                ctrl.toggleOperationMode();
                            }
                        })
                        .error(errorHandling)
                        .finally(function () {
                            loading.close();
                        });

                });
        },

        // 批量收藏
        onCollectItemList: wrapper(function () {

            if (!APP_USER.id) {
                modals.login.open();
                return api.when();
            }

            var items = _.filter(ctrl.basket.mainItemsMap, {
                opSelected: true
            });
            var itemIds = _.pluck(items, 'goodsId');

            if (!itemIds.length) {
                toast.open($translate.instant('cart.notSelectedProductYet'));
            }

            return collectService.addList(itemIds)
                .success(function (response) {
                    angular.forEach(items, function (item) {
                        item.collect = true;
                    });
                    toast.open(response);
                }).error(errorHandling);
        }),


        ///////////////////////////////////////////////////////
        /// 通用
        ///////////////////////////////////////////////////////

        // 切换到全球购
        toggleBasket: function(basketName) {
            if (ctrl.showBasketName !== basketName) {
                ctrl.showBasketName = basketName;
                ctrl.basket = ctrl.data.baskets[basketName];

                ctrl.changeOverseasShopFlag();
                $ionicScrollDelegate.resize();

                publishTag();

                // 刷新购物车 如果有倒计时时，保证数据实时
                ctrl.refresh({
                    showLoading: false,
                    emptyData: false
                });
            }
        },

        // 根据当前所显示的购物篮类型，修改 APP_CONFIG.isInOverseasShopView
        changeOverseasShopFlag: function() {
            APP_CONFIG.isInOverseasShopView = ctrl.showBasketName === 'overseasShop';
        },

        // 选择赠品
        onPresentSelect: function (item, rule) {
            loading.open();
            cartService.getPresents(rule.ruleId)
                .success(function (presents) {
                    cartService.processingPresentRuleData(presents, rule);
                    modals.selectPresents.open({
                        params: {
                            // 类型：1-赠品，2-加价购
                            type: rule.rewardType,
                            // 需要选择的商品
                            presents: presents,
                            // 最多可以选择多少件商品
                            selectUpperLimit: rule.presentNumber,
                            // 购物篮 ID
                            basketId: ctrl.basket.id,
                            // 购物项 ID
                            itemId: item && item.id,
                            // 规则 ID
                            ruleId: rule.ruleId
                        }
                    });
                })
                .finally(function () {
                    loading.close();
                });
        },

        /** 修改购物车内商品数量 */
        changeNumber: wrapper(function (item, newNumber, oldNumber) {
            return cartService.editGoods(ctrl.basket.id, item.id, item.goodsId, newNumber)
                .error(errorHandling);
        }),

        onOperationButtionClick: function () {
            ctrl.toggleOperationMode();
        },

        // 切换操作模式
        toggleOperationMode: function () {
            if (ctrl.opMode !== OPMODES.EDIT) {
                ctrl.opMode = OPMODES.EDIT;
                // 将购物车的编辑状态下的选中模式改为未选中状态
                // ctrl.basket.opSelectedAll = false;

            } else {
                ctrl.opMode = OPMODES.VIEW;
            }
        },

        goCheckout: function () {

            if (!APP_USER.id) {
                modals.login.open();
                return;
            }

            loading.open();

            checkoutService.checkoutInfoByCart()
                .success(function (data) {
                    var modalConfig = {
                        params: {
                            data: data
                        }
                    };
                    // 标记该订单来源
                    modalConfig.params.data.origin = 'cart';
                    modals.confirmOrder.open(modalConfig);
                })
                .error(errorHandling)
                .finally(function () {
                    loading.close();
                });
        },

        // 全球购 购物车 显示免邮细则
        showFreeDetail: function() {
            $scope.modals.promptInfo.open({
                params: {
                    title: $translate.instant('freightAmountInfo.title'),
                    content: $translate.instant('freightAmountInfo.content'),
                    content2: $translate.instant('freightAmountInfo.content2'),
                    content3: $translate.instant('freightAmountInfo.content3'),
                    content4: $translate.instant('freightAmountInfo.content4'),
                    content5: $translate.instant('freightAmountInfo.content5'),
                    content6: $translate.instant('freightAmountInfo.content6'),
                    type: 5
                }
            });
        }
    });

    // b2c版动态设置购物篮上下文
    $scope.$watch(function () {
        if (!ctrl.data) {
            return undefined;
        }
        else {
            return ctrl.data.baskets[ctrl.showBasketName];
        }
    }, function (newBasket) {
        ctrl.basket = newBasket;
    });

    // 购物车页面关闭前 关闭领取赠品弹层
    $scope.$on("$ionicView.beforeLeave", function () {
        modals.selectPresents.close();
    });

    // 切换语言后刷新购物车
    messageCenter.subscribeMessage('language.change', function () {
        ctrl.refresh({
            showLoading: false,
            emptyData: false
        });
        ctrl.opMode = OPMODES.VIEW;
    }, $scope);

    function publishTag() {
        // 广播页面Tag
        messageCenter.publishMessage('AT.screen', {
            pageName: "tunnel::step1_" + (APP_CONFIG.isInOverseasShopView ? 'global_cart' : 'general_cart')
        });
    }

    $scope.$on('$ionicView.afterEnter', publishTag);

    $timeout(function () {
        $scope.$broadcast('$ionicHeader.align');
    });

    var deregistration = $scope.$on('$ionicView.afterEnter', function () {
        ctrl.showBasketName = APP_CONFIG.isInOverseasShopView ? 'overseasShop' : 'common';

        ctrl.init();
        deregistration();

        $scope.$on('$ionicView.afterEnter', function () {
            ctrl.refresh({
                showLoading: false,
                emptyData: false
            });
            ctrl.opMode = OPMODES.VIEW;
        });
    });

    $scope.$on('$ionicView.afterEnter', function() {
        ctrl.changeOverseasShopFlag();
    });
});
