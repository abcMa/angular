'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.reducers = undefined;

var _redux = require('redux');

var _reactRouterRedux = require('react-router-redux');

var _entityReducer = require('./entity-reducer');

var _componentReducer = require('./component-reducer');

var _userReducer = require('./user-reducer');

var reducers = exports.reducers = (0, _redux.combineReducers)({
    // 路由状态
    routing: _reactRouterRedux.routerReducer,

    // 存放实体
    entities: _entityReducer.entityReducer,

    // 存放组件状态
    components: _componentReducer.componentReducer,

    // 存放用户信息
    user: _userReducer.userReducer
});