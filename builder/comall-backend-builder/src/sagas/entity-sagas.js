import * as _ from 'lodash';
import { call, put, takeEvery } from 'redux-saga/effects';

import { load } from '../loaders';
import * as actions from '../actions';
import { formatParams } from '../type';
import { behaviorHandle, errorHandle } from '../services';

/**
 * 在页面启动时调用的saga，此时为切换分页至第一页
 */
export function* initEntitySagas() {

    yield takeEvery(actions.SEARCH, searchSaga);

    yield takeEvery(actions.LOAD_NEXT_PAGE, loadNextPageSaga);

    yield takeEvery(actions.ADD, addSaga);

    yield takeEvery(actions.DELETE, deleteSaga);

    yield takeEvery(actions.GET, getSaga);

    yield takeEvery(actions.MODIFY, modifySaga);

    yield takeEvery(actions.LOAD_PROPERTY_OPTIONS, loadPropertyOptionsSaga);

    yield takeEvery(actions.LOAD_FILTER_OPTIONS, loadFilterOptionsSaga);
}

/**
 * <generator函数> searchSaga 搜索saga
 */
function* searchSaga(action) {
    const method = 'get';
    const { entity, params, successBehavior, errorBehavior } = action;
    const { paging, filters } = entity;
    const { apiPath, apiRoot, paramsFilter, filters: types } = entity.metainfo;
    const data = {
        apiRoot, apiPath, paramsFilter,
        params: _.assign({}, params, formatParams(types, filters), _.pick(paging, [ 'page', 'perPage' ]))
    };

    try {
        const response = yield call(load, method, data);

        yield put(actions.searchSuccessAction(entity, response));

        if (Object.prototype.toString.call(successBehavior) === '[object Object]') {
            behaviorHandle(successBehavior);
        }

    } catch(e) {
        if (Object.prototype.toString.call(errorBehavior) === '[object Object]') {
            behaviorHandle(errorBehavior);
        }

        errorHandle(e);

        yield put(actions.searchFailedAction(entity, {
            request: data,
            message: e.message,
            statusCode: e.statusCode,
            status: e.status,
            stack: e.stack
        }));
    }
}

/**
 * <generator函数> 加载下一页数据 saga
 */
function* loadNextPageSaga(action) {
    const method = 'get';
    const { entity, params, successBehavior, errorBehavior } = action;
    const { paging: { page, perPage }, filters } = entity;
    const { apiPath, apiRoot, paramsFilter, filters: types } = entity.metainfo;
    const data = {
        apiRoot, apiPath, paramsFilter,
        params: _.assign({}, params, formatParams(types, filters), { page: page + 1, perPage})
    };

    try {
        const response = yield call(load, method, data);

        yield put(actions.loadNextPageSuccessAction(entity, response));

        if (Object.prototype.toString.call(successBehavior) === '[object Object]') {
            behaviorHandle(successBehavior);
        }

    } catch(e) {
        if (Object.prototype.toString.call(errorBehavior) === '[object Object]') {
            behaviorHandle(errorBehavior);
        }

        errorHandle(e);

        yield put(actions.loadNextPageFailedAction(entity, {
            request: data,
            message: e.message,
            statusCode: e.statusCode,
            status: e.status,
            stack: e.stack
        }));
    }
}

/**
 * <generator函数> addSaga 添加saga
 */
function* addSaga(action) {
    const method = 'post';
    const { entity, params, fields, successBehavior, errorBehavior } = action;
    const { apiPath, apiRoot, paramsFilter, properties: types } = entity.metainfo;
    const data = {
        apiRoot, apiPath, paramsFilter,
        params: _.assign({}, params, formatParams(types, fields))
    };

    try {
        const response = yield call(load, method, data);

        yield put(actions.addSuccessAction(entity, response));

        if (Object.prototype.toString.call(successBehavior) === '[object Object]') {
            behaviorHandle(successBehavior);
        }

    } catch(e) {
        if (Object.prototype.toString.call(errorBehavior) === '[object Object]') {
            behaviorHandle(errorBehavior);
        }

        errorHandle(e);

        yield put(actions.addFailedAction(entity, {
            request: data,
            message: e.message,
            statusCode: e.statusCode,
            status: e.status,
            stack: e.stack
        }));
    }
}

/**
 * <generator函数> deleteSaga 删除saga
 */
function* deleteSaga(action) {
    const method = 'delete';
    const { params, entity, successBehavior, errorBehavior } = action;
    let apiPath = entity.metainfo.apiPath;
    if (params.id && !/\/:id/.test(entity.metainfo.apiPath)) {
        apiPath +=  '/:id';
    }
    const { apiRoot, paramsFilter } = entity.metainfo;
    const data = Object.assign({}, {apiRoot, apiPath, paramsFilter, params});

    try {
        yield call(load, method, data);

        yield put(actions.deleteSuccessAction(entity));

        if (Object.prototype.toString.call(successBehavior) === '[object Object]') {
            behaviorHandle(successBehavior);
        }

    } catch(e) {
        if (Object.prototype.toString.call(errorBehavior) === '[object Object]') {
            behaviorHandle(errorBehavior);
        }

        errorHandle(e);

        yield put(actions.deleteFailedAction(entity, {
            request: data,
            message: e.message,
            statusCode: e.statusCode,
            status: e.status,
            stack: e.stack
        }));
    }
}

/**
 * <generator函数> getSaga 获取单条数据saga
 */
function* getSaga(action) {

    // 1、获取参数
    const method = 'get';
    const { params, entity, successBehavior, errorBehavior } = action;
    let apiPath = entity.metainfo.apiPath;
    if (params.id && !/\/:id/.test(entity.metainfo.apiPath)) {
        apiPath +=  '/:id';
    }
    const { apiRoot, paramsFilter } = entity.metainfo;
    const data = { apiRoot, apiPath, paramsFilter, params };

    try {
        const fields = yield call(load, method, data);

        yield put(actions.getSuccessAction(entity, fields));

        if (Object.prototype.toString.call(successBehavior) === '[object Object]') {
            behaviorHandle(successBehavior);
        }
    } catch(e) {
        if (Object.prototype.toString.call(errorBehavior) === '[object Object]') {
            behaviorHandle(errorBehavior);
        }

        errorHandle(e);

        yield put(actions.getFailedAction(entity, {
            request: data,
            message: e.message,
            statusCode: e.statusCode,
            status: e.status,
            stack: e.stack
        }));
    }
}

/**
 * <generator函数> modifySaga 修改saga
 */
function* modifySaga(action) {
    const method = 'put';
    const { entity, params, fields, successBehavior, errorBehavior } = action;
    const metainfo = entity.metainfo;
    const { apiRoot, paramsFilter, properties: types } = metainfo;
    let apiPath = entity.metainfo.apiPath;
    if (params.id && !/\/:id/.test(entity.metainfo.apiPath)) {
        apiPath +=  '/:id';
    }

    const data = {
        apiRoot, apiPath, paramsFilter,
        params: _.assign({}, params, formatParams(types, fields))
    };

    try {
        yield call(load, method, data);

        yield put(actions.modifySuccessAction(entity));

        if (Object.prototype.toString.call(successBehavior) === '[object Object]') {
            behaviorHandle(successBehavior);
        }

    } catch(e) {
        if (Object.prototype.toString.call(errorBehavior) === '[object Object]') {
            behaviorHandle(errorBehavior);
        }

        errorHandle(e);

        yield put(actions.modifyFailedAction(entity, {
            request: data,
            message: e.message,
            statusCode: e.statusCode,
            status: e.status,
            stack: e.stack
        }));
    }
}

function* loadPropertyOptionsSaga(action) {

    const method = 'get';
    const { entity, fieldName, source } = action;

    if (!source.params) {
        source.params = {};
    }

    try {
        const response = yield call(load, method, source);

        yield put(actions.loadPropertyOptionsSuccessAction(entity, fieldName, response));

    } catch(e) {

        errorHandle(e);

        yield put(actions.loadPropertyOptionsFailedAction(entity, {
            fieldName,
            request: source,
            message: e.message,
            statusCode: e.statusCode,
            status: e.status,
            stack: e.stack
        }));
    }
}


function* loadFilterOptionsSaga(action) {

    const method = 'get';
    const { entity, fieldName, source } = action;

    if (!source.params) {
        source.params = {};
    }

    try {
        const response = yield call(load, method, source);

        yield put(actions.loadFilterOptionsSuccessAction(entity, fieldName, response));

    } catch(e) {

        errorHandle(e);

        yield put(actions.loadFilterOptionsFailedAction(entity, {
            fieldName,
            request: source,
            message: e.message,
            statusCode: e.statusCode,
            status: e.status,
            stack: e.stack
        }));
    }
}
