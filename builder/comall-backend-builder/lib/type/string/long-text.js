'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.LongTextFormat = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

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

var _textbox = require('../../components/textbox');

var _string = require('./string');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var LongTextFormat = exports.LongTextFormat = function (_StringType) {
    (0, _inherits3['default'])(LongTextFormat, _StringType);

    function LongTextFormat() {
        (0, _classCallCheck3['default'])(this, LongTextFormat);
        return (0, _possibleConstructorReturn3['default'])(this, (LongTextFormat.__proto__ || Object.getPrototypeOf(LongTextFormat)).apply(this, arguments));
    }

    (0, _createClass3['default'])(LongTextFormat, [{
        key: 'getControlComponent',

        /**
         * 获取输入组件
         */
        value: function getControlComponent(controlInfo) {
            return _react2['default'].createElement(_textbox.Textbox, (0, _extends3['default'])({}, controlInfo, { type: 'textarea', autosize: { minRows: 3, maxRows: 6 } }));
        }
    }]);
    return LongTextFormat;
}(_string.StringType);