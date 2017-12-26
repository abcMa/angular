/**
 * 注册弹出层控制器
 */
angular.module('app.controllers').controller('registerCtrl', function (
    $scope, $state, modals, cmSwitcherDelegate, globalService, errorHandling,
    userService, $interval, toast, $translate, validator, messageCenter, $ionicScrollDelegate, loading
) {
    loading.open();
    var

        controller = this,

        lock = false,

        switcher = cmSwitcherDelegate.$getByHandle('register-modal');

    _.assign(controller, {

        title: $translate.instant('register.registerMobile'),

        name: 'register',

        // 短信发送状态
        sendStatus: 0,

        // 锁定按钮
        lockSend: false,

        // 发送按钮文本
        sendVerifyCodeText: $translate.instant('register.sendCode'),

        // 发送验证码倒计时
        timeDown: undefined,

        // 定时器ID
        interval: 0,

        agreementText: undefined,

        // 表单参数
        params: {
            // 登录名称
            loginName: '',
            smsVerifyCode: '',
            password: ''
        },

        /**
         * 关闭注册面板
         */
        close: function () {
            modals.register.close();
        },

        /**
         * 返回操作
         */
        backup: function () {

            // 解锁
            lock = false;

            //重设标题
            var title = $translate.instant('register.registerMobile');
            if (controller.title != title) {
                controller.title = title;
            }
            if (switcher.getIsFirst()) {
                this.close();
            } else {
                switcher.prev();
            }
        },

        /**
         * 面板切换的回调函数
         */
        onSwitchPanel: function (switchInfo) {
            if (switchInfo.panelName === 'input-sms-verify-code') {
                //上次和本次手机号不一样 且有倒计时则取消计时器
                if (controller.backMobile != controller.params.loginName && controller.interval != 0) {
                    //重置
                    resetSendSMS();
                }

            }
        },


        /**
         * 验证手机号码
         */
        validateLoginName: function () {
            // console.info('verifyMobile');
            if (!validator.isMobile(controller.params.loginName)) {
                toast.open($translate.instant('validator.mobile'));
                return;
            }
            // 防止快速点击
            if (lock) {
                return;
            }
            lock = true;
            userService.verifyUniqueUser(controller.params.loginName)
                .error(errorHandling)
                .success(function (flag) {
                    flag && switcher.next();
                }).error(function () {
                    lock = false;
                })
        },

        /**
         * 发送短信验证码
         */
        sendSMSVerifyCode: function () {
            //发送状态
            controller.sendStatus = 0;

            //防止重复发送
            if (controller.lockSend) {
                toast.open('短信发送中,请等待完成');
                return;
            }
            //锁定发送
            controller.lockSend = true;

            //记录手机号
            if (controller.backMobile != controller.params.loginName) {
                controller.backMobile = controller.params.loginName;
            }

            return globalService.sendSMSVerifyCode(controller.params.loginName, 201)
                .error(errorHandling)
                .success(function (data) {

                    controller.sendVerifyCodeText = $translate.instant('register.reSend');
                    // 发送状态
                    controller.sendStatus = 1;

                    //初始倒计时60秒
                    controller.timeDown = Number(data.interval) / 1000;

                    //重新获取验证码倒计时
                    checkSendTime();
                }).finally(function () {
                    //解锁
                    controller.lockSend = false;
                });
        },

        /**
         * 验证短信验证码
         */
        validateSMSVerifyCode: function () {
            // console.info('validateSMSVerifyCode');

            globalService.validateSMSVerifyCode(controller.params.loginName, controller.params.smsVerifyCode)
                .success(function () {
                    //重新设置标题
                    controller.title = $translate.instant('register.settingPassword');
                    switcher.next();
                }).error(errorHandling);
        },

        /**
         * 注册协议
         */
        openServiceAgreement: function () {
            globalService.getArticleByStructure('register').success(function (data) {
                modals.registerAgreement.data = data;
                modals.registerAgreement.open();
            });
        },

        // 页面已经限制了最多输入20个字符，需求为 达到20字符时 无法继续录入 但是要提示消息
        checkPassword: function () {
            if ($.trim(controller.params.password).length == 20) {
                toast.open($translate.instant('validator.password'));
                return;
            }
        },
        /**
         * 提交短信验证码
         */
        submit: function () {

            // 检测密码长度是否小于6
            if ($.trim(controller.params.password).length < 6) {
                toast.open($translate.instant('validator.password'));
                return;
            }
            userService.register(controller.params)
                .success(function () {
                    modals.register.close();
                    modals.login.close();
                    switcher.next();
                });
        },

        clearPassword: function () {
            controller.params.password = "";
        }
    });

    // 重置发送短信状态
    function resetSendSMS() {

        //取消计时器
        $interval.cancel(controller.interval);

        //重置按钮文本
        controller.sendVerifyCodeText = $translate.instant('register.sendCode');

        //重置倒计时
        controller.timeDown = undefined;

        //重置发送状态
        controller.sendStatus = 0;

        //解除锁定
        controller.lockSend = false;

    }
    /**
     * 重新获取倒计时,倒计时结束解锁按钮
     */
    function checkSendTime() {
        //开启定时器
        controller.interval = $interval(function () {
            //判断剩余时间
            if (controller.timeDown > 0) {
                controller.timeDown--;
            } else {
                //取消定时器
                $interval.cancel(controller.interval);
                //倒计时结束解锁重新获取按钮 隐藏倒计时
                controller.timeDown = undefined;
            }
        }, 1000);
    }

    // 广播页面Tag
    messageCenter.publishMessage('AT.screen', {
        pageName: 'personal_space::quick_registration'
    });

    // 注册协议
    globalService.getArticleByStructure('register').success(function (data) {
       controller.agreementText = data;
    }).then(function(){
       $ionicScrollDelegate.resize();
       loading.close();
    });
});
