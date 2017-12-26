/**
 * 封装用户相关业务操作
 */
angular.module('app.services').factory('customerService', ["api", function (
    api
) {
    return {
        cache: undefined,

        /**
         * 获取客户服务内容
         */
        queryUserSerivce: function (readCache) {
            if (readCache) {
                return api.when(this.cache);
            }

            return api.get('/member/customerService').success((function (response) {
                this.cache = _.cloneDeep(response);
            }).bind(this));
        },

        /**
         * 获取客户服务频道列表
         */
        getChannels: function () {
            return this.queryUserSerivce()
                .success(function (channels) {
                    _.map(channels, function (item) {
                        delete item['articles'];
                        return item;
                    });
                });
        },

        /**
         * 获取频道的文章列表
         */
        getArticleListByChannelId: function (id) {
            return this.queryUserSerivce(true)
                .then(function (channels) {
                    return _.result(_.find(channels.data, {
                        'id': parseInt(id)
                    }), 'articles');
                });
        }
    };
}]);
