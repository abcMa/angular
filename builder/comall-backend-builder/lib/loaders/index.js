'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.registerLoader = registerLoader;
exports.load = load;

var _services = require('../services');

// 存放所有加载器
var LOADERS = new Map();

/**
 * 注册新的加载器
 * 加载器结构为 { get, post, put, delete }，当 method 未定义时视为不支持
 * @param {string} apiPath 加载器处理的 url，不包含 /loader/ 前缀
 * @param {object} loader 加载器定义
 */
function registerLoader(apiPath, loader) {
    if (LOADERS.has(apiPath)) {
        throw new Error('Loader for url ' + apiPath + ' is registered.');
    }
    LOADERS.set(apiPath, loader);
}

/**
 * 数据加载器入口，通过 apiPath 区分是否使用特定加载器
 * 需要使用加载器的 apiPath 前缀固定为 /loader/
 * 不使用特定加载器或加载器未提供对应 method 时使用 api 默认行为加载
 * @param {string} method 请求类型
 * @param {object} data 请求数据，结构为 { apiRoot, apiPath, params, paramsFilter  }
 * @param {object} config api 配置信息
 */
function load(method, data, config) {
    if (/^\/loader\/(.+)\/:id$/i.test(data.apiPath) || /^\/loader\/(.+)$/i.test(data.apiPath)) {
        var apiPath = '/' + RegExp.$1;
        var loader = LOADERS.get(apiPath);
        data.apiPath = data.apiPath.substring(7);

        if (loader && loader[method]) {
            return loader[method](data, config);
        } else {
            return _services.api[method](data, config);
        }
    } else {
        return _services.api[method](data, config);
    }
}