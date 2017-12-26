angular.module('app.controllers').controller('articleCtrl', ["$scope", "$params", "activityService", "loadDataMixin", "stateUtils", "api", "$sce", "globalService", function (
    $scope, $params, activityService, loadDataMixin, stateUtils, api, $sce, globalService
) {

    var ctrl = this;

    _.assign(ctrl, loadDataMixin, stateUtils, {
        $scope: $scope,

        title: $params.title || '文章页',

        // 加载文章内容
        loadData: function () {
            // 后台说文章页要用活动页的接口
            return activityService.getActivityInfo($params.articleId)
                .then(function (response) {
                    var $html = $('<div>' + response.data + '</div>');

                    $html.find('script').remove();
                    response.data = $html[0].outerHTML;

                    return response;
                });
        }
    });

    // 加载数据
    ctrl.init();

}]);
