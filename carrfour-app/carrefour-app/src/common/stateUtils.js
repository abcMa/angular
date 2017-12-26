/**
 * 路由状态配置及相应功能
 */
angular.module('app.services').factory('stateUtils', function (
    $state, states, toast, $ionicHistory, carrefourWallet, $rootScope, openOtherApp, modals
) {
    // 遍历 $state 中当前状态的视图，并将视图名称及相关数据传入回调函数，
    // 如果回调函数返回一个的值，则立即停止遍历，
    // 并将该值返回。
    function eachStateViews(callback) {
        var viewPaths = $state.$current.path,
            result;

        _.forEachRight(viewPaths, function (item) {
            var views = item.self.views;

            _.forEachRight(views, function (data, name) {
                result = callback(name, data);
                return result === undefined;
            });

            return result === undefined;
        });

        return result;
    }

    /**
     * 用于获取在 statesForEveryTab 中定义的，并注册在当前 tab 项中的状态名称
     */
    function getStateNameByCurrentTab(stateName) {
        var t = _.capitalize(stateName),
            stateNameForTab;

        stateNameForTab = eachStateViews(function (viewName) {
            var stateName = 'tabs.' + viewName + t;
            return states[stateName] ? stateName : undefined;
        });

        return stateNameForTab ? stateNameForTab : states[stateName] ? stateName : undefined;
    }

    return {

        getStateNameByCurrentTab: getStateNameByCurrentTab,

        goStateByCurrentTab: function (stateName, params) {
            var exactStateName = getStateNameByCurrentTab(stateName);
            $state.go(exactStateName, params);
        },

        // 商品详情页
        goProductInfo: function (productId, goodsId, title, fromLocation, isOverseasShop) {
            if (arguments.length <= 4) {
                isOverseasShop = APP_CONFIG.isInOverseasShopView;
            }

            if (isOverseasShop === true) {
                return this.goOverseasShopProductInfo(productId, goodsId, title);
            } else {
                var stateName = getStateNameByCurrentTab('productInfo');

                return $state.go(stateName, {
                    productId: productId,
                    goodsId: goodsId,
                    title: title,
                    fromLocation: fromLocation
                });
            }
        },

        // 跳转到订单详情页
        goOrderInfo: function (orderId, isOverseasShop, payNow) {
            if (isOverseasShop) {
                return this.goOverseasShopOrderInfo(orderId, !!payNow);
            } else {
                return this.goStateByCurrentTab('orderInfo', {
                    id: orderId,
                    payNow: !!payNow
                });
            }
        },

        // 跳转商品列表
        goProductList: function (params) {
            if (APP_CONFIG.isInOverseasShopView) {
                return this.goOverseasShopProductList(params);
            } else {
                var stateName = getStateNameByCurrentTab('productList');
                return $state.go(stateName, params);
            }
        },

        //跳转到消息列表
        goMessageList: function (params) {
            var stateName = getStateNameByCurrentTab('messageList');
            $state.go(stateName, params);
        },

        //附近的家乐福
        goNearbyStores: function () {
            var stateName = getStateNameByCurrentTab('nearbyStores');
            $state.go(stateName);
        },

        //跳转到会员卡页面
        goMemberCenter: function(){
            if (!APP_USER.id) {
                modals.login.open({
                    params: {
                        successCallback: function () {
                            $state.go('tabs.memberCenter');
                        }
                    }
                });
            } else {
                $state.go('tabs.memberCenter');
            }
        },

        // 跳到活动页
        goActivity: function (articleId, title) {
            var stateName = getStateNameByCurrentTab('activity');
            $state.go(stateName, {
                articleId: articleId,
                title: title
            });
        },

        //跳转到首页
        goIndex: function (isClearHistory) {
            if (isClearHistory) {
                $ionicHistory.nextViewOptions({
                    disableBack: true,
                    disableAnimate: true,
                    historyRoot: true
                });

                $ionicHistory.clearHistory();
                $ionicHistory.clearCache();
            }
            $state.go('tabs.index');
        },

        // 跳转福卡钱包
        goCarrefourWallet: function () {
            var self = this;
            carrefourWallet.open(undefined, function (state, url) {
                switch (state) {
                    case "backtoindex":
                        self.goIndex();
                        break;

                }
            });
        },

        goByNewMessage: function (message) {
            //如果已经过期，点击没反应
            if (message.content && message.content.isExpired) {
                return;
            } else {
                var state = message.content.state; //1－文章页 2-活动页 3-首页

                switch (state) {
                    case 1:
                    case 2:
                        this.goActivity(message.content.articleId, message.content.articleTitle);
                        break;
                    case 3:
                        this.goIndex();
                        break;
                }
            }
        },

        goOtherApp: function() {
            openOtherApp.open();
        },

        goAdvRedirect: function (type, params) {
            var stateName = null;

            switch (type) {
                case 1:
                    stateName = 'productInfo';
                    break;
                case 2:
                    stateName = 'productList';
                    break;
                case 4:
                    stateName = 'activity';
                    break;
                case 5:
                    this.goOverseasShopIndex();
                    return;
                case 6:
                    this.goNearbyStores();
                    return;
                case 7:
                    this.goCarrefourWallet();
                    return;
                case 8:
                    this.goOtherApp();
                    return;
                case 9:
                    this.goMemberCenter();
                    return;
            }

            if (!stateName) {
                toast.open('数据无效，无法进行跳转。');
                return;
            }

            stateName = getStateNameByCurrentTab(stateName);
            $state.go(stateName, params);
        },

        //跳转到搜索页
        goSearch: function () {
            if (APP_CONFIG.isInOverseasShopView) {
                return this.goOverseasShopSearch();
            } else {
                return this.goStateByCurrentTab('search');
            }
        },

        goCartNoTabs: function () {
            if (APP_CONFIG.isInOverseasShopView) {
                return this.goOverseasShopCartNoTabs();
            } else {
                return this.goStateByCurrentTab('shoppingCart');
            }
        },

        // 全球购广告位跳转逻辑
        goOverseasShopAdvRedirect: function (type, params) {
            switch (type) {
                // 商品详情
                case 1:
                    this.goOverseasShopProductInfo(params.productId, params.goodsId, params.title);
                    break;
                    // 商品列表
                case 2:
                    this.goOverseasShopProductList(params);
                    break;
                    // 广告页
                case 4:
                    this.goOverseasShopActivity(params.articleId, params.title);
                    break;
                case 8:
                    this.goOtherApp();
                    return;
                    // 不支持的广告跳转类型
                default:
                    toast.open('数据无效，无法进行跳转');
                    break;
            }
        },

        // 跳转到全球购首页
        goOverseasShopIndex: function (disableAnimate) {
            if (disableAnimate) {
                $ionicHistory.nextViewOptions({
                    disableAnimate: true
                });
            }

            $state.go(getStateNameByCurrentTab('overseasShopIndex'));
        },

        // 跳转到全球购分类页
        goOverseasShopCategories: function (disableAnimate) {
            if (disableAnimate) {
                $ionicHistory.nextViewOptions({
                    disableAnimate: true
                });
            }

            $state.go(getStateNameByCurrentTab('overseasShopCategories'));
        },

        // 跳转到全球购购物车页面
        goOverseasShopCart: function (disableAnimate) {
            if (disableAnimate) {
                $ionicHistory.nextViewOptions({
                    disableAnimate: true
                });
            }

            $state.go(getStateNameByCurrentTab('overseasShopCart'));
        },

        //跳转到全球购搜索页
        goOverseasShopSearch: function () {
            $state.go(getStateNameByCurrentTab('overseasShopSearch'));
        },

        // 跳转到全球购购物车页面 - 无 tabs
        goOverseasShopCartNoTabs: function () {
            $state.go(getStateNameByCurrentTab('overseasShopCartNoTabs'));
        },

        // 跳转到全球购商品列表页面
        goOverseasShopProductList: function (params) {
            $state.go(getStateNameByCurrentTab('overseasShopProductList'), params);
        },

        // 跳转到全球购商品详情页面
        goOverseasShopProductInfo: function (productId, goodsId, title) {
            $state.go(getStateNameByCurrentTab('overseasShopProductInfo'), {
                productId: productId,
                goodsId: goodsId,
                title: title
            });
        },

        // 跳转到全球购订单详情页面
        goOverseasShopOrderInfo: function (orderId, payNow) {
            if ($rootScope.isWeixinBrowser) {
                var hashUrl = "#/tabs/index/overseasShop/orderInfo?id=" + orderId + "&userSession=" + APP_USER.userSession + "&payNow=" + payNow + "&lang=" + APP_CONFIG.language;
                var newUrl = location.protocol + '//' + location.host + location.pathname + '?' + Math.random() + hashUrl;
                window.location.href = newUrl;
                return;
            }
            $state.go(getStateNameByCurrentTab('overseasShopOrderInfo'), {
                id: orderId,
                payNow: payNow
            });
        },

        // 跳转到全球购广告页
        goOverseasShopActivity: function (articleId, title) {
            $state.go(getStateNameByCurrentTab('overseasShopActivity'), {
                articleId: articleId,
                title: title
            });
        }

    };
});
