'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ArrayType = undefined;

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

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _checkboxGroup = require('../../components/checkbox-group');

var _type = require('../type');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var ArrayType = exports.ArrayType = function (_Type) {
    (0, _inherits3['default'])(ArrayType, _Type);

    function ArrayType() {
        (0, _classCallCheck3['default'])(this, ArrayType);
        return (0, _possibleConstructorReturn3['default'])(this, (ArrayType.__proto__ || Object.getPrototypeOf(ArrayType)).apply(this, arguments));
    }

    (0, _createClass3['default'])(ArrayType, [{
        key: 'getDisplayComponent',

        /**
         * 获取展示组件
         */
        value: function getDisplayComponent(array, displayInfo) {
            var className = displayInfo.className,
                style = displayInfo.style;

            if (array && array.length) {
                return _react2['default'].createElement(
                    'ul',
                    { className: (0, _classnames2['default'])('type-array', className), style: style },
                    _.map(array, function (item, index) {
                        return _react2['default'].createElement(
                            'li',
                            { key: index, className: 'string-type' },
                            item
                        );
                    })
                );
            } else {
                return (0, _get3['default'])(ArrayType.prototype.__proto__ || Object.getPrototypeOf(ArrayType.prototype), 'getNotAvailableDisplayComponent', this).call(this, displayInfo);
            }
        }

        /**
         * 获取输入组件
         */

    }, {
        key: 'getControlComponent',
        value: function getControlComponent(controlInfo) {
            return _react2['default'].createElement(_checkboxGroup.CheckboxGroup, controlInfo);
        }

        /**
         * 对数据进行校验
         */

    }, {
        key: 'validate',
        value: function validate(rule, value, callback) {
            if (value && value.length && !_.every(value, function (item) {
                return typeof item === 'string';
            })) {
                callback('The input is not valid Array!');
            } else {
                callback();
            }
        }
    }]);
    return ArrayType;
}(_type.Type);