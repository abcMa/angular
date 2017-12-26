'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.PositiveFormat = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _number = require('./number');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 * 非负数类型
 */
var PositiveFormat = exports.PositiveFormat = function (_NumberType) {
    (0, _inherits3['default'])(PositiveFormat, _NumberType);

    function PositiveFormat() {
        (0, _classCallCheck3['default'])(this, PositiveFormat);
        return (0, _possibleConstructorReturn3['default'])(this, (PositiveFormat.__proto__ || Object.getPrototypeOf(PositiveFormat)).apply(this, arguments));
    }

    (0, _createClass3['default'])(PositiveFormat, [{
        key: 'validate',

        /**
         * 对数据进行校验
         */
        value: function validate(rule, value, callback) {
            if (value && typeof value !== 'number' && value < 0 && !Number.isFinite(value)) {
                callback('The input is not valid Number!');
            } else {
                callback();
            }
        }

        /**
         * 将数据格式化为 positive number 类型的值
         */

    }, {
        key: 'format',
        value: function format(value) {
            if (typeof value !== 'number') {
                value = parseFloat(value, 10);
            }

            // NaN, +Infinity, -Infinity
            if (Number.isFinite(value) === false) {
                value = undefined;
            } else {
                value = Math.abs(value);
            }

            return value;
        }
    }]);
    return PositiveFormat;
}(_number.NumberType);