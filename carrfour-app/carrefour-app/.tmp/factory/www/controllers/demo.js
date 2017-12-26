/**
 * Tabs 的控制器
 */
angular.module('app.controllers').controller('demoCtrl', ["$scope", "$state", "modals", "$translate", "stateUtils", "localStorage", "messageCenter", "toast", "loading", "$timeout", function(
    $scope, $state, modals, $translate, stateUtils, localStorage, messageCenter, toast, loading, $timeout
) {

    var ctrl = this;

    _.assign(ctrl, {
        langs: APP_LANG,

        /**
         * 打开登录弹出层
         */
        openLogin: function() {
            modals.login.open();
        },

        openToast: function() {
            toast.open('toast');
        },

        openToastDelay: function() {
            toast.open('toast', { delay: 2000 });
        },

        open3Toast: function() {
            toast.open('1 toast');
            $timeout(function() {
                toast.open('2 toast');
                $timeout(function() {
                    toast.open('3 toast');
                }, 1000);
            }, 1000);
        },

        openLoading: function() {
            loading.open('loading ...');
            $timeout(function() {
                loading.close();
            }, 1000);
        },

        openEmptyLoading: function() {
            loading.open();
            $timeout(function() {
                loading.close();
            }, 1000);
        },

        openLoadingDelay: function() {
            loading.open('toast', { delay: 2000 });
            $timeout(function() {
                loading.close();
            }, 5000);

        },

        open3Loading: function() {
            loading.open('1 loading');
            $timeout(function() {
                loading.open('2 loading');
                $timeout(function() {
                    loading.open('3 loading');
                    $timeout(function() {
                        loading.close();
                    }, 1000);
                }, 1000);
            }, 1000);
        },

        open3ToastAnd3Loading: function() {
            toast.open('1 toast');
            loading.open('1 loading');
            $timeout(function() {
                toast.open('2 toast');
                loading.open('2 loading');
                $timeout(function() {
                    toast.open('3 toast');
                    loading.open('3 loading');
                    $timeout(function() {
                        loading.close();
                    }, 1000);
                }, 1000);
            }, 1000);
        },

        /**
         * 跳转到搜索页面
         */
        goSearch: function() {
            var stateName = stateUtils.getStateNameByCurrentTab('search');
            $state.go(stateName);
        },

        // 分站名称
        regionName: APP_CONFIG.regionName,

        /**
         * 选择地区
         */
        selectRegion: function() {
            modals.selectRegion.open();
        },

        toggleLang: function(langKey) {
            $translate.use(langKey);
        },

        // tab切换默认显示第一个
        activeTab: 0,

        // tab切换文本
        infoTabs: [
            {text: '红酒庄园', state: 'tab-active'},
            {text: '进口食品', state: ''}
        ],

        // tab切换效果
        changeTab: function (index) {
            ctrl.activeTab = index;

            for (var i in ctrl.infoTabs) {
                var tab = ctrl.infoTabs[i];
                if (i == index) {
                    tab.state = 'tab-active';
                } else {
                    tab.state = '';
                }
            }
        }
    });

    function selectInitialRegion() {
        modals.selectRegion.open({
            animation: 'none',
            backdropClickToClose: false,
            hardwareBackButtonClose: false
        });
    }

    // 首次访问首页，启动选择地区
    if (!APP_CONFIG.subsiteId) {
        selectInitialRegion();
    }

    // 订阅地区选择消息
    messageCenter.subscribeMessage('subsite.change', function(event, subsite) {
        ctrl.regionName = subsite.regionName;
    }, $scope);
}]);
