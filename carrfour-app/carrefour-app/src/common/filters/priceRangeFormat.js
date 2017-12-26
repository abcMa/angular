/**
 * 格式化价格区间
 */
angular.module('app.filters').filter('priceRangeFormat', function($translate) {
    return function(priceRange) {  // [100, 200] => "100 - 200 元"
        var beginPrice = priceRange && priceRange[0],
            endPrice = priceRange && priceRange[1],

            result = "";

        if (beginPrice != null && endPrice != null) {
            result = beginPrice + " - " + endPrice + " " + $translate.instant('priceSuffix');
        }

        return result;
    };
});
