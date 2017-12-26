angular.module('app.controllers').controller('productListCtrl', ["$scope", "$state", "$stateParams", "productService", "loadDataMixin", "stateUtils", function (
    $scope, $state, $stateParams, $translate, $ionicScrollDelegate, productService, cartService,
    loadDataMixin, stateUtils, searchHistory, loading, errorHandling, toast, messageCenter, modals, localStorage,
    $timeout
) {
    var ctrl = this;

    /**
     * 1:赠品,
     * 2:加价购,
     * 3:返券,
     * 4:赠积分,
     * 5:满减,
     * 6:减运费,
     * 7:多件折扣,
     * 8:抢购
     */
    angular.extend(ctrl, loadDataMixin, stateUtils, {

        $scope: $scope,

        // 自定义页面标题
        title: $stateParams.title || $translate.instant('productList.title'),

        // 搜索关键字
        keyword: '',

        // 排序
        order: $stateParams.order || productService.productOrders.DEFAULT,

        // 排序处理
        productOrders: productService.productOrders,

        // 查询参数
        searchParams: _.assign({}, $stateParams, function (objectValue, sourceValue, key) {
            return key == 'title' || key == 'order' ? objectValue : sourceValue;
        }),

        // 筛选数据
        filters: undefined,

        /**
         * 搜索功能
         */
        search: function() {
            if (ctrl.keyword) {
                searchHistory.add(ctrl.keyword);
                var param = {
                    keyword: ctrl.keyword
                };
                stateUtils.goProductList(param);
            }
        },
        /**
         * 跳转详情页
         */
        goProductInfo: function (productId, goodsId, name, fromLocation, elementIndex) {
            // // 如果是搜索
            // if (ctrl.searchParams.keyword) {
            // // 广播页面Tag
            // messageCenter.publishMessage('AT.viewTag', {
            //     pageName: 'search::pageresult',
            //     search: {
            //         searchKeywords: ctrl.searchParams.keyword,
            //             searchScreenNumber: Math.floor(elementIndex / ctrl.itemsPerPage) + 1,
            //             searchElementPosition: elementIndex + 1,
            //     },
            //     customVariables: {
            //         "1": APP_LANG[APP_CONFIG.language].$id,
            //         "2": APP_CONFIG.subsiteId,
            //         "17": ctrl.searchParams.keyword,
            //         "18": APP_USER.oldNew,
            //         "19": APP_USER.ageGroup
            //     }
            // });
            // }

            stateUtils.goProductInfo(productId, goodsId, name, fromLocation);
        },

        /**
         * 加载某一分页数据
         */
        loadPage: function (page, pageCount) {
            var searchParams = _.assign({}, ctrl.searchParams),
                filters = ctrl.filters;

            // 搜索时 清空url参数
            if (searchParams.keyword && searchParams.url) {
                searchParams.url = undefined;
            }
            // 将筛选条件加入搜索参数中
            if (filters) {
                if (filters.category) {
                    searchParams.selectedCategoryId = filters.category.id;
                }

                if (filters.brands) {
                    searchParams.brandId = _.keys(filters.brands);
                }

                if (filters.priceRange) {
                    searchParams.beginPrice = filters.priceRange[0];
                    searchParams.endPrice = filters.priceRange[1];
                }
            }

            return productService.search(searchParams, ctrl.order, page, pageCount)
                .success(function (response) {

                    var productIdArray = [];
                    // 取促销信息
                    productService.findListTagByGoodsId(_.pluck(response.items, 'defaultGoodsId'))
                        .success(function (promotionResponse) {
                            angular.forEach(response.items, function (data) {
                                data.promotionList = promotionResponse[data.defaultGoodsId];
                            });
                        });

                    //获取的信息放到缓存中，统计数据使用
                    angular.forEach(response.items, function (data) {
                        productIdArray.push(data.id);
                    });
                    var productIdList = productIdArray.join(',');
                    localStorage.set('productIdList', productIdList);

                    // 广播页面Tag
                    messageCenter.publishMessage('AT.screen', {
                        pageName: 'product_list::product_list',
                        search: {
                            searchKeywords: searchParams.keyword,
                            searchScreenNumber: 0,
                            searchElementPosition: 0
                        },
                        customVariables: {
                            "17": searchParams.keyword
                        },
                    });
                });
        },

        /**
         * 切换排序
         * @param targetName {String} 待切换排序规则的名称
         */
        toggleOrder: function (targetName) {
            var orders = productService.productOrders;

            if (!orders.is(targetName, ctrl.order)) {
                ctrl.order = orders.get(targetName);
                ctrl.refresh();
            } else {
                var descOrder = orders.getAntitone(ctrl.order);
                if (descOrder === undefined) {
                    return;
                }
                ctrl.order = descOrder;
                ctrl.refresh();
            }

            messageCenter.publishMessage('AT.gesture', {
                name: 'product_list::sort::' + orders.getName(ctrl.order),
                action: 'touch'
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
            cartService.addGoods(product.defaultGoodsId, product.flashSale.id, 1)
                .finally(function () {
                    loading.close();
                })
                .success(function () {
                    // 广播加车事件
                    messageCenter.publishMessage('AT.addToCart', {
                        type: "add_to_cart",
                        goodsId: product.defaultGoodsId,
                        number: 1,
                        fromLocation: "productList",
                    });
                    toast.open({
                        template: $translate.instant('productList.collectSuccess')
                    });
                })
                .error(errorHandling);
        },

        /**
         * 打开商品筛选面板
         */
        openProductFilter: function () {
            modals.productFilter.open({
                params: {
                    searchParams: ctrl.searchParams,
                    filters: ctrl.filters,
                    confirm: function (filters) {
                        ctrl.filters = filters;
                        ctrl.refresh();
                        $timeout(function () {
                            $ionicScrollDelegate.scrollTop(true);
                        });
                    }
                }
            });
        },

        /**
         * 跳转到购物车
         */
        goCart: function () {
            stateUtils.goStateByCurrentTab('shoppingCart');
        },

        // 回到顶部
        goBackTop: function () {
            $ionicScrollDelegate.scrollTop(true);
        }
    });

    // 订阅地区选择消息
    messageCenter.subscribeMessage('subsite.change', function (event, subsite) {

        // 切换分站后刷新数据
        ctrl.refresh({
            showLoading: false
        });

    }, $scope);

    $scope.$on('$ionicView.beforeEnter', function () {
        ctrl.keyword = $stateParams.keyword || '';
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
