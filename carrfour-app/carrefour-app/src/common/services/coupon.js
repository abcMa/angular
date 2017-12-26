/**
 * 卡券相关接口
 */
angular.module('app.services').factory('couponService', ["api", "$q", "$rootScope", function (
    api, $q, $rootScope
) {

    // 调整优惠券日期
    function resetCouponsDate(coupon) {
        if(coupon.beginTime){
            coupon.beginTime = moment(coupon.beginTime).format("YYYY.MM.DD");
        }
        if(coupon.endTime){
            coupon.endTime = moment(coupon.endTime).format("YYYY.MM.DD");
        }
    }

    // 选择优惠券后重新排序
    function sortNUm(n){
        return function(a, b){
            var x = Number(a[n]);
            var y = Number(b[n]);
            return y - x;
        };
    }

    var

        couponService = {

        /**
         * 获取当前用户的优惠券列表
         */
        list: function (status, page, pageCount) {
            var params = {
                status: status,
                page: page,
                pageCount: pageCount
            };

            return api.get('/coupon/list', params)
                .success(function (data) {
                    // 整理数据以符合分页数据标准
                    data.pageIndex = data.page; // 页码
                    data.totalItems = data.total; // 总条目数量

                    // 优惠券日期展示格式调整
                    _.each(data.items, resetCouponsDate);
                });
        },

        /**
         * 获取当前用户的优惠券数量
         */
        count: function () {
            // return api.when(
            //     {
            //         active:'100',
            //         used:'20',
            //         expired:'10'
            //     });
            return api.post('/coupon/count');
        },

        /**
         * 选择优惠券
         */
        selectedCoupon: function (params) {
            return api.post('/checkout/selectedCoupon', params)
            .success(function (response) {
                // 优惠券日期展示格式调整
                _.each(response.availableCoupons,resetCouponsDate);
                _.each(response.unAvailableCoupons,resetCouponsDate);
                response.availableCoupons = response.availableCoupons.sort(sortNUm('availableStatus'));
            });
        },

        /**
         * 处理优惠券数据
         */
        // processingCoupons: function(coupons) {
        //     // 处理数据
        //     _.forEach(coupons, function(coupon) {
        //         coupon.beginTime = moment(coupon.beginTime);
        //         coupon.endTime = moment(coupon.endTime);
        //
        //         coupon.remainingTime = CM.durationHumanize(
        //             moment.duration(Math.max(coupon.endTime.diff(moment()), 0))
        //         );
        //     });
        // },

        /**
         * 激活码 激活
         */
        changeCoupon: function (codeText) {
            var params = {
                shortNum: codeText
            };
            return api.post('/coupon/activate', params);
        }
    };

    return couponService;
}]);
