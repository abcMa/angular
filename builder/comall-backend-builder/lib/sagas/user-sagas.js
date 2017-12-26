'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

exports.initUserSagas = initUserSagas;

var _effects = require('redux-saga/effects');

var _loaders = require('../loaders');

var _actions = require('../actions');

var actions = _interopRequireWildcard(_actions);

var _services = require('../services');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _marked = [initUserSagas, getPermissionSaga, logoutSaga].map(_regenerator2['default'].mark);

function initUserSagas() {
    return _regenerator2['default'].wrap(function initUserSagas$(_context) {
        while (1) {
            switch (_context.prev = _context.next) {
                case 0:
                    _context.next = 2;
                    return (0, _effects.takeEvery)(actions.LOGIN_SUCCESS, getPermissionSaga);

                case 2:
                    _context.next = 4;
                    return (0, _effects.takeEvery)(actions.LOGOUT, logoutSaga);

                case 4:
                case 'end':
                    return _context.stop();
            }
        }
    }, _marked[0], this);
}

/**
 * <generator函数> 获取权限saga
 */
function getPermissionSaga(action) {
    var user, method, apiPath, data;
    return _regenerator2['default'].wrap(function getPermissionSaga$(_context2) {
        while (1) {
            switch (_context2.prev = _context2.next) {
                case 0:
                    user = action.payload;
                    method = 'get';
                    apiPath = '/privileges';
                    data = {
                        apiPath: apiPath,
                        params: {}
                    };
                    _context2.prev = 4;
                    _context2.next = 7;
                    return (0, _effects.call)(_loaders.load, method, data);

                case 7:
                    user.privileges = _context2.sent;

                    _services.localStorage.set('user', user);
                    window.location.href = window.location.pathname;
                    _context2.next = 17;
                    break;

                case 12:
                    _context2.prev = 12;
                    _context2.t0 = _context2['catch'](4);


                    (0, _services.errorHandle)(_context2.t0);

                    _context2.next = 17;
                    return (0, _effects.put)(actions.getPermissionFailedAction({
                        request: data,
                        message: _context2.t0.message,
                        statusCode: _context2.t0.statusCode,
                        status: _context2.t0.status,
                        stack: _context2.t0.stack
                    }));

                case 17:
                case 'end':
                    return _context2.stop();
            }
        }
    }, _marked[1], this, [[4, 12]]);
}

function logoutSaga(action) {
    return _regenerator2['default'].wrap(function logoutSaga$(_context3) {
        while (1) {
            switch (_context3.prev = _context3.next) {
                case 0:
                    _context3.prev = 0;

                    _services.localStorage.remove('user');
                    _context3.next = 4;
                    return (0, _effects.put)(actions.logoutSuccessAction());

                case 4:
                    _context3.next = 10;
                    break;

                case 6:
                    _context3.prev = 6;
                    _context3.t0 = _context3['catch'](0);
                    _context3.next = 10;
                    return (0, _effects.put)(actions.logoutFailedAction({
                        message: _context3.t0.message,
                        statusCode: _context3.t0.statusCode,
                        status: _context3.t0.status,
                        stack: _context3.t0.stack
                    }));

                case 10:
                case 'end':
                    return _context3.stop();
            }
        }
    }, _marked[2], this, [[0, 6]]);
}