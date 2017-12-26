'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Tabs = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _css = require('antd/lib/icon/style/css');

var _icon = require('antd/lib/icon');

var _icon2 = _interopRequireDefault(_icon);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _css2 = require('antd/lib/tabs/style/css');

var _tabs = require('antd/lib/tabs');

var _tabs2 = _interopRequireDefault(_tabs);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

var _parser = require('../../parser');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var AntTabPane = _tabs2['default'].TabPane;

var Tabs = exports.Tabs = function (_Component) {
    (0, _inherits3['default'])(Tabs, _Component);

    function Tabs() {
        (0, _classCallCheck3['default'])(this, Tabs);
        return (0, _possibleConstructorReturn3['default'])(this, (Tabs.__proto__ || Object.getPrototypeOf(Tabs)).apply(this, arguments));
    }

    (0, _createClass3['default'])(Tabs, [{
        key: 'render',
        value: function render() {
            var _this2 = this;

            var _props = this.props,
                className = _props.className,
                style = _props.style,
                items = _props.items,
                animated = _props.animated,
                defaultActiveKey = _props.defaultActiveKey,
                size = _props.size,
                tabBarStyle = _props.tabBarStyle,
                tabPosition = _props.tabPosition;

            var props = {
                className: className,
                style: style,
                animated: animated,
                size: size,
                tabBarStyle: tabBarStyle,
                tabPosition: tabPosition
            };

            if (defaultActiveKey) {
                props.defaultActiveKey = defaultActiveKey;
            }

            return _react2['default'].createElement(
                _tabs2['default'],
                props,
                _.map(items, function (item, index) {
                    return _this2.renderItem(item, index);
                })
            );
        }
    }, {
        key: 'renderItem',
        value: function renderItem(item, index) {
            var _props2 = this.props,
                entity = _props2.entity,
                entities = _props2.entities,
                routes = _props2.routes,
                params = _props2.params,
                children = _props2.children;
            var className = item.className,
                style = item.style,
                title = item.title,
                icon = item.icon,
                forceRender = item.forceRender,
                tabParams = item.params,
                content = item.content;

            var itemProps = {
                key: index,
                className: className,
                style: style,
                forceRender: forceRender,
                tab: _react2['default'].createElement(
                    'span',
                    null,
                    icon ? _react2['default'].createElement(_icon2['default'], { type: icon }) : undefined,
                    title
                )
            };
            var ContentComponent = _parser.parser.getComponent(content.component);
            var contentProps = (0, _extends3['default'])({}, content, {
                entity: entity,
                entities: entities,
                routes: routes,
                params: (0, _extends3['default'])({}, params, tabParams)
            });
            delete contentProps.component;

            return _react2['default'].createElement(
                AntTabPane,
                itemProps,
                (0, _react.createElement)(ContentComponent, contentProps, children)
            );
        }
    }]);
    return Tabs;
}(_react.Component);