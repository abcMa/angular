import request from 'superagent';
import pathToRegexp from 'path-to-regexp';
import * as _ from 'lodash';
import md5 from 'md5';

import { statusCode } from './status-code';
import { uuid } from './uuid';
import { globalConfig } from './global-config';
import { store } from '../store';
import * as actions from '../actions';

export const METHOD_GET = 'get';
export const METHOD_POST = 'post';
export const METHOD_PUT = 'put';
export const METHOD_DELETE = 'delete';

const DEFAULT_METHOD = METHOD_GET;

/**
 * 封装实体的 API 接口调用相关操作
 */
export const api = {
    /**
     * 发送请求
     * @param {object} config - 请求对象
     */
    request(config) {
        let { method = DEFAULT_METHOD, apiRoot, apiPath, params, paramsFilter } = config;
        if (paramsFilter) {
            params = _.reduce(paramsFilter, (result, name) => {
                let value = params[name];
                if (value !== undefined && value !== null) {
                    result[name] = value;
                }
                return result;
            }, {});
        } else {
            params = _.clone(params);
        }

        const path = formatPath(apiRoot, apiPath, params);
        params = formatObjectKeys(params, 'snake');

        let req = request[method](path);

        if (params) {
            switch (method) {
                case METHOD_GET:
                    _.forEach(params, (value, key) => {
                        if (_.isArray(value)) {
                            params[key] = value.join(',');
                        }
                    });
                    req = req.query(params);
                    break;
                case METHOD_DELETE:
                    break;
                default:
                    req = req.send(params);
                    break;
            }
        }

        let signParams;
        if (method === METHOD_GET) {
            signParams = params;
        } else if (method !== METHOD_DELETE) {
            signParams = { body: params };
        }
        req.query(generateSign(signParams));

        // 设置请求头
        const user = store.getState().user;
        req.set({ 'Authorization': `Bearer ${user.accessToken}`, 'REQUEST-ID': uuid() });

        return req;
    }
};

/** 定义所有快捷操作 */
['get', 'post', 'put', 'patch', 'delete'].forEach(function(method) {
    // WARN: 该方法内使用了指向 api 的 this, 因此不可使用箭头函数；
    api[method] = function(data, config = {}) {

        let {apiRoot, apiPath, params, paramsFilter} = data;

        config = Object.assign({}, config, {
            method, apiRoot, apiPath, params, paramsFilter
        });

        return api.request(config)
            .then((response) => {
                return formatObjectKeys(response.body, 'camel');
            }).catch((error) => {
                error.statusCode = statusCode[error.status];
                if (error.status === statusCode.UNAUTHORIZED) {
                    store.dispatch(actions.logoutAction());
                }
                return Promise.reject(error);
            });
    };
});

api.download = function(data, config) {
    let {apiRoot, apiPath, params, paramsFilter} = data;

    config = Object.assign({}, config, {
        method: 'get', apiRoot, apiPath, params, paramsFilter
    });

    return api.request(config)
        .responseType('blob')
        .then((response) => {
            /filename="(.+)"$/.test(response.header['content-disposition']);
            let fileName = decodeURIComponent(RegExp.$1);
            let windowUrl = window.URL || window.webkitURL;
            if (typeof navigator.msSaveBlob === 'function') {
                navigator.msSaveBlob(response.body, fileName);
            } else if (typeof windowUrl.createObjectURL === 'function') {
                let url = windowUrl.createObjectURL(response.body);
                let anchor = document.createElement('a');
                anchor.href = url;
                anchor.download = fileName;
                document.body.appendChild(anchor);
                anchor.click();
                anchor.remove();
                windowUrl.revokeObjectURL(url);
            }
        })
        .catch((error) => {
            error.statusCode = statusCode[error.status];
            if (error.status === statusCode.UNAUTHORIZED) {
                store.dispatch(actions.logoutAction());
            }
            return Promise.reject(error);
        });
};

/**
 * 将对象中所有 key 转换为指定命名格式
 */
export function formatObjectKeys(obj, type) {
    if (_.isArray(obj)) {
        return _.map(obj, item => formatObjectKeys(item, type));
    } else if (_.isObject(obj)) {
        let result = {};

        _.forEach(obj, (value, key) => {
            result[_[`${type}Case`](key)] = formatObjectKeys(value, type);
        });

        return result;
    } else {
        return obj;
    }
}

/**
 * 格式化接口地址
 * @param {string} rootPath - 接口根地址
 * @param {string} relPath - 相对地址，支持声明路径参数，会通过 params 中的数据进行格式化处理
 * @param {object} params - 参数对象，若其中有参数被注入到了 url 中，则会将该参数从对象中移除
 * @return {string} 完整的接口地址
 */
function formatPath(rootPath, relPath, params) {
    const relPathKeys = [];
    const relPathParams = {};

    rootPath = _.trim(rootPath ? rootPath : globalConfig.get('api.root'));
    relPath = _.trim(relPath);

    if (relPath === '/') {
        relPath = '';
    }

    // 将路径参数移到 relPathParams 中
    pathToRegexp(relPath, relPathKeys);
    relPathKeys.forEach((keyMatch) => {
        const name = keyMatch.name;

        relPathParams[name] = params[name];
        delete params[name];
    });

    // 格式化相对地址
    relPath = pathToRegexp.compile(relPath)(relPathParams);

    return rootPath + relPath;
}

/**
 * 生成请求签名信息
 * @param {object} params - 参数对象
 * @return {object} 签名对象
 */
export function generateSign(params) {
    let timestamp = new Date().getTime();
    let signParams = {apiKey: globalConfig.get('api.key'), t: timestamp};

    params = Object.assign({}, params, signParams, { token: globalConfig.get('api.token') });

    let md5List = _.map(params, (value, key) => {
        if (value === undefined || value === null || value === '') {
            return '';
        } else {
            return `${key}=${jsonSerialization(value)}`;
        }
    });
    md5List.sort();
    signParams.sign = md5(md5List.join(''));
    return signParams;
}

/**
 * 将 json 结构序列化为字符串
 * @param {array} json - json 对象
 * @return {object} 序列化后的字符串
 */
function jsonSerialization(json) {
    if (_.isArray(json)) {
        let array = _.map(json, item => jsonSerialization(item));
        array.sort();
        return `[${array.length ? `{${array.join('},{')}}` : ''}]`;
    } else if (_.isObject(json)) {
        let result = [];

        let keys = _.clone(Object.keys(json));
        keys.sort();
        _.forEach(keys, key => {
            let value = json[key];
            if (!_.isArray(value) && _.isObject(value)) {
                result.push(`${key}={${jsonSerialization(value)}}`);
            } else if (value !== undefined) {
                result.push(`${key}=${jsonSerialization(value)}`);
            }
        });

        return result.join('&');
    } else {
        return json + '';
    }
}
