angular.module('app.services').factory('indexService', ['api', function (api) {

    return {
        /**
         * app商城·获取欢迎页中所使用的轮播图片数据
         * @param times {number<1,2>} 是否是第一次打开应用
         */
        getComeIndex: function (times) {
            return api.get('/index/getComeIndex', {
                times: times
            }, {
                timeout: 3000
            });
        },

        /**
         * app商城·获取首页轮播和频道信息
         * @param type 终端类型
         */
        getInfo: function (type) {
            return api.get('/index/byNewGetIndexInfo', {
                type: type
            }).success(function (response) {
                // 首页按钮面板，最多显示10个, 按5切行, 超5均分
                response.buttonPanels = response.buttonPanels.slice(0, 10);

                var buttonPanels = [];
                var length = response.buttonPanels.length;
                while (response.buttonPanels.length) {
                    var count = length > 5 ? Math.ceil(length / 2) : 5;
                    buttonPanels.push(response.buttonPanels.splice(0, count));
                }
                response.buttonPanels = buttonPanels;

                // 大家都在买模块 配置的words，仅显示6个，其余不要
                _.forEach(response.recommendedProducts, function (recommend) {
                    if (recommend.words && recommend.words.length > 6) {
                        recommend.words.length = 6;
                    }
                });
            });
        },

        /**
         * app商城·获取单品推荐类型
         */
        getRecType: function () {
            return api.get('/index/recType');
        },

        /**
         * app商城·根据单品推荐类型获取商品
         * 他API里的参数名就叫structureId
         * 可接口里叫ByTypeId
         */
        getRecProductsByTypeId: function (type) {
            return api.get('/index/getRecProductsByTypeId', {
                structureId: type
            });
        },

        /**
         * 微信商城·获取首页频道信息
         */
        getChannelInfo: function () {
            return api.post('/index/getChannelInfo', {});
        },

        /**
         * 微信商城·根据频道Id获取首页展示数据
         * @param channelId 频道Id
         * @param type 终端类型
         */
        getIndexInfoByChannel: function (channelId, type) {
            var params = {
                channelId: channelId,
                type: type
            };
            return api.post('/index/getIndexInfo', params);
        },

        /**
         * 首页秒杀异步获取状态
         */
        getFlashSale: function () {
            return api.get('/index/asyncTimelimitMoudle');
        },

        /**
         * 获取首页飘雪配置数据
         */
        getSnowing: function () {
            return api.get('/index/fetchSnowConfig');
        }

    };
}]);
