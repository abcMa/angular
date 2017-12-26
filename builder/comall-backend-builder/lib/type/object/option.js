'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.OptionFormat = undefined;

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

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _object = require('./object');

var _select = require('../../components/select');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 * 字符串类型
 */
var OptionFormat = exports.OptionFormat = function (_ObjectType) {
    (0, _inherits3['default'])(OptionFormat, _ObjectType);

    function OptionFormat() {
        (0, _classCallCheck3['default'])(this, OptionFormat);
        return (0, _possibleConstructorReturn3['default'])(this, (OptionFormat.__proto__ || Object.getPrototypeOf(OptionFormat)).apply(this, arguments));
    }

    (0, _createClass3['default'])(OptionFormat, [{
        key: 'getAvailableDisplayComponent',

        /**
         * 获取展示组件
         */
        value: function getAvailableDisplayComponent(value, displayInfo) {
            var _displayInfo = displayInfo,
                className = _displayInfo.className;

            displayInfo = (0, _extends3['default'])({}, displayInfo, {
                className: (0, _classnames2['default'])('format-option', className)
            });
            return (0, _get3['default'])(OptionFormat.prototype.__proto__ || Object.getPrototypeOf(OptionFormat.prototype), 'getAvailableDisplayComponent', this).call(this, value.name, displayInfo);
        }

        /**
         * 获取输入组件
         */

    }, {
        key: 'getControlComponent',
        value: function getControlComponent(controlInfo) {
            return _react2['default'].createElement(ObjectSelect, controlInfo);
        }

        /**
         * 对数据进行校验
         */

    }, {
        key: 'validate',
        value: function validate(rule, value, callback) {
            callback();
        }
    }]);
    return OptionFormat;
}(_object.ObjectType);

var ObjectSelect = function (_Component) {
    (0, _inherits3['default'])(ObjectSelect, _Component);

    function ObjectSelect() {
        (0, _classCallCheck3['default'])(this, ObjectSelect);
        return (0, _possibleConstructorReturn3['default'])(this, (ObjectSelect.__proto__ || Object.getPrototypeOf(ObjectSelect)).apply(this, arguments));
    }

    (0, _createClass3['default'])(ObjectSelect, [{
        key: 'render',
        value: function render() {
            var _props = this.props,
                _onChange = _props.onChange,
                value = _props.value,
                options = _props.options;

            var control = (0, _extends3['default'])({}, this.props, {
                value: value ? value.id + '' : null,
                onChange: function onChange(value, name) {
                    _onChange(_.find(options, { id: value }), name);
                }
            });
            return _react2['default'].createElement(_select.Select, control);
        }
    }]);
    return ObjectSelect;
}(_react.Component);