import * as _ from 'lodash';

import { Entities } from './entities';
import { Components } from './components';
import { Routes } from './routes';

import * as components from '../components';
import * as containers from '../containers';
import { privilege, globalConfig } from '../services';

export const parser = {
    parse,
    registerComponent: Components.register,
    getComponent: Components.get,
    registerEntity: Entities.register,
    getEntity: Entities.get,
    getRouterConfig: Routes.getRouterConfig,
    getRoutes: Routes.getRoutes
};

/**
 * 配置解析
 */
function parse(config) {
    globalConfig.set('api.root', config.apiRoot);

    _.forEach(config.entities, (desc, name) => {
        Entities.register(name, desc);
    });

    _.forEach(config.components, (desc, name) => {
        Components.register(name, desc);
    });

    Routes.init(privilege.convertRouter(config.router));
}

// 注册静态组件
_.forEach(components, (component, name) => {
    Components.register(name, component);
});

// 注册容器
_.forEach(containers, (container, name) => {
    Components.register(name, container);
});