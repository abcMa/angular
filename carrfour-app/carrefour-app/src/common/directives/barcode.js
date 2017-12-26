/**
 * 生成条形码
 * https://github.com/lindell/JsBarcode
 *
 * 安装依赖:
 * bower install jsbarcode --save
 *
 * options:
 * https://github.com/lindell/JsBarcode/wiki/Options
 *
 * @param content {String} 条形码内容
 * @param option(?) {Object} 附加配置项
 *
 * @example
 * <barcode content="content" option="option"></barcode>
 */

angular.module('app')
    .directive('barcode', function () {
        return {
            restrict: 'E',
            template: "<canvas class='barcode'></canvas>",
            replace: true,
            link: function ($scope, $el, $attrs) {
                if (!window.JsBarcode) {
                    console.warn('[barcode] missing dependency');
                    return;
                }
                window.JsBarcode($el[0], $attrs.content, $scope.$eval($attrs.option));
            }
        };
    });
