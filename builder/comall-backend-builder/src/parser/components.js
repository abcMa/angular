import { DynamicComponentFactory } from './dynamic-component-factory';

/**
 * 存放所有已注册的组件
 */
const COMPONENTS = new Map();

export class Components {
    /**
     * 注册组件
     * @param {string} name - 组件名称
     * @param {Component|Object} component - 组件类
     */
    static register(name, component) {
        if (COMPONENTS.has(name)) {
            throw new Error(`Component ${name} is registered.`);
        }

        switch (typeof component) {
            case 'object':
                component = DynamicComponentFactory.create(name, component);
                break;
            case 'function':
                component.displayName = '#' + (component.displayName || component.name);
                break;
            default:
                // Not Default
        }

        COMPONENTS.set(name, component);
    }

    /**
     * 基于名称获取对应的组件类
     * @param {string} name - 组件注册名称
     * @return {Component} 对应的组件类
     */
    static get(name) {
        if (!COMPONENTS.has(name)) {
            throw new Error(`Component ${name} not found.`);
        }
        return COMPONENTS.get(name);
    }
}
