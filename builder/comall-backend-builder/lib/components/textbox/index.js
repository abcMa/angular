'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Textbox = undefined;

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

var _css = require('antd/lib/input/style/css');

var _input = require('antd/lib/input');

var _input2 = _interopRequireDefault(_input);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _componentProps = require('../component-props');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var AntTextArea = _input2['default'].TextArea;

/**
 * 文本输入框
 */

var Textbox = exports.Textbox = function (_Component) {
    (0, _inherits3['default'])(Textbox, _Component);

    function Textbox(props) {
        (0, _classCallCheck3['default'])(this, Textbox);

        var _this = (0, _possibleConstructorReturn3['default'])(this, (Textbox.__proto__ || Object.getPrototypeOf(Textbox)).call(this, props));

        _this.handleChange = _this.handleChange.bind(_this);
        return _this;
    }

    (0, _createClass3['default'])(Textbox, [{
        key: 'handleChange',
        value: function handleChange(e) {
            var _props = this.props,
                name = _props.name,
                onChange = _props.onChange;
            var value = e.target.value;


            if (onChange) {
                onChange(value, name);
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
                placeholder = _props2.placeholder,
                disabled = _props2.disabled,
                maxLength = _props2.maxLength,
                type = _props2.type,
                autosize = _props2.autosize,
                addonBefore = _props2.addonBefore,
                addonAfter = _props2.addonAfter,
                prefix = _props2.prefix,
                suffix = _props2.suffix;


            var inputProps = {
                // basicPropTypes
                className: className,
                style: style,

                // controlPropTypes
                name: name,
                value: value,
                placeholder: placeholder,
                disabled: disabled,
                maxLength: maxLength,
                onChange: this.handleChange
            };

            if (type === 'textarea') {
                inputProps.autosize = autosize;
                return _react2['default'].createElement(AntTextArea, inputProps);
            } else {
                (0, _extends3['default'])(inputProps, {
                    addonBefore: addonBefore,
                    addonAfter: addonAfter,
                    prefix: prefix,
                    suffix: suffix
                });
                return _react2['default'].createElement(_input2['default'], inputProps);
            }
        }
    }]);
    return Textbox;
}(_react.Component);

Textbox.defaultProps = {
    type: 'text'
};
Textbox.propTypes = (0, _extends3['default'])({}, _componentProps.basicPropTypes, _componentProps.controlPropTypes, {

    // 文本框类型
    type: _propTypes2['default'].oneOf(['text', 'password', 'textarea']),

    // 自适应内容高度，只对 type="textarea" 有效，可设置为 true|false 或对象：{ minRows: 2, maxRows: 6 }
    autosize: _propTypes2['default'].oneOfType([_propTypes2['default'].bool, _propTypes2['default'].shape({
        minRows: _propTypes2['default'].number,
        maxRows: _propTypes2['default'].number
    })])
});