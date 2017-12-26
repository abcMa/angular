angular.module('app').directive('cmBlurSelect', function factory() {
	return {
	    restrict: 'A',
	    link: function($scope, $el) {
			$scope.$on('$destroy', function() {
				$el.blur();
			})
	    }
	};
});
