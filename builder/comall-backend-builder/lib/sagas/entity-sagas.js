'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

exports.initEntitySagas = initEntitySagas;

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

var _effects = require('redux-saga/effects');

var _loaders = require('../loaders');

var _actions = require('../actions');

var actions = _interopRequireWildcard(_actions);

var _type = require('../type');

var _services = require('../services');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _marked = [initEntitySagas, searchSaga, loadNextPageSaga, addSaga, deleteSaga, getSaga, modifySaga, loadPropertyOptionsSaga, loadFilterOptionsSaga].map(_regenerator2['default'].mark);

/**
 * 在页面启动时调用的saga，此时为切换分页至第一页
 */
function initEntitySagas() {
    return _regenerator2['default'].wrap(function initEntitySagas$(_context) {
        while (1) {
            switch (_context.prev = _context.next) {
                case 0:
                    _context.next = 2;
                    return (0, _effects.takeEvery)(actions.SEARCH, searchSaga);

                case 2:
                    _context.next = 4;
                    return (0, _effects.takeEvery)(actions.LOAD_NEXT_PAGE, loadNextPageSaga);

                case 4:
                    _context.next = 6;
                    return (0, _effects.takeEvery)(actions.ADD, addSaga);

                case 6:
                    _context.next = 8;
                    return (0, _effects.takeEvery)(actions.DELETE, deleteSaga);

                case 8:
                    _context.next = 10;
                    return (0, _effects.takeEvery)(actions.GET, getSaga);

                case 10:
                    _context.next = 12;
                    return (0, _effects.takeEvery)(actions.MODIFY, modifySaga);

                case 12:
                    _context.next = 14;
                    return (0, _effects.takeEvery)(actions.LOAD_PROPERTY_OPTIONS, loadPropertyOptionsSaga);

                case 14:
                    _context.next = 16;
                    return (0, _effects.takeEvery)(actions.LOAD_FILTER_OPTIONS, loadFilterOptionsSaga);

                case 16:
                case 'end':
                    return _context.stop();
            }
        }
    }, _marked[0], this);
}

/**
 * <generator函数> searchSaga 搜索saga
 */
function searchSaga(action) {
    var method, entity, params, successBehavior, errorBehavior, paging, filters, _entity$metainfo, apiPath, apiRoot, paramsFilter, types, data, response;

    return _regenerator2['default'].wrap(function searchSaga$(_context2) {
        while (1) {
            switch (_context2.prev = _context2.next) {
                case 0:
                    method = 'get';
                    entity = action.entity, params = action.params, successBehavior = action.successBehavior, errorBehavior = action.errorBehavior;
                    paging = entity.paging, filters = entity.filters;
                    _entity$metainfo = entity.metainfo, apiPath = _entity$metainfo.apiPath, apiRoot = _entity$metainfo.apiRoot, paramsFilter = _entity$metainfo.paramsFilter, types = _entity$metainfo.filters;
                    data = {
                        apiRoot: apiRoot, apiPath: apiPath, paramsFilter: paramsFilter,
                        params: _.assign({}, params, (0, _type.formatParams)(types, filters), _.pick(paging, ['page', 'perPage']))
                    };
                    _context2.prev = 5;
                    _context2.next = 8;
                    return (0, _effects.call)(_loaders.load, method, data);

                case 8:
                    response = _context2.sent;
                    _context2.next = 11;
                    return (0, _effects.put)(actions.searchSuccessAction(entity, response));

                case 11:

                    if (Object.prototype.toString.call(successBehavior) === '[object Object]') {
                        (0, _services.behaviorHandle)(successBehavior);
                    }

                    _context2.next = 20;
                    break;

                case 14:
                    _context2.prev = 14;
                    _context2.t0 = _context2['catch'](5);

                    if (Object.prototype.toString.call(errorBehavior) === '[object Object]') {
                        (0, _services.behaviorHandle)(errorBehavior);
                    }

                    (0, _services.errorHandle)(_context2.t0);

                    _context2.next = 20;
                    return (0, _effects.put)(actions.searchFailedAction(entity, {
                        request: data,
                        message: _context2.t0.message,
                        statusCode: _context2.t0.statusCode,
                        status: _context2.t0.status,
                        stack: _context2.t0.stack
                    }));

                case 20:
                case 'end':
                    return _context2.stop();
            }
        }
    }, _marked[1], this, [[5, 14]]);
}

/**
 * <generator函数> 加载下一页数据 saga
 */
function loadNextPageSaga(action) {
    var method, entity, params, successBehavior, errorBehavior, _entity$paging, page, perPage, filters, _entity$metainfo2, apiPath, apiRoot, paramsFilter, types, data, response;

    return _regenerator2['default'].wrap(function loadNextPageSaga$(_context3) {
        while (1) {
            switch (_context3.prev = _context3.next) {
                case 0:
                    method = 'get';
                    entity = action.entity, params = action.params, successBehavior = action.successBehavior, errorBehavior = action.errorBehavior;
                    _entity$paging = entity.paging, page = _entity$paging.page, perPage = _entity$paging.perPage, filters = entity.filters;
                    _entity$metainfo2 = entity.metainfo, apiPath = _entity$metainfo2.apiPath, apiRoot = _entity$metainfo2.apiRoot, paramsFilter = _entity$metainfo2.paramsFilter, types = _entity$metainfo2.filters;
                    data = {
                        apiRoot: apiRoot, apiPath: apiPath, paramsFilter: paramsFilter,
                        params: _.assign({}, params, (0, _type.formatParams)(types, filters), { page: page + 1, perPage: perPage })
                    };
                    _context3.prev = 5;
                    _context3.next = 8;
                    return (0, _effects.call)(_loaders.load, method, data);

                case 8:
                    response = _context3.sent;
                    _context3.next = 11;
                    return (0, _effects.put)(actions.loadNextPageSuccessAction(entity, response));

                case 11:

                    if (Object.prototype.toString.call(successBehavior) === '[object Object]') {
                        (0, _services.behaviorHandle)(successBehavior);
                    }

                    _context3.next = 20;
                    break;

                case 14:
                    _context3.prev = 14;
                    _context3.t0 = _context3['catch'](5);

                    if (Object.prototype.toString.call(errorBehavior) === '[object Object]') {
                        (0, _services.behaviorHandle)(errorBehavior);
                    }

                    (0, _services.errorHandle)(_context3.t0);

                    _context3.next = 20;
                    return (0, _effects.put)(actions.loadNextPageFailedAction(entity, {
                        request: data,
                        message: _context3.t0.message,
                        statusCode: _context3.t0.statusCode,
                        status: _context3.t0.status,
                        stack: _context3.t0.stack
                    }));

                case 20:
                case 'end':
                    return _context3.stop();
            }
        }
    }, _marked[2], this, [[5, 14]]);
}

/**
 * <generator函数> addSaga 添加saga
 */
function addSaga(action) {
    var method, entity, params, fields, successBehavior, errorBehavior, _entity$metainfo3, apiPath, apiRoot, paramsFilter, types, data, response;

    return _regenerator2['default'].wrap(function addSaga$(_context4) {
        while (1) {
            switch (_context4.prev = _context4.next) {
                case 0:
                    method = 'post';
                    entity = action.entity, params = action.params, fields = action.fields, successBehavior = action.successBehavior, errorBehavior = action.errorBehavior;
                    _entity$metainfo3 = entity.metainfo, apiPath = _entity$metainfo3.apiPath, apiRoot = _entity$metainfo3.apiRoot, paramsFilter = _entity$metainfo3.paramsFilter, types = _entity$metainfo3.properties;
                    data = {
                        apiRoot: apiRoot, apiPath: apiPath, paramsFilter: paramsFilter,
                        params: _.assign({}, params, (0, _type.formatParams)(types, fields))
                    };
                    _context4.prev = 4;
                    _context4.next = 7;
                    return (0, _effects.call)(_loaders.load, method, data);

                case 7:
                    response = _context4.sent;
                    _context4.next = 10;
                    return (0, _effects.put)(actions.addSuccessAction(entity, response));

                case 10:

                    if (Object.prototype.toString.call(successBehavior) === '[object Object]') {
                        (0, _services.behaviorHandle)(successBehavior);
                    }

                    _context4.next = 19;
                    break;

                case 13:
                    _context4.prev = 13;
                    _context4.t0 = _context4['catch'](4);

                    if (Object.prototype.toString.call(errorBehavior) === '[object Object]') {
                        (0, _services.behaviorHandle)(errorBehavior);
                    }

                    (0, _services.errorHandle)(_context4.t0);

                    _context4.next = 19;
                    return (0, _effects.put)(actions.addFailedAction(entity, {
                        request: data,
                        message: _context4.t0.message,
                        statusCode: _context4.t0.statusCode,
                        status: _context4.t0.status,
                        stack: _context4.t0.stack
                    }));

                case 19:
                case 'end':
                    return _context4.stop();
            }
        }
    }, _marked[3], this, [[4, 13]]);
}

/**
 * <generator函数> deleteSaga 删除saga
 */
function deleteSaga(action) {
    var method, params, entity, successBehavior, errorBehavior, apiPath, _entity$metainfo4, apiRoot, paramsFilter, data;

    return _regenerator2['default'].wrap(function deleteSaga$(_context5) {
        while (1) {
            switch (_context5.prev = _context5.next) {
                case 0:
                    method = 'delete';
                    params = action.params, entity = action.entity, successBehavior = action.successBehavior, errorBehavior = action.errorBehavior;
                    apiPath = entity.metainfo.apiPath;

                    if (params.id && !/\/:id/.test(entity.metainfo.apiPath)) {
                        apiPath += '/:id';
                    }
                    _entity$metainfo4 = entity.metainfo, apiRoot = _entity$metainfo4.apiRoot, paramsFilter = _entity$metainfo4.paramsFilter;
                    data = (0, _extends3['default'])({}, { apiRoot: apiRoot, apiPath: apiPath, paramsFilter: paramsFilter, params: params });
                    _context5.prev = 6;
                    _context5.next = 9;
                    return (0, _effects.call)(_loaders.load, method, data);

                case 9:
                    _context5.next = 11;
                    return (0, _effects.put)(actions.deleteSuccessAction(entity));

                case 11:

                    if (Object.prototype.toString.call(successBehavior) === '[object Object]') {
                        (0, _services.behaviorHandle)(successBehavior);
                    }

                    _context5.next = 20;
                    break;

                case 14:
                    _context5.prev = 14;
                    _context5.t0 = _context5['catch'](6);

                    if (Object.prototype.toString.call(errorBehavior) === '[object Object]') {
                        (0, _services.behaviorHandle)(errorBehavior);
                    }

                    (0, _services.errorHandle)(_context5.t0);

                    _context5.next = 20;
                    return (0, _effects.put)(actions.deleteFailedAction(entity, {
                        request: data,
                        message: _context5.t0.message,
                        statusCode: _context5.t0.statusCode,
                        status: _context5.t0.status,
                        stack: _context5.t0.stack
                    }));

                case 20:
                case 'end':
                    return _context5.stop();
            }
        }
    }, _marked[4], this, [[6, 14]]);
}

/**
 * <generator函数> getSaga 获取单条数据saga
 */
function getSaga(action) {
    var method, params, entity, successBehavior, errorBehavior, apiPath, _entity$metainfo5, apiRoot, paramsFilter, data, fields;

    return _regenerator2['default'].wrap(function getSaga$(_context6) {
        while (1) {
            switch (_context6.prev = _context6.next) {
                case 0:

                    // 1、获取参数
                    method = 'get';
                    params = action.params, entity = action.entity, successBehavior = action.successBehavior, errorBehavior = action.errorBehavior;
                    apiPath = entity.metainfo.apiPath;

                    if (params.id && !/\/:id/.test(entity.metainfo.apiPath)) {
                        apiPath += '/:id';
                    }
                    _entity$metainfo5 = entity.metainfo, apiRoot = _entity$metainfo5.apiRoot, paramsFilter = _entity$metainfo5.paramsFilter;
                    data = { apiRoot: apiRoot, apiPath: apiPath, paramsFilter: paramsFilter, params: params };
                    _context6.prev = 6;
                    _context6.next = 9;
                    return (0, _effects.call)(_loaders.load, method, data);

                case 9:
                    fields = _context6.sent;
                    _context6.next = 12;
                    return (0, _effects.put)(actions.getSuccessAction(entity, fields));

                case 12:

                    if (Object.prototype.toString.call(successBehavior) === '[object Object]') {
                        (0, _services.behaviorHandle)(successBehavior);
                    }
                    _context6.next = 21;
                    break;

                case 15:
                    _context6.prev = 15;
                    _context6.t0 = _context6['catch'](6);

                    if (Object.prototype.toString.call(errorBehavior) === '[object Object]') {
                        (0, _services.behaviorHandle)(errorBehavior);
                    }

                    (0, _services.errorHandle)(_context6.t0);

                    _context6.next = 21;
                    return (0, _effects.put)(actions.getFailedAction(entity, {
                        request: data,
                        message: _context6.t0.message,
                        statusCode: _context6.t0.statusCode,
                        status: _context6.t0.status,
                        stack: _context6.t0.stack
                    }));

                case 21:
                case 'end':
                    return _context6.stop();
            }
        }
    }, _marked[5], this, [[6, 15]]);
}

/**
 * <generator函数> modifySaga 修改saga
 */
function modifySaga(action) {
    var method, entity, params, fields, successBehavior, errorBehavior, metainfo, apiRoot, paramsFilter, types, apiPath, data;
    return _regenerator2['default'].wrap(function modifySaga$(_context7) {
        while (1) {
            switch (_context7.prev = _context7.next) {
                case 0:
                    method = 'put';
                    entity = action.entity, params = action.params, fields = action.fields, successBehavior = action.successBehavior, errorBehavior = action.errorBehavior;
                    metainfo = entity.metainfo;
                    apiRoot = metainfo.apiRoot, paramsFilter = metainfo.paramsFilter, types = metainfo.properties;
                    apiPath = entity.metainfo.apiPath;

                    if (params.id && !/\/:id/.test(entity.metainfo.apiPath)) {
                        apiPath += '/:id';
                    }

                    data = {
                        apiRoot: apiRoot, apiPath: apiPath, paramsFilter: paramsFilter,
                        params: _.assign({}, params, (0, _type.formatParams)(types, fields))
                    };
                    _context7.prev = 7;
                    _context7.next = 10;
                    return (0, _effects.call)(_loaders.load, method, data);

                case 10:
                    _context7.next = 12;
                    return (0, _effects.put)(actions.modifySuccessAction(entity));

                case 12:

                    if (Object.prototype.toString.call(successBehavior) === '[object Object]') {
                        (0, _services.behaviorHandle)(successBehavior);
                    }

                    _context7.next = 21;
                    break;

                case 15:
                    _context7.prev = 15;
                    _context7.t0 = _context7['catch'](7);

                    if (Object.prototype.toString.call(errorBehavior) === '[object Object]') {
                        (0, _services.behaviorHandle)(errorBehavior);
                    }

                    (0, _services.errorHandle)(_context7.t0);

                    _context7.next = 21;
                    return (0, _effects.put)(actions.modifyFailedAction(entity, {
                        request: data,
                        message: _context7.t0.message,
                        statusCode: _context7.t0.statusCode,
                        status: _context7.t0.status,
                        stack: _context7.t0.stack
                    }));

                case 21:
                case 'end':
                    return _context7.stop();
            }
        }
    }, _marked[6], this, [[7, 15]]);
}

function loadPropertyOptionsSaga(action) {
    var method, entity, fieldName, source, response;
    return _regenerator2['default'].wrap(function loadPropertyOptionsSaga$(_context8) {
        while (1) {
            switch (_context8.prev = _context8.next) {
                case 0:
                    method = 'get';
                    entity = action.entity, fieldName = action.fieldName, source = action.source;


                    if (!source.params) {
                        source.params = {};
                    }

                    _context8.prev = 3;
                    _context8.next = 6;
                    return (0, _effects.call)(_loaders.load, method, source);

                case 6:
                    response = _context8.sent;
                    _context8.next = 9;
                    return (0, _effects.put)(actions.loadPropertyOptionsSuccessAction(entity, fieldName, response));

                case 9:
                    _context8.next = 16;
                    break;

                case 11:
                    _context8.prev = 11;
                    _context8.t0 = _context8['catch'](3);


                    (0, _services.errorHandle)(_context8.t0);

                    _context8.next = 16;
                    return (0, _effects.put)(actions.loadPropertyOptionsFailedAction(entity, {
                        fieldName: fieldName,
                        request: source,
                        message: _context8.t0.message,
                        statusCode: _context8.t0.statusCode,
                        status: _context8.t0.status,
                        stack: _context8.t0.stack
                    }));

                case 16:
                case 'end':
                    return _context8.stop();
            }
        }
    }, _marked[7], this, [[3, 11]]);
}

function loadFilterOptionsSaga(action) {
    var method, entity, fieldName, source, response;
    return _regenerator2['default'].wrap(function loadFilterOptionsSaga$(_context9) {
        while (1) {
            switch (_context9.prev = _context9.next) {
                case 0:
                    method = 'get';
                    entity = action.entity, fieldName = action.fieldName, source = action.source;


                    if (!source.params) {
                        source.params = {};
                    }

                    _context9.prev = 3;
                    _context9.next = 6;
                    return (0, _effects.call)(_loaders.load, method, source);

                case 6:
                    response = _context9.sent;
                    _context9.next = 9;
                    return (0, _effects.put)(actions.loadFilterOptionsSuccessAction(entity, fieldName, response));

                case 9:
                    _context9.next = 16;
                    break;

                case 11:
                    _context9.prev = 11;
                    _context9.t0 = _context9['catch'](3);


                    (0, _services.errorHandle)(_context9.t0);

                    _context9.next = 16;
                    return (0, _effects.put)(actions.loadFilterOptionsFailedAction(entity, {
                        fieldName: fieldName,
                        request: source,
                        message: _context9.t0.message,
                        statusCode: _context9.t0.statusCode,
                        status: _context9.t0.status,
                        stack: _context9.t0.stack
                    }));

                case 16:
                case 'end':
                    return _context9.stop();
            }
        }
    }, _marked[8], this, [[3, 11]]);
}