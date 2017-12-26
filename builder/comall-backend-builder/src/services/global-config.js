import * as _ from 'lodash';

const GLOBAL_CONFIG = {
    api: {
        root: '',
        token: '',
        key: ''
    },
    components: {

    },
    format: {
        date: 'YYYY-MM-DD',
        month: 'YYYY-MM',
        time: 'hh:mm:ss',
        dateTime: 'YYYY-MM-DD hh:mm:ss'
    }
};

export const globalConfig = {
    /**
     * 根据路径获取配置值
     * @param {string} path 属性路径
     * @returns 配置值
     */
    get(path) {
        return _.get(GLOBAL_CONFIG, path);
    },

    /**
     * 根据路径设置配置值
     * @param {string} path 属性路径
     * @param {*} value 配置值
     */
    set(path, value) {
        _.set(GLOBAL_CONFIG, path, value);
    }
};