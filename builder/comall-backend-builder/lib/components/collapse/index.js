'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Collapse = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _css = require('antd/lib/collapse/style/css');

var _collapse = require('antd/lib/collapse');

var _collapse2 = _interopRequireDefault(_collapse);

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

var Collapse = exports.Collapse = function (_Component) {
    (0, _inherits3['default'])(Collapse, _Component);

    function Collapse() {
        (0, _classCallCheck3['default'])(this, Collapse);
        return (0, _possibleConstructorReturn3['default'])(this, (Collapse.__proto__ || Object.getPrototypeOf(Collapse)).apply(this, arguments));
    }

    (0, _createClass3['default'])(Collapse, [{
        key: 'render',
        value: function render() {
            var _this2 = this;

            var _props = this.props,
                items = _props.items,
                style = _props.style,
                className = _props.className,
                activeKey = _props.activeKey,
                defaultActiveKey = _props.defaultActiveKey;


            var props = {
                style: style,
                className: className,
                defaultActiveKey: defaultActiveKey
            };

            if (activeKey) {
                props.activeKey = activeKey;
            }

            return _react2['default'].createElement(
                _collapse2['default'],
                props,
                items.map(function (item, index) {
                    return _react2['default'].createElement(
                        _collapse2['default'].Panel,
                        { key: index, header: item.name },
                        _this2.renderPanels(item)
                    );
                })
            );
        }
    }, {
        key: 'renderPanels',
        value: function renderPanels(panel) {
            var _props2 = this.props,
                entity = _props2.entity,
                entities = _props2.entities,
                routes = _props2.routes,
                params = _props2.params,
                children = _props2.children;

            var content = panel.content;
            var props = (0, _extends3['default'])({ entity: entity, entities: entities, routes: routes, params: params }, content);
            delete props.component;

            var component = _parser.parser.getComponent(content.component);

            return (0, _react.createElement)(component, props, children);
        }
    }]);
    return Collapse;
}(_react.Component);