/**
 * 获取购物车内商品数量
 */
angular.module('app.directives').directive('cmCartNumber', function(
    cartService
) {
    return {
        restrict: 'A',
        priority: 1,
        link: function($scope, $el, $attrs) {

            try {
                if (cartService.data) {
                    $el[0].innerHTML = cartService.data.basket.info.totalQuantity;
                }
                else {
                    cartService.refresh().success(function() {
                        $el[0].innerHTML = cartService.data.basket.info.totalQuantity;
                    });
                }
            }
            catch (e) {
                $el[0].innerHTML = '0';
            }

            $scope.$watch(function() {
                var number = 0;

                try {
                    number = cartService.data.basket.info.totalQuantity;
                }
                catch(e) { ; }

                return number;
            }, function(value) {
                $el[0].innerHTML = value;
            });
        }
    };
});
