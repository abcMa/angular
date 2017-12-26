/**
 * 条形码、二维码扫描服务
 */
angular.module('app.services').factory('scanService', function (
    $q, toast, $translate, messageCenter
) {
    var scanService = {
        scan: function () {
            var deferred = $q.defer();
            // 微信商城扫描
            if (window.wx) {
                wx.scanQRCode({
                    needResult: 1,
                    success: function (res) {
                        // 扫描结果
                        var code = res.resultStr;
                        // 判断类型  条形码 or 二维码
                        var format = "";
                        if (/^http/.test(code)) {
                            format = 'qrCode';
                        } else {
                            format = 'barCode';

                            // 微信处理条形码 多个字符串
                            _.forEach(code.split(","), function (str) {
                                if (isNaN(str) === false) {
                                    code = str;
                                }
                            });
                        }
                        deferred.resolve({
                            format: format,
                            code: code,
                        });
                    },
                    fail: function () {
                        toast.open($translate.instant('scan.parseFailure'));
                        deferred.reject();
                    }
                });
            }
            // 应用内扫描
            else if (window.cordova && cordova.plugins && cordova.plugins.barcodeScanner) {
                // 标记扫一扫
                messageCenter.publishMessage('AT.screen', {
                    pageName: 'scan'
                });
                cordova.plugins.barcodeScanner.scan(
                    function (result) {

                        if (result.cancelled || !result.text) {
                            deferred.reject();
                            return;
                        }

                        var format = result.format;
                        var index = format.lastIndexOf(".");
                        if (index > 0) {
                            format = format.substr(index + 1);
                        }

                        deferred.resolve({
                            format: format,
                            code: result.text
                        });
                    },

                    function () {
                        toast.open($translate.instant('scan.parseFailure'));
                        deferred.reject();
                    }
                );
            } else {
                toast.open($translate.instant('scan.notSupport'));
                deferred.reject();
            }

            return deferred.promise;
        }
    };

    return scanService;
});
