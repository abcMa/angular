/**
 * 首页控制器
 */
angular.module('app.controllers').controller('indexCtrl', function (
    $scope, $state, modals, $translate, userService, $timeout,
    $ionicPlatform, loadDataMixin, $interval, $ionicScrollDelegate, $ionicSlideBoxDelegate,
    stateUtils, messageCenter, indexService, loading, toast, errorHandling, $ionicHistory,
    utils, $stateParams, localStorage, messageCenterService, overseasShopIndexService, cartService, shareService
) {
    var ctrl = this;

    _.assign(ctrl, loadDataMixin, stateUtils, {

        $scope: $scope,

        // AT统计映射表
        // atEnum: atEnum,

        // 分站名称
        regionName: APP_CONFIG.regionName,

        messageCenterService: messageCenterService,

        // vm绑定数据
        indexInfo: {},

        // 单品精选数据
        recProducts: [],

        //抢购倒计时
        timerHandle: undefined,

        // 秒杀商品
        flashSlidesOptions: {
            slidesPerView: 'auto'
        },

        // 秒杀区倒计时
        flashSaleCounterOption: {
            businessAvailable: false,
        },

        /**
         * 跳转到搜索页面
         */
        goSearch: function () {
            var stateName = stateUtils.getStateNameByCurrentTab('search');
            // nativeTransition.forward();
            $state.go(stateName);
        },

        /**
         * 选择地区
         */
        selectRegion: function () {
            modals.selectRegion.open();
        },

        /**
         * 跳转到全球购首页
         */
        goOverseasShopIndex: function () {
            if (APP_CONFIG.overseasShopId > 0) {
                stateUtils.goOverseasShopIndex();
            } else {
                loading.open();
                overseasShopIndexService.getOverseasId()
                    .success(function (response) {
                        APP_CONFIG.overseasShopId = response;
                        stateUtils.goOverseasShopIndex();
                    })
                    .error(errorHandling)
                    .finally(function () {
                        loading.close();
                    });
            }
        },

        // 加载首页频道
        loadData: function () {
            //获取频道信息
            return indexService.getInfo('mobile')
                .error(errorHandling)
                .success(function (response) {
                    if (ctrl.timerHandle) {
                        $interval.cancel(ctrl.timerHandle);
                    }

                    if (_.isEmpty(ctrl.indexInfo)) {
                        utils.updateViewModel(response, ctrl.indexInfo);
                    }

                    indexService.getFlashSale().success(function (flashSaleResponse) {
                        // 重置倒计时
                        ctrl.flashSaleCounterOption.businessAvailable = false;
                        if (moment().isAfter(flashSaleResponse.endDate)) {
                            flashSaleResponse.endDate = false;
                        } else {
                            flashSaleResponse.coutdown = false;
                        }
                        _.each(response.flashSales.flashProducts, function (product) {
                            if (flashSaleResponse.goodsList && flashSaleResponse.goodsList[product.goodsId]) {
                                product.flashSaleOption = flashSaleResponse.goodsList[product.goodsId];
                            }
                        });
                        $timeout(function () {
                            ctrl.flashSaleCounterOption = flashSaleResponse;
                            utils.updateViewModel(response, ctrl.indexInfo);
                            // 秒杀区变更以后resize swiper
                            $timeout(function () {
                                ctrl.seckillHandler.update();
                            });
                        });

                        // 秒杀区变更以后resize swiper
                        $timeout(function () {
                            ctrl.seckillHandler.update();
                        });
                    });
                });
        },

        loadProductsByStructureId: function (structureId) {
            _.forEach(ctrl.recType, function (target) {
                target.active = target.id == structureId;
            });
            $timeout(function () {
                loadRecProductsAsync(structureId);
            });
        },

        // 回到顶部
        goBackTop: function () {
            $ionicScrollDelegate.scrollTop();
        },

        addToCart: function ($event, product) {
            $event.stopPropagation();
            // 如果不可买
            if (!product.canSell) {
                // 展示错误信息
                toast.open(product.stockTips);
                return;
            }
            loading.open();
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
                        fromLocation: "index",
                    });
                    toast.open({
                        template: $translate.instant('index.addToCartSuccess')
                    });
                })
                .error(errorHandling);
        }
    });

    function loadRecTypeAsync() {
        indexService.getRecType()
            .success(function (response) {
                // 如果有已选中的， 就保持选中状态
                // 否则选中第一项
                var currentIndex = _.findIndex(ctrl.recType, 'active');
                if (currentIndex <= 0) {
                    currentIndex = 0;
                }
                ctrl.recType = response;
                ctrl.recType[currentIndex].active = true;
                loadRecProductsAsync(ctrl.recType[currentIndex].id);
            });
    }

    function loadRecProductsAsync(structureId) {
        indexService.getRecProductsByTypeId(structureId)
            .success(function (response) {
                // ctrl.recProducts = response;
                utils.updateViewModel(response, ctrl.recProducts);
            });
    }

    // 订阅地区选择消息
    messageCenter.subscribeMessage('subsite.change', function (event, subsite) {
        ctrl.regionName = subsite.regionName;

        // 设置微信分享的信息
        shareService.defaultShareInfo();

        // 切换分站后重新加载首页数据
        ctrl.refresh({
            emptyData: false,
            showLoading: false
        });

        // 秒杀区变更以后resize swiper
        $timeout(function () {
            ctrl.seckillHandler.slideTo(0, 0);
            ctrl.seckillHandler.update();
        });
    }, $scope);

    // 订阅锁屏恢复
    messageCenter.subscribeMessage('resume', function () {
        // 因为这个事件有可能在海外购环境下触发，所以需要过滤一下
        if (APP_CONFIG.isInOverseasShopView) {
            return;
        }
        // 锁屏解锁后刷新首页数据
        ctrl.refresh({
            emptyData: false,
            showLoading: false
        });
    }, $scope);

    // 切换语言后重新加载对应语言的地区名称
    messageCenter.subscribeMessage('language.change', function () {
        ctrl.loadData();
    }, $scope);

    // 分站更新后更新左上角分站名称
    messageCenter.subscribeMessage('subsite.update', function (e,subsite) {
        ctrl.regionName = subsite.regionName;
    }, $scope);

    $scope.$on('$ionicView.afterEnter', function () {
        // 广播页面Tag
        messageCenter.publishMessage('AT.screen', {
            pageName: 'home::homepage'
        });
        $scope.$broadcast('AT.review');

        // 设置微信分享的信息
        shareService.defaultShareInfo();
    });

    var deregistration = $scope.$on('$ionicView.afterEnter', function () {

        document.title = "家乐福微信商城";

        ctrl.init({
            showLoading: false
        });
        deregistration();

        $scope.$on('$ionicView.afterEnter', function () {
            $ionicHistory.clearHistory();
            ctrl.refresh({
                emptyData: false,
                showLoading: false
            });
        });

    });

    // 首页飘雪
    var getConfig = indexService.getSnowing();

    function checkSnow() {
        // 可能触发多次
        if (window.isSnowed) {
            return;
        }
        getConfig.success(function (data) {
            if (!moment().isBetween(data.startTime, data.endTime)) {
                return;
            }
            window.isSnowed = true;
            var stopSnow = window._startSnowing($(".index-snowing")[0]);
            $timeout(function () {
                stopSnow();
            }, data.showSeconds * 1000);

            $scope.$on('$ionicView.beforeEnter', function () {
                stopSnow();
            });
        });
    }

    if (APP_CONFIG.os === 'weixin') {
        $scope.$on('$ionicView.afterEnter', checkSnow);
    } else {
        messageCenter.subscribeMessage('index.enter', checkSnow);
    }
});
