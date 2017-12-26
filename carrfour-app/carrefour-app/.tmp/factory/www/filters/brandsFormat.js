/**
 */
angular.module('app.filters').filter('brandsFormat', ["$translate", function($translate) {
    return function(brands) {
        var result = "";

        _.forEach(brands, function(brandName, brandId) {
            result += brandName;
            return false;
        });

        if (_.keys(brands).length > 1) {
            result += $translate.instant('etcSuffix');
        }

        return result;
    };
}]);
