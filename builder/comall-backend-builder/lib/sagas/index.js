'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.sagaMiddleware = undefined;
exports.runSagas = runSagas;

var _reduxSaga = require('redux-saga');

var _reduxSaga2 = _interopRequireDefault(_reduxSaga);

var _userSagas = require('./user-sagas');

var _entitySagas = require('./entity-sagas');

var _componentSagas = require('./component-sagas');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// create the saga middleware
var sagaMiddleware = exports.sagaMiddleware = (0, _reduxSaga2['default'])(_entitySagas.initEntitySagas);

// then run sagas
function runSagas() {
    sagaMiddleware.run(_userSagas.initUserSagas);
    sagaMiddleware.run(_entitySagas.initEntitySagas);
    sagaMiddleware.run(_componentSagas.initComponentSagas);
}