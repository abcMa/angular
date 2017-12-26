/**
 * 增加一个文本过滤器 用于替换隐藏字符 用户详情页用户评价名称
 * 传入的文本，取第一个和最后一个，中间使用***代替，不管多长的用户名
 *   18612943151 -> 1***1
 *   12          -> 1***2
 *   1           -> 1***
 */ 
angular.module('app.filters').filter('commentNameFormat', ["validator", function(validator) {
    
    return function(text) {

        if (text.length == 1) {
            text = $.trim(text).substr(0, 1) + "***";
        } else if (text.length == 0) {
            text = '';
        } else {
            text = $.trim(text).substr(0, 1) + "***" + $.trim(text).substr(-1);
        }

        return text;
    };
}]);
