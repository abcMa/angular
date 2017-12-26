/**
 * 封装家乐福钱包
 */
angular.module('app.services').factory('carrefourWallet', ["api", "modals", "$translate", "errorHandling", function (
    api, modals, $translate, errorHandling
) {
    function openInAppBrowser(url, callback) {
        var closeButtonCaption = $translate.instant('carrefourWallet.closeButton');
        var inAppBrowser = cordova.InAppBrowser.open(url, '_blank', 'location=no,hardwareback=no,enableViewportScale=no,suppressesIncrementalRendering=yes,closebuttoncaption=' + closeButtonCaption + ',disallowoverscroll=yes,toolbarposition=top');
        inAppBrowser.addEventListener('loadstart', function (event) {
            var url = event.url || event;
            if (/exit/.test(url)) {
                callback("exit", url);
                inAppBrowser.close();
                inAppBrowser = undefined;
                return;
            }
            if (/backtoindex/.test(url)) {
                callback("backtoindex", url);
                inAppBrowser.close();
                inAppBrowser = undefined;
                return;
            }
            if (/.*\/paysuccesspart/.test(url)) {
                callback("paysuccesspart", url);
                inAppBrowser.close();
                inAppBrowser = undefined;
                return;
            }
            if (/.*\/paysuccess/.test(url)) {
                callback("paysuccess", url);
                inAppBrowser.close();
                inAppBrowser = undefined;
                return;
            }
            if (/.*\/payerror/.test(url)) {
                callback("payerror", url);
                inAppBrowser.close();
                inAppBrowser = undefined;
                return;
            }
        });
        inAppBrowser.addEventListener('exit', function () {
            callback("exit");
            inAppBrowser.close();
            inAppBrowser = undefined;
        });
    }

    function getIndexUrl() {
        return api.get('/user/toCard').error(errorHandling);
    }

    function checkLogin() {
        var deferred = api.defer();
        if (!APP_USER.id) {
            modals.login.open({
                params: {
                    successCallback: function () {
                        deferred.resolve();
                    },
                    cancelCallback: function () {
                        deferred.reject();
                    }
                }
            });
            return deferred.promise;
        }
        return api.when(true);
    }

    return {
        open: function (url, callback) {
            return checkLogin()
                .then(function () {
                    if (url) {
                        return api.when({
                            url: url
                        });
                    }
                    return getIndexUrl();
                })
                .success(function (data) {
                    openInAppBrowser(data.url, callback);
                });
        }
    };
}]);
