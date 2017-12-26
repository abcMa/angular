angular.module('app.controllers').controller('userCouponsCtrl', ["$scope", "$stateParams", "loadDataMixin", "errorHandling", "couponService", "loading", "toast", "$translate", "messageCenter", "$ionicScrollDelegate", function (
    $scope, $stateParams, loadDataMixin, errorHandling, couponService, loading,
    toast, $translate, messageCenter, $ionicScrollDelegate
) {

    var ctrl = this;

    angular.extend(ctrl, loadDataMixin, {
        $scope: $scope,
        couponCode: '',

        start: function () {
            couponService.count().success(function (response) {
                ctrl.count = response;
            });
        },

        loadPage: function (page, pageCount) {
            return couponService.list(ctrl.activeType, page, pageCount)
                .error(errorHandling);
        },

        //1.已创建、2.已绑定、3.已使用、4.已过期
        activeType: '2',

        //切换tab
        onTabClick: function (index) {
            if (ctrl.activeType != index) {
                ctrl.activeType = index;
                ctrl.refresh({
                    emptyData: true,
                    showLoading: true
                });
                $ionicScrollDelegate.$getByHandle('userCouponsScroll').scrollTo(0, 44);
            }
        },

        //兑换优惠券
        exchangeCoupon: function () {
            if (!ctrl.couponCode) {
                toast.open($translate.instant('userCoupon.enterCode'));
                return;
            }
            loading.open();
            couponService.changeCoupon(ctrl.couponCode)
                .success(function (response) {
                    toast.open(response);
                    ctrl.refresh({
                        showLoading: true
                    });
                })
                .error(errorHandling)
                .finally(function () {
                    ctrl.couponCode = '';
                    loading.close();
                });
        },

        // 展示优惠券详细信息
        showDetailInfo: function(item){

            // 刷新滚动条高度
            $ionicScrollDelegate.resize();
            item.isShowDetailInfo = !item.isShowDetailInfo;

        }
    });

    // 广播页面Tag
    messageCenter.publishMessage('AT.screen', {
        pageName: 'personal_space::my_coupons'
    });

    var deregistration = $scope.$on('$ionicView.afterEnter', function () {
        ctrl.init();
        deregistration();

        $scope.$on('$ionicView.afterEnter', function () {
            ctrl.refresh({
                showLoading: false
            });
        });
    });
}]);
