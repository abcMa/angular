/*eslint no-console: "off"*/
/**
 * 数据统计
 * AT Internet
 *
 * 这种标记方式可真愚蠢
 * 为什么会变成这样呢_(:з」∠)_
 * 一把辛酸泪
 *
 * mk2 也没好的了哪去 -- 2017-03-21
 */

angular.module('app.services')
    .factory('analytics', ["messageCenter", "atTagServices", "atTagging", function (
        messageCenter, atTagServices, atTagging
    ) {

        function convertProducts(products) {
            var arr = [];
            _.each(products, function (item) {
                arr.push({
                    // category1: item.category[0],
                    // category2: item.category[1],
                    // category3: item.category[2],
                    // category4: item.category[3],
                    // category5: item.category[4],
                    // category6: item.category[5],
                    quantity: item.quantity,
                    productId: item.goodsId,
                    unitPriceTaxIncluded: item.price
                });
            });
            return arr;
        }


        return {
            init: function (site, secure) {

                // 设置基本内容
                atTagging.set({
                    main: {
                        site: site,
                        secure: secure
                    },
                    population: {
                        visitorID: APP_USER.id,
                        visitorCategory: APP_USER.sex
                    },
                    sales: {
                        newCustomer: APP_USER.newCustomer,
                    },
                    customVariables: {
                        "1": APP_LANG[APP_CONFIG.language].$id,
                        "2": APP_CONFIG.subsiteId,
                        "18": APP_USER.newCustomer,
                        "19": APP_USER.ageGroup
                    }
                });

                // 监听标记事件
                messageCenter.subscribeMessage('AT.screen', function (event, tag) {
                    atTagging.set(tag).tagScreen();
                });

                // 监听行为事件
                messageCenter.subscribeMessage('AT.gesture', function (event, gesture) {
                    atTagging.tagGesture(gesture);
                });

                // 监听展示事件
                messageCenter.subscribeMessage('AT.AdShow', function (event, ad) {
                    atTagging.tagAdShow(ad);
                });

                // 监听广告点击事件
                messageCenter.subscribeMessage('AT.AdClick', function (event, ad) {
                    atTagging.tagAdClick(ad);
                });

                // 监听搜索结果事件
                messageCenter.subscribeMessage('AT.searchResult', function (event, searchResult) {
                    atTagging.tagSearchResult(searchResult);
                });

                // 监听加车事件
                messageCenter.subscribeMessage('AT.addToCart', function (event, goods) {
                    atTagServices.getProduct(goods.goodsId).success(function (response) {
                        var picto = [];
                        var coupon = [];
                        _.each(response.rules, function (item) {
                            picto.push(item.rewardMark);
                            coupon.push(item.ruleName);
                        });
                        // 避免因为后台没有传对象引发的前端错误
                        if (!response.category) {
                            response.category = [];
                        }
                        atTagging.set({
                            pageName: goods.type,
                            aisles: {
                                level1: response.category[0],
                                level2: response.category[1],
                                level3: response.category[2],
                                level4: response.category[3],
                                level5: response.category[4]
                            },
                            customVariables: {
                                "8": response.goodsId,
                                "9": response.barcode,
                                "10": response.productName,
                                "11": response.price,
                                "12": goods.number,
                                "13": goods.fromLocation,
                                "14": picto,
                                "16": coupon
                            }
                        }).tagCart();
                    });
                });

                // 监听创建订单事件
                messageCenter.subscribeMessage('AT.createOrder', function (event, order) {
                    atTagServices.getOrder(order.orderId).success(function (response) {
                        atTagging.set({
                            pageName: 'tunnel::step4_payment_center_pre1',
                            sales: {
                                orderId: order.orderId,
                                turnover: response.paymentAmount,
                                status: 1,
                                // paymentMethod: response.paymentMethod, 这个是支付方式(在线支付/货到付款),但他们要的是银联/支付宝/微信
                                amountTaxIncluded: response.paymentAmount,
                                deliveryMethod: response.deliveryMethod,
                                shippingFeesTaxIncluded: response.shippingFeesTaxIncluded,
                                discountTaxIncluded: response.discountTaxIncluded,
                                orderCustomVariables: {
                                    service: response.deliveryMethod,
                                    numberOfArticles: response.products.length
                                },
                                products: convertProducts(response.products)
                            }
                        }).tagCreateOrder();
                    });
                });

                // 监听支付订单事件
                messageCenter.subscribeMessage('AT.payment', function (event, order) {
                    atTagging.tagOrderPayment(order);
                });

                // 监听登入登出
                messageCenter.subscribeMessage('user.info', function (event, userInfo) {
                    atTagging.set({
                        population: {
                            visitorID: userInfo.id,
                            visitorCategory: userInfo.sex
                        },
                        sales: {
                            newCustomer: userInfo.newCustomer,
                        },
                        customVariables: {
                            "18": userInfo.newCustomer,
                            "19": userInfo.ageGroup
                        }
                    });
                });

                messageCenter.subscribeMessage('logout', function () {
                    atTagging.set({
                        population: {
                            visitorID: "",
                            visitorCategory: 0
                        },
                        sales: {
                            newCustomer: false,
                        },
                        customVariables: {
                            "18": undefined,
                            "19": undefined
                        }
                    });
                });

                // 监听切换分站
                messageCenter.subscribeMessage('subsite.change', function (event, subsite) {
                    atTagging.set({
                        sales: {
                            orderCustomVariables: {
                                shopId: subsite.subsiteId
                            }
                        },
                        customVariables: {
                            "2": subsite.subsiteId,
                        }
                    });
                });
            }
        };
    }])

    /**
     * 标记用的directives
     */

    .directive('atGesture', ["messageCenter", function (
        messageCenter
    ) {
        return {
            restrict: 'A',
            link: function ($scope, $el, $attrs) {
                $el.on('click', function () {
                    messageCenter.publishMessage('AT.gesture', {
                        name: $attrs.atGesture,
                        type: $attrs.gestureAction || "navigation"
                    });
                });
            }
        };
    }])
    .directive('atSearchResult', ["messageCenter", function (
        messageCenter
    ) {
        return {
            restrict: 'A',
            link: function ($scope, $el, $attrs) {
                $el.on('click', function () {
                    messageCenter.publishMessage('AT.searchResult', {
                        keyword: $attrs.atSearchResult || "",
                        resultScreenNumber: $attrs.screenNumber || 0,
                        resultPosition: $attrs.resultPosition || 0
                    });
                });
            }
        };
    }])
    .directive('atAds', ["messageCenter", "observer", function (
        messageCenter, observer
    ) {

        function install(ad, $el, $scope) {
            var unsubscribe;

            function elementClick() {
                messageCenter.publishMessage('AT.AdClick', ad);
            }

            function elementWatch() {
                messageCenter.publishMessage('AT.AdShow', ad);
            }

            unsubscribe = observer.subscribe($el, elementWatch);


            $el.on('click', elementClick);

            // 重新访问页面事件
            // 不直接监听$ionicView.afterEnter的原因是其触发方式是$emit
            // ng-repeat内容上的directive属于页面$scope的子级，接收不到这个事件
            // 现在的处理方式是在controller里监听到afterEnter后使用$broadcast广播出来
            // 这样的话子集directive就可以接收到了
            $scope.$on('AT.review', function () {
                unsubscribe();
                unsubscribe = observer.subscribe($el, elementWatch);
            });

            // 清理监听事件
            // 比如那种注册监听了之后并没有触发过的
            // 如果不清理的话就会产生对一个DOM监听了两次的情况，
            // 第一次是未清理的(上次的数据)，第二次是新数据
            $scope.$on('$destroy', function () {
                unsubscribe();
            });

            return function () {
                unsubscribe();
                $el.off('click', elementClick);
                return undefined;
            };
        }
        return {
            restrict: 'A',
            link: function ($scope, $el, $attr) {
                var uninstall, lastUpdate;

                $scope.$watch($attr.atAds, function (newValue) {

                    if (_.eq(newValue, lastUpdate)) {
                        return;
                    } else {
                        if (uninstall) {
                            uninstall = uninstall();
                        }

                        lastUpdate = newValue;
                        uninstall = install(newValue, $el, $scope);
                    }
                });
            }
        };
    }])

    /**
     * 服务器接口
     */

    .factory('atTagServices', ["api", "$http", function (
        api, $http
    ) {
        return {

            getProduct: function (goodsId) {
                return api.get('/analytics/product', {
                    goodsId: goodsId
                });
            },

            getOrder: function (orderId) {
                return api.get('/analytics/order', {
                    orderId: orderId
                });
            },

            updateOrder: function (params) {
                return $http({
                    url: "http://logc207.xiti.com/hit.xiti",
                    method: "GET",
                    params: params
                });
            }
        };
    }])

    /**
     * 结构构造包装
     */

    .factory('atTagging', ["atTagServices", function (
        atTagServices
    ) {
        var fullParams = {
            main: {
                site: "",
                secure: false
            },
            population: {
                visitorID: "",
                visitorCategory: 0
            },
            search: {
                searchKeywords: "",
                searchScreenNumber: 0,
                searchElementPosition: 0
            },
            sales: {
                cartId: "",
                orderId: "",
                turnover: 0,
                status: 0,
                newCustomer: false,
                paymentMethod: 0,
                amountTaxIncluded: 0,
                deliveryMethod: "",
                shippingFeesTaxIncluded: 0,
                discountTaxIncluded: 0,
                promotionalCode: "",
                orderCustomVariables: {
                    shopId: "",
                    service: "",
                    numberOfArticles: 0
                },
                products: []
            },
            aisles: {
                level1: "",
                level2: "",
                level3: "",
                level4: "",
                level5: "",
                level6: ""
            },
            customVariables: {

            },
            customScreenVariables: {

            },
            pageName: ""
        };

        function cleanCustomVars(arr) {
            _.each(arr, function (item, index) {
                if (_.isUndefined(item)) {
                    delete arr[index];
                }
            });
        }

        return {
            get: function () {
                return _.cloneDeep(fullParams);
            },
            set: function (params) {
                if (params.pageName && APP_CONFIG.isInOverseasShopView) {
                    params.pageName = "global::" + params.pageName;
                }
                _.assign(fullParams, params,
                    function compare(value, other) {
                        if (_.isEmpty(value)) {
                            return other;
                        }
                        if (_.isObject(value)) {
                            return _.assign(value, other, compare);
                        }
                        return other;
                    });
                cleanCustomVars(fullParams.customVariables);
                cleanCustomVars(fullParams.customScreenVariables);
                return this;
            },
            tagScreen: function () {
                if (!window.CMAtInternet) {
                    console.info('[Screen]: ' + fullParams.pageName, fullParams);
                    return;
                }
                window.CMAtInternet.Screen(
                    fullParams.main.site,
                    fullParams.main.secure,
                    fullParams.population.visitorID,
                    fullParams.population.visitorCategory,
                    fullParams.search.searchKeywords,
                    fullParams.search.searchScreenNumber,
                    fullParams.search.searchElementPosition,
                    fullParams.aisles.level1,
                    fullParams.aisles.level2,
                    fullParams.aisles.level3,
                    fullParams.aisles.level4,
                    fullParams.aisles.level5,
                    fullParams.aisles.level6,
                    fullParams.customVariables,
                    fullParams.customScreenVariables,
                    fullParams.pageName,
                    function () {
                        console.info('[Screen]:', fullParams);
                    });
            },
            tagCart: function () {
                if (!window.CMAtInternet) {
                    console.info('[Cart]: ' + fullParams.pageName, fullParams);
                    return;
                }
                window.CMAtInternet.AddCart(
                    fullParams.main.site,
                    fullParams.main.secure,
                    fullParams.population.visitorID,
                    fullParams.population.visitorCategory,
                    fullParams.aisles.level1,
                    fullParams.aisles.level2,
                    fullParams.aisles.level3,
                    fullParams.aisles.level4,
                    fullParams.aisles.level5,
                    fullParams.aisles.level6,
                    fullParams.customVariables,
                    fullParams.pageName,
                    function () {
                        console.info('[Cart]:', fullParams);
                    });
            },
            tagCreateOrder: function () {
                if (!window.CMAtInternet) {
                    console.info('[Order]: ' + fullParams.pageName, fullParams);
                    return;
                }
                window.CMAtInternet.Order(
                    fullParams.main.site,
                    fullParams.main.secure,
                    fullParams.population.visitorID,
                    fullParams.population.visitorCategory,
                    fullParams.sales.cartId,
                    fullParams.sales.orderId,
                    fullParams.sales.turnover,
                    fullParams.sales.status,
                    fullParams.sales.newCustomer,
                    fullParams.sales.paymentMethod,
                    fullParams.sales.amountTaxIncluded,
                    fullParams.sales.deliveryMethod,
                    fullParams.sales.shippingFeesTaxIncluded,
                    fullParams.sales.discountTaxIncluded,
                    fullParams.sales.promotionalCode,
                    fullParams.sales.orderCustomVariables.shopId,
                    fullParams.sales.orderCustomVariables.service,
                    fullParams.sales.orderCustomVariables.numberOfArticles,
                    fullParams.sales.products,
                    fullParams.pageName,
                    function () {
                        console.info('[Cart]:', fullParams);
                    });
            },
            tagOrderPayment: function (order) {
                if (!window.CMAtInternet) {
                    console.info('[Payment]: ' + order.orderId, order);
                    return;
                }
                var params = {
                    // 一级站点ID
                    s: fullParams.main.site,
                    // 设备类型
                    s2: ionic.Platform.isIOS() ? 2 : 1,
                    // 页面名
                    p: "payment_validated",
                    // 固定 conf1
                    tp: "conf1",
                    // 和cmd一起都是orderId
                    idcart: order.orderId,
                    cmd: order.orderId,
                    // 3: Approved
                    st: 3,
                    // paymentId
                    mp: order.paymentId
                };
                atTagServices.updateOrder(params)
                    .then(function (response) {
                        console.debug('[PaymentUpdate]: ' + response);
                    }, function (response) {
                        console.debug('[PaymentUpdateError]: ' + response);
                    });
            },
            tagAdShow: function (ad) {
                if (!window.CMAtInternet) {
                    console.info('[adShow] :', ad);
                    return;
                }
                window.CMAtInternet.AdsInfo(ad.adid, ad.atFormat, ad.atProductId, function () {
                    console.info('[adShow] :', ad);
                });
            },
            tagAdClick: function (ad) {
                if (!window.CMAtInternet) {
                    console.info('[adClick] :', ad);
                    return;
                }
                window.CMAtInternet.AdsClick(ad.adid, ad.atFormat, ad.atProductId, function () {
                    console.info('[adClick] :', ad);
                });
            },
            tagGesture: function (gesture) {
                if (APP_CONFIG.isInOverseasShopView) {
                    gesture.name = "global::" + gesture.name;
                }
                if (!window.CMAtInternet) {
                    console.info('[Gesture]: ' + gesture.name, gesture);
                    return;
                }
                /**
                    如果有三层章节：
                    .add("Name", "Chapter1", "Chapter2", "Chapter3")
                    若两层：
                    .add("Name", "Chapter1", "Chapter2")
                    若一层：
                    .add("Name", "Chapter1")
                 */
                var chapterAndName = gesture.name.split('::');
                // 把name 放到最前
                var name = chapterAndName.pop();
                var chapterArr = chapterAndName;
                window.CMAtInternet.Gesture(
                    gesture.action,
                    name,
                    chapterArr[0],
                    chapterArr[1],
                    chapterArr[2],
                    function () {
                        console.info('[Gesture] :' + gesture.name);
                    }
                );
            },
            tagSearchResult: function (searchResult) {
                if (!window.CMAtInternet) {
                    console.info('[searchResult] :' + searchResult.keyword, searchResult);
                    return;
                }
                window.CMAtInternet.SearchResult(
                    searchResult.keyword,
                    searchResult.resultScreenNumber,
                    searchResult.resultPosition,
                    function () {
                        console.info('[searchResult] :' + searchResult.keyword);
                    }
                );
            }

        };

    }]);
