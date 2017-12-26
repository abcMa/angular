angular.module('app.controllers').controller('userInfoCtrl', ["$scope", "$state", "loadDataMixin", "userService", "api", "modals", "stateUtils", "globalService", "popup", "$ionicActionSheet", "dateFilter", "camera", "toast", "loading", "$translate", "errorHandling", "messageCenter", function (
    $scope, $state, loadDataMixin, userService, api, modals, stateUtils, globalService, popup,
    $ionicActionSheet, dateFilter, camera, toast, loading, $translate, errorHandling,
    messageCenter
) {
    var ctrl = this;

    ctrl.sexEnum = {
        1: $translate.instant('user.info.sex.sexMale'),
        2: $translate.instant('user.info.sex.sexFemale')
    };

    _.assign(ctrl, loadDataMixin, {
        $scope: $scope,

        userInfo: APP_USER,

        loadData: function () {
            if (APP_USER.id) {
                return userService.info();
            } else {
                return api.when(APP_USER);
            }
        },

        uploadProfile: function () {
            if (APP_CONFIG.os === 'weixin') {
                return;
            }
            camera.getPicture(320, 320, 'userPhoto')
                .success(function (imageData) {

                    userService.uploadAvatar(imageData)
                        .success(function(responseData) {
                            ctrl.refresh({
                                emptyData: false,
                                showLoading: true
                            });
                            toast.open($translate.instant("camera.photoSucceeded"));
                        })
                        .error(errorHandling);

                })
                .error(errorHandling);
        },

        editNickname: function () {
            popup.input($scope, $translate.instant('user.info.editNickname.title'))
                .then(function (val) {
                    if (val) {
                        if ($.trim(val).length > 15) {
                            toast.open($translate.instant('user.info.editNickname.alert'));
                            return;
                        }
                        loading.open();
                        userService.update({
                            nickname: val
                        }).success(function (response) {
                            ctrl.userInfo.nickname = val;
                            loading.close();
                        });
                    }
                });
        },

        editSex: function () {
            var buttons = [];
            for (var i in ctrl.sexEnum) {
                buttons.push({
                    text: ctrl.sexEnum[i]
                });
            }
            $ionicActionSheet.show({
                buttons: buttons,
                titleText: $translate.instant('user.info.editSex.title'),
                cancelText: $translate.instant('user.info.editSex.cancel'),
                buttonClicked: function (index) {
                    loading.open();
                    userService.update({
                        sex: index
                    }).then(function (response) {
                        ctrl.userInfo.sex = index + 1;
                        loading.close();
                    });
                    return true;
                }
            });
        },

        goDatePicker: function () {
            if (APP_CONFIG.os === 'weixin') {
                return;
            }
            loading.open();
            if (!window.plugins || !window.plugins.datePicker) {
                toast.open("datePicker is not defined");
                setTimeout(function(){
                    loading.close();
                }, 1000);
                return;
            }

            var options = {
                date: ctrl.userInfo.birthday ? new Date(ctrl.userInfo.birthday) : new Date(),
                minDate: new Date('1900-01-01'),
                maxDate: new Date(),
                mode: 'date',
                doneButtonLabel: $translate.instant('datePicker.doneButtonLabel'),
                cancelButtonLabel: $translate.instant('datePicker.cancelButtonLabel'),
                titleText: $translate.instant('datePicker.titleText'),
                cancelText: $translate.instant('datePicker.cancelText'),
                todayText: $translate.instant('datePicker.todayText'),
                nowText: $translate.instant('datePicker.nowText'),
                okText: $translate.instant('datePicker.okText'),
                allowOldDates: false,
                allowFutureDates: false,
                is24Hour: true,
                locale: APP_CONFIG.language
            };

            datePicker.show(options, onSuccess);

            setTimeout(function(){
                loading.close();
            }, 1000);

            function onSuccess(date) {
                if (!_.isDate(date)) {
                    return;
                }
                loading.open();
                var dateStr = dateFilter(date, "yyyy-MM-dd");
                userService.update({
                    birthday: dateStr,
                }).success(function (response) {
                    ctrl.userInfo.birthday = dateStr;
                }).finally(function () {
                    loading.close();
                });
            }
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
        }
    });

    // 广播页面Tag
    messageCenter.publishMessage('AT.screen', {
        pageName: 'personal_space::personal_space_detail'
    });

    function keyboardShowHandler(e) {
        var ele = document.getElementsByClassName("popup");
        if(ele.length > 0) {
            ele = ele[0];
            var eleBottom = window.screen.height - (ele.offsetTop + ele.offsetHeight);
            var keyboardHeight = e.keyboardHeight;
            if (keyboardHeight - eleBottom > 85) {
                ele.parentNode.className += " show-up";
            }
        }
    }
    function keyboardHideHandler(e) {
        $(".popup").parent().removeClass("show-up");
    }
    window.addEventListener('native.keyboardshow', keyboardShowHandler);
    window.addEventListener('native.keyboardhide', keyboardHideHandler);

    var deregistration = $scope.$on('$ionicView.afterEnter', function () {
        ctrl.init({
            emptyData: false,
            showLoading: false
        });
        deregistration();

        $scope.$on('$ionicView.afterEnter', function () {
            ctrl.refresh({
                emptyData: false,
                showLoading: true
            });
        });
    });
}]);
