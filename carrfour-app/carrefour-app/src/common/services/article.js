angular.module('app.services').factory('articleService', function(
    api
) {
    return {

        /**
         * 根据 id 获取文章
         */
        getArticleById: function(id) {
            return api.post('/global/getArticleById', {
                id: id
            });
        },
    };
});
