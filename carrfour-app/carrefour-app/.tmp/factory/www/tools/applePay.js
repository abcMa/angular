/**
 * Apple Pay 插件的代理服务
 */
angular.module('app.services').factory('applePay', ["api", "$timeout", function(api, $timeout) {

    // 支付失败时，插件所返回的是一个错误消息字符串，需将其转换成 APP_STATE_CODE 中对应的状态码，
    // 支付调用者将根据状态码进行错误处理
    var errorMessageMap = {
        'failure': APP_STATE_CODE.applePayFailure,
        'cancel': APP_STATE_CODE.applePayCancel,
        'unknown cancel': APP_STATE_CODE.applePayFailure
    };

    var applePay = {
        // 是否支持 Apple Pay，在该 service 创建时，会自动进行检测当前手机是否支持 apple pay。
        isSupportApplePay: false,

        /**
         * 使用 Apple Pay 进行支付
         *
         * @param {string} payInfo - 支付相关数据
         * @return {ApiPromise} - 一个由 api.js 生成的 promise
         */
        pay: function(tn) {
            var apiDeferred = api.defer();

            if (this.isSupportApplePay === false) {
                apiDeferred.reject(APP_STATE_CODE.applePayNotSupport);
            }
            else {
                window.CMApplePay.startPay(
                    tn,
                    function(orderInfo) {
                        var applePayDiscountAmount,
                            orderAmt,
                            payAmt;

                        try {
                            console.debug('Apple Pay: the original order info: ' + orderInfo);
                            orderInfo = parseOrderInfo(orderInfo);
                            console.debug('Apple Pay: the parsed order info: ' + JSON.stringify(orderInfo));

                            if (orderInfo && orderInfo.order_amt && orderInfo.pay_amt) {
                                orderAmt = orderInfo.order_amt;
                                payAmt = orderInfo.pay_amt;

                                if (payAmt < orderAmt) {
                                    applePayDiscountAmount = (Math.floor(parseFloat(orderAmt, 10) * 100) - Math.floor(parseFloat(payAmt, 10) * 100)) / 100;
                                }
                            }

                            console.debug('Apple Pay: discount amount: ' + applePayDiscountAmount);
                        } catch (e) {
                            console.error('Apple Pay: error');
                            console.error(e);
                        }

                        apiDeferred.resolve({
                            paidAmount: payAmt,
                            paymentDiscountAmount: applePayDiscountAmount
                        });
                    },
                    function(message) {
                        apiDeferred.reject(errorMessageMap[message]);
                    });
            }

            return apiDeferred.promise;
        }
    };

    // 解析支付成功后返回的订单信息
    function parseOrderInfo(orderInfo) {
        orderInfo = _.trim(orderInfo);

        if (!orderInfo) {
            return undefined;
        }

        var result = {},
            infoItems = orderInfo.split('&');

        _.each(infoItems, function(item) {
            var key, value;

            item = _.trim(item);

            // like: 'key=value&'
            if (!item) {
                return;
            }

            item = item.split('=');

            key = decodeURIComponent(item[0]);
            value = decodeURIComponent(item[1]);

            result[key] = value;
        });

        return result;
    }

    // 检测是否支持 Apple Pay
    function checkIsSupport() {
        // 检测当前系统是否支持 applePay
        window.CMApplePay.checkSupport(
            function() {
                $timeout(function() {
                    applePay.isSupportApplePay = true;
                }, 0);
            },

            function() {
                $timeout(function() {
                    applePay.isSupportApplePay = false;
                }, 0);
            }
        );
    }

    // 检测是否有 applePay 插件
    if ( !(window.cordova && window.CMApplePay) ) {
        applePay.isSupportApplePay = false;
        applePay.pay = function() {
            return api.reject(APP_STATE_CODE.applePayNotSupport);
        };
    }
    else {
        // 设置支付模式
        CMApplePay.setDebug(APP_CONFIG.applePayDebugMode === '1');

        checkIsSupport();

        // 当设备从后台唤起时，重新检测
        document.addEventListener("resume", function() {
            setTimeout(checkIsSupport, 0);
        }, false);
    }

    return applePay;
}]);
