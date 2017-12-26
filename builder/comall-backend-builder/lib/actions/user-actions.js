'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.loginAction = loginAction;
exports.loginSuccessAction = loginSuccessAction;
exports.loginFailedAction = loginFailedAction;
exports.getPermissionSuccessAction = getPermissionSuccessAction;
exports.getPermissionFailedAction = getPermissionFailedAction;
exports.logoutAction = logoutAction;
exports.logoutSuccessAction = logoutSuccessAction;
exports.logoutFailedAction = logoutFailedAction;
exports.validateCodeAction = validateCodeAction;
exports.validateCodeSuccessAction = validateCodeSuccessAction;
exports.validateCodeFailedAction = validateCodeFailedAction;
exports.refreshTokenAction = refreshTokenAction;
exports.refreshTokenSuccessAction = refreshTokenSuccessAction;
exports.refreshTokenFailedAction = refreshTokenFailedAction;
var LOGIN = exports.LOGIN = 'login';
var LOGIN_SUCCESS = exports.LOGIN_SUCCESS = 'login.success';
var LOGIN_FAILED = exports.LOGIN_FAILED = 'login.failed';

var GET_PERMISSION = exports.GET_PERMISSION = 'get.permission';
var GET_PERMISSION_SUCCESS = exports.GET_PERMISSION_SUCCESS = 'get.permission.success';
var GET_PERMISSION_FAILED = exports.GET_PERMISSION_FAILED = 'get.permission.failed';

var LOGOUT = exports.LOGOUT = 'logout';
var LOGOUT_SUCCESS = exports.LOGOUT_SUCCESS = 'logout.success';
var LOGOUT_FAILED = exports.LOGOUT_FAILED = 'logout.failed';

var VLIDATE_CODE = exports.VLIDATE_CODE = 'vlidatecode';
var VLIDATE_CODE_SUCCESS = exports.VLIDATE_CODE_SUCCESS = 'vlidatecode.success';
var VLIDATE_CODE_FAILED = exports.VLIDATE_CODE_FAILED = 'vlidatecode.failed';

var REFRESH_TOKEN = exports.REFRESH_TOKEN = 'refresh.token';
var REFRESH_TOKEN_SUCCESS = exports.REFRESH_TOKEN_SUCCESS = 'refresh.token.success';
var REFRESH_TOKEN_FAILED = exports.REFRESH_TOKEN_FAILED = 'refresh.token.failed';

// 登录
function loginAction(entity) {
    return {
        type: LOGIN,
        entity: entity
    };
}

// 登录成功
function loginSuccessAction(user) {
    return {
        type: LOGIN_SUCCESS,
        payload: user
    };
}

// 登录失败
function loginFailedAction(error) {
    return {
        type: LOGIN_FAILED,
        payload: error
    };
}

// 获取权限成功
function getPermissionSuccessAction(user) {
    return {
        type: GET_PERMISSION_SUCCESS,
        payload: user
    };
}

// 获取权限失败
function getPermissionFailedAction(error) {
    return {
        type: GET_PERMISSION_FAILED,
        payload: error
    };
}

// 登出
function logoutAction() {
    return {
        type: LOGOUT
    };
}

// 登出成功
function logoutSuccessAction() {
    return {
        type: LOGOUT_SUCCESS
    };
}

// 登出失败
function logoutFailedAction(error) {
    return {
        type: LOGOUT_FAILED,
        payload: error
    };
}

// 获取TOKEN
function validateCodeAction(params) {
    return {
        type: VLIDATE_CODE,
        payload: params
    };
}

// 获取TOKEN成功
function validateCodeSuccessAction(token) {
    return {
        type: VLIDATE_CODE_SUCCESS,
        payload: token
    };
}

// 获取TOKEN失败
function validateCodeFailedAction(error) {
    return {
        type: VLIDATE_CODE_FAILED,
        payload: error
    };
}

// 刷新TOKEN
function refreshTokenAction(params) {
    return {
        type: REFRESH_TOKEN,
        payload: params
    };
}

// 刷新TOKEN成功
function refreshTokenSuccessAction(user) {
    return {
        type: REFRESH_TOKEN_SUCCESS,
        payload: user
    };
}

// 刷新TOKEN失败
function refreshTokenFailedAction(error) {
    return {
        type: REFRESH_TOKEN_FAILED,
        payload: error
    };
}