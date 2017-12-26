// 修改全局配置对象
// -----------------------------------------------------------------------------

_.assign(window.APP_CONFIG, {
    os: ionic.Platform.platform(),
    osVersion: ionic.Platform.version()
});


// 手机端初始化操作
// -----------------------------------------------------------------------------

var app = angular.module('app');

// 配置 ionic
app.config(["$ionicConfigProvider", function ($ionicConfigProvider) {
    $ionicConfigProvider.tabs.style('standard');
    $ionicConfigProvider.tabs.position('bottom');
    $ionicConfigProvider.navBar.alignTitle('center');
    $ionicConfigProvider.scrolling.jsScrolling(true);
    $ionicConfigProvider.spinner.icon('ios');
}]);

// 设置默认 url
app.config(["$urlRouterProvider", function ($urlRouterProvider) {
    $urlRouterProvider.otherwise('/tabs/index');
}]);

// 初始化极光推送
app.run(["$rootScope", "jPushService", function ($rootScope, jPushService) {
    var deregistration = $rootScope.$on('$ionicView.afterEnter', function () {
        if (window.cordova) {
            setTimeout(function () {
                jPushService.init();
            }, 500);
        }
        deregistration();
    });
}]);

// 启动弹出app引导评价
app.run(["feedbackService", function (feedbackService) {

    if (window.cordova) {
        feedbackService.init();
    }

}]);

// 初始化弹层活动页
app.run(["messageCenter", "activityService", "modals", function (messageCenter, activityService, modals) {
    //首页文章弹层
    messageCenter.subscribeMessage('index.popup', function () {
        activityService.getLayerActivity().then(function (response) {
                if (!response.data) {
                    return false;
                }
                return activityService.getActivityInfo(response.data);
            })
            .then(function (response) {
                if (!response.data) {
                    return;
                }

                modals.popUpModals.open({
                    animation: "none",
                    backdropClickToClose: false,
                    hardwareBackButtonClose: false,
                    params: {
                        content: response.data
                    }
                });
            });

    });
}]);

// 应用启动时打开欢迎页
app.run(["modals", "localStorage", "indexService", "globalService", "$ionicPlatform", "messageCenter", "$timeout", function (modals, localStorage, indexService, globalService, $ionicPlatform, messageCenter, $timeout) {
    var isFirstOpen = localStorage.get('is-first-open', true);

    if (isFirstOpen) {
        localStorage.set('is-first-open', false);
    }

    indexService.getComeIndex(isFirstOpen ? 1 : 2)
        .success(function (data) {

            if (data && data.length) {
                modals.welcome.open({
                    animation: "none",
                    backdropClickToClose: false,
                    hardwareBackButtonClose: false,
                    params: {
                        firstOpen: isFirstOpen,
                        posters: data,
                        successCallback: function () {
                            publicIndexEnter();
                            checkSubsite();
                        }
                    }
                });
            } else {
                publicIndexEnter();
                hideSplashscreen();
                checkSubsite();
            }
        })
        .error(function () {
            publicIndexEnter();
            hideSplashscreen();
            checkSubsite();
        });

    function publicIndexEnter() {
        messageCenter.publishMessage('index.enter');
    }

    function hideSplashscreen() {
        $timeout(function () {
            $ionicPlatform.ready(function () {
                if (navigator.splashscreen) {
                    navigator.splashscreen.hide();
                }
            });
        }, 500);
    }

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
                } else {
                    // 非第一次进入首页打开文章弹层
                    messageCenter.publishMessage('index.popup');
                }
            });
        }
    }

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
}]);

// 获取海外购subsiteId
app.run(["overseasShopIndexService", function (overseasShopIndexService) {
    overseasShopIndexService.getOverseasId()
        .success(function (response) {
            APP_CONFIG.overseasShopId = response;
        });
}]);

// 初始化数据统计
app.run(["analytics", "messageCenter", function (analytics, messageCenter) {
    analytics.init(APP_CONFIG.atAnalyticSiteId, false);
}]);

// 版本检测
app.run(["localStorage", "modals", "globalService", "popup", function (localStorage, modals, globalService, popup) {

    //检测是否有新版本
    globalService.checkUpdate().success(function (data) {
        var remoteVersion = data.version.split('.');
        var currentVersion = window.APP_CONFIG.appVersion.split('.');
        var isUpdate = versionCompare(currentVersion, remoteVersion);

        // 有新版本更新
        if (isUpdate) {
            // 判断是否强制更新
            if (data.force) {
                return popup.updateAlert(data.description, function () {
                    cordova.InAppBrowser.open(data.url, '_system');
                });
            }
            return popup.updateConfirm(data.description, function() {
                cordova.InAppBrowser.open(data.url, '_system');
            });
        }
    });

    function versionCompare(currentVersion, remoteVersion) {
        var flag = false;
        if (currentVersion.length != remoteVersion.length) {
            flag = false;
        }
        for (var i in currentVersion) {
            if (remoteVersion[i] != currentVersion[i]) {
                flag = remoteVersion[i] > currentVersion[i];
                break;
            }
        }
        return flag;
    }

}]);

//根据当前链接的网络判断时候给提示，是否更新热部署
app.run(["popup", "networkStatus", "deploy", "messageCenter", function (popup, networkStatus, deploy, messageCenter) {
    var currentNetWorkType = networkStatus.getNetType();
    var ignoreVersion = "";

    deploy.watch({
        interval: 1 * 60 * 1000
    }, updateCallback);

    var isShowen = false;

    function updateCallback(response) {
        if (isShowen) {
            // 已经打开了popup就不走了
            return;
        }
        if (response.targetVersion == ignoreVersion) {
            // 取消过当前版本就不再提示了
            return;
        }
        isShowen = true;

        // 通知引导好评此次不在弹出
        messageCenter.publishMessage('alert.indexPage');

        popup.deployMixin(response.force, currentNetWorkType).then(function () {
            // 直到版本更新前停止检测
            isShowen = false;
            deploy.unwatch();
        }, function () {
            // 用户取消更新
            isShowen = false;
            ignoreVersion = response.targetVersion;
        });
    }

    // 新版
    // deploy.watch()
    //     .then(function (response) {
    //         // TODO: 增加强制或非强制的标记
    //         var forceUpdate = false;
    //         // 非强制
    //         if (forceUpdate) {
    //             return popup.deployAlert(function () {
    //                 return download()
    //                     .then(extract)
    //                     .then(restart);
    //             });
    //         }
    //         return popup.deployConfirm()
    //             .then(function (result) {
    //                 if (result) {
    //                     return download()
    //                         .then(extract)
    //                         .then(restart);
    //                 } else {
    //                     return api.reject();
    //                 }
    //             });
    //
    //         function download() {
    //             var popupScope = $rootScope.$new();
    //             popupScope.percent = '0%';
    //             popup.deployProcess(popupScope, 'deployTips.downloading');
    //             return deploy.downloadByProcess(function (result) {
    //                 popupScope.$apply(_.throttle(function () {
    //                     popupScope.percent = result + '%';
    //                 }), 500);
    //             });
    //         }
    //
    //         function extract() {
    //             var popupScope = $rootScope.$new();
    //             popupScope.percent = '0%';
    //             popup.deployProcess(popupScope, 'deployTips.extracting');
    //             return deploy.extractByProcess(function (result) {
    //                 popupScope.$apply(_.throttle(function () {
    //                     popupScope.percent = result + '%';
    //                 }), 500);
    //             });
    //         }
    //
    //         function restart() {
    //             setTimeout(function () {
    //                 if (ionic.Platform.isIOS()) {
    //                     return deploy.load();
    //                 }
    //                 navigator.app.exitApp();
    //             }, 3000);
    //         }
    //
    //     }, function () {
    //         deploy.unwatch();
    //     });

    // 老版
    // deploy.check()
    //     .then(function (response) {
    //         console.info('Deploy: update - has update - ' + response.data);
    //
    //         if (response.data === true) {
    //             return updateVersion();
    //         } else {
    //             throw 'not check';
    //         }
    //     })
    //     .then(function () {
    //         return deploy.extract();
    //     });
    //
    // function updateVersion() {
    //     if (isCell === NETWORKTYPE.cell) {
    //         return popup.updateVersion('deployTips.netTypeTips')
    //             .then(function (res) {
    //                 if (res) {
    //                     return deploy.download();
    //                 } else {
    //                     throw 'no update';
    //                 }
    //             });
    //     } else if (isCell === NETWORKTYPE.wifi) {
    //         return deploy.download();
    //     }
    // }
}]);

app.run(["cartService", "$rootScope", "messageCenter", function (cartService, $rootScope, messageCenter) {
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
}]);

//初始化 数据统计
app.run(["cofferSem", "localStorage", function (cofferSem, localStorage) {

    //应用是否为首次打开
    var isactivity = localStorage.get('isactivity') ? localStorage.get('isactivity') : 'first';
    var activity = 1;
    if (isactivity === 'first') {
        localStorage.set('isactivity', 'notfirst');
    } else if (isactivity === 'notfirst') {
        activity = 0;
    }

    //在localStorage里面存放应用打开的次数 格式为sid=20150101_15
    var now = moment().format("YYYYMMDD");
    var openCount = localStorage.get('opencount') ? localStorage.get('opencount') : 0;
    localStorage.set('opencount', ++openCount);

    var sid = now + "_" + openCount;
    localStorage.set("sid", sid);

    if (ionic.Platform.isIOS() && window.plugins && window.plugins.AppleAdvertising) {

        window.plugins.AppleAdvertising.getIDFA(function (res) {
            cofferSem.init(res);
            cofferSem.initApp(activity);
        });
        return;
    }
    cofferSem.init();
    cofferSem.initApp(activity);
}]);

// 平台相关的路由状态
app.constant('platformStates', {});

//平台相关的在每一个 tab 项下都要提供的状态配置
app.constant('platformStatesForEveryTab', {

});
