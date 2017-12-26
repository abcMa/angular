'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DatePicker = undefined;

var _css = require('antd/lib/date-picker/style/css');

var _datePicker = require('antd/lib/date-picker');

var _datePicker2 = _interopRequireDefault(_datePicker);

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

var DatePicker = exports.DatePicker = function (_Component) {
    (0, _inherits3['default'])(DatePicker, _Component);

    function DatePicker(props) {
        (0, _classCallCheck3['default'])(this, DatePicker);

        var _this = (0, _possibleConstructorReturn3['default'])(this, (DatePicker.__proto__ || Object.getPrototypeOf(DatePicker)).call(this, props));

        _this.onChange = function (value) {
            var format = _this.format;
            var _this$props = _this.props,
                name = _this$props.name,
                onChange = _this$props.onChange;


            value = value ? value.format(format) : undefined;

            if (onChange) {
                onChange(value, name);
            }
        };

        _this.disabledDate = function (date) {
            var format = _this.format;
            var range = _this.props.range;
            if (range) {
                var start = range.start,
                    end = range.end;


                return (start ? date < (0, _moment2['default'])(start, format) : false) || (end ? date > (0, _moment2['default'])(end, format) : false);
            } else {
                return false;
            }
        };

        _this.format = _globalConfig.globalConfig.get('format.date');
        return _this;
    }

    (0, _createClass3['default'])(DatePicker, [{
        key: 'render',
        value: function render() {
            var format = this.format;
            var _props = this.props,
                value = _props.value,
                renderFormat = _props.format,
                placeholder = _props.placeholder,
                disabled = _props.disabled,
                allowClear = _props.allowClear;


            if (value) {
                value = (0, _moment2['default'])(value, format);
            }

            var props = {
                value: value,
                format: renderFormat,
                placeholder: placeholder,
                disabled: disabled,
                allowClear: allowClear,
                onChange: this.onChange,
                disabledDate: this.disabledDate
            };

            return _react2['default'].createElement(_datePicker2['default'], props);
        }
    }]);
    return DatePicker;
}(_react.Component);