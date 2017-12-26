angular.module('app.services').factory('commentService', ["api", function(
    api
) {
    return {

        /**
         * 获取商品评论列表
         *
         * productId    <String>    商品ID，获取商品详情页评论列表
         * 支持loadDataMixin标准分页模式
         *
         * return:
         * [<评价>]
         */
        list: function(productId, queryType, page, pageCount) {
            var params = _.assign({}, {
                productId: productId,
                queryType: queryType,
                page: page,
                pageCount: pageCount
            });

            return api.get('/remark/list', params)
                .success(function(data) {
                    data.totalItems = data.total;
                    data.pageIndex = data.page;
                });
        },

        /**
         * 添加评论
         *
         * content  <String>    评论内容
         * score    <Integer>   评分
         * isAnonymously    <Boolean>   是否匿名评论
         * product2RemarkId <Integer>   商品&评论关系ID
         * productId    <string>    商品ID
         *
         * return:
         * integral <Integer>   赠送积分，如果是已评论的，则有该属性
         */
        add: function(content, score, isAnonymously, product2RemarkId, productId) {
            var params = {
                content: content,
                score: score,
                isAnonymously: isAnonymously,
                product2RemarkId: product2RemarkId,
                productId:productId
            };

            return api.post('/remark/add', params);
        },

        /**
         * 获取订单购物项评论情况
         *
         * orderId  <String>    订单ID
         *
         * return:
         * [<购物项>]
         */
        reviewProduct: function(orderId) {
            return api.get('/remark/reviewProduct', {
                orderId: orderId
            });
        }
    };
}]);
