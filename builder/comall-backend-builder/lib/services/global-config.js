'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.globalConfig = undefined;

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var GLOBAL_CONFIG = {
    api: {
        root: '',
        token: '',
        key: ''
    },
    components: {},
    format: {
        date: 'YYYY-MM-DD',
        month: 'YYYY-MM',
        time: 'hh:mm:ss',
        dateTime: 'YYYY-MM-DD hh:mm:ss'
    }
};

var globalConfig = exports.globalConfig = {
    /**
     * 根据路径获取配置值
     * @param {string} path 属性路径
     * @returns 配置值
     */
    get: function get(path) {
        return _.get(GLOBAL_CONFIG, path);
    },


    /**
     * 根据路径设置配置值
     * @param {string} path 属性路径
     * @param {*} value 配置值
     */
    set: function set(path, value) {
        _.set(GLOBAL_CONFIG, path, value);
    }
};