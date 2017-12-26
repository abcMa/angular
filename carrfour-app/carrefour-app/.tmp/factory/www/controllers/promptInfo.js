angular.module('app.controllers').controller('promptInfoCtrl', ["$scope", "$params", "activityService", "loadDataMixin", "stateUtils", function(
    $scope, $params, activityService, loadDataMixin, stateUtils
) {

    var ctrl = this;

    _.assign(ctrl, loadDataMixin, stateUtils, {
        $scope: $scope,

        title: $params.title,
        content: $params.content,
        content2: $params.content2,
        content3: $params.content3,
        content4: $params.content4,
        content5: $params.content5,
        content6: $params.content6

    });

}]);
