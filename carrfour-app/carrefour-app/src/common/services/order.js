/**
 * 封装订单接口
 */
angular.module('app.services').factory('orderService', function(
    api
) {
    return {
        /** 订单类型 */
        ORDER_TYPES: {
            ALL: 0, //  全部
            WAITING_PAYMENT: 1, // 待支付
            WAITING_DELIVERY: 2, // 待收货
            COMPLETE: 3, // 已完成
            CANCELED: 4 // 已取消
        },

        /**
         * 获取订单列表数据
         * @param type      {Integer} 订单类型
         * @param page      {Integer} 页码，从 1 开始
         * @param pageCount {Integer} 每页数据的数量
         */
        list: function(userId, type, page, pageCount) {
            var params = {
                type: type,
                page: page,
                pageCount: pageCount
            };

            return api.get('/order/list', params).success(function(data) {
                data.totalItems = data.total;
                data.pageIndex = page;
            });
        },

        /**
         * 获取订单详细信息
         * @param id {String} 订单 ID
         */
        info: function(id) {
            var params = {
                orderId: id
            };
            return api.get('/order/info', params);
        },

        /**
         * 取消订单
         * @param reasonId {Integer} 原因 ID
         * @param orderId {Integer} 订单 ID
         */
        cancel: function(reasonId, orderId) {
            var params = {
                reasonId: reasonId,
                orderId: orderId
            };
            return api.get('/order/cancel', params);
        },

        /**
         *  获取取消订单原因列表
         */
        findReason: function() {
            return api.get('/order/findReason');
        },

        /**
         *  发送自提货柜查询码短信
         */
        fetchSinceCode: function(orderId) {
           var params = {
               orderId : orderId
           };
            return api.get('/order/fetchSinceCode', params);
        },

        /**
         *  监听数据 订单提交成功数据
         */
         paiedSuccess: function (orderId) {
            var params = {
                orderNum : orderId
            };
            return api.get('/pay/semPaidSuccessInfo', params);
        },

        /**
         * 活的支付成功页的广告位
         */
        paySuccessAdv: function() {
            return api.get('/pay/paySuccessAdv');
        },

        /*
        * 获取成功支付后奖励的订单积分
        */
        getOrderRewardPoints: function(orderId){
            var params = {
                orderId : orderId
            };
            return api.get('/order/fetchOrderRewardPoints', params);
        }
    };
});
