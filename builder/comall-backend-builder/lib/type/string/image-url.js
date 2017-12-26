'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ImageURLFormat = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _string = require('./string');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 * 图片地址类型
 */
var ImageURLFormat = exports.ImageURLFormat = function (_StringType) {
    (0, _inherits3['default'])(ImageURLFormat, _StringType);

    function ImageURLFormat() {
        (0, _classCallCheck3['default'])(this, ImageURLFormat);
        return (0, _possibleConstructorReturn3['default'])(this, (ImageURLFormat.__proto__ || Object.getPrototypeOf(ImageURLFormat)).apply(this, arguments));
    }

    (0, _createClass3['default'])(ImageURLFormat, [{
        key: 'getAvailableDisplayComponent',

        /**
         * 获取展示组件
         */
        value: function getAvailableDisplayComponent(value, displayInfo) {
            var className = displayInfo.className,
                style = displayInfo.style,
                alt = displayInfo.alt;

            return _react2['default'].createElement('img', { className: (0, _classnames2['default'])('type-string format-image-url', className),
                style: style, src: value, alt: alt });
        }

        /**
         * 将数据格式化为 number 类型的值
         */

    }, {
        key: 'format',
        value: function format(value) {
            var stringValue = (0, _get3['default'])(ImageURLFormat.prototype.__proto__ || Object.getPrototypeOf(ImageURLFormat.prototype), 'format', this).call(this, value);
            return stringValue.trim();
        }
    }]);
    return ImageURLFormat;
}(_string.StringType);