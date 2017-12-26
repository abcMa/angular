'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.api = exports.METHOD_DELETE = exports.METHOD_PUT = exports.METHOD_POST = exports.METHOD_GET = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

exports.formatObjectKeys = formatObjectKeys;
exports.generateSign = generateSign;

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _pathToRegexp = require('path-to-regexp');

var _pathToRegexp2 = _interopRequireDefault(_pathToRegexp);

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

var _md = require('md5');

var _md2 = _interopRequireDefault(_md);

var _statusCode = require('./status-code');

var _uuid = require('./uuid');

var _globalConfig = require('./global-config');

var _store = require('../store');

var _actions = require('../actions');

var actions = _interopRequireWildcard(_actions);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var METHOD_GET = exports.METHOD_GET = 'get';
var METHOD_POST = exports.METHOD_POST = 'post';
var METHOD_PUT = exports.METHOD_PUT = 'put';
var METHOD_DELETE = exports.METHOD_DELETE = 'delete';

var DEFAULT_METHOD = METHOD_GET;

/**
 * 封装实体的 API 接口调用相关操作
 */
var api = exports.api = {
    /**
     * 发送请求
     * @param {object} config - 请求对象
     */
    request: function request(config) {
        var _config$method = config.method,
            method = _config$method === undefined ? DEFAULT_METHOD : _config$method,
            apiRoot = config.apiRoot,
            apiPath = config.apiPath,
            params = config.params,
            paramsFilter = config.paramsFilter;

        if (paramsFilter) {
            params = _.reduce(paramsFilter, function (result, name) {
                var value = params[name];
                if (value !== undefined && value !== null) {
                    result[name] = value;
                }
                return result;
            }, {});
        } else {
            params = _.clone(params);
        }

        var path = formatPath(apiRoot, apiPath, params);
        params = formatObjectKeys(params, 'snake');

        var req = _superagent2['default'][method](path);

        if (params) {
            switch (method) {
                case METHOD_GET:
                    _.forEach(params, function (value, key) {
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

        var signParams = void 0;
        if (method === METHOD_GET) {
            signParams = params;
        } else if (method !== METHOD_DELETE) {
            signParams = { body: params };
        }
        req.query(generateSign(signParams));

        // 设置请求头
        var user = _store.store.getState().user;
        req.set({ 'Authorization': 'Bearer ' + user.accessToken, 'REQUEST-ID': (0, _uuid.uuid)() });

        return req;
    }
};

/** 定义所有快捷操作 */
['get', 'post', 'put', 'patch', 'delete'].forEach(function (method) {
    // WARN: 该方法内使用了指向 api 的 this, 因此不可使用箭头函数；
    api[method] = function (data) {
        var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var apiRoot = data.apiRoot,
            apiPath = data.apiPath,
            params = data.params,
            paramsFilter = data.paramsFilter;


        config = (0, _extends3['default'])({}, config, {
            method: method, apiRoot: apiRoot, apiPath: apiPath, params: params, paramsFilter: paramsFilter
        });

        return api.request(config).then(function (response) {
            return formatObjectKeys(response.body, 'camel');
        })['catch'](function (error) {
            error.statusCode = _statusCode.statusCode[error.status];
            if (error.status === _statusCode.statusCode.UNAUTHORIZED) {
                _store.store.dispatch(actions.logoutAction());
            }
            return Promise.reject(error);
        });
    };
});

api.download = function (data, config) {
    var apiRoot = data.apiRoot,
        apiPath = data.apiPath,
        params = data.params,
        paramsFilter = data.paramsFilter;


    config = (0, _extends3['default'])({}, config, {
        method: 'get', apiRoot: apiRoot, apiPath: apiPath, params: params, paramsFilter: paramsFilter
    });

    return api.request(config).responseType('blob').then(function (response) {
        /filename="(.+)"$/.test(response.header['content-disposition']);
        var fileName = decodeURIComponent(RegExp.$1);
        var windowUrl = window.URL || window.webkitURL;
        if (typeof navigator.msSaveBlob === 'function') {
            navigator.msSaveBlob(response.body, fileName);
        } else if (typeof windowUrl.createObjectURL === 'function') {
            var url = windowUrl.createObjectURL(response.body);
            var anchor = document.createElement('a');
            anchor.href = url;
            anchor.download = fileName;
            document.body.appendChild(anchor);
            anchor.click();
            anchor.remove();
            windowUrl.revokeObjectURL(url);
        }
    })['catch'](function (error) {
        error.statusCode = _statusCode.statusCode[error.status];
        if (error.status === _statusCode.statusCode.UNAUTHORIZED) {
            _store.store.dispatch(actions.logoutAction());
        }
        return Promise.reject(error);
    });
};

/**
 * 将对象中所有 key 转换为指定命名格式
 */
function formatObjectKeys(obj, type) {
    if (_.isArray(obj)) {
        return _.map(obj, function (item) {
            return formatObjectKeys(item, type);
        });
    } else if (_.isObject(obj)) {
        var result = {};

        _.forEach(obj, function (value, key) {
            result[_[type + 'Case'](key)] = formatObjectKeys(value, type);
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
    var relPathKeys = [];
    var relPathParams = {};

    rootPath = _.trim(rootPath ? rootPath : _globalConfig.globalConfig.get('api.root'));
    relPath = _.trim(relPath);

    if (relPath === '/') {
        relPath = '';
    }

    // 将路径参数移到 relPathParams 中
    (0, _pathToRegexp2['default'])(relPath, relPathKeys);
    relPathKeys.forEach(function (keyMatch) {
        var name = keyMatch.name;

        relPathParams[name] = params[name];
        delete params[name];
    });

    // 格式化相对地址
    relPath = _pathToRegexp2['default'].compile(relPath)(relPathParams);

    return rootPath + relPath;
}

/**
 * 生成请求签名信息
 * @param {object} params - 参数对象
 * @return {object} 签名对象
 */
function generateSign(params) {
    var timestamp = new Date().getTime();
    var signParams = { apiKey: _globalConfig.globalConfig.get('api.key'), t: timestamp };

    params = (0, _extends3['default'])({}, params, signParams, { token: _globalConfig.globalConfig.get('api.token') });

    var md5List = _.map(params, function (value, key) {
        if (value === undefined || value === null || value === '') {
            return '';
        } else {
            return key + '=' + jsonSerialization(value);
        }
    });
    md5List.sort();
    signParams.sign = (0, _md2['default'])(md5List.join(''));
    return signParams;
}

/**
 * 将 json 结构序列化为字符串
 * @param {array} json - json 对象
 * @return {object} 序列化后的字符串
 */
function jsonSerialization(json) {
    if (_.isArray(json)) {
        var array = _.map(json, function (item) {
            return jsonSerialization(item);
        });
        array.sort();
        return '[' + (array.length ? '{' + array.join('},{') + '}' : '') + ']';
    } else if (_.isObject(json)) {
        var result = [];

        var keys = _.clone(Object.keys(json));
        keys.sort();
        _.forEach(keys, function (key) {
            var value = json[key];
            if (!_.isArray(value) && _.isObject(value)) {
                result.push(key + '={' + jsonSerialization(value) + '}');
            } else if (value !== undefined) {
                result.push(key + '=' + jsonSerialization(value));
            }
        });

        return result.join('&');
    } else {
        return json + '';
    }
}