/**
 * 截取字符串并增加缩略符
 */
angular.module('app.filters').filter('truncate', function () {

    return function (string, length) {
        if (!length) {
            return string;
        }
        var count = length;
        var result = "";
        var index = 0;
        while (count > 0) {
            var char = string.slice(index, index + 1);
            var charCode = char.charCodeAt();
            if ((charCode >= 0x0001 && charCode <= 0x007e) || (0xff60 <= charCode && charCode <= 0xff9f)) {
                count -= 0.5;
            } else {
                count -= 1;
            }
            result = result + char;
            index++;
        }
        if (string.length > index) {
            return result + "...";
        } else {
            return result;
        }

    };
});
