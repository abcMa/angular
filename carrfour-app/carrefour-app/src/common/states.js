/**
 * 路由状态配置及相应功能
 */
angular.module('app')
    /**
     * 普通路由状态配置
     */
    .constant('states', {
        'tabs': {
            url: '/tabs',
            abstract: true,
            templateUrl: 'templates/tabs.html',
            controller: 'tabsCtrl as tabs'
        },

        'tabs.index': {
            url: '/index',
            views: {
                index: {
                    templateUrl: 'templates/index.html',
                    controller: 'indexCtrl as index'
                }
            }
        },

        'tabs.demo': {
            url: '/demo',
            views: {
                demo: {
                    templateUrl: 'templates/demo.html',
                    controller: 'demoCtrl as demo'
                }
            }
        },

        'tabs.categories': {
            url: '/categories',
            views: {
                categories: {
                    templateUrl: 'templates/categories.html',
                    controller: 'categoriesCtrl as categories'
                }
            }
        },

        'tabs.scan': {
            url: '/scan',
            views: {
                scan: {
                    templateUrl: 'templates/scan.html',
                    controller: 'scanCtrl as scan'
                }
            }
        },

        'tabs.user': {
            url: '/user',
            views: {
                user: {
                    templateUrl: 'templates/user.html',
                    controller: 'userCtrl as user'
                }
            }
        },

        'tabs.userInfo': {
            url: '/userInfo',
            views: {
                user: {
                    templateUrl: 'templates/userInfo.html',
                    controller: 'userInfoCtrl as userInfo'
                }
            }
        },

        'tabs.userViewHistory': {
            url: '/userViewHistory',
            views: {
                user: {
                    templateUrl: 'templates/userViewHistory.html',
                    controller: 'userViewHistoryCtrl as userViewHistory'
                }
            }
        },

        'tabs.userCollectionList': {
            url: '/userCollectionList',
            views: {
                user: {
                    templateUrl: 'templates/userCollectionList.html',
                    controller: 'userCollectionListCtrl as userCollectionList'
                }
            }
        },

        'tabs.customerService': {
            url: '/customerService',
            views: {
                user: {
                    templateUrl: 'templates/customerService.html',
                    controller: 'customerServiceCtrl as customerService'
                }
            }
        },

        'tabs.customerServiceArticleList': {
            url: '/customerServiceArticleList?channelId&title',
            views: {
                user: {
                    templateUrl: 'templates/customerServiceArticleList.html',
                    controller: 'customerServiceArticleListCtrl as customerServiceArticleList'
                }
            }
        },

        'tabs.settings': {
            url: '/settings',
            views: {
                user: {
                    templateUrl: 'templates/settings.html',
                    controller: 'settingsCtrl as settings'
                }
            }
        },

        'tabs.userAboutUs': {
            url: '/userAboutUs',
            views: {
                user: {
                    templateUrl: 'templates/userAboutUs.html'
                }
            }
        },

        'tabs.userCoupons': {
            url: '/userCoupons',
            views: {
                user: {
                    templateUrl: 'templates/userCoupons.html',
                    controller: 'userCouponsCtrl as userCoupons'
                }
            }
        },

        'tabs.storeInfo': {
            url: '/storeInfo?storeId&start',
            views: {
                user: {
                    templateUrl: 'templates/storeInfo.html',
                    controller: 'storeInfoCtrl as storeInfo'
                }
            }
        },

        'tabs.feedbackOptions': {
            url: '/feedbackOptions',
            views: {
                user: {
                    templateUrl: 'templates/feedbackOptions.html',
                    controller: 'feedbackOptionsCtrl as feedbackOptions'
                }
            }
        },

        'tabs.memberCenter': {
            url: '/memberCenter',
            views: {
                user: {
                    templateUrl: 'templates/memberCenter.html',
                    controller: 'memberCenterCtrl as memberCenter'
                }
            }
        },

        'tabs.unbindMemberCard': {
            url: '/unbindMemberCard?cardNumber',
            views: {
                user: {
                    templateUrl: 'templates/unbindMemberCard.html',
                    controller: 'unbindMemberCardCtrl as unbindMemberCard'
                }
            }
        },

        'tabs.bindMemberCard': {
            url: '/bindMemberCard',
            cache: false,
            views: {
                user: {
                    templateUrl: 'templates/bindMemberCard.html',
                    controller: 'bindMemberCardCtrl as bindMemberCard'
                }
            }
        },

        // 会员信息
        'tabs.memberInfo': {
            url: '/memberInfo',
            views: {
                user: {
                    templateUrl: 'templates/memberInfo.html',
                    controller: 'memberInfoCtrl as memberInfo'
                }
            }
        }
    })

    /**
     * 全球购相关状态配置，要求如下：
     *
     * 1. 根状态必须为 overseasShop，该视图下只有一个 ion-nav-view 标签，所有的全球购视图都放在该 ion-nav-view 下
     * 2. 其它状态名称必须以 'overseasShop.' 开头，并指定 views
     */
    .constant('statesForOverseasShop', {
        'overseasShopIndex': {
            url: '/overseasShop/index',
            templateUrl: 'templates/overseasShopIndex.html',
            controller: 'overseasShopIndexCtrl as overseasShopIndex'
        },

        'overseasShopCategories': {
            url: '/overseasShop/categories',
            templateUrl: 'templates/categories.html',
            controller: 'categoriesCtrl as categories'
        },

        'overseasShopCart': {
            title: 'cart.title',
            url: '/overseasShop/cart',
            templateUrl: 'templates/shoppingCart.html',
            controller: 'shoppingCartCtrl as cart'
        },

        'overseasShopSearch': {
            url: '/overseasShop/search?keyword',
            templateUrl: 'templates/search.html',
            controller: 'searchCtrl as search'
        },

        'overseasShopProductList': {
            title: 'productList.title',
            url: '/overseasShop/productList?categoryId&brandId&keyword&attributes&beginPrice&endPrice&order&page&pageCount&title&url',
            templateUrl: 'templates/productlist.html',
            controller: 'productListCtrl as productList'
        },

        'overseasShopProductInfo': {
            title: 'productInfo.title',
            url: '/overseasShop/productInfo?productId&styleId&goodsId&title',
            templateUrl: 'templates/productInfo.html',
            controller: 'productInfoCtrl as productInfo'
        },

        'overseasShopCartNoTabs': {
            title: 'cart.title',
            url: '/overseasShop/cartNoTabs',
            templateUrl: 'templates/shoppingCart.html',
            controller: 'shoppingCartCtrl as cart',
            data: {
                isHiddenOverseasShopTabs: true
            }
        },

        'overseasShopOrderInfo': {
            title: 'orderInfo.title',
            url: '/overseasShop/orderInfo?id&userSession&payNow&showPayInfo&goPayment&lang',
            templateUrl: 'templates/orderInfo.html',
            controller: 'orderInfoCtrl as orderInfo'
        },

        'overseasShopOrderList': {
            title: 'orderList.title',
            url: '/overseasShop/orderList?type',
            templateUrl: 'templates/orderList.html',
            controller: 'orderListCtrl as orderList'
        },

        'overseasShopActivity': {
            url: '/overseasShop/activity?articleId&title',
            templateUrl: 'templates/activity.html',
            controller: 'activityCtrl as activity'
        }
    })

    /**
     * 在每一个 tab 项下都要提供的状态配置
     *
     * 其中 state 名称 及 url 的格式比较特殊，比如商品列表视图配置为如下 state 名称：
     *
     *   productList
     *
     * 在注册时会自动为其添加前缀：
     *
     *    tabs.indexProductList
     *    tabs.cartProductList
     *
     * url 亦同。
     *
     * 另外不支持设置 views 属性。
     */
    .constant('statesForEveryTab', {
        'productList': {
            url: '/productList?fromCategories&categoryId&brandId&keyword&attributes&beginPrice&endPrice&order&page&pageCount&title&url',
            templateUrl: 'templates/productlist.html',
            controller: 'productListCtrl as productList'
        },

        'productInfo': {
            url: '/productInfo?productId&goodsId&title&fromLocation',
            templateUrl: 'templates/productInfo.html',
            controller: 'productInfoCtrl as productInfo'
        },

        'search': {
            url: '/search?keyword',
            templateUrl: 'templates/search.html',
            controller: 'searchCtrl as search'
        },

        'shoppingCart': {
            url: '/shoppingCart',
            templateUrl: 'templates/shoppingCart.html',
            controller: 'shoppingCartCtrl as cart'
        },

        'orderList': {
            url: '/orderList?type',
            templateUrl: 'templates/orderList.html',
            controller: 'orderListCtrl as orderList'
        },

        'orderInfo': {
            url: '/orderInfo?id',
            templateUrl: 'templates/orderInfo.html',
            controller: 'orderInfoCtrl as orderInfo'
        },

        'activity': {
            url: '/activity?articleId&title',
            templateUrl: 'templates/activity.html',
            controller: 'activityCtrl as activity'
        },

        'messageCenter': {
            url: '/messageCenter',
            templateUrl: 'templates/messageCenter.html',
            controller: 'messageCenterCtrl as messageCenter'
        },

        'messageList': {
            url: '/messageList?title&type',
            templateUrl: 'templates/messageList.html',
            controller: 'messageListCtrl as messageList'
        },

        'nearbyStores': {
            url: '/nearbyStores',
            templateUrl: 'templates/nearbyStores.html',
            controller: 'nearbyStoresCtrl as nearbyStores'
        }
    });
