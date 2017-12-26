/**
 * 注册弹出层控制器
 */
angular.module('app.controllers').controller('retrievePasswordCtrl', ["$scope", "$state", "modals", "$interval", "$translate", "cmSwitcherDelegate", "globalService", "userService", "errorHandling", "validator", "toast", "messageCenter", function (
    $scope, $state, modals, $interval, $translate, cmSwitcherDelegate, globalService,
    userService, errorHandling, validator, toast, messageCenter
) {
    var switcher = cmSwitcherDelegate.$getByHandle('retrieve-password-modal');

    var lock = false;
    var controller = this;
    _.assign(this, {
        name: 'retrievePassword',

        params: {
            // 登录名称
            loginName: '',

            // 图片验证码
            imageVerifyCode: '',

            // 短信验证码
            smsVerifyCode: '',

            // 发送验证码文本  点击后 重置为 重新获取
            sendVerifyCodeText: $translate.instant('retrievePassword.sendCode'),

            // 发送验证码倒计时
            timeDown: undefined,

            // 定时器ID
            interval: undefined,

            // 短信验证码发送状态 0未发送 1 发送中 2 已发送
            state: 0,

            // 是否禁止发送
            lockSend: false,

            // 新的密码
            newPassword: '',

            // 显示密码
            showupPassword: false

        },

        /**
         * 验证登录名称
         */
        validateLoginName: function () {
            //登陆名称
            var loginName = controller.params.loginName;
            // 防止重复点击
            if (lock) {
                return;
            }
            lock = true;
            //验证账户是否存在
            globalService.validateExitsUserAndImageVerifyCode(controller.params.imageVerifyCode, loginName)
                .error(errorHandling)
                .success(function () {
                    //跳转下一步 判断是否邮箱
                    var isEmail = validator.isEmail(loginName);
                    if (isEmail) {
                        //发送找回密码邮件
                        globalService.sendMail(loginName, 301);
                        //跳转到邮件验证提示panel
                        switcher.switch('[data-name=send-email-success-panel]');
                    } else if (validator.isMobile(loginName)) {

                        //上次和本次手机号不一样 且有倒计时则取消计时器
                        if (controller.backMobile != controller.params.loginName && controller.interval != 0) {
                            //重置
                            resetSendSMS();
                        }

                        //进入下一步流程
                        switcher.next();
                    }
                })
                .finally(function () {
                    lock = false;
                    // 重新刷新一次验证码
                    $scope.$broadcast('refresh');
                    controller.params.imageVerifyCode = "";
                });
            // userService.validateLoginName(loginName)
            //     .error(errorHandling)
            //     .success(function (response) {
            //         //账户验证成功后验证验证码是否正确
            //         globalService.validateImageVerifyCode(controller.params.imageVerifyCode)
            //             .error(errorHandling)
            //             .success(function (response) {
            //                 //跳转下一步 判断是否邮箱
            //                 var isEmail = validator.isEmail(loginName);
            //                 if (isEmail) {
            //                     //发送找回密码邮件
            //                     globalService.sendMail(loginName, 301);
            //                     //跳转到邮件验证提示panel
            //                     switcher.switch('[data-name=send-email-success-panel]');
            //                 } else if (validator.isMobile(loginName)) {
            //
            //                     //上次和本次手机号不一样 且有倒计时则取消计时器
            //                     if (controller.backMobile != controller.params.loginName && controller.interval != 0) {
            //                         //重置
            //                         resetSendSMS();
            //                     }
            //
            //                     //进入下一步流程
            //                     switcher.next();
            //                 }
            //             }).error(function () {
            //                 lock = false;
            //                 //登陆失败 重新刷新一次验证码
            //                 $('.image-verify-code').trigger('click');
            //             });
            //     }).error(function () {
            //         lock = false;
            //     });

        },
        /**
         * 发送短信验证码
         */
        sendSMSVerifyCode: function () {

            //置为发送中状态
            controller.params.state = 1;

            // 防止重复发送
            if (controller.params.lockSend) {
                toast.open('短信发送中,请等待完成');
                return;
            }

            controller.params.lockSend = true;

            //记录手机号
            if (controller.backMobile != controller.params.loginName) {
                controller.backMobile = controller.params.loginName;
            }

            //发送验证码
            globalService.sendSMSVerifyCode(this.params.loginName, 301)
                .error(errorHandling)
                .success(function (response) {

                    //短信发送状态
                    controller.params.state = 2;

                    //修改按钮文本
                    controller.params.sendVerifyCodeText = $translate.instant('retrievePassword.reSend');

                    //初始倒计时60秒
                    controller.params.timeDown = Number(response.interval) / 1000;

                    //重新获取验证码倒计时
                    checkSendTime();
                }).finally(function () {
                    //解锁
                    controller.params.lockSend = false;
                });

        },
        /**
         * 验证短信密码
         */
        verifySMSVerifyCode: function () {

            var phoneNumber = controller.params.loginName;
            var smsVerifyCode = $.trim(controller.params.smsVerifyCode);
            if (smsVerifyCode.length < 6) {
                return;
            }
            globalService.validateSMSVerifyCode(phoneNumber, smsVerifyCode)
                .error(errorHandling)
                .success(function () {
                    //验证通过跳到下一步
                    switcher.next();
                });

        },

        /**
         * 基于手机号码进行修改密码操作
         */
        changePasswordByMobile: function () {
            var phoneNumber = controller.params.loginName;
            var smsVerifyCode = controller.params.smsVerifyCode;
            var newPassword = controller.params.newPassword;
            //修改密码
            userService.changePassword(phoneNumber, smsVerifyCode, newPassword)
                .error(errorHandling)
                .success(function (response) {
                    //修改成功关闭修改密码窗口
                    toast.open($translate.instant("retrievePassword.success"));
                    modals.retrievePassword.close();
                });
        },

        /**
         * 关闭找回密码弹出层
         */
        close: function () {
            modals.retrievePassword.close();
        },

        /**
         * 返回操作
         */
        backup: function () {

            lock = false;
            if (switcher.getIsFirst()) {
                this.close();
            } else {
                switcher.backup();
            }
        },

        changePasswordShowup: function () {
            if (controller.params.showupPassword) {
                $('.input-password').attr('type', 'text');
            } else {
                $('.input-password').attr('type', 'password');
            }
        }
    });

    // 重置发送短信状态
    function resetSendSMS() {
        //取消计时器
        $interval.cancel(controller.params.interval);

        //重置按钮文本
        controller.params.sendVerifyCodeText = $translate.instant('retrievePassword.sendCode');

        //重置倒计时
        controller.params.timeDown = undefined;

        //重置发送状态
        controller.params.state = 0;

        //解除锁定
        controller.params.lockSend = false;

    }

    /**
     * 找回密码重新获取倒计时,倒计时结束解锁按钮
     */
    function checkSendTime() {
        //开启定时器
        controller.params.interval = $interval(function () {
            //判断剩余时间
            if (controller.params.timeDown > 0) {
                controller.params.timeDown--;
            } else {
                //取消定时器
                $interval.cancel(controller.params.interval);
                //倒计时结束解锁重新获取按钮 隐藏倒计时
                controller.params.timeDown = undefined;

                controller.params.interval = 0;
            }
        }, 1000);

    }

    // 广播页面Tag
    messageCenter.publishMessage('AT.screen', {
        pageName: 'personal_space::forgot_password'
    });
}]);
