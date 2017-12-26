angular.module('app.services').factory('unique', ["localStorage", function (
    localStorage
) {

    return {
        get: function (successCallback) {
            var callBack = _.defaults({}, {
                successCallback: successCallback || _.noop
            });
            // 如果有keyChain则尝试读
            if (window.cmKeychain && ionic.Platform.isIOS()) {
                // 无值或为空则生成并储存
                cmKeychain.getForKey("unique", function (value) {
                    if (!_.isEmpty(value)) {
                        callBack.successCallback(value);
                        return;
                    }
                    var unique = getUnique();
                    cmKeychain.setForKey("unique", unique);
                    callBack.successCallback(unique);

                }, function (error) {
                    var unique = getUnique();
                    cmKeychain.setForKey("unique", unique);
                    callBack.successCallback(unique);
                });
                return;
            }
            if (ionic.Platform.isAndroid()) {
                callBack.successCallback(getUnique());
                return;
            }
            var unique = localStorage.get('unique');
            if (_.isEmpty(unique)) {
                unique = generateCustomUnique();
                localStorage.set('unique', unique);
            }
            callBack.successCallback(unique);
        }
    };


    // 读取
    function getUnique() {
        var unique = "";
        if (window.device) {
            unique = window.device.platform.toLowerCase() + '-' + window.device.uuid;
        } else {
            unique = generateCustomUnique();
        }
        return unique;
    }

    // 创建一个自定义标识码
    function generateCustomUnique() {
        var now = new Date();

        return 'custom-' + now.getFullYear() +
            fill((now.getMonth() + 1), 2) +
            fill(now.getDate(), 2) +
            fill(now.getHours(), 2) +
            fill(now.getMinutes(), 2) +
            fill(now.getSeconds(), 2) +
            fill(now.getMilliseconds(), 3) +
            Math.random().toFixed(20).substring(2); // 20 位随机码
    }

    // 将所传入的数字转换为字符串，若字符串的长度小于所指定的长度，则在起始位置以数字 「0」 补足长度。
    // 最多支持 5 位补足长度。
    function fill(number, length) {
        var str = number.toString(),
            filler = '00000';

        if (str.length < length) {
            str = filler.substring(0, length - str.length) + str;
        }

        return str;
    }
}]);
