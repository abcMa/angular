'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ObjectType = undefined;

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

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

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _type = require('../type');

var _textbox = require('../../components/textbox');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 * 对象类型
 */
var ObjectType = exports.ObjectType = function (_Type) {
    (0, _inherits3['default'])(ObjectType, _Type);

    function ObjectType() {
        (0, _classCallCheck3['default'])(this, ObjectType);
        return (0, _possibleConstructorReturn3['default'])(this, (ObjectType.__proto__ || Object.getPrototypeOf(ObjectType)).apply(this, arguments));
    }

    (0, _createClass3['default'])(ObjectType, [{
        key: 'getAvailableDisplayComponent',

        /**
         * 获取展示组件
         */
        value: function getAvailableDisplayComponent(value, displayInfo) {
            var _displayInfo = displayInfo,
                className = _displayInfo.className;

            displayInfo = (0, _extends3['default'])({}, displayInfo, {
                className: (0, _classnames2['default'])('type-object', className)
            });
            if ((typeof value === 'undefined' ? 'undefined' : (0, _typeof3['default'])(value)) === 'object') {
                value = JSON.stringify(value);
            }
            return (0, _get3['default'])(ObjectType.prototype.__proto__ || Object.getPrototypeOf(ObjectType.prototype), 'getAvailableDisplayComponent', this).call(this, value, displayInfo);
        }

        /**
         * 获取输入组件
         */

    }, {
        key: 'getControlComponent',
        value: function getControlComponent(controlInfo) {
            return _react2['default'].createElement(ObjectTextBox, controlInfo);
        }

        /**
         * 对数据进行校验
         */

    }, {
        key: 'validate',
        value: function validate(rule, value, callback) {
            try {
                if ((typeof value === 'undefined' ? 'undefined' : (0, _typeof3['default'])(value)) !== 'object') {
                    JSON.parse(value);
                }
                callback();
            } catch (error) {
                callback('The input is not valid JSON format!');
            }
        }

        /**
         * 将数据格式化为请求参数
         */

    }, {
        key: 'formatParams',
        value: function formatParams(key, value) {
            try {
                return (0, _defineProperty3['default'])({}, key, (typeof value === 'undefined' ? 'undefined' : (0, _typeof3['default'])(value)) === 'object' ? value : JSON.parse(value));
            } catch (e) {
                return (0, _defineProperty3['default'])({}, key, null);
            }
        }
    }]);
    return ObjectType;
}(_type.Type);

var ObjectTextBox = function (_Component) {
    (0, _inherits3['default'])(ObjectTextBox, _Component);

    function ObjectTextBox() {
        (0, _classCallCheck3['default'])(this, ObjectTextBox);
        return (0, _possibleConstructorReturn3['default'])(this, (ObjectTextBox.__proto__ || Object.getPrototypeOf(ObjectTextBox)).apply(this, arguments));
    }

    (0, _createClass3['default'])(ObjectTextBox, [{
        key: 'render',
        value: function render() {
            var value = this.props.value;

            if ((typeof value === 'undefined' ? 'undefined' : (0, _typeof3['default'])(value)) === 'object') {
                value = JSON.stringify(value);
            }
            return _react2['default'].createElement(_textbox.Textbox, (0, _extends3['default'])({}, this.props, {
                value: value,
                type: 'text' }));
        }
    }]);
    return ObjectTextBox;
}(_react.Component);