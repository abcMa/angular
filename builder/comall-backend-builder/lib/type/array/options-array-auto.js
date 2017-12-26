'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.OptionsArrayAutoFormat = undefined;

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

var _optionsArray = require('./options-array');

var _selectAutoComplete = require('../../components/select-auto-complete');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 * 名值对数组类型
 */
var OptionsArrayAutoFormat = exports.OptionsArrayAutoFormat = function (_OptionsArrayFormat) {
    (0, _inherits3['default'])(OptionsArrayAutoFormat, _OptionsArrayFormat);

    function OptionsArrayAutoFormat() {
        (0, _classCallCheck3['default'])(this, OptionsArrayAutoFormat);
        return (0, _possibleConstructorReturn3['default'])(this, (OptionsArrayAutoFormat.__proto__ || Object.getPrototypeOf(OptionsArrayAutoFormat)).apply(this, arguments));
    }

    (0, _createClass3['default'])(OptionsArrayAutoFormat, [{
        key: 'getControlComponent',


        /**
         * 获取输入组件
         */
        value: function getControlComponent(controlInfo) {
            var props = (0, _extends3['default'])({}, controlInfo, {
                mode: 'multiple'
            });
            return _react2['default'].createElement(_selectAutoComplete.SelectAutoComplete, props);
        }
    }]);
    return OptionsArrayAutoFormat;
}(_optionsArray.OptionsArrayFormat);