'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.IntegerFormat = undefined;

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

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

var _number = require('./number');

var _select = require('../../components/select');

var _numberbox = require('../../components/numberbox');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 * 整数类型
 */
var IntegerFormat = exports.IntegerFormat = function (_NumberType) {
    (0, _inherits3['default'])(IntegerFormat, _NumberType);

    function IntegerFormat() {
        (0, _classCallCheck3['default'])(this, IntegerFormat);
        return (0, _possibleConstructorReturn3['default'])(this, (IntegerFormat.__proto__ || Object.getPrototypeOf(IntegerFormat)).apply(this, arguments));
    }

    (0, _createClass3['default'])(IntegerFormat, [{
        key: 'getAvailableDisplayComponent',

        /**
         * 获取展示组件
         */
        value: function getAvailableDisplayComponent(value, displayInfo) {
            var _displayInfo = displayInfo,
                className = _displayInfo.className,
                options = _displayInfo.options;

            displayInfo = (0, _extends3['default'])({}, displayInfo, {
                className: (0, _classnames2['default'])('format-integer', className)
            });

            if (options) {
                value = _.result(_.find(options, function (option) {
                    return option.id === Number(value);
                }), 'name');
            }

            return (0, _get3['default'])(IntegerFormat.prototype.__proto__ || Object.getPrototypeOf(IntegerFormat.prototype), 'getAvailableDisplayComponent', this).call(this, value, displayInfo);
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
                return _react2['default'].createElement(_numberbox.Numberbox, controlInfo);
            }
        }

        /**
         * 将数据格式化为请求参数
         */

    }, {
        key: 'formatParams',
        value: function formatParams(key, value) {
            return (0, _defineProperty3['default'])({}, key, +value);
        }

        /**
         * 对数据进行校验
         */

    }, {
        key: 'validate',
        value: function validate(rule, value, callback) {
            if (value && typeof value !== 'number' && Number.isInteger(value) && !Number.isFinite(value)) {
                callback('The input is not valid Integer');
            } else {
                callback();
            }
        }
    }]);
    return IntegerFormat;
}(_number.NumberType);