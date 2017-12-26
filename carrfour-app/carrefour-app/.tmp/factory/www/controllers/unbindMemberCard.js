/**
 * 解绑会员卡
 */
angular.module('app.controllers').controller('unbindMemberCardCtrl', ["$scope", "$state", "$stateParams", "loadDataMixin", "stateUtils", "errorHandling", "memberCenterService", "loading", "$interval", "messageCenter", "toast", "$translate", function (
    $scope, $state, $stateParams, loadDataMixin, stateUtils, errorHandling, memberCenterService, loading, $interval, messageCenter, toast, $translate
) {

    var ctrl = this;

    _.assign(ctrl, loadDataMixin, stateUtils, {
        $scope: $scope,

        mobile: '',

        cardNumber: $stateParams.cardNumber,

        // 倒计时剩余时间
        countdown: 0,

        // 验证码
        verifyCode: undefined,

        loadData: function(){
            loading.open();
            return memberCenterService.getUnbindMobile().success(function(data){
                ctrl.mobile = data;
            }).error(errorHandling).error(function(){
                loading.close();
            });
        },

        // 获取验证码
        getUnbindVerifyCode: function () {
            loading.open();
            ctrl.countdown = 90;
            memberCenterService.getUnbindVerifyCode()
                .success(function () {
                    var intervalHandle = $interval(function () {
                        if (ctrl.countdown > 0) {
                            ctrl.countdown--;
                        } else {
                            $interval.cancel(intervalHandle);
                            ctrl.countdown = 0;
                        }
                    }, 1000);
                })
                .error(errorHandling)
                .finally(function () {
                    loading.close();
                });
        },

        // 提交解绑
        onSubmit: function () {

            loading.open();

            // 验证资料
            if (!ctrl.verifyCode) {
                return;
            }

            memberCenterService.unbind(ctrl.verifyCode).success(function () {
                loading.close();
                $state.go('tabs.memberCenter');
                toast.open($translate.instant('unbindMemberCard.success'));
                messageCenter.publishMessage('memberCenter.refresh');
            }).error(errorHandling).error(function () {
                ctrl.verifyCode = undefined;
                toast.open($translate.instant('unbindMemberCard.error'));
                loading.close();
            });

        }

    });
    var deregistration = $scope.$on('$ionicView.beforeEnter', function () {
        ctrl.init();
        deregistration();
    });
}]);
