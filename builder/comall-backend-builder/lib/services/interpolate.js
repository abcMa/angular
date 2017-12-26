'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.interpolate = interpolate;
/**
 * 插值方法，使用 context 中的值替换 text 中 {{}} 表达式
 * @expamle interpolate('hello {{ foo.bar }}', {foo: {bar: 'world'}});
 * 返回值： 'hello world'
 */
function interpolate(text, context) {
    var result = text;

    while (/{{([^}]+)}}/.test(result)) {
        var expr = RegExp.$1;
        var keys = expr.trim().split('.');
        var value = context;
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = keys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var key = _step.value;

                value = value[key];
                if (!value) {
                    value = '';
                    break;
                }
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator['return']) {
                    _iterator['return']();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        result = result.replace(/{{[^}]+}}/, value.toString().replace(/\//, '') || '');
    }

    return result;
}