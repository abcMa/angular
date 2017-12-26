'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.TimePicker = undefined;

var _css = require('antd/lib/time-picker/style/css');

var _timePicker = require('antd/lib/time-picker');

var _timePicker2 = _interopRequireDefault(_timePicker);

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

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _globalConfig = require('../../services/global-config');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var TimePicker = exports.TimePicker = function (_Component) {
    (0, _inherits3['default'])(TimePicker, _Component);

    function TimePicker(props) {
        (0, _classCallCheck3['default'])(this, TimePicker);

        var _this = (0, _possibleConstructorReturn3['default'])(this, (TimePicker.__proto__ || Object.getPrototypeOf(TimePicker)).call(this, props));

        _this.onChange = function (value) {
            var format = _this.format;
            var _this$props = _this.props,
                name = _this$props.name,
                onChange = _this$props.onChange,
                range = _this$props.range;


            if (range) {
                var start = range.start,
                    end = range.end;


                if ((0, _moment2['default'])(start, format) > value || (0, _moment2['default'])(end, format) < value) {
                    value = undefined;
                }
            }

            value = value ? value.format(format) : undefined;

            if (onChange) {
                onChange(value, name);
            }
        };

        _this.disabledHours = function (date) {
            var format = _this.format;
            var range = _this.props.range;


            if (range) {
                var start = range.start,
                    end = range.end;

                var startHour = start ? (0, _moment2['default'])(start, format).hour() : 0;
                var endHour = end ? (0, _moment2['default'])(end, format).hour() : 23;

                return _.range(0, startHour).concat(_.range(endHour + 1, 24));
            } else {
                return _.range(0, 24);
            }
        };

        _this.disabledMinutes = function (selectedHour) {
            var format = _this.format;
            var range = _this.props.range;


            if (range) {
                var start = range.start,
                    end = range.end;

                var startMinute = 0;
                var endMinute = 59;

                if (start) {
                    var startTime = (0, _moment2['default'])(start, format);

                    if (selectedHour === startTime.hour()) {
                        startMinute = startTime.minute();
                    }
                }

                if (end) {
                    var endTime = (0, _moment2['default'])(end, format);

                    if (selectedHour === endTime.hour()) {
                        endMinute = endTime.minute();
                    }
                }

                return _.range(0, startMinute).concat(_.range(endMinute + 1, 60));
            } else {
                return _.range(0, 60);
            }
        };

        _this.disabledSeconds = function (selectedHour, selectedMinute) {
            var format = _this.format;
            var range = _this.props.range;


            if (range) {
                var start = range.start,
                    end = range.end;

                var startSecond = 0;
                var endSecond = 59;

                if (start) {
                    var startTime = (0, _moment2['default'])(start, format);

                    if (selectedHour === startTime.hour() && selectedMinute === startTime.minute()) {
                        startSecond = startTime.second();
                    }
                }

                if (end) {
                    var endTime = (0, _moment2['default'])(end, format);

                    if (selectedHour === endTime.hour() && selectedMinute === endTime.minute()) {
                        endSecond = endTime.second();
                    }
                }

                return _.range(0, startSecond).concat(_.range(endSecond + 1, 60));
            } else {
                return _.range(0, 60);
            }
        };

        _this.format = _globalConfig.globalConfig.get('format.time');
        return _this;
    }

    (0, _createClass3['default'])(TimePicker, [{
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
                disabledHours: this.disabledHours,
                disabledMinutes: this.disabledMinutes,
                disabledSeconds: this.disabledSeconds
            };

            return _react2['default'].createElement(_timePicker2['default'], props);
        }
    }]);
    return TimePicker;
}(_react.Component);