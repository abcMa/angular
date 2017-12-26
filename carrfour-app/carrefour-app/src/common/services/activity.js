angular.module('app.services').factory('activityService', function (
    api
) {
    return {

        /**
         * 根据文章ID获取内容
         *
         * articleId    <String>    文章ID
         *
         * return:
         * content      <String>    文章内容
         */
        getActivityInfo: function (articleId) {
            var params = _.assign({}, {
                articleId: articleId
            });

            return api.get('/activity/getActivityInfo', params);
        },

        /**
         * 获取弹层活动文章ID
         *
         * return:
         * data      <Number>    文章ID
         */
        getLayerActivity: function () {
            return api.get('/activity/getLayerActivity');
        }
    };
});
