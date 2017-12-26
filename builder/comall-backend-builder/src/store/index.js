import { createStore, applyMiddleware, compose } from 'redux';
import createLogger from 'redux-logger';

import { sagaMiddleware, runSagas } from '../sagas';

import { reducers } from '../reducers';

const preloadedState = {
    // 存放所有实体数据
    entities: {},
    // 存放所有组件状态数据
    components: {},
    // 存放用户数据
    user: {}
};

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const enhancer = applyMiddleware(
    sagaMiddleware,
    createLogger()
);

export const store = createStore(
    reducers,
    preloadedState,
    composeEnhancers(enhancer)
);

runSagas();
