angular.module('app.directives').directive('cmSearchBar', ["$timeout", function factory($timeout) {
    return function($scope, $el, $attrs) {

        var input = $el.find('input[type=search]');

        $scope.$on('$ionicView.beforeLeave', function() {
            input.blur();
        });
    };
}]);
