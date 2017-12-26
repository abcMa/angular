'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.parser = undefined;

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

var _entities = require('./entities');

var _components = require('./components');

var _routes = require('./routes');

var _components2 = require('../components');

var components = _interopRequireWildcard(_components2);

var _containers = require('../containers');

var containers = _interopRequireWildcard(_containers);

var _services = require('../services');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var parser = exports.parser = {
    parse: parse,
    registerComponent: _components.Components.register,
    getComponent: _components.Components.get,
    registerEntity: _entities.Entities.register,
    getEntity: _entities.Entities.get,
    getRouterConfig: _routes.Routes.getRouterConfig,
    getRoutes: _routes.Routes.getRoutes
};

/**
 * 配置解析
 */
function parse(config) {
    _services.globalConfig.set('api.root', config.apiRoot);

    _.forEach(config.entities, function (desc, name) {
        _entities.Entities.register(name, desc);
    });

    _.forEach(config.components, function (desc, name) {
        _components.Components.register(name, desc);
    });

    _routes.Routes.init(_services.privilege.convertRouter(config.router));
}

// 注册静态组件
_.forEach(components, function (component, name) {
    _components.Components.register(name, component);
});

// 注册容器
_.forEach(containers, function (container, name) {
    _components.Components.register(name, container);
});