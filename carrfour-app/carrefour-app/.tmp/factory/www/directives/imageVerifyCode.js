/**
 * 设置订单列表页商品滑动容器宽度
 */

angular.module('app').directive('cmImageVerifyCode', ["globalService", function(
    globalService
) {
    return {
        restrict: 'A',
        scope: false,
        link: function($scope, $element, $attrs) {
            var isLoading = false;

            loadImage();

            $element.on('click', loadImage);
            // 监听刷新事件
            $scope.$on('refresh', function (event, data) {
                loadImage();
            });

            function loadImage() {
                if (isLoading) return;

                isLoading = true;
                globalService.imageVerifyCode().success(function(data) {
                    var base64Str = 'data:' + data.dataType + ';base64,' + data.base64;
                    $element.attr('src', base64Str);
                    isLoading = false;
                });
            }
        }
    };
}])
;
