'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

exports.userReducer = userReducer;

var _actions = require('../actions');

var actions = _interopRequireWildcard(_actions);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function userReducer() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var action = arguments[1];


    var payload = action.payload;

    switch (action.type) {

        case actions.LOGIN_SUCCESS:
        case actions.REFRESH_TOKEN_SUCCESS:
        case actions.GET_PERMISSION_SUCCESS:
            return (0, _extends3['default'])({}, state, payload);

        case actions.LOGOUT_SUCCESS:
            return {};

        default:
            return state;
    }
}