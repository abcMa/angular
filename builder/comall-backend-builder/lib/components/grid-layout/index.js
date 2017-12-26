'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.GridLayout = undefined;

var _css = require('antd/lib/col/style/css');

var _col = require('antd/lib/col');

var _col2 = _interopRequireDefault(_col);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _css2 = require('antd/lib/row/style/css');

var _row = require('antd/lib/row');

var _row2 = _interopRequireDefault(_row);

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

var GridLayout = exports.GridLayout = function (_Component) {
    (0, _inherits3['default'])(GridLayout, _Component);

    function GridLayout() {
        (0, _classCallCheck3['default'])(this, GridLayout);
        return (0, _possibleConstructorReturn3['default'])(this, (GridLayout.__proto__ || Object.getPrototypeOf(GridLayout)).apply(this, arguments));
    }

    (0, _createClass3['default'])(GridLayout, [{
        key: 'render',
        value: function render() {
            var _props = this.props,
                className = _props.className,
                style = _props.style;


            var rowProps = {
                className: className, style: style
            };

            return _react2['default'].createElement(
                _row2['default'],
                rowProps,
                this.renderItems()
            );
        }

        /**
         * 渲染 col
         */

    }, {
        key: 'renderItems',
        value: function renderItems() {
            var _this2 = this;

            return this.props.items.map(function (itemDesc, index) {
                var ItemComponent = _parser.parser.getComponent(itemDesc.component);
                var props = _this2.getItemProps(itemDesc, index);
                var children = _this2.props.children;
                var span = itemDesc.span;


                var colProps = {
                    span: span
                };

                return _react2['default'].createElement(
                    _col2['default'],
                    (0, _extends3['default'])({}, colProps, { key: index }),
                    (0, _react.createElement)(ItemComponent, props, children)
                );
            });
        }

        /**
         * 生成 col 的 props 对象
         */

    }, {
        key: 'getItemProps',
        value: function getItemProps(itemDesc, key) {
            var _props2 = this.props,
                entity = _props2.entity,
                entities = _props2.entities,
                routes = _props2.routes,
                params = _props2.params;

            var props = (0, _extends3['default'])({ key: key, entity: entity, entities: entities, routes: routes, params: params }, itemDesc);

            return props;
        }
    }]);
    return GridLayout;
}(_react.Component);