'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Nav = undefined;

var _css = require('antd/lib/menu/style/css');

var _menu = require('antd/lib/menu');

var _menu2 = _interopRequireDefault(_menu);

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

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

var _image = require('../image');

var _icon = require('../icon');

var _text = require('../text');

var _parser = require('../../parser');

var _services = require('../../services');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var Nav = exports.Nav = function (_Component) {
    (0, _inherits3['default'])(Nav, _Component);

    function Nav(props) {
        (0, _classCallCheck3['default'])(this, Nav);

        var _this = (0, _possibleConstructorReturn3['default'])(this, (Nav.__proto__ || Object.getPrototypeOf(Nav)).call(this, props));

        _this.defaultOpenKeys = [];
        _this.handleClick = _this.handleClick.bind(_this);
        return _this;
    }

    /**
     * 根据当前路由来确定当前需要展开的submenu和active状态的menuItem
     */


    (0, _createClass3['default'])(Nav, [{
        key: 'getSelectedKeys',
        value: function getSelectedKeys() {
            var _this2 = this;

            var _props = this.props,
                items = _props.items,
                mode = _props.mode;

            var selectedKeys = void 0;

            _.forEach(items, function (item) {
                if (item.type === 'menu') {
                    _.forEach(item.items, function (subMenuItem) {
                        if (_this2.isMatched(subMenuItem.route)) {
                            selectedKeys = subMenuItem.key.toString();
                            // inline 模式下设置默认展开的子菜单
                            if (mode === 'inline') {
                                _this2.defaultOpenKeys = [item.key.toString()];
                            }
                            return false;
                        }
                    });
                } else {
                    if (_this2.isMatched(item.route)) {
                        selectedKeys = item.key.toString();
                        return false;
                    }
                }
            });

            return selectedKeys;
        }

        /**
         * 用来匹配路由是否处于激活状态
         * @param {string} pathStr - 需要匹配的路由
         */

    }, {
        key: 'isMatched',
        value: function isMatched(pathStr) {
            var pathname = _services.navigation.getPathname();
            if (pathname === '/') {
                pathname = _parser.parser.getRouterConfig().index;
            }
            return pathname.indexOf(pathStr) > -1;
        }

        /**
         * 点击 menuItem 时调用，可获得当前选中的menuItem，用来展示当前active状态的menuItem
         */

    }, {
        key: 'handleClick',
        value: function handleClick(menuItem) {
            var item = menuItem.item;
            // 路由跳转

            (0, _services.behaviorHandle)(item.props);
        }
    }, {
        key: 'render',
        value: function render() {
            var selectedKeys = this.getSelectedKeys();

            var _props2 = this.props,
                className = _props2.className,
                style = _props2.style,
                _props2$mode = _props2.mode,
                mode = _props2$mode === undefined ? 'inline' : _props2$mode,
                _props2$theme = _props2.theme,
                theme = _props2$theme === undefined ? 'light' : _props2$theme,
                defaultSelectedKeys = _props2.defaultSelectedKeys;


            var props = {
                className: className,
                style: style,
                mode: mode,
                theme: theme,
                defaultSelectedKeys: [defaultSelectedKeys],
                defaultOpenKeys: this.defaultOpenKeys
            };

            if (selectedKeys) {
                props.selectedKeys = [selectedKeys];
            } else {
                props.selectedKeys = [];
            }

            return _react2['default'].createElement(
                _menu2['default'],
                (0, _extends3['default'])({}, props, { onClick: this.handleClick }),
                this.renderSubMenu()
            );
        }
    }, {
        key: 'renderSubMenu',
        value: function renderSubMenu() {
            var _this3 = this;

            var items = this.props.items;


            return items.map(function (item) {

                if (item.privilege) {
                    var _item$privilege = item.privilege,
                        path = _item$privilege.path,
                        level = _item$privilege.level;

                    if (!_services.privilege.check(path, level)) {
                        return undefined;
                    }
                }

                if (item.type === 'menu') {
                    return _react2['default'].createElement(
                        _menu2['default'].SubMenu,
                        { key: item.key, title: _this3.renderItem(item) },
                        item.items.map(function (menuItem) {
                            return _this3.renderMenuItem(menuItem);
                        })
                    );
                } else {
                    return _this3.renderMenuItem(item);
                }
            });
        }
    }, {
        key: 'renderMenuItem',
        value: function renderMenuItem(item) {
            if (item.privilege) {
                var _item$privilege2 = item.privilege,
                    path = _item$privilege2.path,
                    level = _item$privilege2.level;

                if (!_services.privilege.check(path, level)) {
                    return undefined;
                }
            }

            return _react2['default'].createElement(
                _menu2['default'].Item,
                { key: item.key, route: item.route, action: item.action },
                this.renderItem(item)
            );
        }
    }, {
        key: 'renderItem',
        value: function renderItem(item) {
            var components = [];
            if (item.imageurl) {
                components.push(_react2['default'].createElement(_image.Image, { key: 'image', className: 'img', text: item.title, imageurl: item.imageurl }));
            }
            if (item.icon) {
                components.push(_react2['default'].createElement(_icon.Icon, { key: 'icon', type: item.icon }));
            }
            if (item.component) {
                components.push(this.renderComponent(item));
            }
            components.push(_react2['default'].createElement(_text.Text, { key: 'text', text: item.title }));
            return components;
        }
    }, {
        key: 'renderComponent',
        value: function renderComponent(item) {
            if (item.component) {
                var _props3 = this.props,
                    entity = _props3.entity,
                    routes = _props3.routes,
                    params = _props3.params;

                var props = (0, _extends3['default'])({ entity: entity, routes: routes, params: params }, item.component);
                delete props.name;
                return (0, _react.createElement)(_parser.parser.getComponent(item.component.name), props);
            }
        }
    }]);
    return Nav;
}(_react.Component);