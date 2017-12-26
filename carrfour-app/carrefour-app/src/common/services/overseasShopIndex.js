/**
 * Created by admin on 2016/7/14.
 */
angular.module('app.services').factory('overseasShopIndexService', function (
    api
) {
    return {
        getInfo: function () {
            return api.get('/index/overseasShop').success(function (response) {
                if (response.buyWhat) {
                    _.forEach(response.buyWhat, function (buyWhat) {
                        // 只允许展示6个内容;
                        if (buyWhat.words && buyWhat.words.length > 6) {
                            buyWhat.words.length = 6;
                        }
                    });
                }
            });
        },

        getOverseasId: function () {
            return api.get('/global/fetchOverseasSubsiteId');
        }
    };
});
