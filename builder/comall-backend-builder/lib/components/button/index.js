'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Button = undefined;

var _css = require('antd/lib/tooltip/style/css');

var _tooltip = require('antd/lib/tooltip');

var _tooltip2 = _interopRequireDefault(_tooltip);

var _css2 = require('antd/lib/button/style/css');

var _button = require('antd/lib/button');

var _button2 = _interopRequireDefault(_button);

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

var _services = require('../../services');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var Button = exports.Button = function (_Component) {
    (0, _inherits3['default'])(Button, _Component);

    function Button(props) {
        (0, _classCallCheck3['default'])(this, Button);

        var _this = (0, _possibleConstructorReturn3['default'])(this, (Button.__proto__ || Object.getPrototypeOf(Button)).call(this, props));

        _this.handleClick = _this.handleClick.bind(_this);
        return _this;
    }

    /**
     * 处理按钮的点击事件
     */


    (0, _createClass3['default'])(Button, [{
        key: 'handleClick',
        value: function handleClick(event) {
            var onClick = this.props.onClick;


            if (onClick) {
                onClick(event);
            } else {
                (0, _services.behaviorHandle)(this.props);
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _props = this.props,
                className = _props.className,
                style = _props.style,
                text = _props.text,
                type = _props.type,
                htmlType = _props.htmlType,
                children = _props.children,
                icon = _props.icon,
                shape = _props.shape,
                disabled = _props.disabled,
                size = _props.size,
                tooltip = _props.tooltip,
                loading = _props.loading;


            var btnStyle = style;

            var buttonProps = {
                type: type,
                htmlType: htmlType,
                icon: icon,
                shape: shape,
                className: className,
                style: btnStyle,
                disabled: disabled,
                size: size,
                loading: loading,

                onClick: this.handleClick
            };

            var button = _react2['default'].createElement(
                _button2['default'],
                buttonProps,
                text || children
            );

            return tooltip ? _react2['default'].createElement(
                _tooltip2['default'],
                { title: tooltip },
                button
            ) : button;
        }
    }]);
    return Button;
}(_react.Component);