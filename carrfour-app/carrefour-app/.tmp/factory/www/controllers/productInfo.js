angular.module('app.controllers').controller('productInfoCtrl', ["$scope", "$state", "stateUtils", "$stateParams", "loadDataMixin", "$translate", "$ionicScrollDelegate", "productService", "cartService", "errorHandling", "toast", "messageCenter", "globalService", "$timeout", "viewHistory", "modals", "collectService", "$interval", "api", "$ionicHistory", "shareService", function (
    $scope, $state, stateUtils, $stateParams, loadDataMixin, $translate, $ionicScrollDelegate,
    productService, cartService, errorHandling, toast, messageCenter, globalService, $timeout,
    viewHistory, modals, collectService, $interval, api, $ionicHistory, shareService
) {

    var ctrl = this;

    angular.extend(ctrl, loadDataMixin, stateUtils, {

        $scope: $scope,

        // 购物车数量默认值
        number: 1,

        historyPrevPage: !!$ionicHistory.backView(),

        //购物车中商品总数量
        // cartTotalNumber: 0,

        //页面标题
        title: $stateParams.title || $translate.instant('productInfo.title'),

        // 是否切换至图文详情面板
        switched: false,

        // 默认tab为 商品介绍
        activeTab: 0,

        // 浏览历史数据
        viewHistory: viewHistory.getAll(),

        // 已上架?
        isAvailable: false,

        // 抢购进行中?
        isFlashSaleNow: false,

        // 加载完成?
        isLoaded: false,

        // 最大counter的数量
        maxCount: 1,

        //定义tabs
        infoTabs: [{
            name: "more_info",
            text: $translate.instant('productInfo.productContent'),
            active: true
        }, {
            name: "specs",
            text: $translate.instant('productInfo.productProperties'),
            active: false
        }, {
            name: "after_sales",
            text: $translate.instant('productInfo.productAfterSales'),
            active: false
        }],

        // 促销规则折叠
        isRulesFolded: true,
        toggleFoldRules: function () {
            this.isRulesFolded = !this.isRulesFolded;
        },

        // 促销规则折叠
        isServicesFolded: true,
        toggleFoldServices: function () {
            this.isServicesFolded = !this.isServicesFolded;
        },

        //切换tab
        changeTab: function (index) {

            ctrl.activeTab = index;

            for (var i in ctrl.infoTabs) {
                var tab = ctrl.infoTabs[i];
                tab.active = i == index;
            }
            $ionicScrollDelegate.resize();
        },

        //加载商品信息
        loadData: function () {
            var goodsId = $stateParams.goodsId;
            var productId = $stateParams.productId;
            if (goodsId || productId) {
                return productService.info(goodsId, productId)
                    .success(function (response) {
                        if (!response) {
                            return;
                        }

                        // 商品有效才统计
                        if (response.goods) {

                            messageCenter.publishMessage('productInfo.lodaData', response);

                            // 广播页面Tag
                            var picto = [];
                            var coupon = [];
                            _.each(response.goods.rules, function (item) {
                                picto.push(item.rewardMark);
                                coupon.push(item.ruleName);
                            });

                            messageCenter.publishMessage('AT.screen', {
                                pageName: "product::product_details",
                                aisles: {
                                    level1: response.category && response.category[0],
                                    level2: response.category && response.category[1],
                                    level3: response.category && response.category[2],
                                    level4: response.category && response.category[3],
                                    level5: response.category && response.category[4]
                                },
                                customScreenVariables: {
                                    "1": response.category && response.category[0],
                                    "2": response.category && response.category[1],
                                    "3": response.category && response.category[2],
                                    "4": response.category && response.category[3],
                                    "5": response.category && response.category[4],
                                    "6": response.name,
                                },
                                customVariables: {
                                    "8": response.goods.id,
                                    "10": response.name,
                                    "11": response.goods.salesPrice.value,
                                    "13": $stateParams.fromLocation,
                                    "14": picto,
                                    "16": coupon,
                                }
                            });
                        }
                        //推荐商品默认给个空数组
                        response.recommends = [];

                        //转义一下返回的文描html
                        response.content = _.unescape(response.content);

                        // $timeout(function () {
                        //     //重置页面标题
                        //     ctrl.title = response.name;
                        //
                        // }, 500);

                        ctrl.title = response.name;

                        // 是否为上架商品
                        ctrl.isAvailable = !(_.isNull(response.goods) || !response.goods.isSellable);

                        // 没上架怎么抢购?
                        if (ctrl.isAvailable) {

                            // 抢购商品才有倒计时
                            var flashSale = response.goods.flashSale;
                            if (!_.isNull(flashSale) && flashSale.state <= 1) {
                                // 抢购进行中吗?
                                ctrl.isFlashSaleNow = flashSale.state == 1;
                                ctrl.flashSaleTimer(flashSale, goodsId, productId);
                            } else {
                                ctrl.isFlashSaleNow = false;
                            }
                        }

                        // 存进浏览历史
                        viewHistory.add({
                            canSell: response.goods && response.goods.isSellable ? 1 : 2,
                            productId: response.productId,
                            goodsId: response.goods && response.goods.id,
                            name: response.name,
                            pic: response.pics[0],
                            price: response.goods && response.goods.salesPrice.value,
                            isOverseasShop: response.isOverseasShop,
                            stockTips: response.goods && response.goods.stockTips

                        });

                        //判断最大counter数值
                        if (response.goods && response.goods.count) {
                            ctrl.maxCount = response.goods.count > 99 ? 99 : response.goods.count;
                        }

                        //异步读取推荐商品
                        productService.getGoodsMatch(goodsId, productId).success(function (data) {
                            ctrl.data.recommends = data;
                        });

                        // 读取售后信息
                        globalService.getArticleInfo('afterSales').success(function (data) {
                            ctrl.data.afterSales = data;
                        });

                        // 获取门店信息
                        productService.getStoreInfo().success(function (data) {
                            ctrl.data.storeInfo = data;
                        });

                        // 设置微信分享的信息
                        shareService.wechatShareInfo('product', response.productId);

                        // 获取文描页脚
                        productService.getProductFooter(response.productId).success(function (data) {
                            ctrl.data.footer = _.unescape(data.details);
                        });

                    }).finally(function () {
                        ctrl.isLoaded = true;
                    });
            }

        },
        flashSaleTimer: function (flashSale, goodsId, productId) {
            var tickCountDown = function () {
                flashSale.countDown -= 1000;
                if (flashSale.countDown <= 0) {
                    flashSale.countDown = 0;
                    $interval.cancel(tickPromise);
                    ctrl.refreshProductStatus(goodsId, productId);
                    return;
                }
            };
            var tickPromise = $interval(tickCountDown, 1000);
        },
        // 因为在抢购倒计时这个时间点请求回来的数据可能状态还未改变，
        // 所以需要判断有效性直到请求到一个状态改变后的商品数据
        // 延迟3秒，最多三次
        refreshProductStatus: function (goodsId, productId) {
            var times = 3;
            var tickPromise = $interval(function () {
                if (times <= 0) {
                    $interval.cancel(tickPromise);
                }
                requestProductInfo()
                    .success(function (response) {
                        $interval.cancel(tickPromise);
                        var goods = response.goods;
                        var flashSale = response.goods.flashSale;
                        ctrl.data.goods = goods;
                        if (flashSale.state)
                            switch (flashSale.state) {
                                case 1:
                                    ctrl.isFlashSaleNow = true;
                                    ctrl.flashSaleTimer(flashSale, goods.id, response.productId);
                                    break;
                                case 2:
                                    ctrl.isFlashSaleNow = false;
                                    break;
                            }
                    })
                    .error(function (response) {})
                    .finally(function () {
                        times--;
                    });
            }, 3000);

            function requestProductInfo() {
                var deferred = api.defer();
                productService.info(goodsId, productId)
                    .success(function (response) {
                        // 正确的内容就resolve
                        if (!response || !response.goods || !response.goods.flashSale) {
                            deferred.reject(false, response);
                            return;
                        }
                        var flashSale = response.goods.flashSale;
                        switch (flashSale.state) {
                            case 1:
                                if (flashSale.id > 0) {
                                    deferred.resolve({
                                        data: response
                                    });
                                } else {
                                    deferred.reject(false, response);
                                }
                                break;
                            case 2:
                                if (flashSale.id < 0) {
                                    deferred.resolve({
                                        data: response
                                    });
                                } else {
                                    deferred.reject(false, response);
                                }
                                break;
                            default:
                                deferred.reject(false, response);
                                break;

                        }
                    })
                    .error(errorHandling)
                    .error(function () {
                        deferred.reject(false, response);
                    });
                return deferred.promise;
            }
        },

        //加入购物车
        addToCart: function () {
            if (!ctrl.data.goods) {
                return;
            }
            var goodsId = ctrl.data.goods.id;

            // 抢购商品，并且为进行中的抢购商品时，需要添加抢购商品id
            var flashSaleId = (ctrl.data.goods.flashSale && ctrl.data.goods.flashSale.state == 1) ? ctrl.data.goods.flashSale.id : undefined;

            if (flashSaleId) {
                if (!APP_USER.id) {
                    modals.login.open();
                    return;
                }
            }
            cartService.addGoods(goodsId, flashSaleId, ctrl.number).success(function (response) {
                // ctrl.cartTotalNumber = response.basket.info.totalQuantity;
                var message = $translate.instant('productInfo.addToCartSuccess');
                toast.open(message);
                // 广播加车事件
                messageCenter.publishMessage('AT.addToCart', {
                    type: "add_to_cart",
                    goodsId: ctrl.data.goods.id,
                    number: ctrl.number,
                    fromLocation: "productInfo",
                });
            }).error(errorHandling);
        },

        //推荐商品详情
        goRecommendProductInfo: function (goods) {
            // 商品详情视图
            var stateName = stateUtils.getStateNameByCurrentTab('productInfo', $state);

            if (stateName) {
                $state.go(stateName, {
                    goodsId: goods.id,
                    productId: goods.productId,
                    title: goods.productName
                });
            }
        },

        // 打开头部更多按钮
        openHeaderMoreBtns: function (el) {
            modals.productInfoMoreBtns.open({
                params: {
                    hideBanner: el.hideBanner
                }
            });
        },

        // // 进入搜索页
        // goSearch: function () {
        //     var stateName = stateUtils.getStateNameByCurrentTab('search', $state);
        //     if (stateName) {
        //         $state.go(stateName);
        //     }
        // },

        // 进入首页
        goIndex: function () {
            // 这里手动广播事件是因为如果通过directive的话
            // 触发时点会在路由转换之后
            // 就会发生标记错误
            messageCenter.publishMessage('AT.gesture', {
                name: "product::back_home",
                type: "navigation"
            });
            $state.go('tabs.index');
        },

        // 打开浏览记录侧栏
        openSiderBarBrowerList: function () {
            modals.siderBarBrowerList.open();
        },

        // 打开商品评价页
        goCommentList: function () {
            modals.conmmentList.open({
                params: {
                    productId: ctrl.data.productId
                }
            });
        },

        // 加入/取消收藏
        toggleCollection: function (goodsId) {

            if (!goodsId) {
                toast.open($translate.instant('productInfo.cantCollect'));
                return;
            }

            if (!APP_USER.id) {
                modals.login.open();
                return;
            }

            var isCollected = ctrl.data.collect;
            if (isCollected) {
                collectService.removeByGoodsId(goodsId).success(function (response) {
                    toast.open(response);
                    ctrl.data.collect = false;
                }).error(errorHandling);
            } else {
                collectService.add(goodsId).success(function (response) {
                    toast.open(response);
                    ctrl.data.collect = true;

                    // 广播收藏事件
                    messageCenter.publishMessage('AT.addToCart', {
                        type: "add_to_wishlist",
                        goodsId: goodsId,
                        number: 1,
                        fromLocation: "productInfo",
                    });
                }).error(errorHandling);
            }
        },

        openArticle: function (id, name) {
            if (!id) {
                return;
            }
            modals.article.open({
                params: {
                    articleId: id,
                    title: name
                }
            });
        },

        //打开税率说明弹层
        goTaxInfo: function () {
            $scope.modals.promptInfo.open({
                params: {
                    title: $translate.instant('productInfo.taxInfo.title'),
                    content: $translate.instant('productInfo.taxInfo.content'),
                    content2: $translate.instant('productInfo.taxInfo.content2'),
                    type: 4
                }
            });
        },

        //全球购 显示免邮细则
        showFreeDetail: function () {
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
        },

        // 查看公司详情
        openArticlePrompt: function (articleId, articleTitle) {
            modals.articlePrompt.open({
                params: {
                    id: articleId,
                    title: articleTitle
                }
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
                showLoading: false,
                emptyData: false
            });
        });
    });

    // 当视图离开时（进入到下一个视图或返回到上一个视图），重置为默认分享信息
    $scope.$on('$ionicView.beforeLeave', function() {
        shareService.defaultShareInfo();
    });

    // 订阅锁屏消息
    // 锁屏解锁后刷新数据
    messageCenter.subscribeMessage('resume', function () {
        ctrl.refresh({
            showLoading: false,
            emptyData: false
        });
    }, $scope);

    // 分站信息变化后，刷新详情页数据
    messageCenter.subscribeMessage('subsite.change', function () {
        ctrl.refresh({
            showLoading: false,
            emptyData: false
        });
    }, $scope);

}]);
