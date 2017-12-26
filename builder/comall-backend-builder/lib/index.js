'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.globalConfig = exports.builder = undefined;

var _services = require('./services');

Object.defineProperty(exports, 'globalConfig', {
    enumerable: true,
    get: function get() {
        return _services.globalConfig;
    }
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

var _reactRedux = require('react-redux');

var _store = require('./store');

var _parser = require('./parser');

var _type = require('./type');

var _loaders = require('./loaders');

require('./index.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var builder = exports.builder = {
    /**
     * 初始化配置
     * @param {object} config
     */
    init: function init(config) {
        _services.navigation.init(_store.store);
        _parser.parser.parse(config);
    },


    /**
     * 注册组件
     * @param {string} name 组件名称
     * @param {Component} component 组件类定义
     */
    registerComponent: _parser.parser.registerComponent,

    /**
     * 注册一个实体
     * @param {string} name 实体名称
     * @param {object} desc 实体的描述信息
     */
    registerEntity: _parser.parser.registerEntity,

    /**
     * 注册新类型
     * @param {string} name 类型名称
     * @param {Type} type 类型实例
     */
    registerType: _type.registerType,

    /**
     * 注册新的加载器
     * @param {string} apiPath 加载器处理的 url，不包含 /loader/ 前缀
     * @param {object} loader 加载器定义
     */
    registerLoader: _loaders.registerLoader,

    /**
     * 获取 redux store
     */
    getStore: function getStore() {
        return _store.store;
    },


    /**
     * 获取历史
     */
    getHistory: _services.navigation.getHistory,

    /**
     * 获取路由配置
     */
    getRoutes: _parser.parser.getRoutes,

    /**
     * 获取渲染组件
     */
    component: function component() {
        return _react2['default'].createElement(
            _reactRedux.Provider,
            { store: builder.getStore() },
            _react2['default'].createElement(_reactRouter.Router, { history: builder.getHistory(), routes: builder.getRoutes() })
        );
    }
};