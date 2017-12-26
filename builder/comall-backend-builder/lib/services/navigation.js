'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.navigation = undefined;

var _reactRouter = require('react-router');

var _reactRouterRedux = require('react-router-redux');

var history = void 0;

var navigation = exports.navigation = {
    /**
     * 初始化 history
     * @param {object} store - 绑定的 Redux store
     */
    init: function init(store) {
        history = (0, _reactRouterRedux.syncHistoryWithStore)(_reactRouter.hashHistory, store);
    },


    /**
     * 获取 history 对象
     */
    getHistory: function getHistory() {
        return history;
    },


    /**
     * 路由跳转
     * @param {string} path - 需跳转路由地址
     */
    goto: function goto(path) {
        history.push(path);
    },


    /**
     * 路由返回
     */
    goBack: function goBack() {
        history.goBack();
    },


    /**
     * 获取当前路由 pathname
     */
    getPathname: function getPathname() {
        return history.getCurrentLocation().pathname;
    }
};