'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.PercentageFormat = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

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

var _number = require('./number');

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 * 百分比类型
 */
var PercentageFormat = exports.PercentageFormat = function (_NumberType) {
    (0, _inherits3['default'])(PercentageFormat, _NumberType);

    function PercentageFormat() {
        (0, _classCallCheck3['default'])(this, PercentageFormat);
        return (0, _possibleConstructorReturn3['default'])(this, (PercentageFormat.__proto__ || Object.getPrototypeOf(PercentageFormat)).apply(this, arguments));
    }

    (0, _createClass3['default'])(PercentageFormat, [{
        key: 'getAvailableDisplayComponent',

        /**
         * 获取展示组件
         */
        value: function getAvailableDisplayComponent(value, displayInfo) {
            var _displayInfo = displayInfo,
                className = _displayInfo.className;

            displayInfo = (0, _extends3['default'])({}, displayInfo, {
                className: (0, _classnames2['default'])('format-percentage', className)
            });

            var result = parseInt(value * 100000, 10) / 1000 + '%';
            return (0, _get3['default'])(PercentageFormat.prototype.__proto__ || Object.getPrototypeOf(PercentageFormat.prototype), 'getAvailableDisplayComponent', this).call(this, result, displayInfo);
        }
    }]);
    return PercentageFormat;
}(_number.NumberType);