import { interpolate, navigation } from '../services';
import { store } from '../store';

/**
 * 点击等行为处理器
 * @param {object} behavior - 行为信息
 */
export const behaviorHandle = function (behavior) {
    const { route, link, action, actions } = behavior;

    if (route) {
        if (route === 'goBack') {
            navigation.goBack();
        } else {
            let { entity, params } = behavior;
            navigation.goto(interpolate(route, { entity, params }));
        }
        action && store.dispatch(action);
    } else if (action) {
        store.dispatch(action);
    } else if (actions) {
        for (let action of actions) {
            store.dispatch(action);
        }
    } else if (link) {
        // TODO: 链接调转
    }
};
