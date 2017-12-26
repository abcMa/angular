/**
 * 结算服务
 */
angular.module('app.services').factory('checkoutService', ["api", "userService", "cartService", "couponService", function(
    api, userService, cartService, couponService, messageCenter
) {

    return {
        // 当前在处理的订单数据
        order: undefined,

        // 提交订单的返回结果
        submitOrderResult: undefined,

        // 设置需共享的订单数据
        setOrder: function(order) {
            this.order = order;
        },

        // 基于当前的购物车获取结算信息
        checkoutInfoByCart: function() {
            return api.post('/checkout/info')
                .success(function(data) {
                    // 北京站版本兼容
                    if(data.consignee){
                        var fullAddress = data.consignee.address.allDeliveryName;
                        data.consignee.address = fullAddress;
                    }
                    // couponService.processingCoupons(data.avalaibleCoupons);
                    // couponService.processingCoupons(data.unavalaibleCoupons);
                });
        },

        // 刷新结算信息
        update: function(params) {
            return api.post('/checkout/update', params)
                .success(function(data) {
                    // couponService.processingCoupons(data.avalaibleCoupons);
                    // couponService.processingCoupons(data.unavalaibleCoupons);
                });
        },

        //保存身份信息
        saveIdCard: function(idCard) {
            var params = {
                idCard: idCard
            };
            return api.post('/checkout/saveIdCard', params);
        },

        // 获取配送方式
        getDeliverys: function(consigneeId, paymentModeType) {
            var params = {
                consigneeId: consigneeId,
                paymentModeType: paymentModeType
            };
            return api.post('/checkout/getDeliverys', params);
        },

        // 获取自提点
        //  @param {number} ownDeliveryAddrId? - 自提点 ID
        getPickupes: function(ownDeliveryAddrId) {
            var params = {
                consigneeId: ownDeliveryAddrId
            };
            return api.post('/checkout/findOwnDeliverylist', params);
        },

        // 获取时间
        //  @param {number} pickupId? - 自提点 ID
        getPickupesTime: function(pickupId) {
            var params = {
                ownDeliveryAddrId: pickupId
            };
            return api.post('/checkout/findSinceDeliveryOntimes', params);
        },

        /**
         * 获取准时达（或生鲜达）信息
         *
         * @param {number} consigneeId - 收货人地址 ID
         * @param {number} ownDeliveryAddrId? - 自提点 ID
         */
        findDeliveryOntimes: function(consigneeId, ownDeliveryAddrId) {
            var params = {
                consigneeId: consigneeId,
                ownDeliveryAddrId: ownDeliveryAddrId
            };

            return api.post('/checkout/findDeliveryOntimes', params);
        },

        // 提交结算信息
        submit: function(config) {
            var params = _.merge({}, config);
            return api.post('/checkout/createOrder', params)
                .success(function(data) {
                    // 如果结算信息是来自购物车，则需要刷新购物车数据
                    if (config.origin === 'cart') {
                        cartService.refresh();
                    }

                    //统计数据 监听提交消息
                    messageCenter.publishMessage('checkout.success', data);
                });
        }
    };
}]);
