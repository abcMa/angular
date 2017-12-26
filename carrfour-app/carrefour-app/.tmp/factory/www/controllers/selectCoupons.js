angular.module('app.controllers').controller('selectCouponsCtrl', ["$scope", "$stateParams", "$params", "modals", "loadDataMixin", "errorHandling", "couponService", "loading", "messageCenter", "$ionicScrollDelegate", "$timeout", "toast", "$translate", "utils", function (
    $scope, $stateParams, $params, modals, loadDataMixin, errorHandling,
    couponService, loading, messageCenter, $ionicScrollDelegate, $timeout, toast, $translate, utils
) {

    var ctrl = this;
    $params = _.defaults({}, $params, {
        consigneeId: 0,
        deliveryModeId: 0,
        paymentModeType: 0,
        ownDeliveryAddrId: 0,
        selectedCouponIds: [],
        deliveryOntimeId: 0,
        deliveryOntimeDate: "",
        confirmCallback: _.noop
    });

    // TODO:10 ☆等待明确需求后继续
    angular.extend(ctrl, loadDataMixin, {
        $scope: $scope,

        coupons: [],

        newSelectedCouponIds: _.cloneDeep($params.selectedCouponIds),

        priceInfo: {},

        showCoupons: [],

        // 是否改过?
        isModified: false,

        changeClickColor: false,

        // 加载分页
        loadData: function () {
            return updateCoupon($params.selectedCouponIds);
        },

        // 0可使用 1不可使用
        activeType: '0',

        //切换tab
        onTabClick: function (index) {
            if (ctrl.activeType != index) {
                ctrl.activeType = index;
                ctrl.showCoupons = ctrl.coupons[index];
                // $ionicScrollDelegate.$getByHandle('selectCouponsScroll').scrollTop(false);
                // http://stackoverflow.com/questions/27237817/ionic-scroll-wont-fire-on-load-with-getbyhandle
                $timeout(function () {
                    var startHandle = _.find($ionicScrollDelegate._instances, function (s) {
                        return s.$$delegateHandle === "selectCouponsScroll";
                    });
                    startHandle.scrollTop();
                });
            }
        },

        onSelected: function (coupon) {

            // 无法使用的列表
            if (ctrl.activeType == 1) {
                return;
            }
            // 选中push入
            // 取消选中则pull出，重新请求
            if (coupon.selected) {
                ctrl.newSelectedCouponIds = _.pull(ctrl.newSelectedCouponIds, coupon.couponId);
                ctrl.changeClickColor = false;
            } else {
                if(coupon.availableStatus){
                    // 互斥时，需要取消已选中的，重新进行选择
                    // 互斥则重构选择列表
                    if (!coupon.availableStatus) {
                        ctrl.newSelectedCouponIds = [];
                    }
                    ctrl.newSelectedCouponIds.push(coupon.couponId);
                    ctrl.changeClickColor = true;
                }else{
                    toast.open($translate.instant('userCoupon.cancelNote'));
                    return;
                }
            }
            ctrl.isModified = true;
            updateCoupon(ctrl.newSelectedCouponIds);
        },

        onCancel: function () {
            modals.selectCoupons.close();
        },
        onConfirm: function () {
            $params.confirmCallback(ctrl.isModified ? ctrl.newSelectedCouponIds : $params.selectedCouponIds, ctrl.priceInfo);
            modals.selectCoupons.close();
        },

        // 展示优惠券详细信息
        showDetailInfo: function(item){

            // 刷新滚动条高度
            item.isShowDetailInfo = !item.isShowDetailInfo;

            // 重新计算高度
            $timeout(function () {
                utils.getScrollDelegateByName('selectCouponsScroll').resize();
            });

        }
    });

    function updateCoupon(couponIds) {
        loading.open();
        return couponService.selectedCoupon({
            consigneeId: $params.consigneeId,
            couponIds: couponIds,
            deliveryModeId: $params.deliveryModeId,
            paymentModeType: $params.paymentModeType,
            ownDeliveryAddrId: $params.ownDeliveryAddrId,
            deliveryOntimeId: $params.deliveryOntimeId,
            deliveryOntimeDate: $params.deliveryOntimeDate
        }).finally(function () {
            loading.close();
        }).success(function (response) {
            ctrl.coupons[0] = response.availableCoupons;
            ctrl.coupons[1] = response.unAvailableCoupons;
            ctrl.showCoupons = ctrl.coupons[ctrl.activeType];
            ctrl.priceInfo = response.info;
            // 更新选中项
            // 这段代码完全没有意义, 反而导致了前端无法维护选中顺序
            // ctrl.newSelectedCouponIds = [];
            // angular.forEach(response.availableCoupons, function (data, index, array) {
            //     if (data.selected) {
            //         ctrl.newSelectedCouponIds.push(data.couponId);
            //     }
            // });
        });
    }

    // 广播页面Tag
    messageCenter.publishMessage('AT.screen', {
        pageName: 'tunnel::step7_coupon'
    });

    ctrl.init();
}]);
