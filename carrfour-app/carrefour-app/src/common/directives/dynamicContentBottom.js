/**
 * 动态计算并设置Bottom
 */

angular.module('app.directives').directive('cmDynamicContentBottom', function (
    $rootScope, $timeout
) {

    var footers = [];
    return {
        restrict: 'A',
        controller: function ($scope) {
            this.sign = function ($footer) {
                if (footers.indexOf($footer) > -1) {
                    return;
                }
                footers.push($footer);
            };
        },
        link: function ($scope, $el, $attrs) {
            var $ionContent = $el.find("ion-content");
            if (!$ionContent) {
                return;
            }

            function setBottom() {
                if ($ionContent.is(':hidden')) return;
                var bottom = 0;
                for (var i = 0; i < footers.length; i++) {
                    bottom += footers[i].outerHeight();
                }
                $ionContent[0].style.bottom = bottom + "px";
                $scope.$broadcast('resize');
            }

            $timeout(setBottom);
            window.addEventListener('resize', setBottom);
            var handle = $rootScope.$on('$ionicView.enter', setBottom);
            $scope.$on('$destroy', function () {
                window.removeEventListener('resize', setBottom);
                footers = [];
                handle();
            });
        }
    };
}).directive("cmDynamicContentFooter", function () {
    return {
        restrict: "A",
        require: "^^cmDynamicContentBottom",
        link: function ($scope, $el, $attrs, $cmDynamicContentBottom) {
            $cmDynamicContentBottom.sign($el);
        }
    };
});
