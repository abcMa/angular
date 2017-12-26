/**
 * 全球购相关工具方法
 */
angular.module('app.services').provider('overseasShop', function apiProvider() {
    var provider = this;

    provider.$get = function() {
        function isOverseasShop(stateName, url, data) {
            var hasGlobalFlagInName = stateName.toLowerCase().indexOf('overseasshop') !== -1,
                hasGlobalFlagInUrl = url.toLowerCase().indexOf('/overseasshop/') !== -1,
                hasGlobalFlagInData = !!(data && data.isGlobal);

            var isOverseasShop = hasGlobalFlagInName || hasGlobalFlagInUrl || hasGlobalFlagInData;

            return isOverseasShop;
        }

        var overseasShop = {

            isOverseasShopState: function(state) {
                return isOverseasShop(state.name, state.url, state.data);
            },

            isOverseasShopView: function(view) {
                return isOverseasShop(view.stateName, view.url);
            }
        };

        return overseasShop;
    };
});
