angular.module('app.controllers').controller('siderBarBrowerListCtrl', function(
    $scope, $state, stateUtils, $stateParams, loadDataMixin, errorHandling, globalService,
    viewHistory, modals, api
) {

    var ctrl = this;

    angular.extend(ctrl, loadDataMixin, stateUtils, {

        $scope: $scope,

        // 浏览历史数据
        viewHistory: [],

        // 每页加载数量
        itemsPerPage: 8,

        loadPage: function(page, pageCount) {
            return viewHistory.getPage(page, pageCount).success(function(response) {
                ctrl.viewHistory = ctrl.viewHistory.concat(response.items);
            });
        },

        // 关闭浏览记录侧栏
        closeSiderBarBrowerList: function() {
            modals.siderBarBrowerList.close();
        },
    });
    ctrl.init();
});
