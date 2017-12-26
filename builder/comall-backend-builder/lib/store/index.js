'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.store = undefined;

var _redux = require('redux');

var _reduxLogger = require('redux-logger');

var _reduxLogger2 = _interopRequireDefault(_reduxLogger);

var _sagas = require('../sagas');

var _reducers = require('../reducers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var preloadedState = {
    // 存放所有实体数据
    entities: {},
    // 存放所有组件状态数据
    components: {},
    // 存放用户数据
    user: {}
};

var composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || _redux.compose;
var enhancer = (0, _redux.applyMiddleware)(_sagas.sagaMiddleware, (0, _reduxLogger2['default'])());

var store = exports.store = (0, _redux.createStore)(_reducers.reducers, preloadedState, composeEnhancers(enhancer));

(0, _sagas.runSagas)();