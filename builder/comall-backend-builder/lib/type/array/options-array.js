'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.OptionsArrayFormat = undefined;

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

var _array = require('./array');

var _select = require('../../components/select');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 * 名值对数组类型
 */
var OptionsArrayFormat = exports.OptionsArrayFormat = function (_ArrayType) {
    (0, _inherits3['default'])(OptionsArrayFormat, _ArrayType);

    function OptionsArrayFormat() {
        (0, _classCallCheck3['default'])(this, OptionsArrayFormat);
        return (0, _possibleConstructorReturn3['default'])(this, (OptionsArrayFormat.__proto__ || Object.getPrototypeOf(OptionsArrayFormat)).apply(this, arguments));
    }

    (0, _createClass3['default'])(OptionsArrayFormat, [{
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
                    { className: (0, _classnames2['default'])('type-array format-options-array', className), style: style },
                    _.map(array, function (_ref) {
                        var id = _ref.id,
                            name = _ref.name,
                            value = _ref.value;

                        return _react2['default'].createElement(
                            'li',
                            { key: id, className: 'string-type' },
                            name
                        );
                    })
                );
            } else {
                return (0, _get3['default'])(OptionsArrayFormat.prototype.__proto__ || Object.getPrototypeOf(OptionsArrayFormat.prototype), 'getNotAvailableDisplayComponent', this).call(this, displayInfo);
            }
        }

        /**
         * 获取输入组件
         */

    }, {
        key: 'getControlComponent',
        value: function getControlComponent(controlInfo) {
            return _react2['default'].createElement(OptionsArraySelect, controlInfo);
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
    return OptionsArrayFormat;
}(_array.ArrayType);

var OptionsArraySelect = function (_Component) {
    (0, _inherits3['default'])(OptionsArraySelect, _Component);

    function OptionsArraySelect() {
        (0, _classCallCheck3['default'])(this, OptionsArraySelect);
        return (0, _possibleConstructorReturn3['default'])(this, (OptionsArraySelect.__proto__ || Object.getPrototypeOf(OptionsArraySelect)).apply(this, arguments));
    }

    (0, _createClass3['default'])(OptionsArraySelect, [{
        key: 'render',
        value: function render() {
            var _props = this.props,
                _onChange = _props.onChange,
                value = _props.value,
                options = _props.options;

            var control = (0, _extends3['default'])({}, this.props, {
                mode: 'multiple',
                value: value ? value.map(function (_ref2) {
                    var id = _ref2.id;
                    return id;
                }) : null,
                onChange: function onChange(value, name) {
                    _onChange(value.map(function (id) {
                        return _.find(options, { id: id });
                    }), name);
                }
            });
            return _react2['default'].createElement(_select.Select, control);
        }
    }]);
    return OptionsArraySelect;
}(_react.Component);