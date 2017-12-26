/**
 * 切换分站控制器
 */
angular.module('app.controllers').controller('selectRegionCtrl', ["$scope", "$ionicScrollDelegate", "$ionicHistory", "popup", "cartService", "globalService", "loading", "errorHandling", "localStorage", "messageCenter", "modals", "$params", "utils", "$timeout", function (
    $scope, $ionicScrollDelegate, $ionicHistory, popup, cartService,
    globalService, loading, errorHandling, localStorage, messageCenter, modals, $params, utils, $timeout
) {
    var ctrl = this;

    _.assign(ctrl, {
        $scope: $scope,

        currentLanguage: APP_CONFIG.language,

        languageZhCn: window.APP_LANG['zh-CN'].$name,

        languageEn: window.APP_LANG.en.$name,

        // 当前选中的地区
        selectedRegionId: undefined,

        // 当前展示的区域
        regionList: [],

        // 读记录
        storedSubsite: localStorage.get('subsite', {
            "breadNavigator": []
        }, {
            "breadNavigator": []
        }),

        // 当前的面包屑
        currentBread: undefined,

        // 关闭弹出层
        closeModal: function () {
            if ($params && !$params.backdropClickToClose) {
                return;
            }
            modals.selectRegion.close();
        },

        /*
         * 切换语言
         */
        onToggleLanguage: function (language) {
            globalService.toggleLanguage(language);
        },

        /*
         * 修改选择地区
         */
        onClickRegion: function (region) {

            var get = ctrl.getRegionListById(region.regionId, region)
                .success(function (regionList) {
                    if (regionList.length === 0) {
                        // 切换分站了？
                        if (!_.isUndefined(ctrl.storedSubsite.subsiteId) && (region.subsiteId !== ctrl.storedSubsite.subsiteId)) {
                            popup.confirm('selectRegion.popupContent')
                                .then(function (res) {
                                    if (res) {
                                        ctrl.publishSubsiteChange(region);
                                    } else { //取消
                                        return false;
                                    }
                                });
                        } else {
                            ctrl.publishSubsiteChange(region);
                        }
                    } else { //是否最后一级？
                        get.then(function (reponse) {
                            ctrl.regionList = reponse.data;
                        })
                        ctrl.updateSubsiteAndBreadNavigator(region);
                    }
                })
        },
        /**
         * 点击面包屑
         */
        onBreadClick: function (bread) {
            // 删除后面的面包屑
            ctrl.storedSubsite.breadNavigator.length = ctrl.storedSubsite.breadNavigator.indexOf(bread);
            ctrl.currentBread = bread;
            $timeout(function () {
                utils.getScrollDelegateByName('breadNavigatorScroll').resize();
            });
            ctrl.getRegionListById(bread.regionParentId, bread).success(function (data) {
                ctrl.regionList = data;
            });
        },

        updateSubsiteAndBreadNavigator: function (region) {

            // 最后一级是同胞?
            var last = _.last(ctrl.storedSubsite.breadNavigator);
            if (last && last.regionParentId === region.regionParentId) {
                ctrl.storedSubsite.breadNavigator.pop();
            }
            ctrl.storedSubsite.breadNavigator.push(region);
        },

        // 应用切换分站
        publishSubsiteChange: function (region) {

            ctrl.updateSubsiteAndBreadNavigator(region);

            var chapter = ctrl.storedSubsite.subsiteId ? 'home' : 'pre-home';
            messageCenter.publishMessage('AT.gesture', {
                name: chapter + '::select_store',
                action: 'touch'
            });

            // 将选中地区
            var newStoredSubsite = _.assign({}, ctrl.storedSubsite, region);
            localStorage.set('subsite', newStoredSubsite);

            _.assign(APP_CONFIG, newStoredSubsite);
            messageCenter.publishMessage('subsite.change', newStoredSubsite);

            // TODO 弄出去
            // 打开文章弹层
            messageCenter.publishMessage('index.popup');

            // 最有一级了?
            $timeout(function () {
                modals.selectRegion.close();
            });
        },

        // 根据区域id获取子级
        getRegionListById: function (id, currentBread) {
            //查找id下的list
            loading.open();
            return globalService.getListByRegionId(id)
                .success(function (response) {

                    // 如果有当前项?
                    if (currentBread) {
                        _.forEach(response, function (region) {
                            region.active = region.regionId === currentBread.regionId;
                        });
                    }
                    $timeout(function () {
                        utils.getScrollDelegateByName('selectRegionScroll').scrollTop(true);
                    });
                })
                .error(errorHandling)
                .finally(function () {
                    loading.close();

                });

        },

        // 加载地区数据
        loadRegions: function (isRefresh) {
            if (ctrl.storedSubsite.breadNavigator && ctrl.storedSubsite.breadNavigator.length > 0) {
                var lastBread = _.last(ctrl.storedSubsite.breadNavigator);

                // 初次加载?  把面包屑最后一个弹出来
                if (!isRefresh) {
                    // 弹出来的留着用
                    ctrl.currentBread = ctrl.storedSubsite.breadNavigator.pop();

                    // 初次加载时last和当前展示的regionList是同胞
                    ctrl.getRegionListById(lastBread.regionParentId, lastBread)
                        .success(function (data) {
                            ctrl.regionList = data;
                        });
                } else {
                    // 刷新时，之前弹出来的和regionList是同胞
                    ctrl.getRegionListById(lastBread.regionId, ctrl.currentBread).success(function (data) {
                        ctrl.regionList = data;
                    });
                }

            } else {
                ctrl.getRegionListById(1, ctrl.currentBread).success(function (data) {
                    ctrl.regionList = data;
                });
            }
        },

        // 只更新自己存储的，localstroage里的由公用切换来负责
        updateStoredSubsite: function () {
            var idArr = _.pluck(ctrl.storedSubsite.breadNavigator, "regionId");
            if (idArr.length < 0) {
                return;
            }
            globalService.getRegionNamesByIdList(idArr)
                .success(function (data) {

                    // 批量更新
                    _.forEach(data, function (regionName, regionId) {
                        var region = _.find(ctrl.storedSubsite.breadNavigator, {
                            regionId: parseInt(regionId)
                        });
                        if (region) {
                            region.regionName = regionName;
                        }
                    });
                    $timeout(function () {
                        utils.getScrollDelegateByName('breadNavigatorScroll').scrollTo(0);
                    })
                });
        }
    });
    // 加载地区
    ctrl.loadRegions();

    // 切换语言后重新加载地区数据
    messageCenter.subscribeMessage('language.change', function (e, language) {
        ctrl.loadRegions(true);
        ctrl.updateStoredSubsite();
        ctrl.currentLanguage = language;
    }, $scope);
}]);
