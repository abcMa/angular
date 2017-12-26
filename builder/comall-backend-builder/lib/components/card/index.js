'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Card = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _css = require('antd/lib/card/style/css');

var _card = require('antd/lib/card');

var _card2 = _interopRequireDefault(_card);

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

var _parser = require('../../parser');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var Card = exports.Card = function (_Component) {
    (0, _inherits3['default'])(Card, _Component);

    function Card(props) {
        (0, _classCallCheck3['default'])(this, Card);

        var _this = (0, _possibleConstructorReturn3['default'])(this, (Card.__proto__ || Object.getPrototypeOf(Card)).call(this, props));

        _this.handleClick = _this.handleClick.bind(_this);
        return _this;
    }

    /**
     * 处理按钮的点击事件
     */


    (0, _createClass3['default'])(Card, [{
        key: 'handleClick',
        value: function handleClick(event) {
            if (this.props.onClick) {
                this.props.onClick(event);
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _props = this.props,
                title = _props.title,
                style = _props.style,
                className = _props.className,
                bordered = _props.bordered,
                loading = _props.loading,
                bodyStyle = _props.bodyStyle;


            var props = { title: title, style: style, className: className, bordered: bordered, loading: loading, bodyStyle: bodyStyle, onClick: this.handleClick };

            return _react2['default'].createElement(
                _card2['default'],
                props,
                this.renderContent()
            );
        }
    }, {
        key: 'renderContent',
        value: function renderContent() {
            var _props2 = this.props,
                content = _props2.content,
                entity = _props2.entity,
                entities = _props2.entities,
                routes = _props2.routes,
                params = _props2.params;

            var props = (0, _extends3['default'])({ entity: entity, entities: entities, routes: routes, params: params }, content);
            delete props.component;

            var component = _parser.parser.getComponent(content.component);

            return (0, _react.createElement)(component, props);
        }
    }]);
    return Card;
}(_react.Component);