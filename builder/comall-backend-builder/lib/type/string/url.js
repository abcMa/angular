'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.URLFormat = undefined;

var _css = require('antd/lib/tooltip/style/css');

var _tooltip = require('antd/lib/tooltip');

var _tooltip2 = _interopRequireDefault(_tooltip);

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

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _string = require('./string');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 * 地址类型
 */
var URLFormat = exports.URLFormat = function (_StringType) {
    (0, _inherits3['default'])(URLFormat, _StringType);

    function URLFormat() {
        (0, _classCallCheck3['default'])(this, URLFormat);
        return (0, _possibleConstructorReturn3['default'])(this, (URLFormat.__proto__ || Object.getPrototypeOf(URLFormat)).apply(this, arguments));
    }

    (0, _createClass3['default'])(URLFormat, [{
        key: 'getAvailableDisplayComponent',

        /**
         * 获取展示组件
         */
        value: function getAvailableDisplayComponent(value, displayInfo) {
            var className = displayInfo.className,
                style = displayInfo.style,
                _displayInfo$text = displayInfo.text,
                text = _displayInfo$text === undefined ? '[link]' : _displayInfo$text,
                _displayInfo$target = displayInfo.target,
                target = _displayInfo$target === undefined ? '_blank' : _displayInfo$target;

            value = _xssFilters2['default'].uriInDoubleQuotedAttr(value);
            return _react2['default'].createElement(
                _tooltip2['default'],
                { title: value },
                _react2['default'].createElement(
                    'a',
                    { className: (0, _classnames2['default'])('type-string format-url', className),
                        style: style, href: value, target: target },
                    text
                )
            );
        }

        /**
         * 对数据进行校验
         */

    }, {
        key: 'validate',
        value: function validate(rule, value, callback) {
            // var url = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
            if (value && typeof value !== 'string') {
                // if (value && typeof value !== 'string' && !url.test(value)) {
                callback('The input is not valid Url!');
            } else {
                callback();
            }
        }
    }]);
    return URLFormat;
}(_string.StringType);