/**
 * 编辑身份证号码
 *
 * ## params
 * - successCallback {Function} 当添加或修改成功后，将调用该回调函数，并传入修改后的数据
 * - data {Object} 默认数据
 *   */
angular.module('app.controllers').controller('editIdCardCtrl', function (
    $scope, $params, modals, errorHandling, loading, validator, toast, $translate, checkoutService,$ionicPopup
) {
    var ctrl = this;

    $params = _.defaults({}, $params, {
        successCallback: _.noop
    });

    angular.extend(this, {
        $scope: $scope,

        // 保存表单
        submit: function() {
            // 校验身份证号是否合法
            if(!validator.isIdCard(this.idCard)) {
                toast.open($translate.instant('validator.idCard'));
                return;
            }

            loading.open();

            //保存新号码到服务
            checkoutService.saveIdCard(this.idCard)
                .success(function(data) {
                    $params.successCallback(ctrl.idCard);
                    ctrl.close();
                })
                .error(errorHandling)
                .finally(function() {
                    loading.close();
                });

        },

        close: function() {
            $scope.modals.editIdCard.close();
        },

        init: function() {
            $ionicPopup.alert({
                cssClass:'cardHint',
                template: $translate.instant('checkout.editIdCard.tip5'),
                okText: $translate.instant('checkout.editIdCard.tip6')
            })
        }
    });
    ctrl.init();

});
