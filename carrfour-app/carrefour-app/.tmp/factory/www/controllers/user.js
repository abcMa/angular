/**
 * 用户中心 的控制器
 */
angular.module('app.controllers').controller('userCtrl', ["$rootScope", "$scope", "$state", "loadDataMixin", "userService", "api", "modals", "stateUtils", "globalService", "viewHistory", "$translate", "messageCenter", "$ionicActionSheet", "errorHandling", "messageCenterService", "loading", function (
    $rootScope, $scope, $state, loadDataMixin, userService, api, modals, stateUtils, globalService,
    viewHistory, $translate, messageCenter, $ionicActionSheet, errorHandling, messageCenterService, loading
) {
    var ctrl = this;

    _.assign(ctrl, loadDataMixin, {

        $scope: $scope,

        userInfo: APP_USER,

        viewHistoryCount: 0,

        messageCenterService: messageCenterService,

        //要切换到语言
        wantLanguage: 'En',
        languageKey: 'en',

        loadData: function () {

            // 发布进入个人中心
            messageCenter.publishMessage('enter.userPage');
            
            var language = APP_CONFIG.language;

            if (language == "en") {
                ctrl.wantLanguage = "中";
                ctrl.languageKey = "zh-CN";
            } else {
                ctrl.wantLanguage = "En";
                ctrl.languageKey = "en";
            }

            ctrl.viewHistoryCount = viewHistory.getCount();
            if (APP_USER.id) {
                return userService.info().success(function (response) {
                        angular.extend(ctrl.userInfo, response);
                    })
                    .error(errorHandling);
            } else {
                return api.when(APP_USER);
            }
        },

        /**
         * 跳转到客户服务页面
         */
        goCustomerService: function () {
            // 广播页面Tag
            // messageCenter.publishMessage('AT.viewTag', {
            //     pageName: 'personal_space::customer_service',
            //     customVariables: {
            //         "1": APP_LANG[APP_CONFIG.language].$id,
            //         "2": APP_CONFIG.subsiteId,
            //         "18": APP_USER.oldNew,
            //         "19": APP_USER.ageGroup
            //     }
            // });
            $state.go('tabs.customerService');
        },


        /**
         * 跳转到设置页面
         */
        goSettings: function () {
            $state.go('tabs.settings');
        },

        /**
        * 跳转会员中心
        */
        goMemberCenter: function(){
            if (!APP_USER.id) {
                ctrl.openLogin();
                return;
            }
            loading.open();
            $state.go('tabs.memberCenter');
        },

        /**
         * 跳转到我的优惠券页面
         */
        goUserCoupons: function () {
            if (!APP_USER.id) {
                ctrl.openLogin();
                return;
            }
            $state.go('tabs.userCoupons');
        },

        /**
         * 弹出地址管理层
         */
        goUserConsignee: function () {
            if (!APP_USER.id) {
                ctrl.openLogin();
                return;
            }
            $scope.modals.memberSelectConsignee.open({
                params: {
                    title: $translate.instant('user.userConsignee')
                }
            });
        },

        /**
         * 身边的家乐福
         */
        goNearbyStore: function () {
            stateUtils.goNearbyStores();
        },

        /**
         * 跳转到个人资料
         */
        goUserInfo: function () {
            $state.go('tabs.userInfo');
        },

        /**
         * 跳转到浏览记录
         */
        goBrowerList: function () {
            $state.go('tabs.userViewHistory');
        },

        /**
         * 跳转到我的收藏
         */
        goCollectionList: function () {
            if (!APP_USER.id) {
                ctrl.openLogin();
                return;
            }
            $state.go('tabs.userCollectionList');
        },

        /**
         *  跳转到订单列表
         */
        goOrderList: function (type) {
            if (!APP_USER.id) {
                ctrl.openLogin();
                return;
            }
            //跳转到订单列表
            var stateName = stateUtils.getStateNameByCurrentTab('orderList');
            //跳转到订单列表
            $state.go(stateName, {
                type: type
            });
        },

        /**
         * 打开登录弹出层
         */
        openLogin: function () {
            modals.login.open();
        },

        /**
         * 切换语言 获取当前语言，并显示要切换的另一种语言var language = APP_CONFIG.language;
         */
        onToggleLanguage: function () {
            //获取到当前语言

            globalService.toggleLanguage(ctrl.languageKey);

            if (ctrl.languageKey == 'en') {
                ctrl.languageKey = "zh-CN";
                ctrl.wantLanguage = "中";
            } else {
                ctrl.languageKey = "en";
                ctrl.wantLanguage = "En";
            }
            ctrl.loadData();
        },

        /**
         * 家乐福福卡钱包
         */
        goCarrefourWallet: function () {
            stateUtils.goCarrefourWallet();
        }
    });

    messageCenter.subscribeMessage('login', function () {
        ctrl.refresh({
            emptyData: false,
            showLoading: true
        });
    }, $scope);

    $scope.$on('$ionicView.afterEnter', function () {
        // 广播页面Tag
        messageCenter.publishMessage('AT.screen', {
            pageName: 'personal_space::personal_space_home'
        });
    });

    var deregistration = $scope.$on('$ionicView.afterEnter', function () {
        ctrl.init({
            emptyData: false,
            showLoading: false
        });
        deregistration();

        $scope.$on('$ionicView.afterEnter', function () {
            ctrl.refresh({
                emptyData: false,
                showLoading: false
            });
        });
    });
}]);
