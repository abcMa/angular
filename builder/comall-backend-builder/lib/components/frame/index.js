'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Frame = undefined;

var _css = require('antd/lib/breadcrumb/style/css');

var _breadcrumb = require('antd/lib/breadcrumb');

var _breadcrumb2 = _interopRequireDefault(_breadcrumb);

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

var _css2 = require('antd/lib/layout/style/css');

var _layout = require('antd/lib/layout');

var _layout2 = _interopRequireDefault(_layout);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _flexLayout = require('../flex-layout');

var _parser = require('../../parser');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var Header = _layout2['default'].Header,
    Footer = _layout2['default'].Footer,
    Sider = _layout2['default'].Sider,
    Content = _layout2['default'].Content;


var DEFAULT_PROPS = {
    'side-nav': {
        sider: {
            collapsible: true
        },
        breadcrumb: {
            style: {
                padding: '0 16px',
                lineHeight: '50px',
                backgroundColor: '#fff'
            }
        },
        content: {
            style: {
                padding: '16px 16px 0'
            }
        },
        footer: {
            style: {
                textAlign: 'center'
            }
        }
    },

    'top-nav': {
        header: {
            style: {
                position: 'fixed',
                left: 0,
                right: 0,
                zIndex: 10000,
                height: 48,
                backgroundColor: '#fff'
            }
        },
        breadcrumb: {
            style: {
                padding: '56px 50px 8px'
            }
        },
        content: {
            style: {
                padding: '0 58px'
            }
        },
        footer: {
            style: {
                textAlign: 'center'
            }
        }
    }
};

var Frame = exports.Frame = function (_Component) {
    (0, _inherits3['default'])(Frame, _Component);

    function Frame() {
        (0, _classCallCheck3['default'])(this, Frame);
        return (0, _possibleConstructorReturn3['default'])(this, (Frame.__proto__ || Object.getPrototypeOf(Frame)).apply(this, arguments));
    }

    (0, _createClass3['default'])(Frame, [{
        key: 'getItemProps',


        /**
         * 生成 item 的 props 对象
         * @param {object} itemDesc - item 的配置对象
         * @param {any} key - item 的 key 值
         * @param {object} props - item 的 props
         * @return {object} - 该 item 的 props
         */
        value: function getItemProps(itemDesc, key, props) {
            var entity = props.entity,
                routes = props.routes,
                params = props.params;

            var itemProps = (0, _extends3['default'])({ key: key, entity: entity, routes: routes, params: params }, itemDesc);

            delete itemProps.component;

            return itemProps;
        }
    }, {
        key: 'renderItems',
        value: function renderItems(props) {
            var _this2 = this;

            if (!props.items) {
                return;
            }
            var children = props.children;

            return props.items.map(function (itemDesc, index) {
                var ItemComponent = _parser.parser.getComponent(itemDesc.component);
                var itemProps = _this2.getItemProps(itemDesc, index, props);

                return (0, _react.createElement)(ItemComponent, itemProps, children);
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var _props = this.props,
                type = _props.type,
                className = _props.className,
                style = _props.style,
                header = _props.header,
                sider = _props.sider,
                breadcrumb = _props.breadcrumb,
                content = _props.content,
                footer = _props.footer,
                routes = _props.routes,
                params = _props.params,
                children = _props.children;


            var headerProps = (0, _extends3['default'])({}, DEFAULT_PROPS[type].header, header, {
                children: children
            });
            delete headerProps.items;

            var siderProps = (0, _extends3['default'])({}, DEFAULT_PROPS[type].sider, sider, {
                children: children
            });
            var siderItems = this.renderItems(siderProps);
            delete siderProps.items;

            var breadcrumbProps = (0, _extends3['default'])({}, DEFAULT_PROPS[type].breadcrumb, breadcrumb, {
                routes: routes,
                params: params,
                children: children
            });

            var contentProps = (0, _extends3['default'])({}, DEFAULT_PROPS[type].content, content, {
                children: children
            });
            var contentItems = this.renderItems(contentProps);
            delete contentProps.items;

            var footerProps = (0, _extends3['default'])({}, DEFAULT_PROPS[type].footer, footer, {
                children: children
            });
            var footerItems = this.renderItems(footerProps);
            delete footerProps.items;

            if (type === 'side-nav') {
                return _react2['default'].createElement(
                    _layout2['default'],
                    { className: className, style: style },
                    _react2['default'].createElement(
                        Sider,
                        siderProps,
                        siderItems
                    ),
                    _react2['default'].createElement(
                        _layout2['default'],
                        null,
                        _react2['default'].createElement(_breadcrumb2['default'], breadcrumbProps),
                        _react2['default'].createElement(
                            Content,
                            contentProps,
                            contentItems
                        ),
                        _react2['default'].createElement(
                            Footer,
                            footerProps,
                            footerItems
                        )
                    )
                );
            }

            if (type === 'top-nav') {

                var headerFlexProps = {
                    direction: 'horizontal',
                    align: 'center',
                    justify: 'space-between',
                    items: header.items,
                    routes: routes,
                    params: params,
                    children: children
                };

                return _react2['default'].createElement(
                    _layout2['default'],
                    { className: className, style: style },
                    _react2['default'].createElement(
                        Header,
                        headerProps,
                        _react2['default'].createElement(_flexLayout.FlexLayout, headerFlexProps)
                    ),
                    _react2['default'].createElement(
                        _layout2['default'],
                        null,
                        _react2['default'].createElement(_breadcrumb2['default'], breadcrumbProps),
                        _react2['default'].createElement(
                            Content,
                            contentProps,
                            contentItems
                        ),
                        _react2['default'].createElement(
                            Footer,
                            footerProps,
                            footerItems
                        )
                    )
                );
            }
        }
    }]);
    return Frame;
}(_react.Component);