'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.KeyValueArrayFormat = undefined;

var _css = require('antd/lib/input/style/css');

var _input = require('antd/lib/input');

var _input2 = _interopRequireDefault(_input);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

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

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 * 名值对数组类型
 */
var KeyValueArrayFormat = exports.KeyValueArrayFormat = function (_ArrayType) {
    (0, _inherits3['default'])(KeyValueArrayFormat, _ArrayType);

    function KeyValueArrayFormat() {
        (0, _classCallCheck3['default'])(this, KeyValueArrayFormat);
        return (0, _possibleConstructorReturn3['default'])(this, (KeyValueArrayFormat.__proto__ || Object.getPrototypeOf(KeyValueArrayFormat)).apply(this, arguments));
    }

    (0, _createClass3['default'])(KeyValueArrayFormat, [{
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
                    { className: (0, _classnames2['default'])('type-array format-key-value-array', className), style: style },
                    _.map(array, function (_ref) {
                        var id = _ref.id,
                            name = _ref.name,
                            value = _ref.value;

                        return _react2['default'].createElement(
                            'li',
                            { key: id, className: 'string-type' },
                            name + ': ' + value
                        );
                    })
                );
            } else {
                return (0, _get3['default'])(KeyValueArrayFormat.prototype.__proto__ || Object.getPrototypeOf(KeyValueArrayFormat.prototype), 'getNotAvailableDisplayComponent', this).call(this, displayInfo);
            }
        }

        /**
         * 获取输入组件
         */

    }, {
        key: 'getControlComponent',
        value: function getControlComponent(controlInfo) {
            return _react2['default'].createElement(MultiInput, controlInfo);
        }

        /**
         * 将数据格式化为请求参数
         */

    }, {
        key: 'formatParams',
        value: function formatParams(key, value) {
            return (0, _defineProperty3['default'])({}, key, _.map(value, function (item) {
                return { id: item.id, value: item.value };
            }));
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
    return KeyValueArrayFormat;
}(_array.ArrayType);

var MultiInput = function (_Component) {
    (0, _inherits3['default'])(MultiInput, _Component);

    function MultiInput(props) {
        (0, _classCallCheck3['default'])(this, MultiInput);

        var _this2 = (0, _possibleConstructorReturn3['default'])(this, (MultiInput.__proto__ || Object.getPrototypeOf(MultiInput)).call(this, props));

        _this2.handleChange = _this2.handleChange.bind(_this2);
        return _this2;
    }

    (0, _createClass3['default'])(MultiInput, [{
        key: 'handleChange',
        value: function handleChange(value, index) {
            var _props = this.props,
                array = _props.value,
                name = _props.name,
                onChange = _props.onChange;

            var cloneArray = _.cloneDeep(array);
            value = parseInt(value, 10);
            cloneArray[index].value = isNaN(value) ? undefined : value;

            if (onChange) {
                onChange(cloneArray, name);
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _this3 = this;

            var array = this.props.value;

            return _react2['default'].createElement(
                'div',
                { className: 'multi-input-wrapper' },
                _.map(array, function (item, index) {
                    var id = item.id,
                        name = item.name,
                        value = item.value;

                    return _react2['default'].createElement(_input2['default'], { key: id, value: value, addonBefore: name,
                        onChange: function onChange(e) {
                            _this3.handleChange(e.target.value, index);
                        } });
                })
            );
        }
    }]);
    return MultiInput;
}(_react.Component);