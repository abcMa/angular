/**
 * Created by admin on 2016/7/14.
 */
angular.module('app.controllers').controller('overseasShopIndexCtrl', ["$scope", "$state", "$ionicPosition", "$ionicScrollDelegate", "$translate", "toast", "loading", "errorHandling", "loadDataMixin", "cartService", "overseasShopIndexService", "utils", "shareService", "messageCenter", function(
    $scope, $state, $ionicPosition, $ionicScrollDelegate, $translate,
    toast, loading, errorHandling, loadDataMixin, cartService, overseasShopIndexService, utils, shareService,
    messageCenter
) {
    var ctrl = this;

    _.assign(ctrl, loadDataMixin, {
        $scope: $scope,

        indexInfo: {},

        //加载首页数据
        loadData: function() {

            // 设置微信分享的信息
            shareService.defaultShareInfo();

            return overseasShopIndexService.getInfo()
            .success(function(response) {
                utils.updateViewModel(response, ctrl.indexInfo);
            });
        },

        /**
         * 添加商品至购物车
         */
        addToCart: function(product) {
            // 如果不可买，展示错误信息
            if(!product.canSell) {
                toast.open(product.stockTips);
                return;
            }

            loading.open();

            cartService.addGoods(product.goodsId, product.flashSaleId, 1)
                .finally(function() {
                    loading.close();
                })
                .success(function() {
                    // 广播加车事件
                    messageCenter.publishMessage('AT.addToCart', {
                        type: "add_to_cart",
                        goodsId: product.goodsId,
                        number: 1,
                        fromLocation: "global_index",
                    });
                    toast.open({
                        template: $translate.instant('productList.collectSuccess')
                    });
                })
                .error(errorHandling);
        },

        /** 滚动到对应的元素 */
        goAnchor: function(id) {
            var position = $ionicPosition.position(angular.element(document.getElementById(id)));
            $ionicScrollDelegate.$getByHandle('overseas-shop-index-scroll').scrollTo(position.left, position.top, true);
        },

        // 回到顶部
        goBackTop: function() {
            $ionicScrollDelegate.scrollTop();
        }
    });

    $scope.$on('$ionicView.afterEnter', function () {
        // 广播页面Tag
        messageCenter.publishMessage('AT.screen', {
            pageName: 'home::homepage'
        });
    });

    var deregistration = $scope.$on('$ionicView.afterEnter', function () {
        ctrl.init();
        deregistration();

        $scope.$on('$ionicView.afterEnter', function () {
            ctrl.refresh({
                emptyData: false,
                showLoading: false
            });
        });
    });

    // 分站信息变化后，刷新数据
    messageCenter.subscribeMessage('subsite.change', function () {
        ctrl.refresh({
            showLoading: false,
            emptyData: false
        });
    }, $scope);

}]);
