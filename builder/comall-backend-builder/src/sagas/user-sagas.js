import { call, put, takeEvery } from 'redux-saga/effects';

import { load } from '../loaders';

import * as actions from '../actions';
import { localStorage, errorHandle } from '../services';

export function* initUserSagas() {

    yield takeEvery(actions.LOGIN_SUCCESS, getPermissionSaga);

    yield takeEvery(actions.LOGOUT, logoutSaga);
}

/**
 * <generator函数> 获取权限saga
 */
function* getPermissionSaga(action) {

    let user = action.payload;
    const method = 'get';
    const apiPath = '/privileges';
    const data = {
        apiPath,
        params: {}
    };

    try {
        user.privileges = yield call(load, method, data);
        localStorage.set('user', user);
        window.location.href = window.location.pathname;
    } catch (e) {

        errorHandle(e);

        yield put(actions.getPermissionFailedAction({
            request: data,
            message: e.message,
            statusCode: e.statusCode,
            status: e.status,
            stack: e.stack
        }));
    }
}

function* logoutSaga(action) {
    try {
        localStorage.remove('user');
        yield put(actions.logoutSuccessAction());
    } catch (e) {
        yield put(actions.logoutFailedAction({
            message: e.message,
            statusCode: e.statusCode,
            status: e.status,
            stack: e.stack
        }));
    }
}