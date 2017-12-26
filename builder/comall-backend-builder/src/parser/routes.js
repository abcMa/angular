import * as _ from 'lodash';

import { Components } from './components';


let routerConfig;
let routes;

export class Routes {
    static init(config) {
        routerConfig = config;
        routes = parseRoutesConfig(config);
    }

    static register(route) {

    }

    static getRouterConfig() {
        return routerConfig;
    }

    static getRoutes() {
        return routes;
    }
}

// 路由配置解析器
// 纯函数
export function parseRoutesConfig(config) {
    const route = {
        component: Components.get(config.component),
        breadcrumbName: config.breadcrumbName
    };

    // 处理路由路径
    if (config.path) {
        route.path = config.path;
    }

    // 处理子路由配置
    if (_.isArray(config.routers)) {
        route.childRoutes = _.map(
            config.routers,
            ( childConfig ) => parseRoutesConfig(childConfig)
        );
    }

    // 处理默认的子组件
    if (typeof config.index === 'string') {
        let index = _.find(route.childRoutes, {path: config.index});
        if (index) {
            route.indexRoute = {
                component: index.component
            };
        }
    }

    return route;
}
