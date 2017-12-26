'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.NumberType = undefined;

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

var _type = require('../type');

var _numberbox = require('../../components/numberbox');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 * 数字类型
 */
var NumberType = exports.NumberType = function (_Type) {
    (0, _inherits3['default'])(NumberType, _Type);

    function NumberType() {
        (0, _classCallCheck3['default'])(this, NumberType);
        return (0, _possibleConstructorReturn3['default'])(this, (NumberType.__proto__ || Object.getPrototypeOf(NumberType)).apply(this, arguments));
    }

    (0, _createClass3['default'])(NumberType, [{
        key: 'getAvailableDisplayComponent',

        /**
         * 获取展示组件
         */
        value: function getAvailableDisplayComponent(value, displayInfo) {
            var _displayInfo = displayInfo,
                className = _displayInfo.className;

            displayInfo = (0, _extends3['default'])({}, displayInfo, {
                className: (0, _classnames2['default'])('type-number', className)
            });
            return (0, _get3['default'])(NumberType.prototype.__proto__ || Object.getPrototypeOf(NumberType.prototype), 'getAvailableDisplayComponent', this).call(this, value, displayInfo);
        }

        /**
         * 获取输入组件
         */

    }, {
        key: 'getControlComponent',
        value: function getControlComponent(controlInfo) {
            return _react2['default'].createElement(_numberbox.Numberbox, controlInfo);
        }

        /**
         * 对数据进行校验
         */

    }, {
        key: 'validate',
        value: function validate(rule, value, callback) {
            if (value && typeof value !== 'number' && !Number.isFinite(value)) {
                callback('The input is not valid Number!');
            } else {
                callback();
            }
        }

        /**
         * 将数据格式化为 number 类型的值
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
            }

            return value;
        }
    }]);
    return NumberType;
}(_type.Type);