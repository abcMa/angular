angular.module('app.controllers').controller('userViewHistoryCtrl', ["$scope", "$state", "api", "modals", "viewHistory", "stateUtils", "loadDataMixin", "loading", "toast", "cartService", "errorHandling", "$translate", "popup", "messageCenter", function (
    $scope, $state, api, modals, viewHistory, stateUtils, loadDataMixin, loading,
    toast, cartService, errorHandling, $translate, popup, messageCenter
) {
    var ctrl = this;

    _.assign(ctrl, loadDataMixin, stateUtils, {

        $scope: $scope,

        userInfo: APP_USER,

        // 浏览历史数据
        viewHistory: [],

        // 每页加载数量
        itemsPerPage: 8,

        loadPage: function (page, pageCount) {
            return viewHistory.getPage(page, pageCount).success(function (response) {
                // 异步更新商品状态
                var items = response.items;
                var goodsIds = _.pluck(items, "goodsId").join("-");

                api.get("/collect/findBrowsingHistory", {
                    goodsIds: goodsIds
                }).success(function (response) {
                    angular.forEach(ctrl.viewHistory, function (data, index) {
                        var dataAsync = response[data.goodsId];
                        if (_.isUndefined(dataAsync)) {
                            return;
                        }

                        data.isOverseasShop = dataAsync.isOverseasShop;
                        data.pic = dataAsync.productImgUrl;
                        data.name = dataAsync.productName;
                        data.price = dataAsync.flashSale && dataAsync.flashSale.price;
                        data.flashSaleId = dataAsync.flashSale && dataAsync.flashSale.id;
                        data.stockTips = dataAsync.stockTips;
                        data.canSell = dataAsync.canSell;

                        viewHistory.update(data);
                    });
                });
                ctrl.viewHistory = ctrl.viewHistory.concat(items);
            });
        },

        /**
         * 清空浏览记录
         */
        onCleanup: function () {
            popup.confirm($translate.instant('userViewHistory.clearConfirm'))
                .then(function (res) {
                    if (res) {
                        viewHistory.clear();
                        toast.open($translate.instant('userViewHistory.clearDone'));
                        ctrl.viewHistory = [];
                    }
                });
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
            // 抢购商品用抢购id
            cartService.addGoods(product.goodsId, product.flashSaleId, 1)
                .finally(function () {
                    loading.close();
                })
                .success(function () {
                    // 广播加车事件
                    messageCenter.publishMessage('AT.addToCart', {
                        type: "add_to_cart",
                        goodsId: product.goodsId,
                        number: 1,
                        fromLocation: "viewHistory",
                    });
                    toast.open({
                        template: $translate.instant('productList.collectSuccess')
                    });
                })
                .error(errorHandling);
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
        pageName: 'personal_space::my_history'
    });

    var deregistration = $scope.$on('$ionicView.afterEnter', function () {
        ctrl.init();
        deregistration();

        $scope.$on('$ionicView.afterEnter', function () {
            ctrl.viewHistory = [];
            ctrl.init();
        });
    });
}]);
