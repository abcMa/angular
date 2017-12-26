'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.PriceFormat = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _number = require('./number');

var _numberbox = require('../../components/numberbox');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 * 全局默认类型系统呈现，其余类型或格式通过继承该类并覆盖相应方法以实现内容。
 */
var PriceFormat = exports.PriceFormat = function (_NumberType) {
    (0, _inherits3['default'])(PriceFormat, _NumberType);

    function PriceFormat() {
        (0, _classCallCheck3['default'])(this, PriceFormat);
        return (0, _possibleConstructorReturn3['default'])(this, (PriceFormat.__proto__ || Object.getPrototypeOf(PriceFormat)).apply(this, arguments));
    }

    (0, _createClass3['default'])(PriceFormat, [{
        key: 'getAvailableDisplayComponent',

        /**
         * 获取展示组件
         */
        value: function getAvailableDisplayComponent(value, displayInfo) {
            var _displayInfo = displayInfo,
                className = _displayInfo.className;

            displayInfo = (0, _extends3['default'])({}, displayInfo, {
                className: (0, _classnames2['default'])('format-price', className)
            });

            var str = value.toFixed(2) + '';

            var integerPart = str.slice(0, -3).replace(/\B(?=(?:\d{3})+$)/g, ',');
            var decimalPart = str.slice(-3);

            var priceStr = integerPart + decimalPart;

            return (0, _get3['default'])(PriceFormat.prototype.__proto__ || Object.getPrototypeOf(PriceFormat.prototype), 'getAvailableDisplayComponent', this).call(this, priceStr, displayInfo);
        }

        /**
         * 获取输入组件
         */

    }, {
        key: 'getControlComponent',
        value: function getControlComponent(controlInfo) {
            return _react2['default'].createElement(_numberbox.Numberbox, (0, _extends3['default'])({}, controlInfo, { min: 0 }));
        }

        /**
         * 对数据进行校验
         */

    }, {
        key: 'validate',
        value: function validate(rule, value, callback) {
            if (value && typeof value !== 'number' && Number.isInteger(value)) {
                callback('The input is not valid Price');
            } else {
                callback();
            }
        }

        /**
         * 将数据格式化为符合 price 格式的 number 类型的值
         * 即最多保留小数点后两位（直接截去，而非四舍五入）
         */

    }, {
        key: 'format',
        value: function format(value) {
            value = (0, _get3['default'])(PriceFormat.prototype.__proto__ || Object.getPrototypeOf(PriceFormat.prototype), 'format', this).call(this, value);

            if (value !== undefined) {
                value = Math.floor(value * 100) / 100; // 只保留小数点后两位的值
            }

            return value;
        }
    }]);
    return PriceFormat;
}(_number.NumberType);