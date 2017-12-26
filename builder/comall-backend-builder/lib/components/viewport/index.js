'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Viewport = undefined;

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

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var Viewport = exports.Viewport = function (_Component) {
    (0, _inherits3['default'])(Viewport, _Component);

    function Viewport() {
        (0, _classCallCheck3['default'])(this, Viewport);
        return (0, _possibleConstructorReturn3['default'])(this, (Viewport.__proto__ || Object.getPrototypeOf(Viewport)).apply(this, arguments));
    }

    (0, _createClass3['default'])(Viewport, [{
        key: 'render',
        value: function render() {
            var _props = this.props,
                entity = _props.entity,
                children = _props.children,
                className = _props.className,
                style = _props.style;


            var extendedChildren = void 0;

            // 需将当前实体向下传递
            if (entity) {
                extendedChildren = _react2['default'].cloneElement(children, {
                    entity: entity
                });
            } else {
                extendedChildren = children;
            }

            return _react2['default'].createElement(
                'div',
                { className: (0, _classnames2['default'])('viewport', className), style: style },
                extendedChildren
            );
        }
    }]);
    return Viewport;
}(_react.Component);