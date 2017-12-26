'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.StringType = undefined;

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

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _type = require('../type');

var _select = require('../../components/select');

var _textbox = require('../../components/textbox');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 * 字符串类型
 */
var StringType = exports.StringType = function (_Type) {
    (0, _inherits3['default'])(StringType, _Type);

    function StringType() {
        (0, _classCallCheck3['default'])(this, StringType);
        return (0, _possibleConstructorReturn3['default'])(this, (StringType.__proto__ || Object.getPrototypeOf(StringType)).apply(this, arguments));
    }

    (0, _createClass3['default'])(StringType, [{
        key: 'getAvailableDisplayComponent',


        /**
         * 获取展示组件
         */
        value: function getAvailableDisplayComponent(value, displayInfo) {
            var _displayInfo = displayInfo,
                className = _displayInfo.className,
                options = _displayInfo.options;

            displayInfo = (0, _extends3['default'])({}, displayInfo, {
                className: (0, _classnames2['default'])('type-string', className)
            });

            if (options) {
                // 下拉选择框，通过key，查找显示的value值
                value = _.result(_.find(options, function (option) {
                    return option.id === String(value);
                }), 'name');
            }
            return (0, _get3['default'])(StringType.prototype.__proto__ || Object.getPrototypeOf(StringType.prototype), 'getAvailableDisplayComponent', this).call(this, value, displayInfo);
        }

        /**
         * 获取输入组件
         */

    }, {
        key: 'getControlComponent',
        value: function getControlComponent(controlInfo) {
            if (controlInfo.options) {
                // 下拉选择框
                return _react2['default'].createElement(_select.Select, controlInfo);
            } else {
                return _react2['default'].createElement(_textbox.Textbox, (0, _extends3['default'])({}, controlInfo, { type: 'text' }));
            }
        }

        /**
         * 对数据进行校验
         */

    }, {
        key: 'validate',
        value: function validate(rule, value, callback) {
            if (value && typeof value !== 'string') {
                callback('The input is not valid String!');
            } else {
                callback();
            }
        }
    }]);
    return StringType;
}(_type.Type);