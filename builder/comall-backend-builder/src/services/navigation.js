import { hashHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

let history;

export const navigation = {
    /**
     * 初始化 history
     * @param {object} store - 绑定的 Redux store
     */
    init(store) {
        history = syncHistoryWithStore(hashHistory, store);
    },

    /**
     * 获取 history 对象
     */
    getHistory() {
        return history;
    },

    /**
     * 路由跳转
     * @param {string} path - 需跳转路由地址
     */
    goto(path) {
        history.push(path);
    },

    /**
     * 路由返回
     */
    goBack() {
        history.goBack();
    },

    /**
     * 获取当前路由 pathname
     */
    getPathname() {
        return history.getCurrentLocation().pathname;
    }
};
