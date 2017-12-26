export const LOGIN          = 'login';
export const LOGIN_SUCCESS  = 'login.success';
export const LOGIN_FAILED   = 'login.failed';

export const GET_PERMISSION          = 'get.permission';
export const GET_PERMISSION_SUCCESS  = 'get.permission.success';
export const GET_PERMISSION_FAILED   = 'get.permission.failed';

export const LOGOUT         = 'logout';
export const LOGOUT_SUCCESS = 'logout.success';
export const LOGOUT_FAILED  = 'logout.failed';

export const VLIDATE_CODE          = 'vlidatecode';
export const VLIDATE_CODE_SUCCESS  = 'vlidatecode.success';
export const VLIDATE_CODE_FAILED   = 'vlidatecode.failed';

export const REFRESH_TOKEN          = 'refresh.token';
export const REFRESH_TOKEN_SUCCESS  = 'refresh.token.success';
export const REFRESH_TOKEN_FAILED   = 'refresh.token.failed';

// 登录
export function loginAction(entity) {
    return {
        type: LOGIN,
        entity
    };
}

// 登录成功
export function loginSuccessAction(user) {
    return {
        type: LOGIN_SUCCESS,
        payload: user
    };
}

// 登录失败
export function loginFailedAction(error) {
    return {
        type: LOGIN_FAILED,
        payload: error
    };
}

// 获取权限成功
export function getPermissionSuccessAction(user) {
    return {
        type: GET_PERMISSION_SUCCESS,
        payload: user
    };
}

// 获取权限失败
export function getPermissionFailedAction(error) {
    return {
        type: GET_PERMISSION_FAILED,
        payload: error
    };
}

// 登出
export function logoutAction() {
    return {
        type: LOGOUT
    };
}

// 登出成功
export function logoutSuccessAction() {
    return {
        type: LOGOUT_SUCCESS
    };
}

// 登出失败
export function logoutFailedAction(error) {
    return {
        type: LOGOUT_FAILED,
        payload: error
    };
}

// 获取TOKEN
export function validateCodeAction(params) {
    return {
        type: VLIDATE_CODE,
        payload: params
    };
}

// 获取TOKEN成功
export function validateCodeSuccessAction(token) {
    return {
        type: VLIDATE_CODE_SUCCESS,
        payload: token
    };
}

// 获取TOKEN失败
export function validateCodeFailedAction(error) {
    return {
        type: VLIDATE_CODE_FAILED,
        payload: error
    };
}

// 刷新TOKEN
export function refreshTokenAction(params) {
    return {
        type: REFRESH_TOKEN,
        payload: params
    };
}

// 刷新TOKEN成功
export function refreshTokenSuccessAction(user) {
    return {
        type: REFRESH_TOKEN_SUCCESS,
        payload: user
    };
}

// 刷新TOKEN失败
export function refreshTokenFailedAction(error) {
    return {
        type: REFRESH_TOKEN_FAILED,
        payload: error
    };
}