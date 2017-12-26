'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.BooleanType = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _type = require('../type');

var _icon = require('../../components/icon');

var _switch = require('../../components/switch');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 * 数字类型
 */
var BooleanType = exports.BooleanType = function (_Type) {
    (0, _inherits3['default'])(BooleanType, _Type);

    function BooleanType() {
        (0, _classCallCheck3['default'])(this, BooleanType);
        return (0, _possibleConstructorReturn3['default'])(this, (BooleanType.__proto__ || Object.getPrototypeOf(BooleanType)).apply(this, arguments));
    }

    (0, _createClass3['default'])(BooleanType, [{
        key: 'getDisplayComponent',

        /**
         * 获取展示组件
         */
        value: function getDisplayComponent(value, displayInfo) {
            var className = displayInfo.className,
                style = displayInfo.style;

            return _react2['default'].createElement(_icon.Icon, { className: (0, _classnames2['default'])('type-boolean', className),
                style: style, type: value ? 'check' : 'close' });
        }

        /**
         * 获取输入组件
         */

    }, {
        key: 'getControlComponent',
        value: function getControlComponent(controlInfo) {
            return _react2['default'].createElement(_switch.Switch, controlInfo);
        }

        /**
         * 对数据进行校验
         */

    }, {
        key: 'validate',
        value: function validate(rule, value, callback) {
            if (value && typeof value !== 'boolean') {
                callback('The input is not valid Boolean');
            } else {
                callback();
            }
        }

        /**
         * 将数据转换为 boolean 类型的值
         * 对于非 boolean 值，遵循如下规则：
         * - undefined, null - 转换为 undefined
         * - 任何其它值，都转换为 true
         */

    }, {
        key: 'format',
        value: function format(value) {
            if (typeof value === 'boolean') {
                return value;
            } else if (value == null) {
                return undefined;
            } else {
                return true;
            }
        }
    }]);
    return BooleanType;
}(_type.Type);