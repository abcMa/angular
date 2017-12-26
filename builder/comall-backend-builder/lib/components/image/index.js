'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Image = undefined;

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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var Image = exports.Image = function (_Component) {
    (0, _inherits3['default'])(Image, _Component);

    function Image() {
        (0, _classCallCheck3['default'])(this, Image);
        return (0, _possibleConstructorReturn3['default'])(this, (Image.__proto__ || Object.getPrototypeOf(Image)).apply(this, arguments));
    }

    (0, _createClass3['default'])(Image, [{
        key: 'render',
        value: function render() {
            var _props = this.props,
                className = _props.className,
                style = _props.style,
                imageurl = _props.imageurl,
                text = _props.text;


            return _react2['default'].createElement('img', { className: className, style: style, src: imageurl, alt: text });
        }
    }]);
    return Image;
}(_react.Component);