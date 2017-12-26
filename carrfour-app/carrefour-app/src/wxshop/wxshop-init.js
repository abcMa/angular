// 修改全局配置对象
// -----------------------------------------------------------------------------

_.assign(window.APP_CONFIG, {
    os: 'weixin',
    osVersion: ionic.Platform.version()
});

// 手机端初始化操作
// -----------------------------------------------------------------------------

var app = angular.module('app');

// 配置 ionic
app.config(function ($ionicConfigProvider) {
    $ionicConfigProvider.tabs.style('standard');
    $ionicConfigProvider.tabs.position('bottom');
    $ionicConfigProvider.navBar.alignTitle('center');
    $ionicConfigProvider.scrolling.jsScrolling(true);
});

// 设置默认 url
app.run(function($state) {
    if (!window.location.hash || /^#\/$/.test(window.location.hash) || /^#\/modals/.test(window.location.hash)) {
        $state.go('tabs.index');
    }
});

// 微信跳转切换语言
app.run(function (globalService) {
    var args = location.search.split("&");
    _.forEach(args , function(argument) {
        var arguments = argument.split("=");
        if("language" == arguments[0] && arguments[1]){
            var language = arguments[1];
            if (language == 'en') {
                language = "en";
            } else {
                language = "zh-CN";
            }
            globalService.toggleLanguage(language);
        }
    });
});

// 兼容QQ浏览器
app.run(function () {
    // 判断是否是QQ浏览器
    var isQQBrowser = function () {
        var ua = navigator.userAgent.toLowerCase();
        return (/mqqbrowser/.test(ua)) ? true : false;
    };

    if(isQQBrowser() && location.search.indexOf("%23") > 0){
        location.href = location.origin + location.pathname + location.search.replace("%23","#");
    }
});

// 应用启动时打开欢迎页
app.run(function (modals, globalService, messageCenter) {

    function checkSubsite() {
        // 首次访问首页，启动选择地区
        if (!APP_CONFIG.subsiteId) {
            openSelectRegionModal();
        } else {
            // 非第一次进入首页打开文章弹层,检测地区选择和门店信息是否对应
            globalService.changeRegionalStore(APP_CONFIG.regionId).success(function(data){
                if (!data) {
                    // 当region和subsite对不上的时候 清空记录内容
                    localStorage.remove('subsite');
                    openSelectRegionModal();
                }
            });
        }
    }

    checkSubsite();

    // 广播页面Tag
    messageCenter.publishMessage('AT.viewTag', {
        pageName: 'pre-home::splashscreen',
        customVariables: {
            "1": APP_LANG[APP_CONFIG.language].$id
        }
    });

    function openSelectRegionModal() {
        modals.selectRegion.open({
            animation: 'none',
            backdropClickToClose: false,
            hardwareBackButtonClose: false,
            params: {
                backdropClickToClose: false
            }
        });
    }
});

// 获取海外购subsiteId
app.run(function (overseasShopIndexService) {
    overseasShopIndexService.getOverseasId()
        .success(function (response) {
            APP_CONFIG.overseasShopId = response;
        });
});

// 判断是否是微信浏览器
app.run(function ($rootScope) {
  var isWeixinBrowser = function () {
      var ua = navigator.userAgent.toLowerCase();
      return (/micromessenger/.test(ua)) ? true : false;
  };
  $rootScope.isWeixinBrowser = isWeixinBrowser();
});

// 初始化微信 SDK
app.run(function ($rootScope) {
    function getCookieByName(name) {
        var cookies = document.cookie,
            nameStartIndex,
            cookieStartIndex,
            cookieEndIndex,
            cookie;

        if (!cookies) return undefined;

        nameStartIndex = cookies.indexOf(name + '=');

        if (nameStartIndex > -1) {
            cookieStartIndex = nameStartIndex + name.length + 1;
            cookieEndIndex = cookies.indexOf(';', cookieStartIndex);

            if (cookieEndIndex === -1) {
                cookieEndIndex = cookies.length;
            }

            cookie = unescape(cookies.substring(cookieStartIndex, cookieEndIndex));
        }

        return cookie;
    }

    var wxConfig = {
        debug: false,
        // appId: 'wx82672d316249ac56',
        appId: getCookieByName('appId'),
        timestamp: getCookieByName('timestamp'),
        nonceStr: getCookieByName('nonceStr'),
        signature: getCookieByName('signature'),
        jsApiList: [
            'chooseWXPay', // 支付接口
            'scanQRCode', // 扫一扫功能
            'onMenuShareTimeline',
            'onMenuShareAppMessage',
            'onMenuShareQQ',
            'onMenuShareWeibo',
            'onMenuShareQZone'
        ]
    };

    // 只有在微信客户端中打开页面时，才初始化微信 SDK。
    if ($rootScope.isWeixinBrowser) {
        window.wx && wx.config(wxConfig);
    }
});

// 应用初始化时先注册一下默认分享信息
app.run(function(shareService) {
    shareService.defaultShareInfo();
});

app.run(function (cartService, $rootScope, messageCenter) {
    $rootScope.shoppingCartCount = 0;

    function setNumber(number) {
        if (number > 99) {
            $rootScope.shoppingCartCount = "99+";
        } else {
            $rootScope.shoppingCartCount = number || 0;
        }
    }

    function getTotalQuantity() {
        var number = 0;

        try {
            if (cartService.data) {
                number = cartService.data.info.totalQuantity;
                // 微信里只显示海外购购物车数量
                // number = cartService.data.baskets.overseasShop.allItemsNumber;
            } else {
                cartService.refresh();
            }
        } catch (e) {}

        return number;
    }

    // 订阅结算成功消息
    messageCenter.subscribeMessage('checkout.success', function (event, data) {
        setNumber(getTotalQuantity());
    });

    // 订阅购物车改变消息
    messageCenter.subscribeMessage(['cart.refresh', 'cart.init'], function (event, data) {
        setNumber(getTotalQuantity());
    });

    // 初始化购物车
    cartService.init();
});

app.run(function($state, stateUtils, $rootScope, localStorage, modals, messageCenter) {

    if(APP_CONFIG.os == "weixin" && !$rootScope.isWeixinBrowser) {
        var deregistration = $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {

            // 路由跳转name
            var fromStateName = fromState.name,
                toStateName = toState.name;

            if (fromStateName === 'tabs.index' && toStateName === '') {
                return;
            }

            if (window.location.href.indexOf('orderId') != -1 && window.location.href.indexOf('showPayInfo') != -1) {

                var params = getParams(window.location.href),
                    stateTabName = "overseasShopOrderInfo",
                    stateName = stateUtils.getStateNameByCurrentTab(stateTabName);

                var userSession = params.userSession ? params.userSession : "",
                    orderId = params.orderId ? params.orderId : 0,
                    showPayInfo = params.showPayInfo ? params.showPayInfo : 1;

                if(userSession){
                    APP_USER.userSession = userSession;
                    $state.go(stateName, {
                        id: orderId,
                        showPayInfo: showPayInfo,
                        goPayment: true
                    });
                }

            }

            deregistration();
        });
    }

    // showPayInfo   true 表示支付成功，跳支付成功页 false表示支付失败，跳支付中心页
    // orderId  订单id
    // userSession 用户session  APP_USER.userSession 没有值或值不匹配的话，就让用户登陆
    function getParams(params) {
        var orderParams = {};
        if (params && params.indexOf('orderId') != -1) {
            params = params.split('?')[1].split('&');
            var param;
            for (var i in params) {
                param = params[i].split('=');
                orderParams[param[0]] = param[1];
            }
        }
        return orderParams;
    }

});

// 监听路由变化事件，用来监听微信中页面返回
app.run(function($rootScope, modals, $state, userService, messageCenter, toast, $translate) {
    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {

        // 判断当前是否登录，如未登录，则不能返回登录后的内容
        if (!userService.hasLogined()) {

            // 路由跳转name
            var fromStateName = fromState.name,
                toStateName = toState.name

            if (fromStateName == 'tabs.index' && toStateName == 'tabs.userSetting') {
                toast.open($translate.instant('initWx.toClickClose'));
                $state.go('tabs.index');
            }

        }

    });
});

// 平台相关的路由状态
app.constant('platformStates', {});

//平台相关的在每一个 tab 项下都要提供的状态配置
app.constant('platformStatesForEveryTab', {

});
