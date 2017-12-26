angular.module('app.directives').directive('activityPage', function(
    $compile
) {
    return {
        restrict: 'E',
        scope: true,
        link: function($scope, $element, $attrs) {

            $scope.$watch($attrs.content, function(newValue, oldValue) {
                if (!newValue || newValue === oldValue) {
                    return;
                }
                $element.html($scope.$eval($attrs.content));
                // ta~da!
                $compile($element)($scope);
            });
        }
    };

});
angular.module('app.services').provider('activityLoader', function(
    $controllerProvider, $injector
) {
    this.$get = function() {
        return {
            getActivityLoader: function(controllerName) {
                return function(fn) {
                    if (!_.isFunction(fn)) {
                        console.warn("[activityLoader]: fn is not a function");
                        return;
                    }
                    var args = $injector.annotate(fn);
                    $controllerProvider.register(controllerName, args.concat(fn));
                };
            }
        };
    };
});
