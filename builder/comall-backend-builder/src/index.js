import React from 'react';
import { Router } from 'react-router';
import { Provider } from 'react-redux';

import { navigation } from './services';
import { store } from './store';
import { parser } from './parser';
import { registerType } from './type';
import { registerLoader } from './loaders';
import './index.scss';

export const builder = {
    /**
     * 初始化配置
     * @param {object} config
     */
    init(config) {
        navigation.init(store);
        parser.parse(config);
    },

    /**
     * 注册组件
     * @param {string} name 组件名称
     * @param {Component} component 组件类定义
     */
    registerComponent: parser.registerComponent,

    /**
     * 注册一个实体
     * @param {string} name 实体名称
     * @param {object} desc 实体的描述信息
     */
    registerEntity: parser.registerEntity,

    /**
     * 注册新类型
     * @param {string} name 类型名称
     * @param {Type} type 类型实例
     */
    registerType,

    /**
     * 注册新的加载器
     * @param {string} apiPath 加载器处理的 url，不包含 /loader/ 前缀
     * @param {object} loader 加载器定义
     */
    registerLoader,

    /**
     * 获取 redux store
     */
    getStore() {
        return store;
    },

    /**
     * 获取历史
     */
    getHistory: navigation.getHistory,

    /**
     * 获取路由配置
     */
    getRoutes: parser.getRoutes,

    /**
     * 获取渲染组件
     */
    component() {
        return <Provider store={builder.getStore()}>
            <Router history={builder.getHistory()} routes={builder.getRoutes()} />
        </Provider>;
    }
};

export { globalConfig } from './services';