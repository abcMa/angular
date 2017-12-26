angular.module('app.controllers').controller('popUpModalsCtrl', ["$scope", "$params", "stateUtils", "activityLoader", "$timeout", function (
    $scope, $params, stateUtils, activityLoader, $timeout
) {

    var ctrl = this;

    $params = _.defaults({}, $params, {
        content: ""
    });

    _.assign(ctrl, stateUtils, {
        $scope: $scope,

        activityContent: '',

        // 加载活动内容
        init: function () {
            // 用hash作为ctrl名
            var controllerName = "popUpPageCtrl_" + _hash($params.content);

            //传给directive
            ctrl.activityContent = $("<div>" + $params.content + "</div>")
                .attr("ng-controller", controllerName)
                .addClass("popUpModals-content");

            // 构造一个供给活动页调用的加载器
            window._activityLoader = activityLoader.getActivityLoader(controllerName);
        }
    });

    // 据说性能超高的文本hash计算器
    var I64BIT_TABLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-'.split('');

    function _hash(input) {
        var hash = 5381;
        var i = input.length - 1;
        if (typeof input == 'string') {
            for (; i > -1; i--)
                hash += (hash << 5) + input.charCodeAt(i);
        } else {
            for (; i > -1; i--)
                hash += (hash << 5) + input[i];
        }
        var value = hash & 0x7FFFFFFF;
        var retValue = '';
        do {
            retValue += I64BIT_TABLE[value & 0x3F];
        }
        while (value >>= 6);
        return retValue;
    }


    $timeout(function () {
        ctrl.init();
    }, 100);

}]);
