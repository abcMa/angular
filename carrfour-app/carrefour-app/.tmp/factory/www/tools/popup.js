/**
 * 通用提示框和确认对话框
 */
angular.module('app.services').factory('popup', ["$ionicPopup", "$translate", "$ionicPlatform", "$rootScope", "cmSwitcherDelegate", "deploy", "$timeout", "api", function (
    $ionicPopup, $translate, $ionicPlatform, $rootScope, cmSwitcherDelegate, deploy, $timeout, api
) {
    return {
        // 提示框
        alert: function (content) {
            return $ionicPopup.alert({
                title: $translate.instant('popup.title'),
                template: $translate.instant(content),
                okText: $translate.instant('popup.ok')
            });
        },

        // 确认对话框
        confirm: function (content) {
            return $ionicPopup.confirm({
                title: $translate.instant('popup.title'),
                template: $translate.instant(content),
                okText: $translate.instant('popup.confirm'),
                cancelText: $translate.instant('popup.cancel')
            });
        },

        // 版本更新确认对话框
        updateConfirm: function(content, updateCallback) {
            return $ionicPopup.show({
                title: $translate.instant('popup.updateTitle'),
                template: content,
                buttons: [{
                    text: $translate.instant('popup.cancel') || 'Cancel',
                    type: 'button-default'
                }, {
                    text: $translate.instant('popup.updateConfirm') || 'OK',
                    type: "button-primary",
                    onTap: function(e) {
                        e.preventDefault();
                        updateCallback();
                    }
                }]
            });
        },
        // 提示框
        updateAlert: function (content, onConfirm) {
            var deregisterBackButton = $ionicPlatform.registerBackButtonAction(function (e) {}, 401);
            return $ionicPopup.show({
                title: $translate.instant('popup.updateTitle'),
                template: content,
                buttons: [{
                    text: $translate.instant('popup.updateConfirm'),
                    type: 'button-primary',
                    onTap: function (e) {
                        onConfirm.call(this);
                        e.preventDefault();
                    }
                }]
            });
        },

        // 热部署弹窗
        deployMixin: function (isForceUpdate, currentNetWorkType) {
            var NETWORKTYPE = {
                WIFI: 0,
                CELL: 1,
                NONE: 2
            };
            var scope = $rootScope.$new();
            var switcher = cmSwitcherDelegate.$getByHandle('deploy-popup-content-switcher');
            var deferred = api.defer();
            if (isForceUpdate) {
                var deregisterBackButton = $ionicPlatform.registerBackButtonAction(function (e) {}, 401);
            }
            _.assign(scope, {
                downloadPercent: 0,
                extractPercent: 0,
                isForceUpdate: isForceUpdate,
                isWifi: currentNetWorkType == NETWORKTYPE.WIFI,
                isIOS: ionic.Platform.isIOS(),
                close: function () {
                    deferred.resolve();
                    navigator.app.exitApp();
                },
                cancel: function () {
                    deferred.reject();
                    popup.close();
                },
                confirm: function () {
                    switcher.switch("#download");
                    download()
                        .then(function () {
                            switcher.switch("#extract");
                            extract().then(function () {
                                switcher.switch("#done");
                                // 需求变更，如ios则直接载入
                                if (ionic.Platform.isIOS()) {
                                    setTimeout(function () {
                                        deploy.load();
                                    }, 1000);
                                }
                            }, function () {
                                switcher.switch("#extractError");
                            });
                        }, function () {
                            switcher.switch("#downloadError");
                        });
                },
                reboot: function () {
                    deferred.resolve();
                    navigator.app.exitApp();
                }
            });

            var popup = $ionicPopup.show({
                title: $translate.instant('deployTips.title'),
                templateUrl: "templates/modules/deployPopupContent.html",
                scope: scope
            });

            function download() {
                return deploy.downloadByProcess(_.throttle(updateDownloadProcess, 100));
            }

            function extract() {
                return deploy.extractByProcess(_.throttle(updateExtractProcess, 100));
            }

            function updateDownloadProcess(percent) {
                scope.$apply(function () {
                    scope.downloadPercent = percent;
                });
            }

            function updateExtractProcess(percent) {
                scope.$apply(function () {
                    scope.extractPercent = percent;
                });
            }

            return deferred.promise;
        },

        // // 热部署确认对话框
        // deployConfirm: function () {
        //     return $ionicPopup.confirm({
        //         title: $translate.instant('popup.updateTitle'),
        //         template: $translate.instant('deployTips.netTypeTips'),
        //         okText: $translate.instant('popup.updateConfirm'),
        //         okType: "button-primary",
        //         cancelText: $translate.instant('popup.cancel')
        //     });
        // },

        // // 热部署强制对话框
        // deployAlert: function (onConfirm) {
        //     var deregisterBackButton = $ionicPlatform.registerBackButtonAction(function (e) {}, 401);
        //     return $ionicPopup.show({
        //         title: $translate.instant('popup.updateTitle'),
        //         template: $translate.instant('deployTips.netTypeTips'),
        //         buttons: [{
        //             text: $translate.instant('popup.updateConfirm'),
        //             type: 'button-primary',
        //             onTap: function (e) {
        //                 onConfirm.call(this);
        //             }
        //         }]
        //     });
        // },
        //
        // // 热部署进度框
        // deployProcess: function ($scope, content) {
        //     return $ionicPopup.show({
        //         title: $translate.instant('deployTips.notice'),
        //         cssClass: 'popup-deploy-process',
        //         template: $translate.instant(content) +
        //             "<div class='deploy-process-container mb'>\
        //                 <span class='deploy-process-bar' style='width:{{percent}}'></span>\
        //                 <span class='deploy-process-percent'>{{percent}}</span>\
        //             </div>",
        //         scope: $scope,
        //     });
        // },

        // 输入框
        input: function ($scope, title, subTitle) {
            $scope.popupData = {};
            return $ionicPopup.show({
                template: '<input type="text" class="tc" autofocus="autofocus" ng-model="popupData.content">',
                title: title,
                subTitle: subTitle,
                scope: $scope,
                buttons: [{
                    text: $translate.instant('popup.cancel'),
                    type: 'button-default',
                    onTap: function (e) {

                    }
                }, {
                    text: $translate.instant('popup.confirm'),
                    type: 'button-positive',
                    onTap: function (e) {
                        if (!$scope.popupData.content) {
                            return false;
                        } else {
                            return $scope.popupData.content;
                        }
                    }
                }]
            });
        },

        // 推送消息提示
        notificationAlert: function (content) {
            return $ionicPopup.alert({
                title: $translate.instant('popup.notificationTitle'),
                template: $translate.instant(content),
                okText: $translate.instant('popup.ok'),
                okType: 'button-primary',
            });
        },

        // 推送消息确认
        notificationConfirm: function (content) {
            return $ionicPopup.confirm({
                title: $translate.instant('popup.notificationTitle'),
                template: $translate.instant(content),
                okText: $translate.instant('popup.check'),
                okType: 'button-primary',
                cancelText: $translate.instant('popup.cancel')
            });
        },

        //热部署版本更新提示
        // updateVersion: function (content) {
        //     return $ionicPopup.confirm({
        //         title: $translate.instant('deployTips.title'),
        //         template: $translate.instant(content),
        //         okText: $translate.instant('deployTips.ok'),
        //         cancelText: $translate.instant('deployTips.cancel')
        //     });
        // }
    };
}]);
