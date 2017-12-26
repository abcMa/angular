angular.module('app.directives').directive('cmDynamicTemplate', function(
    $compile
) {
    return {
        restrict: 'A',

        scope: false,

        link: function($scope, $element, $attrs) {

            $scope.$watch($attrs.cmDynamicTemplate, function(newTemplateStr) {
                if (newTemplateStr) {
                    $element.html(newTemplateStr);
                    $compile($element.contents())($scope);
                }
                else {
                    $element.empty();
                }
            });

        }
    };
});
