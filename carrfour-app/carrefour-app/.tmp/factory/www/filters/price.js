/**
 * 格式化价格数据。
 *
 * 可保证小数点后最多有两位，如果传入的价格的小数部分超过两位，则截去超出的部分。
 * 另外会将价格的货币符号，整数，小数点及小数分别放到单独的元素中，方便为其定义不同的样式。
 *
 * 注意：
 *   因为该过滤器生成的结果是一段 HTML 字符串，因此必须使用 ng-bind-html 指令进行调用，具体调用方式见下方示例。
 *
 * @param symbol(?) {String} 货币符号
 *
 * @example
 * <span class="price" ng-bind-html="10.027 | price:'￥'"></span>
 * -> output:
 * -> <span class="price">
 * ->   <span class="symbol">￥</span>
 * ->   <span class="integer">10</span>
 * ->   <span class="point">.</span>
 * ->   <span class="decimal">02</span>
 * -> </span>
 */
angular.module('app.filters').filter('price', function() {
    return function(price, symbol) {
        // 保证价格数据的有效性，一切非数值类型且无法转换成数值类型的值，都视为 0 进行处理
        price = parseFloat(price, 10) || 0;
        price = price + '';

        // 获取小数点位置
        var pointIndex = price.indexOf('.');

        if (pointIndex === -1) {
            pointIndex = price.length;
        }

        // 取出整数部分及两位小数部分
        var integerPart = price.substring(0, pointIndex),
            decimalPart = price.slice(pointIndex + 1, pointIndex + 3);

        // 保证小数部分为两位，若不足两位，则以 0 补足
        decimalPart = _.padRight(decimalPart, 2, '0');

        // 声明一个用于存放格式化后的价格字符串的变量
        var priceStr = "";

        // 如果有传入货币符号，则先加上它
        if (symbol) {
            priceStr = '<span class="symbol">' + symbol + '</span>';
        }

        // 然后组装数字部分的 HTML 代码
        priceStr +=
            '<span class="integer">' + integerPart + '</span>' +
            '<span class="point">.</span>' +
            '<span class="decimal">' + decimalPart + '</span>';

        // OK
        return priceStr;
    };
});
