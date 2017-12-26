/**
 * 区域级联选择引用指令
 *
 * 现在由参数决定使用哪个services
 *
 * checkout: 结算流程
 * member: 个人中心
 *
 * usage:
 *
 * <div cm-select-region="checkout"
 *      cm-select-live="0"
 *     ng-model="ctrl.selectedRegion"
 *     ng-change="ctrl.changeRegion()">
 *     {{editConsigneeInfo.selectedRegion | regionFormat}}
 * </div>
 */
angular.module('app.directives').directive('cmSelectRegion', function factory() {

    // 格式化地区名称为如下格式：
    //   中国，北京，昌平区
    function formatRegionsName(regions) {
        var name = "";

        _.forEach(regions, function (region) {
            name += region.name;
        });

        return name;
    }

    return {
        restrict: 'A',
        require: '?ngModel',

        link: function ($scope, $el, $attrs, ngModel) {
            if (!ngModel) return;

            $el.on('click', function () {
                if(window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard){
                    cordova.plugins.Keyboard.close();
                }
                $scope.modals.selectAddressRegion.open({
                    params: {
                        mode: $attrs.cmSelectRegion,
                        live: $attrs.cmSelectLive,
                        successCallback: (function (regionId, regions) {
                            ngModel.$setViewValue(regions);
                            ngModel.$render();
                            $scope.$eval($attrs.ngChange);
                        }).bind(this),
                        regions: ngModel.$modelValue
                    }
                });
            });

            ngModel.$formatters = [];
            ngModel.$viewChangeListeners = [];

            ngModel.$render = function () {
                $el.empty().append(formatRegionsName(ngModel.$modelValue));
                $el.val(formatRegionsName(ngModel.$modelValue));
            };
        }
    };
});
