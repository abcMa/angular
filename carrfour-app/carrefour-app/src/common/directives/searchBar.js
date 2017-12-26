angular.module('app.directives').directive('cmSearchBar', function factory($timeout) {
    return function($scope, $el, $attrs) {

        var input = $el.find('input[type=search]');

        $scope.$on('$ionicView.beforeLeave', function() {
            input.blur();
        });
    };
});
