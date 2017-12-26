angular.module('app.controllers').controller('storeInfoCtrl', function (
    $scope, $state, loadDataMixin, $stateParams, storeService, modals, toast, $translate,
    messageCenter
) {

    var ctrl = this;

    angular.extend(ctrl, loadDataMixin, {
        $scope: $scope,

        storeInfo: undefined,

        loadData: function () {
            return storeService.info($stateParams.storeId)
                .success(function (response) {
                    ctrl.storeInfo = response;
                })
                .success(function (response) {
                    var type;
                    switch (parseInt(response.storeInformationTypeId)) {
                        case 1:
                            type = "hypermarket::";
                            break;
                        case 2:
                            type = "easy_store::";
                            break;
                    }

                    if (type) {
                        // 广播页面Tag
                        messageCenter.publishMessage('AT.screen', {
                            pageName: 'personal_space::nearby_stores::' + type + response.storesName
                        });
                    }
                });
        },

        openNavigation: function () {
            if (!window.launchnavigator) {
                toast.open($translate.instant('storeInfo.navigatorError'));
                return;
            }
            var lat = ctrl.storeInfo.storesCoordinatesVO.latitude;
            var lng = ctrl.storeInfo.storesCoordinatesVO.longitude;
            var params = {
                app: launchnavigator.APP.USER_SELECT,
                appSelectionDialogHeader: $translate.instant('storeInfo.chooseNavigator'),
                appSelectionCancelButton: $translate.instant('storeInfo.cancel')
            };
            if ($stateParams.start) {
                params.start = $stateParams.start;
            }
            launchnavigator.navigate([lat, lng], params);
        },

        openMap: function () {
            if ($stateParams.start) {
                ctrl.storeInfo.start = $stateParams.start;
            }
            modals.storeMap.open({
                params: ctrl.storeInfo
            });
        }
    });

    var deregistration = $scope.$on('$ionicView.afterEnter', function () {
        ctrl.init();
        deregistration();

        $scope.$on('$ionicView.afterEnter', function () {
            ctrl.refresh({
                emptyData: false,
                showLoading: false
            });
        });
    });
});
