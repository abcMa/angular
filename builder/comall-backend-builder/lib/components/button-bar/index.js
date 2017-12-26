'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ButtonBar = undefined;

var _css = require('antd/lib/button/style/css');

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

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

var _dynamicRenderer = require('../dynamic-renderer');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var ButtonBar = exports.ButtonBar = function (_Component) {
    (0, _inherits3['default'])(ButtonBar, _Component);

    function ButtonBar() {
        (0, _classCallCheck3['default'])(this, ButtonBar);
        return (0, _possibleConstructorReturn3['default'])(this, (ButtonBar.__proto__ || Object.getPrototypeOf(ButtonBar)).apply(this, arguments));
    }

    (0, _createClass3['default'])(ButtonBar, [{
        key: 'render',
        value: function render() {
            var _props = this.props,
                className = _props.className,
                style = _props.style;


            return _react2['default'].createElement(
                _button2['default'].Group,
                { className: className, style: style },
                this.renderButtonBarItems()
            );
        }
    }, {
        key: 'renderButtonBarItems',
        value: function renderButtonBarItems() {
            return this.props.buttons.map(function (itemConfig, index) {
                var ButtonBarItem = _dynamicRenderer.dynamicRenderer.createDynamicComponent(itemConfig);

                return _react2['default'].createElement(ButtonBarItem, { key: index });
            });
        }
    }]);
    return ButtonBar;
}(_react.Component);