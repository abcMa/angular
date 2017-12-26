'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Numberbox = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _css = require('antd/lib/input-number/style/css');

var _inputNumber = require('antd/lib/input-number');

var _inputNumber2 = _interopRequireDefault(_inputNumber);

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

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _componentProps = require('../component-props');

require('./index.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var Numberbox = exports.Numberbox = function (_Component) {
    (0, _inherits3['default'])(Numberbox, _Component);

    function Numberbox(props) {
        (0, _classCallCheck3['default'])(this, Numberbox);

        var _this = (0, _possibleConstructorReturn3['default'])(this, (Numberbox.__proto__ || Object.getPrototypeOf(Numberbox)).call(this, props));

        _this.handleChange = _this.handleChange.bind(_this);
        return _this;
    }

    (0, _createClass3['default'])(Numberbox, [{
        key: 'handleChange',
        value: function handleChange(value) {
            var _props = this.props,
                name = _props.name,
                onChange = _props.onChange;


            if (onChange) {
                onChange(value, name);
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _props2 = this.props,
                className = _props2.className,
                style = _props2.style,
                name = _props2.name,
                value = _props2.value,
                placeholder = _props2.placeholder,
                disabled = _props2.disabled,
                min = _props2.min,
                max = _props2.max,
                step = _props2.step,
                formatter = _props2.formatter;


            var numberboxProps = {
                // basicPropTypes
                className: className,
                style: style,

                // controlPropTypes
                name: name,
                value: value,
                placeholder: placeholder,
                disabled: disabled,
                onChange: this.handleChange,

                // custom
                min: min,
                max: max,
                step: step,
                formatter: formatter
            };

            return _react2['default'].createElement(_inputNumber2['default'], numberboxProps);
        }
    }]);
    return Numberbox;
}(_react.Component);

Numberbox.propTypes = (0, _extends3['default'])({}, _componentProps.basicPropTypes, _componentProps.controlPropTypes, {

    value: _propTypes2['default'].oneOfType([_propTypes2['default'].string, _propTypes2['default'].number]),

    // 最小值
    min: _propTypes2['default'].number,

    // 最大值
    max: _propTypes2['default'].number,

    // 累加/累减的步长，支持小数
    step: _propTypes2['default'].number,

    formatter: _propTypes2['default'].func
});