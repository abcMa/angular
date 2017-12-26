'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.OptionAutoFormat = undefined;

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

var _option = require('./option');

var _selectAutoComplete = require('../../components/select-auto-complete');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 * 字符串类型
 */
var OptionAutoFormat = exports.OptionAutoFormat = function (_OptionFormat) {
    (0, _inherits3['default'])(OptionAutoFormat, _OptionFormat);

    function OptionAutoFormat() {
        (0, _classCallCheck3['default'])(this, OptionAutoFormat);
        return (0, _possibleConstructorReturn3['default'])(this, (OptionAutoFormat.__proto__ || Object.getPrototypeOf(OptionAutoFormat)).apply(this, arguments));
    }

    (0, _createClass3['default'])(OptionAutoFormat, [{
        key: 'getControlComponent',


        /**
         * 获取输入组件
         */
        value: function getControlComponent(controlInfo) {
            return _react2['default'].createElement(_selectAutoComplete.SelectAutoComplete, controlInfo);
        }
    }]);
    return OptionAutoFormat;
}(_option.OptionFormat);