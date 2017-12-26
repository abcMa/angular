// 声明放在全局空间中的配置对象
// -----------------------------------------------------------------------------

// 应用程序配置
window.APP_CONFIG = {};

// 应用国际化配置
window.APP_LANG = {};

// 应用状态码配置
window.APP_STATE_CODE = {};

// 应用当前登录用户信息
window.APP_USER = {};

// angular 模块声明
// -----------------------------------------------------------------------------

angular.module('app.services', []);
angular.module('app.directives', []);
angular.module('app.controllers', []);
angular.module('app.filters', []);
angular.module('app.templates', []);
angular.module('ngMessages', []);

var app = angular.module('app', [
    'ionic',
    'ngMessages',
    'cmSwitch',
    'ngIOS9UIWebViewPatch',
    'pascalprecht.translate',
    'ionic-datepicker',

    'app.services',
    'app.directives',
    'app.controllers',
    'app.filters',
    'app.templates'
]);

// 默认的初始化操作
// -----------------------------------------------------------------------------

// 设置默认分享信息，未明确定义分享信息的视图皆按照该信息进行分享
// app.factory('defaultShareInfo', function(defaultStates, shareService) {
//     shareService.getDefaultImgUrl()
//         .success(function(data) {
//             return {
//                 sharetitle: '家乐福微信商城',
//                 sharemessage: '家乐福微信商城',
//                 sharepic: data,
//                 shareurl: location.origin + location.pathname + '#' + defaultStates
//             };
//         });
// });

// 默认路由地址，当 URL 中没有路由地址，或路由地址没有对应的 state，则默认跳转到该路由地址
app.constant('defaultStates', '/tabs/index');

// 配置虚拟键盘插件
app.run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
            cordova.plugins.Keyboard.disableScroll(true);
            if(ionic.Platform.isIOS()){
                window.addEventListener('native.keyboardshow', keyboardShowHandler);
            }
        }
    });
    function keyboardShowHandler(e){
        window.keyBoardHeight = e.keyboardHeight;
    }
});

// 配置搜索历史记录
app.config(function (searchHistoryProvider) {
    searchHistoryProvider.maxStorageNumber = 10;
});

// 在根上增加个数学方法
app.run(function ($rootScope) {
    $rootScope.Math = window.Math;
});

// 分享检测是否安装微信/QQ
app.run(function () {
    APP_CONFIG.wechat_installed = false;
    APP_CONFIG.QQ_installed = false;

    if (window.wechatPay) {
        window.wechatPay.checkAppInstalled(function() {
            APP_CONFIG.wechat_installed = true;
        })
    }

    if(window.CMShare){
        window.CMShare.checkAppInstalled('qq',function() {
            APP_CONFIG.QQ_installed = true;
        })
    }
});

// 配置国际化
app.config(function ($translateProvider) {
    if (_.isEmpty(APP_LANG)) {
        return;
    }

    _.forEach(APP_LANG, function (textOptions, langName) {
        $translateProvider.translations(langName, textOptions);
    });

    $translateProvider.preferredLanguage(APP_CONFIG.language);
});

// 设置本地存储的前缀
app.config(function (localStorageProvider) {
    localStorageProvider.prefix = 'carrefour-app-';
});

// 定义全局的返回方法
app.run(function ($rootScope, stateUtils, $ionicViewSwitcher, $ionicHistory, $state, overseasShop) {

    // 定义全局的返回方法
    $rootScope.goBack = function () {
        // 并非所有人都从/tabs/index进入的
        // 避免backbutton失效，使其跳转到index
        if (_.isNull($ionicHistory.backView())) {
            $ionicViewSwitcher.nextDirection('back');
            $state.go('tabs.index');
            $ionicHistory.clearHistory();
            return;
        }
        $rootScope.$ionicGoBack();
    };

    $rootScope.goBackForOverseasShop = function() {
        var viewHistory = $ionicHistory.viewHistory(),
            currentView = viewHistory.currentView,
            history = viewHistory.histories[currentView.historyId],
            historyStack = history.stack,

            currentCursor = history.cursor,
            backCursor = currentCursor - 1,

            backView;

        for (; backCursor >= 0; backCursor--) {
            backView = historyStack[backCursor];

            if (overseasShop.isOverseasShopView(backView) === false) {
                break;
            }
        }

        if (backCursor === -1) {
            $rootScope.goBack();
        }
        else {
            var backCount = backCursor - currentCursor;
            $ionicHistory.goBack(backCount);
        }
    };

    // 消息中心
    $rootScope.goMessageCenter = function () {
        var stateName = stateUtils.getStateNameByCurrentTab('messageCenter');
        $state.go(stateName);
    };

    // 回到首页
    $rootScope.goIndex = function () {
        $state.go('tabs.index');
    };
});

// 二维码扫描和他的处理
app.run(function ($rootScope, $translate, loading, stateUtils, toast, scanService, productService) {
    // 扫码
    $rootScope.scanCode = function () {
        scanService.scan()
            .then(function (res) {
                resultHandler(res.format, res.code);
            });
    };

    // 接口名映射表
    // 用以缩短生成的url长度
    var paramsKeyMap = {
        v: 'version', // 版本号,用于区分二维码参数格式，向前后兼容
        p: 'productId',
        g: 'goodsId',
        a: 'articleId',
        t: 'title'
    };

    // 把缩短版的key转成完全体
    // usage:
    // convertFullParamsKey({v:"vvvv",p:{g:"gggg",a:"aaaa"}})
    // {"version":"vvvv","productId":{"goodsId":"gggg","articleId":"aaaa"}}
    function convertFullParamsKey(params) {
        var result = _.cloneDeep(params);
        _.forEach(result, function (value, key) {
            var fullName = paramsKeyMap[key];
            if (fullName) {
                result[fullName] = value;
                delete result[key];
            }
            if (_.isObject(value)) {
                result[fullName] = convertFullParamsKey(value);
            }
        });
        return result;
    }

    // 从指定的url里取得Query字段
    // getQueryString('wd','https://www.baidu.com/s?wd=rdp%E6%B5%8B%E8%AF%95')
    // output: rdp测试
    function getQueryString(name, url) {
        if (!name || !url) {
            return false;
        }
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var a = document.createElement("a");
        a.href = url;
        var r = a.search.substr(1).match(reg);
        if (r) {
            return decodeURIComponent(r[2]);
        }
        return false;
    }

    function qrCodeAnalyser(resultStr) {

        var rdParams = getQueryString("rdp", resultStr);
        if (!rdParams) {
            toast.open($translate.instant('scan.invalidQRCode'));
            return;
        }

        try {
            rdParams = JSON.parse(rdParams);
        } catch (e) {
            toast.open($translate.instant('scan.invalidQRCode'));
            return;
        }

        rdParams = convertFullParamsKey(rdParams);
        switch (rdParams.version) {
            case 0:
                // 完整版跳转参数
                if (rdParams.isOverseasShop) {
                    stateUtils.goOverseasShopAdvRedirect(rdParams.type, rdParams.params);
                } else {
                    stateUtils.goAdvRedirect(rdParams.type, rdParams.params);
                }
                break;
            case 1:
                // tiny版跳转
                // 有这俩就是跳详情
                if (rdParams.goodsId || rdParams.productId) {
                    stateUtils.goOverseasShopAdvRedirect(1, rdParams);
                    break;
                }
                // 有这个就是跳活动
                if (rdParams.articleId) {
                    stateUtils.goOverseasShopAdvRedirect(4, rdParams);
                    break;
                }
                break;
            default:
                toast.open($translate.instant('scan.invalidQRCode'));
                console.debug('无法识别二维码参数版本');
                break;

        }
    }

    function barCodeAnalyser(barCode) {
        loading.open();

        productService.getProductIdByBarCode(barCode)
            .success(function (data) {
                if (data) {
                    stateUtils.goProductInfo(data.productId, data.goodsId, data.title, 'barcodeScan');
                } else {
                    toast.open($translate.instant('scan.invalidBarCode'));
                }
            })
            .error(function () {
                toast.open($translate.instant('scan.invalidBarCode'));
            })
            .finally(function () {
                loading.close();
            });
    }

    function resultHandler(format, code) {
        switch (format.toLowerCase()) {
            case "qr_code":
            case "qrcode":
                qrCodeAnalyser(code);
                break;
            default:
                barCodeAnalyser(code);
        }
    }
});


// 设置 unique
app.run(function (unique) {
    unique.get(function (value) {
        APP_CONFIG.unique = value;
    });
});

// 监听锁屏事件
app.run(function ($ionicPlatform, messageCenter) {
    // 锁屏
    $ionicPlatform.on('pause', function () {
        messageCenter.publishMessage('pause');
    });

    // 恢复
    $ionicPlatform.on('resume', function () {
        messageCenter.publishMessage('resume');
    });
});

// 设置用户信息
app.run(function ($ionicPlatform, localStorage, messageCenter, $rootScope, viewHistory, cartService) {
    _.assign(APP_USER, localStorage.get('user'));

    // 用户登录以及获取用户信息后，将响应的数据放入到 APP_USER 中，并缓存在本地
    messageCenter.subscribeMessage(['login', 'user.info'], function (event, userInfo) {
        _.assign(APP_USER, userInfo);
        localStorage.set('user', APP_USER);
    });

    // 用户登出后，清空 APP_USER 及本地缓存的用户信息
    messageCenter.subscribeMessage('logout', function (event, userData) {
        for (var key in APP_USER) {
            APP_USER[key] = undefined;
        }

        localStorage.set('user', APP_USER);
    });

    // 切换地区时清空浏览记录等
    messageCenter.subscribeMessage('subsite.change', function (event) {
        viewHistory.clear();
        cartService.clean();
    });
});

// 将 APP_CONFIG 放入 $rootScope
app.run(function ($rootScope) {
    $rootScope.APP_CONFIG = APP_CONFIG;
});

// 还原分站信息
app.run(function (localStorage, messageCenter, globalService) {
    var emptySubsite = {
        "breadNavigator": []
    };

    //检查缓存是否是新地址
    var flag = localStorage.get('newSubsite');
    if (!flag) {
        localStorage.remove('subsite');
        localStorage.set('newSubsite',true);
    }
    _.assign(APP_CONFIG, localStorage.get('subsite', emptySubsite, emptySubsite));

    // 切换语言时要更新localstorage里存储的regionName
    // 切换语言后重新加载地区数据
    messageCenter.subscribeMessage('language.change', function () {
        var subsite = localStorage.get('subsite');
        var idArr = _.pluck(subsite.breadNavigator, "regionId");
        if (idArr.length < 0) {
            return;
        }

        globalService.getRegionNamesByIdList(idArr)
            .success(function (data) {

                // 批量更新
                _.forEach(data, function (regionName, regionId) {
                    var region = _.find(subsite.breadNavigator, {
                        regionId: parseInt(regionId)
                    });
                    if (region) {
                        region.regionName = regionName;
                    }
                });

                // 把外层那个用来兼容的也更新了
                var newSubsite = _.assign(subsite, _.last(subsite.breadNavigator));
                localStorage.set('subsite', newSubsite);

                // 记得更新全局变量
                _.assign(APP_CONFIG, newSubsite);

                // 还有广播
                messageCenter.publishMessage('subsite.update', newSubsite);
            });
    });

});


// 还原语言信息
app.run(function (localStorage, $translate) {
    var language = localStorage.get('language');

    if (language) {
        if (language != APP_CONFIG.language) {

            APP_CONFIG.language = language;

            //切换界面语言
            $translate.use(language);
        }
    }
});

// 全球购标识自动切换
app.run(function ($state, $rootScope, overseasShop) {
    // 根据状态改变自动变更 APP_CONFIG.isInOverseasShopView 的值
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams, error) {
        APP_CONFIG.isInOverseasShopView = overseasShop.isOverseasShopState(toState);
    });
});

app.run(function (messageCenter, cmSwitcherDelegate, modals, $state, $ionicPopup, $translate) {

    // 注册成功后弹出提示框
    messageCenter.subscribeMessage('register', function () {
        modals.memberCardPopup.open({
            params: {
                title: $translate.instant('memberCardPopup.title'),
                content: $translate.instant('memberCardPopup.content'),
                selectA: $translate.instant('memberCardPopup.goRegisterMemberCard'),
                selectB: $translate.instant('memberCardPopup.goBindMemberCard'),
                cancel: $translate.instant('memberCardPopup.cancel')
            }
        });
    });

});

// 配置 api 服务
app.config(function ($httpProvider, apiProvider) {
    // 配置服务器根路径
    apiProvider.serviceAddress = APP_CONFIG.service;

    // 自定义请求参数编码
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

    $httpProvider.defaults.transformRequest = [function (data) {
        return angular.isObject(data) && String(data) !== '[object File]' ?
            apiProvider.formatUrlParameter(data) : data;
    }];

    // 更加健壮的响应数据转换器，当响应数据为 json 字符串时，将按照 json 格式进行解析，否则直接当作字符串返回。
    var defaultJsonTransformResponse = $httpProvider.defaults.transformResponse[0];
    $httpProvider.defaults.transformResponse = [function (data, headers) {
        try {
            return defaultJsonTransformResponse(data, headers);
        } catch (e) {
            return data;
        }
    }];

    // 添加请求头部属性
    _.assign($httpProvider.defaults.headers.common, {
        appkey: function () {
            return APP_CONFIG.appkey;
        },
        os: function () {
            return APP_CONFIG.os;
        },
        osVersion: function () {
            return APP_CONFIG.osVersion;
        },
        appVersion: function () {
            return APP_CONFIG.appVersion;
        },
        unique: function () {
            return APP_CONFIG.unique;
        },
        subsiteId: function () {
            if (APP_CONFIG.isInOverseasShopView === undefined) {
                return location.hash.toLowerCase().indexOf('/overseasshop/') > 0 ? APP_CONFIG.overseasShopId : APP_CONFIG.subsiteId;
            } else {
                return APP_CONFIG.isInOverseasShopView ? APP_CONFIG.overseasShopId : APP_CONFIG.subsiteId;
            }
        },
        normalSubsiteId: function () {
            return APP_CONFIG.subsiteId;
        },
        language: function () {
            return APP_CONFIG.language;
        },
        userid: function () {
            return APP_USER.id;
        },
        channel: function () {
            return APP_CONFIG.channel;
        },
        userSession: function () {
            return APP_USER.userSession;
        }
    });
});

// 注册商品所配置的路由状态，同时也会根据 statesForEveryTab 中的配置内容生成在每一个 tabs 下的状态配置，并放入 states 中。
app.config(function ($stateProvider, tabs, states, platformStates, statesForEveryTab, platformStatesForEveryTab, statesForOverseasShop) {
    _.merge(states, platformStates);
    var allStatesForEveryTab = _.merge({}, statesForEveryTab, statesForOverseasShop, platformStatesForEveryTab);

    _.forEach(allStatesForEveryTab, function (config, name) {
        _.forEach(tabs, function (tabConfig) {
            var nameForTab = 'tabs.' + tabConfig.name + _.capitalize(name),
                configForTab = _.merge({
                    views: {}
                }, _.omit(config, ['templateUrl', 'controller']));

            configForTab.views[tabConfig.name] = {
                templateUrl: config.templateUrl,
                controller: config.controller
            };

            configForTab.url = '/' + tabConfig.name + _.capitalize(configForTab.url);
            states[nameForTab] = configForTab;
        });
    });

    _.forEach(states, function (config, name) {
        $stateProvider.state(name, config);
    });
});

app.run(function ($rootScope, stateUtils) {
    $rootScope.goStateByCurrentTab = stateUtils.goStateByCurrentTab;
    $rootScope.stateUtils = stateUtils;
});

// 处理弹出层配置，将所配置的弹出层注册到 $rootScope 下的 modals 命名空间内
app.run(function ($rootScope, $state, $ionicModal, $controller, modals, messageCenter) {
    // 判断所传入的对象是否是 angular 中的 $scope 对象
    function isScope(scope) {
        return scope.$new && scope.$id;
    }

    // 将 modals 放入 $rootScope 中，方便在模板页面中调用
    $rootScope.modals = modals;

    var defaultOptions = {
        scope: $rootScope,
        animation: 'slide-in-right',
        backdropClickToClose: true,
        hardwareBackButtonClose: true
    };

    _.forEach(modals, function (modal, name) {
        modal = _.defaults(modal, defaultOptions);

        _.assign(modal, {
            $modal: undefined,
            $scope: undefined,

            open: function (options) {
                // 防止 modal 重复开启
                if (modals.$showModals[name]) {
                    return;
                }
                var self = this;
                modals.$showModals[name] = self;

                options = angular.extend({}, modal, options);

                var scope = options.scope.$new();
                self.$scope = scope;

                if (options.controller) {
                    var controller = $controller(options.controller, {
                        $scope: scope,
                        $params: options.params
                    });

                    if (options.controllerAs) {
                        scope[options.controllerAs] = controller;
                    }
                }

                scope.$on('modal.hidden', function () {
                    self.close();
                });

                scope.$on('$destroy', function () {
                    messageCenter.publishMessage('modal.close', modal.title);
                });

                if (APP_CONFIG.os === 'weixin') {
                    modal.popStateListener = function (e) {
                        if (name == e.state.name) {

                            if (!APP_CONFIG.subsiteId && name === 'selectRegion') {
                                window.history.replaceState({name: name}, null, null);
                                window.history.pushState({}, modal.title, '#/modals/' + name);
                                return;
                            }

                            window.removeEventListener("popstate", modal.popStateListener);
                            modal.popStateListener = null;
                            modal.close();
                        }
                    };

                    window.addEventListener("popstate", modal.popStateListener);


                    setTimeout(function () {
                        window.history.replaceState({name: name}, null, null);
                        window.history.pushState({}, modal.title, '#/modals/' + name);
                    });
                }

                return $ionicModal.fromTemplateUrl(options.path, function ($modal) {
                    $modal.show();
                    self.$modal = $modal;
                    messageCenter.publishMessage('modal.open', modal.title);
                }, {
                    scope: scope,
                    animation: options.animation || '',
                    backdropClickToClose: options.backdropClickToClose,
                    hardwareBackButtonClose: options.hardwareBackButtonClose
                });
            },

            close: function () {
                if (modal.popStateListener) {
                    window.removeEventListener("popstate", modal.popStateListener);
                    modal.previousState = null;
                    modal.popStateListener = null;
                    window.history.back();
                }

                var $modal = this.$modal,
                    $scope = this.$scope;

                this.$modal = undefined;
                this.$scope = undefined;

                if ($modal) $modal.remove();
                if ($scope) $scope.$destroy();

                delete modals.$showModals[name];
            }
        });
    });

    // 存放所有当前已显示的 modals
    modals.$showModals = {};
});


// 启动 angular
// -----------------------------------------------------------------------------

// 控制 angular 的初始化时间
// - 当在移动设备中运行时，则在 deviceready 事件触发后启动 angular，
//   此时各项 cordova 插件都已加载并初始化完毕，可以正常使用。
(function bootstrap() {
    // in mobile app open
    if (window.cordova) {
        document.addEventListener("deviceready", function () {
            getChannel(start);
        }, false);
    }
    // in browser open
    else {
        window.onload = start;
    }

    function getChannel(callback) {
        if (!(window.plugins && window.plugins.preference)) {
            callback();
            return;
        }

        // 从 config.xml 中获取 channel
        window.plugins.preference.get('CHANNEL', function (value) {
            _.assign(window.APP_CONFIG, {
                channel: value
            });
            callback();
        }, callback);
    }

    function start() {
        angular.bootstrap(document.body, ['app'], {
            strictDi: true
        });
    }

})();
