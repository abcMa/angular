angular.module('app.controllers').controller('editMemberCardMoblieCtrl', ["$scope", "$params", "loadDataMixin", "memberCenterService", "errorHandling", "loading", "modals", "$interval", "messageCenter", function (
    $scope, $params, loadDataMixin, memberCenterService, errorHandling, loading, modals, $interval, messageCenter
) {

    var ctrl = this;

    $params = _.defaults({}, $params);

    _.assign(ctrl, loadDataMixin, {

        $scope: $scope,

        mobile: '',

        verifyCode: undefined,

        // 倒计时id
        intervalId: 0,

        // 倒计时总时长
        intervalTime: 90,

        // 倒计时剩余时间
        countdownTime: undefined,

        isSendCode: true,

        // 获取验证码
        getVerifyCode: function(){

            loading.open();
            memberCenterService.getModifyMemberInfoMobileVerifyCode(ctrl.mobile).success(function(){
                loading.close();
                ctrl.countdownTime = ctrl.intervalTime;
                ctrl.countdown();
            }).error(errorHandling).error(function(){
                loading.close();
            });

        },

        // 倒计时
        countdown: function(){

            ctrl.interval = $interval(function () {
                if (ctrl.countdownTime > 0) {
                    ctrl.countdownTime--;
                    ctrl.isSendCode = false;
                } else if (ctrl.countdownTime <= 0) {
                    $interval.cancel(ctrl.interval);
                    ctrl.isSendCode = true;
                    ctrl.countdownTime = ctrl.intervalTime;
                }
            }, 1000);

        },

        // 完成提交
        onSubmit: function(){
            loading.open();
            memberCenterService.modifyMemberInfoMobile(ctrl.mobile, ctrl.verifyCode).success(function(){
                messageCenter.publishMessage('memberCenter.refresh');
                modals.editMemberCardMoblie.close();
                $params.callback(ctrl.mobile);
                loading.close();
            }).error(errorHandling).error(function(){
                ctrl.verifyCode = undefined;
                loading.close();
            });

        }
    });

}]);
