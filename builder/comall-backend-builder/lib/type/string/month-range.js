'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.MonthRangeFormat = undefined;

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

var _monthRangePicker = require('../../components/month-range-picker');

var _string = require('./string');

var _services = require('../../services');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var MonthRangeFormat = exports.MonthRangeFormat = function (_StringType) {
    (0, _inherits3['default'])(MonthRangeFormat, _StringType);

    function MonthRangeFormat() {
        (0, _classCallCheck3['default'])(this, MonthRangeFormat);
        return (0, _possibleConstructorReturn3['default'])(this, (MonthRangeFormat.__proto__ || Object.getPrototypeOf(MonthRangeFormat)).apply(this, arguments));
    }

    (0, _createClass3['default'])(MonthRangeFormat, [{
        key: 'getDisplayComponent',


        /**
         * 获取展示组件
         */
        value: function getDisplayComponent(value, displayInfo) {
            var _ref = value || {},
                startDate = _ref.startDate,
                endDate = _ref.endDate;

            if (startDate && endDate) {
                var format = displayInfo.format;
                if (format) {
                    var dateFormat = _services.globalConfig.get('format.date');
                    startDate = (0, _moment2['default'])(startDate, dateFormat).format(format);
                    endDate = (0, _moment2['default'])(endDate, dateFormat).format(format);
                }
                return (0, _get3['default'])(MonthRangeFormat.prototype.__proto__ || Object.getPrototypeOf(MonthRangeFormat.prototype), 'getAvailableDisplayComponent', this).call(this, startDate + ' ~ ' + endDate, displayInfo);
            } else {
                return (0, _get3['default'])(MonthRangeFormat.prototype.__proto__ || Object.getPrototypeOf(MonthRangeFormat.prototype), 'getNotAvailableDisplayComponent', this).call(this, displayInfo);
            }
        }

        /**
         * 获取输入组件，日期的选择区间
         */

    }, {
        key: 'getControlComponent',
        value: function getControlComponent(controlInfo) {
            return _react2['default'].createElement(_monthRangePicker.MonthRangePicker, controlInfo);
        }

        /**
         * 将数据格式化为请求参数
         */

    }, {
        key: 'formatParams',
        value: function formatParams(key, value) {
            var format = _services.globalConfig.get('format.date');
            return {
                startDate: (0, _moment2['default'])(value.startDate).startOf('month').format(format),
                endDate: (0, _moment2['default'])(value.endDate).add(1, 'months').startOf('month').format(format)
            };
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
    return MonthRangeFormat;
}(_string.StringType);