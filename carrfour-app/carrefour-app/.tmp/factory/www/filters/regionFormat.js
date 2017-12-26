/**
 * 格式化价格区间
 */
angular.module('app.filters').filter('regionFormat', function() {

    // 格式化地区名称为如下格式：
    //   中国，北京，昌平区
    function formatRegionsName(regions) {
        var name = "";

        _.forEach(regions, function(region) {
            name += region.name;
        });

        return name;
    }

    return formatRegionsName;
});
