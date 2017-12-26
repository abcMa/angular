'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Routes = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

exports.parseRoutesConfig = parseRoutesConfig;

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

var _components = require('./components');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var routerConfig = void 0;
var routes = void 0;

var Routes = exports.Routes = function () {
    function Routes() {
        (0, _classCallCheck3['default'])(this, Routes);
    }

    (0, _createClass3['default'])(Routes, null, [{
        key: 'init',
        value: function init(config) {
            routerConfig = config;
            routes = parseRoutesConfig(config);
        }
    }, {
        key: 'register',
        value: function register(route) {}
    }, {
        key: 'getRouterConfig',
        value: function getRouterConfig() {
            return routerConfig;
        }
    }, {
        key: 'getRoutes',
        value: function getRoutes() {
            return routes;
        }
    }]);
    return Routes;
}();

// 路由配置解析器
// 纯函数


function parseRoutesConfig(config) {
    var route = {
        component: _components.Components.get(config.component),
        breadcrumbName: config.breadcrumbName
    };

    // 处理路由路径
    if (config.path) {
        route.path = config.path;
    }

    // 处理子路由配置
    if (_.isArray(config.routers)) {
        route.childRoutes = _.map(config.routers, function (childConfig) {
            return parseRoutesConfig(childConfig);
        });
    }

    // 处理默认的子组件
    if (typeof config.index === 'string') {
        var index = _.find(route.childRoutes, { path: config.index });
        if (index) {
            route.indexRoute = {
                component: index.component
            };
        }
    }

    return route;
}