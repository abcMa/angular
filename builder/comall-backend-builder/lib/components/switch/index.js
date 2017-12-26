'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Switch = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _css = require('antd/lib/switch/style/css');

var _switch = require('antd/lib/switch');

var _switch2 = _interopRequireDefault(_switch);

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

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _componentProps = require('../component-props');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var Switch = exports.Switch = function (_Component) {
    (0, _inherits3['default'])(Switch, _Component);

    function Switch(props) {
        (0, _classCallCheck3['default'])(this, Switch);

        var _this = (0, _possibleConstructorReturn3['default'])(this, (Switch.__proto__ || Object.getPrototypeOf(Switch)).call(this, props));

        _this.handleChange = _this.handleChange.bind(_this);
        return _this;
    }

    (0, _createClass3['default'])(Switch, [{
        key: 'handleChange',
        value: function handleChange(checked) {
            var _props = this.props,
                name = _props.name,
                onChange = _props.onChange;


            if (onChange) {
                onChange(checked, name);
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _props2 = this.props,
                className = _props2.className,
                style = _props2.style,
                name = _props2.name,
                value = _props2.value,
                disabled = _props2.disabled,
                checkedChildren = _props2.checkedChildren,
                unCheckedChildren = _props2.unCheckedChildren;


            var switchProps = {
                // basicPropTypes
                className: className,
                style: style,

                // controlPropTypes
                name: name,
                checked: value,
                disabled: disabled,
                onChange: this.handleChange,

                // custom
                checkedChildren: checkedChildren,
                unCheckedChildren: unCheckedChildren
            };

            return _react2['default'].createElement(_switch2['default'], switchProps);
        }
    }]);
    return Switch;
}(_react.Component);

Switch.propTypes = (0, _extends3['default'])({}, _componentProps.basicPropTypes, _componentProps.controlPropTypes, {

    value: _propTypes2['default'].bool
});