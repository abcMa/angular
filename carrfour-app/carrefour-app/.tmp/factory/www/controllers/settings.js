angular.module('app.controllers').controller('settingsCtrl', ["$scope", "$state", "globalService", "$ionicActionSheet", "$translate", "userService", "popup", "toast", "messageCenter", "localStorage", "modals", "shareService", function (
    $scope, $state, globalService, $ionicActionSheet, $translate, userService, popup, toast,
    messageCenter, localStorage, modals, shareService
) {

    var ctrl = this;

    angular.extend(ctrl, {

        $scope: $scope,

        canShare: false,

        version: window.APP_CONFIG.appVersion,

        isLogin: function () {
            return userService.hasLogined();
        },
        /**
         * 切换语言
         */
        onToggleLanguage: function () {
            var buttons = [];
            for (var i in APP_LANG) {
                buttons.push({
                    key: i,
                    text: APP_LANG[i].$name
                });
            }
            // 广播页面Tag
            messageCenter.publishMessage('AT.viewTag', {
                pageName: 'personal_space::switch_language',
                customVariables: {
                    "1": APP_LANG[APP_CONFIG.language].$id,
                    "2": APP_CONFIG.subsiteId,
                    "18": APP_USER.oldNew,
                    "19": APP_USER.ageGroup
                }
            });
            $ionicActionSheet.show({
                buttons: buttons,
                titleText: $translate.instant('settings.toggleLanguageContent'),
                cancelText: $translate.instant('settings.toggleLanguageCancel'),
                buttonClicked: function (index) {
                    globalService.toggleLanguage(buttons[index].key);
                    // 广播行为Tag
                    var language = {
                        0: "english",
                        1: "chinese"
                    };
                    messageCenter.publishMessage('AT.gesture', {
                        name: "personal_space::switch_language::" + language[index],
                        action: "touch"
                    });
                    return true;
                }
            });
        },

        /**
         * 跳转到关于页面
         */
        goUserAboutUs: function () {
            // 广播页面Tag
            messageCenter.publishMessage('AT.screen', {
                pageName: 'personal_space::about_current_version'
            });
            $state.go('tabs.userAboutUs');
        },

        /**
         * 清除缓存
         */
        onClearCache: function () {
            // 广播页面Tag
            messageCenter.publishMessage('AT.screen', {
                pageName: 'personal_space::clear_cache'
            });
            popup.confirm($translate.instant('settings.popupTitle'))
                .then(function (res) {
                    if (res) {
                        // 广播行为Tag
                        messageCenter.publishMessage('AT.gesture', {
                            name: "personal_space::clear_cache::clear_cache_confirm",
                            action: "touch"
                        });
                        window.cache.clear(function () {
                            localStorage.clean();
                            //清除缓存时，保留是否为首次打开应用的数据
                            localStorage.set('isactivity', 'notfirst');

                            toast.open($translate.instant('settings.clearSuccess'));
                        }, angular.noop);
                    }else {
                        // 广播行为Tag
                        messageCenter.publishMessage('AT.gesture', {
                            name: "personal_space::clear_cache::clear_cache_cancel",
                            action: "touch"
                        });
                    }
                });
        },

        checkAppShare: function() {
            shareService.checkAppShare()
            .success(function(data) {
                ctrl.canShare = data.canShare;
            })
        },

        /**
         * 退出登录
         */
        logout: function () {
            userService.logout().finally(function () {
                $state.go('tabs.user');
            });
        },

        /**
        * 跳转意见反馈页面
        */
        notes: function() {
            $state.go('tabs.feedbackOptions');
        },

        /**
        * 跳转appstopre评价页面
        */
        goAppStore: function(){
            window.open("http://itunes.apple.com/WebObjects/MZStore.woa/wa/viewContentsUserReviews?id=1062816186&pageNumber=0&sortOrdering=2&type=Purple+Software&mt=8");
        }

    });

    var deregistration = $scope.$on('$ionicView.beforeEnter', function() {
        if (APP_CONFIG.os === 'android' || APP_CONFIG.os === 'ios') {
            ctrl.checkAppShare();
        }
        deregistration();
    });

    // 广播页面Tag
    messageCenter.publishMessage('AT.screen', {
        pageName: 'personal_space::settings'
    });
}]);
