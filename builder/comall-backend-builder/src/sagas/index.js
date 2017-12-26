import createSagaMiddleware   from 'redux-saga';
import { initUserSagas }     from './user-sagas';
import { initEntitySagas }    from './entity-sagas';
import { initComponentSagas } from './component-sagas';

// create the saga middleware
export const sagaMiddleware = createSagaMiddleware(initEntitySagas);

// then run sagas
export function runSagas() {
    sagaMiddleware.run(initUserSagas);
    sagaMiddleware.run(initEntitySagas);
    sagaMiddleware.run(initComponentSagas);
}
