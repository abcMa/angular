'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Searchbox = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _css = require('antd/lib/input/style/css');

var _input = require('antd/lib/input');

var _input2 = _interopRequireDefault(_input);

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

var _componentProps = require('../component-props');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 * 文本输入框
 */
var Searchbox = exports.Searchbox = function (_Component) {
    (0, _inherits3['default'])(Searchbox, _Component);

    function Searchbox(props) {
        (0, _classCallCheck3['default'])(this, Searchbox);

        var _this = (0, _possibleConstructorReturn3['default'])(this, (Searchbox.__proto__ || Object.getPrototypeOf(Searchbox)).call(this, props));

        _this.handleChange = _this.handleChange.bind(_this);
        return _this;
    }

    (0, _createClass3['default'])(Searchbox, [{
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
                placeholder = _props2.placeholder,
                disabled = _props2.disabled;


            var inputProps = {
                // basicPropTypes
                className: className,
                style: style,

                // controlPropTypes
                name: name,
                placeholder: placeholder,
                disabled: disabled,
                onSearch: this.handleChange
            };

            return _react2['default'].createElement(_input2['default'].Search, inputProps);
        }
    }]);
    return Searchbox;
}(_react.Component);

Searchbox.defaultProps = {
    type: 'text'
};
Searchbox.propTypes = (0, _extends3['default'])({}, _componentProps.basicPropTypes, _componentProps.controlPropTypes);