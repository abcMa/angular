'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DateFormat = undefined;

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

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _string = require('./string');

var _datePicker = require('../../components/date-picker');

var _services = require('../../services');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var DateFormat = exports.DateFormat = function (_StringType) {
    (0, _inherits3['default'])(DateFormat, _StringType);

    function DateFormat() {
        (0, _classCallCheck3['default'])(this, DateFormat);
        return (0, _possibleConstructorReturn3['default'])(this, (DateFormat.__proto__ || Object.getPrototypeOf(DateFormat)).apply(this, arguments));
    }

    (0, _createClass3['default'])(DateFormat, [{
        key: 'getAvailableDisplayComponent',


        /**
         * 获取展示组件
         */
        value: function getAvailableDisplayComponent(value, displayInfo) {
            if (displayInfo.format) {
                value = (0, _moment2['default'])(value, _services.globalConfig.get('format.date')).format(displayInfo.format);
            }
            return (0, _get3['default'])(DateFormat.prototype.__proto__ || Object.getPrototypeOf(DateFormat.prototype), 'getAvailableDisplayComponent', this).call(this, value, displayInfo);
        }

        /**
         * 获取输入组件，日期选择
         */

    }, {
        key: 'getControlComponent',
        value: function getControlComponent(controlInfo) {
            return _react2['default'].createElement(_datePicker.DatePicker, controlInfo);
        }

        /**
         * 对数据进行校验
         */

    }, {
        key: 'validate',
        value: function validate(rule, value, callback) {
            callback();
        }
    }]);
    return DateFormat;
}(_string.StringType);