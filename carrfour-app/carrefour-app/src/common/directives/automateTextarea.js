// 使textarea的高度适应内容
angular.module('app').directive('cmAutomateTextarea', function () {
    return {
        restrict: 'A',
        link: function ($scope, $element, $attr) {
            $scope.$watch($attr.ngModel, function () {
                $element.css("height", "auto");
                $element.css("height", $element[0].scrollHeight + "px");
            });
        }
    };
});
