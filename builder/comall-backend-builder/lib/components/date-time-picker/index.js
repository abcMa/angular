'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DateTimePicker = undefined;

var _css = require('antd/lib/date-picker/style/css');

var _datePicker = require('antd/lib/date-picker');

var _datePicker2 = _interopRequireDefault(_datePicker);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

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

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _globalConfig = require('../../services/global-config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var DateTimePicker = exports.DateTimePicker = function (_Component) {
    (0, _inherits3['default'])(DateTimePicker, _Component);

    function DateTimePicker(props) {
        (0, _classCallCheck3['default'])(this, DateTimePicker);

        var _this = (0, _possibleConstructorReturn3['default'])(this, (DateTimePicker.__proto__ || Object.getPrototypeOf(DateTimePicker)).call(this, props));

        _this.onChange = function (value) {
            var format = _this.dateTimeFormat;
            var _this$props = _this.props,
                name = _this$props.name,
                onChange = _this$props.onChange;


            value = value ? value.format(format) : undefined;

            if (onChange) {
                onChange(value, name);
            }
        };

        _this.disabledDate = function (date) {
            var format = _this.dateTimeFormat;
            var range = _this.props.range;
            if (range) {
                var start = range.start,
                    end = range.end;


                return (start ? date < (0, _moment2['default'])(start, format).startOf('date') : false) || (end ? date > (0, _moment2['default'])(end, format).endOf('date') : false);
            } else {
                return false;
            }
        };

        _this.dateTimeFormat = _globalConfig.globalConfig.get('format.dateTime');
        _this.timeFormat = _globalConfig.globalConfig.get('format.time');
        return _this;
    }

    (0, _createClass3['default'])(DateTimePicker, [{
        key: 'render',
        value: function render() {
            var dateTimeFormat = this.dateTimeFormat,
                timeFormat = this.timeFormat;
            var _props = this.props,
                value = _props.value,
                renderFormat = _props.format,
                _props$placeholder = _props.placeholder,
                placeholder = _props$placeholder === undefined ? 'Select Time' : _props$placeholder,
                _props$showTime = _props.showTime,
                showTime = _props$showTime === undefined ? true : _props$showTime,
                disabled = _props.disabled,
                allowClear = _props.allowClear;


            if (value) {
                value = (0, _moment2['default'])(value, dateTimeFormat);
            }

            var props = {
                value: value,
                format: renderFormat,
                placeholder: placeholder,
                showTime: showTime,
                disabled: disabled,
                allowClear: allowClear,
                onChange: this.onChange,
                disabledDate: this.disabledDate
            };

            if (showTime.defaultValue) {
                showTime = (0, _extends3['default'])({}, showTime, { defaultValue: (0, _moment2['default'])(showTime.defaultValue, timeFormat) });
            }

            return _react2['default'].createElement(_datePicker2['default'], props);
        }
    }]);
    return DateTimePicker;
}(_react.Component);