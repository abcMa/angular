'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.FlexLayout = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

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

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

var _parser = require('../../parser');

require('./index.scss');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var FlexLayout = exports.FlexLayout = function (_Component) {
    (0, _inherits3['default'])(FlexLayout, _Component);

    function FlexLayout() {
        (0, _classCallCheck3['default'])(this, FlexLayout);

        var _this = (0, _possibleConstructorReturn3['default'])(this, (FlexLayout.__proto__ || Object.getPrototypeOf(FlexLayout)).call(this));

        _this.styleMap = {};
        return _this;
    }

    (0, _createClass3['default'])(FlexLayout, [{
        key: 'render',
        value: function render() {
            var _props = this.props,
                direction = _props.direction,
                align = _props.align,
                justify = _props.justify,
                className = _props.className,
                style = _props.style;


            className = (0, _classnames2['default'])('layout', 'flex-layout', (0, _defineProperty3['default'])({}, 'direction-' + direction, !!direction), (0, _defineProperty3['default'])({}, 'align-' + align, !!align), (0, _defineProperty3['default'])({}, 'justify-' + justify, !!justify), className);

            return _react2['default'].createElement(
                'div',
                { className: className, style: style },
                this.renderItems()
            );
        }

        /**
         * 渲染 flex item
         */

    }, {
        key: 'renderItems',
        value: function renderItems() {
            var _this2 = this;

            return this.props.items.map(function (itemDesc, index) {
                var ItemComponent = _parser.parser.getComponent(itemDesc.component);
                var props = _this2.getItemProps(itemDesc, index);
                var children = _this2.props.children;


                return (0, _react.createElement)(ItemComponent, props, children);
            });
        }

        /**
         * 生成 flex item 的 props 对象
         * @param {object} itemDesc - item 的配置对象
         * @param {any} key - item 的 key 值
         * @return {object} - 该 item 的 props
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

            delete props.component;
            props.className = (0, _classnames2['default'])('flex-layout-item', props.className);

            // 处理 flex item 的样式
            if (props.flex) {
                var mapKey = JSON.stringify(itemDesc);
                var cachedStyle = this.styleMap[mapKey];
                var style = _.assign({
                    flex: props.flex,
                    msFlex: props.flex
                }, props.style);

                if (!_.isEqual(style, cachedStyle)) {
                    cachedStyle = style;
                    this.styleMap[mapKey] = cachedStyle;
                }

                props.style = cachedStyle;
                delete props.flex;
            }

            return props;
        }
    }]);
    return FlexLayout;
}(_react.Component);