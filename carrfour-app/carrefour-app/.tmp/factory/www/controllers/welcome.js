/**
 * 首页控制器
 */
angular.module('app.controllers').controller('welcomeCtrl', ["$scope", "modals", "$params", "$ionicSlideBoxDelegate", "localStorage", "$timeout", "$ionicActionSheet", "globalService", "$translate", "messageCenter", "$ionicPlatform", function (
    $scope, modals, $params, $ionicSlideBoxDelegate, localStorage, $timeout, $ionicActionSheet,
    globalService, $translate, messageCenter, $ionicPlatform
) {
    var ctrl = this;

    _.assign(ctrl, {
        posters: $params.posters,
        firstOpen: $params.firstOpen,
        showPager: $params.posters.length > 1,

        init: function () {
            $timeout(function () {
                // 在 ionic 的 1.1.0 中，直接调用 $ionicSlideBoxDelegate 的 update 方法无效，
                // 但直接调用其实例的 update 方法有效
                var instance = getSlideBoxInstance('welcome-slide-box');
                instance && instance.update();
            }, 200);

            $timeout(function () {
                $ionicPlatform.ready(function () {
                    if (navigator.splashscreen) {
                        navigator.splashscreen.hide();
                    }
                });
            }, 1000);
        },

        onSlideChanged: function (index) {
            if (ctrl.firstOpen && index == ctrl.posters.length - 1) {
                // 广播页面Tag
                messageCenter.publishMessage('AT.screen', {
                    pageName: 'pre-home::select_language'
                });
            }
        },

        /**
         * 切换语言
         */
        onToggleLanguage: function (key) {
            globalService.toggleLanguage(key);
            messageCenter.publishMessage('language.change', key);
            ctrl.close();
        },

        close: function () {
            $params.successCallback();
            $timeout(function () {
                modals.welcome.close();
            });
        },

        onDrag: function (start, delta) {
            var instance = getSlideBoxInstance('welcome-slide-box');
            if (!instance || instance.currentIndex() < instance.slidesCount() - 1 || delta.x > 0) {
                // slider has been destroyed
                // not the last one
                // wipe to right
                return;
            }
            var swipePath = Math.abs(delta.x);
            if (swipePath > screen.width / 2) {
                console.debug('close');
                ctrl.close();
            }
        }

    });

    ctrl.init();

    function getSlideBoxInstance(name) {
        var instance;

        _.forEach($ionicSlideBoxDelegate._instances, function (i) {
            if (i.$$delegateHandle === 'welcome-slide-box') {
                instance = i;
                return false;
            }
        });

        return instance;
    }

    // 广播页面Tag
    messageCenter.publishMessage('AT.screen', {
        pageName: 'pre-home::tutorial'
    });
}]);
