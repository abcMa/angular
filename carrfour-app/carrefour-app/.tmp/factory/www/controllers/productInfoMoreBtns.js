angular.module('app.controllers').controller('productInfoMoreBtnsCtrl', ["$scope", "$state", "$params", "stateUtils", "modals", "$timeout", function (
    $scope, $state, $params, stateUtils, modals, $timeout
) {
    $params = _.defaults({}, $params, {
        hideBanner: true
    });

    var ctrl = this;

    angular.extend(ctrl, {
        hideBanner: $params.hideBanner,

        goSearch: function () {
            $timeout(function () {
                stateUtils.goSearch();
            }, 10);

            modals.productInfoMoreBtns.close();
        },

        goIndex: function () {
            $timeout(function () {
                stateUtils.goIndex();
            }, 10);

            modals.productInfoMoreBtns.close();
        },

        // 打开浏览记录侧栏
        openSiderBarBrowerList: function () {
            modals.productInfoMoreBtns.close();
            $timeout(function () {
                modals.siderBarBrowerList.open();
            }, 50);
        }
    });
}]);
