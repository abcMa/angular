/**
 * 登录弹出层控制器
 */
angular.module('app.controllers').controller('loginCtrl', function (
    $scope, $state, $params, modals, globalService, userService, errorHandling, validator, $translate, toast,
    loading, messageCenter
) {
    var ctrl = this;

    $params = _.defaults({}, $params, {
        successCallback: _.noop,
        cancelCallback: _.noop,
        data: {}
    });

    _.assign(ctrl, {
        // 表单参数
        params: {
            // 登录名称
            loginName: undefined,

            // 密码
            password: undefined,

            // 图片验证码
            imageVerifyCode: undefined
        },

        // 是否要显示验证码表单项
        showImageVerifyCode: false,

        /**
         * 提交登录表单
         */
        submit: function () {
            var params = this.params;

            if (!validator.isSecurity(params.loginName) || !validator.isSecurity(params.password)) {
                toast.open($translate.instant('validator.security'));
                return;
            }

            if (this.showImageVerifyCode === false) {
                params = _.assign({}, params, {
                    imageVerifyCode: undefined
                });
            }
            loading.open();
            userService.login(params)
                .success(function () {
                    $params.successCallback(params);
                    userService.info();
                    modals.login.close();
                })
                .error(errorHandling)
                .error(function (responseData) {
                    if (ctrl.showImageVerifyCode === false) {
                        ctrl.showImageVerifyCode = !!_.get(responseData, 'data.needImageVerifyCode');
                    } else {
                        //登陆失败 重新刷新一次验证码
                        $scope.$broadcast('refresh');
                    }
                }).finally(function () {
                    loading.close();
                })
        },

        /**
         * 打开注册窗口
         */
        openRegister: function () {
            modals.register.open();
        },

        /**
         * 打开找回密码窗口
         */
        openRetrievePassword: function () {
            modals.retrievePassword.open();
        },

        close: function() {
            $params.cancelCallback();
            modals.login.close();
        }
    });

    // 广播页面Tag
    messageCenter.publishMessage('AT.screen', {
        pageName: 'personal_space::sign_in'
    });
});
