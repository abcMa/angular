import { combineReducers }       from 'redux';
import { routerReducer }         from 'react-router-redux';
import { entityReducer }         from './entity-reducer';
import { componentReducer }      from './component-reducer';
import { userReducer }           from './user-reducer';

export const reducers = combineReducers({
    // 路由状态
    routing: routerReducer,

    // 存放实体
    entities: entityReducer,

    // 存放组件状态
    components: componentReducer,

    // 存放用户信息
    user: userReducer
});
