/**
 * 商品收藏服务
 */
angular.module('app.services').factory('collectService', function(api) {

    return {

        /**
         * 获取用户收藏商品列表
         * @param  page      分页标识
         * @param  pageCount 每页数量
         */
        list: function(page, pageCount) {
            var params = {
                page: page,
                pageCount: pageCount
            };
            return api.get('/collect/list', params).success(function (response) {
                response.pageIndex = response.page;
                response.totalItems = response.total;
                response.items = response.collections;

            })
        },

        /**
         * 收藏列表页，通过id删除商品收藏
         */
        remove: function(id) {
            return api.post('/collect/delete', {
                id: id
            });
        },

        /**
         * 商品详情页，通过goodsId删除商品收藏
         */
        removeByGoodsId: function(goodsId) {
            return api.post('/collect/deleteByGoodsId', {
                goodsId: goodsId
            });
        },

        /**
         * 添加商品收藏
         */
        add: function(goodsId) {
            return api.post('/collect/add', {
                goodsId: goodsId
            });
        },

        /**
         * 批量添加收藏
         */
        addList: function(goodsIdArray) {
            return api.get('/collect/addList', {
                goodsIds: goodsIdArray.join("-")
            })

        }
    };
});
