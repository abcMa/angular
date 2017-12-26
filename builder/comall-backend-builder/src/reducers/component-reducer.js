import * as _ from 'lodash';
import * as actions from '../actions';

export function componentReducer(state = {}, action) {
    let { type, componentId, payload } = action;
    let componentState = state[componentId];

    if (componentId !== undefined) {

        switch(type) {

            case actions.COMPONENT_UNMOUNT:
                state = { ...state };
                delete state[componentId];
                break;

            case actions.COMPONENT_FORM_INIT:
                state = { ...state, [componentId]: { ...payload } };
                break;

            case actions.COMPONENT_FORM_CHANGE:
                componentState = {
                    ...componentState,
                    fields: _.cloneDeep(componentState.fields)
                };
                _.forEach(payload, (value, key) => {
                    _.set(componentState.fields, key, value);
                });
                state = { ...state, [componentId]: componentState };
                break;

            case actions.COMPONENT_SUBMIT:
                componentState = {
                    ...componentState,
                    submitType: payload
                };
                state = { ...state, [componentId]: componentState };
                break;

            case actions.COMPONENT_SUBMIT_FINISH:
                componentState = {
                    ...componentState,
                    submitType: null
                };
                state = { ...state, [componentId]: componentState };
                break;

            case actions.COMPONENT_TABLE_ROW_SELECTION_CHANGE:
                componentState = {
                    ...componentState,
                    selectedRowKeys: payload
                };
                state = { ...state, [componentId]: componentState };
                break;

            case actions.COMPONENT_TABLE_MODIFY_START:
                componentState = {
                    ...componentState,
                    fields: { ...payload }
                };
                state = { ...state, [componentId]: componentState };
                break;

            case actions.COMPONENT_TABLE_MODIFY_CHANGE:
                componentState = {
                    ...componentState,
                    fields: { ...componentState.fields, ...payload }
                };
                state = { ...state, [componentId]: componentState };
                break;

            case actions.COMPONENT_TABLE_MODIFY_FINISH:
                componentState = {
                    ...componentState,
                    fields: null
                };
                state = { ...state, [componentId]: componentState };
                break;

            case actions.COMPONENT_TABLE_SORT_CHANGE:
                componentState = {
                    ...componentState,
                    sort: { ...payload }
                };
                state = { ...state, [componentId]: componentState };
                break;

            default:
                // do nothing
        }
    }

    return state;
}
