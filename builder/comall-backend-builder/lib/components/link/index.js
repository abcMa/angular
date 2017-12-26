'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Link = undefined;

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

var _xssFilters = require('xss-filters');

var _xssFilters2 = _interopRequireDefault(_xssFilters);

var _image = require('../image');

var _text = require('../text');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var Link = exports.Link = function (_Component) {
    (0, _inherits3['default'])(Link, _Component);

    function Link() {
        (0, _classCallCheck3['default'])(this, Link);
        return (0, _possibleConstructorReturn3['default'])(this, (Link.__proto__ || Object.getPrototypeOf(Link)).apply(this, arguments));
    }

    (0, _createClass3['default'])(Link, [{
        key: 'render',
        value: function render() {
            var _props = this.props,
                style = _props.style,
                url = _props.url,
                imageurl = _props.imageurl,
                text = _props.text,
                imgStyle = _props.imgStyle,
                className = _props.className;


            var sanitizedUrl = _xssFilters2['default'].uriInDoubleQuotedAttr(url);

            // 根据当前是否有imageurl来判断当前的超链接为文本OR图片
            return imageurl ? _react2['default'].createElement(
                'a',
                { href: sanitizedUrl, style: style, className: className },
                _react2['default'].createElement(_image.Image, { imageurl: imageurl, alt: text, style: imgStyle })
            ) : _react2['default'].createElement(
                'a',
                { href: sanitizedUrl, style: style },
                _react2['default'].createElement(_text.Text, { text: text })
            );
        }
    }]);
    return Link;
}(_react.Component);