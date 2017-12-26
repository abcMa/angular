/**
 * 支付相关接口
 */
angular.module('app.services').factory('payService', ["api", "$q", "$rootScope", "$ionicPopover", "toast", "loading", "$sce", "errorHandling", "messageCenter", "$translate", "modals", "applePay", "stateUtils", "$timeout", "carrefourWallet", function (
    api, $q, $rootScope, $ionicPopover, toast, loading, $sce, errorHandling, messageCenter, $translate, modals,
    applePay, stateUtils, $timeout, carrefourWallet
) {
    var

        WECHAT_PAY_METHOD_ID = '4',

        /**
         * 定义所有支持的支付操作
         */
        paymentMethods = {
            /**
             * 支付宝支付
             */
            2: function (payInfo) {
                var apiDeferred = api.defer();

                window.alipay.check(function (isInstalled) {
                    if (isInstalled === 'true') {
                        window.alipay.pay(
                            payInfo,

                            function sucess() {
                                apiDeferred.resolve();
                            },

                            function error(code) {
                                // 支付宝错误码映射
                                var errorMsgs = {
                                    '4000': $translate.instant('pay.payError'), // 支付失败
                                    '6001': $translate.instant('pay.payCancel'), // 支付取消
                                    '6002': $translate.instant('pay.payError') // 网络异常导致无法支付
                                };

                                var message = errorMsgs[code];

                                if (!message) {
                                    message = $translate.instant('pay.payError');
                                }

                                apiDeferred.reject(APP_STATE_CODE.unknownException, message);
                            }
                        );
                    } else {
                        apiDeferred.reject(APP_STATE_CODE.unknownException, $translate.instant('pay.missAlipay'));
                    }
                });

                return apiDeferred.promise;
            },

            /**
             * 微信支付
             */
            4: function (payInfo) {
                var apiDeferred = api.defer();

                // 三只松鼠接口所返回的支付数据集合中的 key 与插件中所规定的不一样，因此这里需要转换一下
                payInfo = (function (data) {
                    if (typeof data === 'string') {
                        data = JSON.parse(data);
                    }

                    data.timeStamp = data.timeStamp || data.timestamp;
                    data.partnerId = data.partnerId || data.partnerid;
                    data.prepayId = data.prepayId || data.prepayid;
                    data.packageValue = data.packageValue || data.package;
                    data.nonceStr = data.nonceStr || data.noncestr;
                    // data.sign

                    return JSON.stringify(data);
                })(payInfo);

                window.wechatPay.checkAppInstalled(function (isInstallWechatApp) {
                    if (isInstallWechatApp === 'true') {
                        window.wechatPay.pay(
                            payInfo,

                            function sucess() {
                                apiDeferred.resolve();
                            },

                            function error(message) {
                                apiDeferred.reject(APP_STATE_CODE.unknownException, message);
                            }
                        );
                    } else {
                        apiDeferred.reject(APP_STATE_CODE.notInstalledWechat, $translate.instant('pay.missWechat'));
                    }
                });

                return apiDeferred.promise;
            },

            /**
             * 银联支付
             */
            10: function (payInfo) {
                var deferred = api.defer();
            var closeButtonCaption = $translate.instant('inAppBrowser.closeButton');
            var inAppBrowser = cordova.InAppBrowser.open(payInfo, '_blank', 'location=no,enableViewportScale=no,suppressesIncrementalRendering=yes,closebuttoncaption=' + closeButtonCaption + ',disallowoverscroll=yes,toolbarposition=top');
                inAppBrowser.addEventListener('loadstart', function (event) {
                    var url = event.url;
                    if (/.*\/paysuccess/.test(url)) {
                        inAppBrowser.close();
                        deferred.resolve();
                    }
                    if (/.*\/payerror/.test(url)) {
                        inAppBrowser.close();
                        var index = url.indexOf('?msg=');
                        deferred.reject(APP_STATE_CODE.unknownException,
                            decodeURIComponent(url.substr(index + 5)));
                    }
                });
                inAppBrowser.addEventListener('exit', function (event) {
                    deferred.reject();
                    inAppBrowser = undefined;
                });
                return deferred.promise;
            },

            /**
             * <del>北京站 银联支付</del>
             *
             * 目前此ID调整为银联控件支付
             */
            11: function (payInfo) {
                var deferred = api.defer();
                window.plugins.CMUnionPay.pay(payInfo.tn, function () {
                    deferred.resolve();
                }, function (resCode) {

                    // 错误码映射
                    var errorMsgs = {
                        'fail': $translate.instant('pay.payError'), // 支付失败
                        'cancel': $translate.instant('pay.payCancel') // 支付取消
                    };

                    var message = errorMsgs[resCode];

                    if (!message) {
                        message = $translate.instant('pay.payError');
                    }

                    deferred.reject(APP_STATE_CODE.unknownException, message);
                });
                return deferred.promise;
            },

            /**
             * Apple Pay
             */
            13: function (payInfo) {
                if (typeof payInfo === 'string') {
                    payInfo = JSON.parse(payInfo);
                }

                return applePay.pay(payInfo.tn).error(errorHandling);
            },

            /**
             * 福卡支付
             */
            6: function (payInfo) {
                var deferred = api.defer();
            var closeButtonCaption = $translate.instant('inAppBrowser.closeButton');
            var inAppBrowser = cordova.InAppBrowser.open(payInfo, '_blank', 'location=no,enableViewportScale=no,suppressesIncrementalRendering=yes,closebuttoncaption=' + closeButtonCaption + ',disallowoverscroll=yes,toolbarposition=top');
                inAppBrowser.addEventListener('loadstart', function (event) {
                    var url = event.url;
                    if (/.*\/paysuccesspart/.test(url)) {
                        inAppBrowser.close();

                        var index = url.indexOf('?paidAmount=');
                        paidAmount = url.substr(index + 12);
                        var payMsg = {
                            paidAmount: paidAmount,
                            secondePay: true
                        };
                        deferred.resolve(payMsg);
                    }
                    if (/.*\/paysuccess/.test(url)) {
                        inAppBrowser.close();
                        deferred.resolve();
                    }
                    if (/.*\/payerror/.test(url)) {
                        inAppBrowser.close();
                        var msgIndex = url.indexOf('?msg=');
                        deferred.reject(APP_STATE_CODE.unknownException,
                            decodeURIComponent(url.substr(msgIndex + 5)));
                    }
                });
                inAppBrowser.addEventListener('exit', function (event) {
                    deferred.reject();
                    inAppBrowser = undefined;
                });
                return deferred.promise;
            },

            /*
             * 海外购 支付宝支付
             */
            12: function (payInfo) {
                var apiDeferred = api.defer();

                //如果是在非微信浏览器里
                if (!$rootScope.isWeixinBrowser && APP_CONFIG.os == "weixin") {
                    window.location.href = payInfo;

                    return apiDeferred.promise;
                }

                return this['2'](payInfo);
            },

            /*
             * 福卡钱包
             */
            14: function (payInfo) {
                var deferred = api.defer();
                carrefourWallet.open(payInfo,function (state, url) {
                    switch (state) {
                        case "exit":
                            deferred.reject(APP_STATE_CODE.carrefourWallet,"exit");
                            break;
                        case "backtoindex":
                            deferred.reject(APP_STATE_CODE.carrefourWallet,"carrefourWalletToIndex");
                            break;
                        case "paysuccesspart":
                            var index = url.indexOf('?paidAmount=');
                            var paidAmount = url.substr(index);
                            var payMsg = {
                                paidAmount: paidAmount,
                                secondePay: true
                            };
                            deferred.resolve(payMsg);
                            break;
                        case "paysuccess":
                            deferred.resolve();
                            break;
                        case "payerror":
                            var msgIndex = url.indexOf('?msg=');
                            deferred.reject(APP_STATE_CODE.unknownException, decodeURIComponent(url.substr(msgIndex + 5)));
                            break;
                    }
                });
                return deferred.promise;
            }

        },

        payService = {

            /**
             * 进行微信 js-api 支付操作
             */
            wechatPay: function (orderId, orderNo, price) {

                loading.open();
                var params = {
                        orderId: _.trim(orderId),
                        paymentModeId: WECHAT_PAY_METHOD_ID
                    },

                    //请求支付数据
                    promise = api.post('/pay/topay', params)
                    .then(function (response) {
                        var data = response.data;
                        var apiDeferred = api.defer();

                        data = $.parseJSON(data);

                        //调起微信支付
                        wx.chooseWXPay({
                            timestamp: data.timeStamp,
                            nonceStr: data.nonceStr,
                            package: data.package,
                            signType: data.signType,
                            paySign: data.paySign,

                            success: function (res) {
                                apiDeferred.resolve();
                            },

                            fail: function (res) {
                                apiDeferred.reject('C10');
                            },

                            cancel: function (res) {
                                apiDeferred.reject('C18');
                            }
                        });

                        return apiDeferred.promise;
                    })
                    .finally(function () {
                        loading.close();
                    }).then(function () {
                        //广播消息 支付完成
                        messageCenter.publishMessage('pay.success');
                    });

                return promise;
            },

            /**
             * 进行支付
             */
            pay: function (orderId, paymentModeId) {

                loading.open();

                var params = {
                    orderId: _.trim(orderId),
                    paymentModeId: paymentModeId
                };

                //请求支付数据
                return api.post('/pay/topay', params)
                    .finally(function () {
                        loading.close();
                    })
                    .then(function (response) {
                        var data = response.data;
                        return paymentMethods[paymentModeId](data);
                    })
                    .then(function (payInfo) {
                        var orderMsg = {
                            orderId: params.orderId,
                            secondPay: payInfo.secondePay,
                            paidAmount: payInfo.paidAmount,
                            paymentDiscountAmount: payInfo.paymentDiscountAmount
                        };

                        // 同步支付成功状态 调用接口，通知后台支付成功、发送数据：orderId、paymentModeId
                        api.post('/pay/payNotice', {
                            orderId: params.orderId,
                            paymentModeId: paymentModeId
                        });

                        //广播消息 支付完成
                        messageCenter.publishMessage('pay.success', params.orderId);
                        return api.when(orderMsg);
                    });

            },

            // 获取启用的支付方式列表
            getPaymentList: function (orderId) {
                loading.open();

                var params = {
                    orderId: _.trim(orderId)
                };
                return api.post('/pay/infoWithSecond', params)
                    .finally(function () {
                        loading.close();
                    });
            }
        };

    return payService;
}]);
