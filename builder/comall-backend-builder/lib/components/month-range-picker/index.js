'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.MonthRangePicker = undefined;

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _css = require('antd/lib/date-picker/style/css');

var _datePicker = require('antd/lib/date-picker');

var _datePicker2 = _interopRequireDefault(_datePicker);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _globalConfig = require('../../services/global-config');

require('./index.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var MonthPicker = _datePicker2['default'].MonthPicker;

var MonthRangePicker = exports.MonthRangePicker = function (_Component) {
    (0, _inherits3['default'])(MonthRangePicker, _Component);

    function MonthRangePicker(props) {
        (0, _classCallCheck3['default'])(this, MonthRangePicker);

        var _this = (0, _possibleConstructorReturn3['default'])(this, (MonthRangePicker.__proto__ || Object.getPrototypeOf(MonthRangePicker)).call(this, props));

        _this.disabledStartDate = function (startDate) {
            var _this$state = _this.state,
                startLimit = _this$state.startLimit,
                endDate = _this$state.endDate;

            if (!startDate || !endDate) {
                return false;
            }
            var limitExceed = startLimit ? startDate < startLimit : false;
            return limitExceed || startDate > endDate;
        };

        _this.disabledEndDate = function (endDate) {
            var _this$state2 = _this.state,
                endLimit = _this$state2.endLimit,
                startDate = _this$state2.startDate;

            if (!endDate || !startDate) {
                return false;
            }
            var limitExceed = endLimit ? endDate > endLimit : false;
            return limitExceed || endDate < startDate;
        };

        _this.onChange = function (field, value) {
            _this.setState((0, _defineProperty3['default'])({}, field, value), function () {
                var format = this.dateFormat;
                var _props = this.props,
                    name = _props.name,
                    onChange = _props.onChange;


                var result = {
                    startDate: this.state.startDate.format(format),
                    endDate: this.state.endDate.format(format)
                };

                if (onChange) {
                    onChange(result, name);
                }
            });
        };

        _this.onStartChange = function (value) {
            _this.onChange('startDate', value);
        };

        _this.onEndChange = function (value) {
            _this.onChange('endDate', value);
        };

        _this.handleStartOpenChange = function (open) {
            if (!open) {
                _this.setState({ endOpen: true });
            }
        };

        _this.handleEndOpenChange = function (open) {
            _this.setState({ endOpen: open });
        };

        _this.dateFormat = _globalConfig.globalConfig.get('format.date');
        _this.monthFormat = _globalConfig.globalConfig.get('format.month');

        var state = _this.generateState(props);
        state.endOpen = false;

        _this.state = state;
        return _this;
    }

    (0, _createClass3['default'])(MonthRangePicker, [{
        key: 'generateState',
        value: function generateState(props) {
            var format = this.dateFormat;

            var _ref = props.value || {},
                startDate = _ref.startDate,
                endDate = _ref.endDate;

            var _ref2 = props.range || {},
                startLimit = _ref2.start,
                endLimit = _ref2.end;

            var state = {
                startDate: (startDate ? (0, _moment2['default'])(startDate, format) : (0, _moment2['default'])()).startOf('month'),
                endDate: (endDate ? (0, _moment2['default'])(endDate, format) : (0, _moment2['default'])()).startOf('month')
            };

            if (startLimit) {
                state.startLimit = (0, _moment2['default'])(startLimit, format);
            }
            if (endLimit) {
                state.endLimit = (0, _moment2['default'])(endLimit, format);
            }

            return state;
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            this.setState(this.generateState(nextProps));
        }
    }, {
        key: 'render',
        value: function render() {
            var _props2 = this.props,
                format = _props2.format,
                disabled = _props2.disabled;
            var _state = this.state,
                startDate = _state.startDate,
                endDate = _state.endDate,
                endOpen = _state.endOpen;


            return _react2['default'].createElement(
                'div',
                { className: 'month-range-picker' },
                _react2['default'].createElement(MonthPicker, {
                    disabledDate: this.disabledStartDate,
                    format: format,
                    value: startDate,
                    placeholder: 'Start',
                    onChange: this.onStartChange,
                    onOpenChange: this.handleStartOpenChange,
                    defaultValue: startDate,
                    allowClear: false,
                    disabled: disabled
                }),
                _react2['default'].createElement(
                    'span',
                    { className: 'spacing' },
                    '~'
                ),
                _react2['default'].createElement(MonthPicker, {
                    disabledDate: this.disabledEndDate,
                    format: format,
                    value: endDate,
                    placeholder: 'End',
                    onChange: this.onEndChange,
                    open: endOpen,
                    onOpenChange: this.handleEndOpenChange,
                    defaultValue: endDate,
                    allowClear: false,
                    disabled: disabled
                })
            );
        }
    }]);
    return MonthRangePicker;
}(_react.Component);