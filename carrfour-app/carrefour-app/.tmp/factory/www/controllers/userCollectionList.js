angular.module('app.controllers').controller('userCollectionListCtrl', ["$scope", "collectService", "loadDataMixin", "stateUtils", "$state", "cartService", "errorHandling", "toast", "api", "modals", "loading", "$translate", "popup", "messageCenter", function (
    $scope, collectService, loadDataMixin, stateUtils, $state, cartService,
    errorHandling, toast, api, modals, loading, $translate, popup, messageCenter
) {

    var ctrl = this;

    angular.extend(ctrl, loadDataMixin, stateUtils, {

        $scope: $scope,

        loadPage: function (page, pageCount) {
            if (APP_USER.id) {
                return collectService.list(page, pageCount);
            } else {
                return api.when(APP_USER).error(errorHandling);
            }
        },

        /**
         * 添加商品至购物车
         */
        addToCart: function ($event, product) {
            $event.stopPropagation();
            // 如果不可买
            if (product.canSell !== 1) {
                // 展示错误信息
                toast.open(product.stockTips);
                return;
            }
            loading.open();
            cartService.addGoods(product.goodsId, product.flashSale.id, 1)
                .finally(function () {
                    loading.close();
                })
                .success(function () {
                    // 广播加车事件
                    messageCenter.publishMessage('AT.addToCart', {
                        type: "add_to_cart",
                        goodsId: product.goodsId,
                        number: 1,
                        fromLocation: "wishList",
                    });
                    toast.open({
                        template: $translate.instant('productList.collectSuccess')
                    });
                })
                .error(errorHandling);
        },

        // 删除收藏
        removeCollect: function (goodsId, $event) {
            if($event){
                $event.stopImmediatePropagation();
            }

            popup.confirm($translate.instant('userCollectionList.confirmTxt'))
                .then(function (res) {
                    if (res) {
                        collectService.remove(goodsId)
                            .success(function (data) {
                                toast.open($translate.instant('userCollectionList.deleteTxt'));
                                ctrl.refresh();
                            });
                    }
                });
        },

        /**
         * 跳转到购物车
         */
        goCart: function () {
            stateUtils.goStateByCurrentTab('shoppingCart');
        }

    });

    // 广播页面Tag
    messageCenter.publishMessage('AT.screen', {
        pageName: 'personal_space::my_wishlist'
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
}]);
