angular.module('app.controllers').controller('nearbyStoresCtrl', ["$scope", "$state", "loadDataMixin", "$ionicPopup", "toast", "api", "storeService", "loading", "$translate", "errorHandling", "$ionicPlatform", "messageCenter", function (
    $scope, $state, loadDataMixin, $ionicPopup, toast, api, storeService, loading,
    $translate, errorHandling, $ionicPlatform, messageCenter
) {

    var ctrl = this;

    angular.extend(ctrl, loadDataMixin, {
        $scope: $scope,

        // 当前激活的tab类型
        // 1 mall
        // 2 store
        activatedType: 1,

        itemsPerPage: 3,

        LBSinit: function (params) {
            if(params.showLoading){
                loading.open();
            }
            var couponType = ctrl.activatedType;
            return ctrl.checkPermission()
                .then(function (response) {
                    var position = response.data;
                    var coords = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    return storeService.getCityIdByCoords(coords);
                }, function (response) {
                    if(response.showToast){
                        toast.open($translate.instant('nearbyStores.gpsUnavailable'));
                    }
                    return api.when({
                        cityId: APP_CONFIG.cityId,
                        coords: undefined
                    });
                })
                .then(function (response) {
                    var cityId = response.data.cityId;
                    var coords = response.data.coords;
                    ctrl.currentPostion = coords;
                    return storeService.init(cityId, couponType, coords);
                })
                .error(errorHandling)
                .finally(function () {
                    if(params.showLoading){
                        loading.close();
                    }
                });
        },

        loadPage: function (page, pageCount) {
            return storeService.getPage(page, pageCount);
        },

        onTabClick: function (mode) {
            if (ctrl.activatedType != mode) {
                ctrl.activatedType = mode;
                ctrl.LBSRefresh({
                    showLoading: true
                });
                publishTag();
            }
        },

        LBSRefresh: function (params) {
            ctrl.LBSinit(params).then(function () {
                ctrl.refresh(params);
            });
        },

        goInfo: function (storeId) {
            var params = {
                storeId: storeId
            };
            if (ctrl.currentPostion) {
                params.start = [ctrl.currentPostion.lat, ctrl.currentPostion.lng];
            }
            $state.go("tabs.storeInfo", params);
        },

        checkPermission: function () {
            var deferred = api.defer();
            if (!window.cordova || !cordova.plugins || !cordova.plugins.diagnostic || !navigator.geolocation) {
                deferred.reject({
                    showToast: true
                });
                return deferred.promise;
            }
            var diagnostic = cordova.plugins.diagnostic;
            var geolocation = navigator.geolocation;

            diagnostic.getLocationAuthorizationStatus(function (status) {
                switch (status) {
                    case diagnostic.permissionStatus.NOT_REQUESTED:
                        diagnostic.requestLocationAuthorization(function () {
                            getGeoLocation();
                        }, function () {
                            deferred.reject({
                                showToast: true
                            });
                        });
                        break;
                    case diagnostic.permissionStatus.DENIED:
                        deferred.reject({
                            showToast: false
                        });
                        popupToSettings(function () {
                            var deregistration = $ionicPlatform.on('resume', function () {
                                ctrl.LBSRefresh({
                                    emptyData: true,
                                    showLoading: false
                                });
                                deregistration();
                            });
                        });
                        break;
                    case diagnostic.permissionStatus.GRANTED:
                    case diagnostic.permissionStatus.GRANTED_WHEN_IN_USE:
                        getGeoLocation();
                        break;
                }
            }, function (error) {
                toast.open(error);
            });

            function getGeoLocation() {
                geolocation.getCurrentPosition(function (position) {
                    setTimeout(function () {
                        deferred.resolve({
                            data: position
                        });
                    });
                }, function () {
                    deferred.reject({
                        showToast: true
                    });
                }, {
                    frequency: 5000,
                    maximumAge: 0,
                    timeout: 60 * 1000
                });
            }
            return deferred.promise;
        }
    });

    function popupToSettings(callback) {
        $ionicPopup.confirm({
            title: $translate.instant('nearbyStores.notice'),
            cssClass: "nearby-stores-confirm-permission",
            template: $translate.instant('nearbyStores.noticeContent'),
            okType: "button-clear button-energized",
            okText: $translate.instant('nearbyStores.noticeSetting'),
            cancelType: "button-clear button-energized",
            cancelText: $translate.instant('nearbyStores.noticeCancel')
        }).then(function (res) {
            if (res) {
                var diagnostic = cordova.plugins.diagnostic;
                if (ionic.Platform.isIOS()) {
                    diagnostic.switchToSettings(callback, fail);
                } else {
                    diagnostic.switchToLocationSettings(callback, fail);
                }
                var fail = function (error) {
                    toast.open(error);
                };
            }
        });
    }

    function publishTag() {
        var name;
        switch (parseInt(ctrl.activatedType)) {
            case 1:
                name = "hypermarket::hypermarket_landing";
                break;
            case 2:
                name = "easy_store::easy_store_landing";
                break;
        }

        if (name) {
            // 广播页面Tag
            messageCenter.publishMessage('AT.screen', {
                pageName: 'personal_space::nearby_stores::' + name
            });
        }
    }

    $scope.$on('$ionicView.afterEnter', function () {
        publishTag();
    });

    var deregistration = $scope.$on('$ionicView.afterEnter', function () {
        ctrl.LBSinit({
            showLoading: true
        }).then(function () {
            ctrl.init();
            deregistration();

            $scope.$on('$ionicView.afterEnter', function () {
                ctrl.LBSRefresh({
                    showLoading: false
                });
            });
        });
    });
}]);
