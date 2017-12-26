'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Text = undefined;

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

var _services = require('../../services');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 * 文本组件，text 属性支持使用 {{}} 表达式从 props 进行插值
 */
var Text = exports.Text = function (_Component) {
    (0, _inherits3['default'])(Text, _Component);

    function Text() {
        (0, _classCallCheck3['default'])(this, Text);
        return (0, _possibleConstructorReturn3['default'])(this, (Text.__proto__ || Object.getPrototypeOf(Text)).apply(this, arguments));
    }

    (0, _createClass3['default'])(Text, [{
        key: 'render',
        value: function render() {
            var _props = this.props,
                style = _props.style,
                text = _props.text,
                className = _props.className;


            var result = (0, _services.interpolate)(text, this.props);

            return _react2['default'].createElement(
                'span',
                { style: style, className: className },
                result
            );
        }
    }]);
    return Text;
}(_react.Component);