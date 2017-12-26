/**
 * 分类接口封装服务
 */
angular.module('app.services').factory('categoryService',["api", function(
    api
) {
    var categoryService = {

        /**
         * 获取分类数据
         * @categoryId: 分类 ID，如果不指定，则为根分类节点
         * @depth: 深度，如果传入 0，则返回 categoryId 下的所有分类节点
         */
        list: function(categoryId, depth) {
            return api.get('/category/list', {
                id: categoryId,
                depth: depth
            });
        }

    };

    return  categoryService;
}]);
