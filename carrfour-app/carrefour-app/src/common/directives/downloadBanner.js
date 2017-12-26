/**
 * 顶部下载条
 */
angular.module('app.directives').directive('cmDownloadBanner', function (
    $compile
) {
    var template = [
        '<div>',
        '    <div class="download-banner ng-binding" ng-hide="hideBanner" ng-click="redirectToDownload()">',
        '    </div>',
        '</div>'
    ].join('');


    return {
        restrict: 'A',
        scope: true,

        link: function ($scope, $el, $attrs) {
            _.assign($scope, {
                hideBanner: false,
                redirectToDownload: function () {
                    window.open("http://a.app.qq.com/o/simple.jsp?pkgname=cn.carrefour.app.mobile&g_f=991653");
                }
            });

            $banner = $(template);
            $el.prepend($banner);
            $compile($banner.contents())($scope);
            $el.addClass('has-download-banner');

            $el.find("ion-content").on('scroll', function (e) {
                var scrollTop = 0;
                var event = e.originalEvent;
                if (event.detail && event.detail.scrollTop) {
                    scrollTop = event.detail.scrollTop;
                } else {
                    scrollTop = event.target.scrollTop;
                }

                if (scrollTop > 5 && !$scope.hideBanner) {
                    hideBanner(true);
                }
                if (scrollTop < 5 && $scope.hideBanner) {
                    hideBanner(false);
                }
            });


            function hideBanner(hide) {
                $scope.$apply(function () {
                    $scope.hideBanner = hide;
                });
                if (hide) {
                    $el.removeClass('has-download-banner');
                } else {
                    $el.addClass('has-download-banner');
                }
            }
        }
    };
});
