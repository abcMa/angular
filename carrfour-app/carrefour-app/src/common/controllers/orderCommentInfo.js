angular.module('app.controllers').controller('orderCommentInfoCtrl', function(
    $scope, $params, $stateParams, modals, loadDataMixin, errorHandling, commentService, api, toast, loading, $translate
) {

    var ctrl = this;

    $params = _.defaults({}, $params, {
        orderGoods: {},
        successCallback: _.noop
    });

    angular.extend(ctrl, loadDataMixin, {
        $scope: $scope,

        orderGoods: $params.orderGoods,

        loadData: function() {
            return api.when(ctrl.orderGoods);
        },

        submit: function() {
            // var params = {
            //     orderId: ctrl.orderId,
            //     content: ctrl.content,
            //     score: ctrl.score,
            //     isAnonymously: false,
            //     product2RemarkId: $params.product2RemarkId
            // };
            if ($.trim(ctrl.content).length < 10) {
                toast.open($translate.instant('userCommentList.textTips'));
                return;
            } else {
                loading.open();
                commentService.add(
                        ctrl.content,
                        ctrl.score,
                        false,
                        ctrl.orderGoods.product2RemarkId,
                        ctrl.orderGoods.productId)
                    .error(errorHandling)
                    .success(function(response) {
                        toast.open($translate.instant('userCommentList.successTip'));
                        // toast.open(response);
                        $params.successCallback();
                        modals.orderCommentInfo.close();
                    })
                    .finally(function() {
                        loading.close();
                    });
            }
        }
    });

    ctrl.init();
});
