import * as _ from 'lodash';

import { store } from '../store';

import * as actions from '../actions';

import { put, takeEvery } from 'redux-saga/effects';

/**
 * 在页面启动时调用的saga，此时为切换分页至第一页
 */
export function* initComponentSagas() {

    yield takeEvery(actions.GET_SUCCESS, initEditFormSaga);
}

/**
 * <generator函数> 数据加载后进行 EditForm 数据初始化
 */
function* initEditFormSaga(action) {
    const state = store.getState();
    const { entity, payload } = action;
    const { id: entityId, metainfo: { properties } } = entity;

    const componentId = _.findKey(state.components, { entityId, type: 'EditForm', loaded: false});

    if (componentId === undefined) {
        return;
    }

    const fields = _.mapValues(properties, (property, name) => {
        return payload[name];
    });

    yield put(actions.formInitAction(componentId, {
        type: 'EditForm',
        entityId,
        fields,
        loaded: true
    }));

    _.forEach(properties, (property, name) => {
        reloadPropertyOptions(name, property, entity, fields);
    });
}

/**
 * 重新加载有条件依赖的候选项
 * @param {string} path 属性路径
 * @param {object} property 属性定义
 * @param {object} entity 实体定义
 * @param {object} fields 实体数据
 */
function reloadPropertyOptions(path, property, entity, fields) {
    const { options, source: sourceDefination } = property;
    if (options && sourceDefination && sourceDefination.dependences) {
        let { apiRoot, apiPath } = sourceDefination;
        let source = { apiRoot, apiPath };
        let params = _.reduce(sourceDefination.dependences, (values, dependence) => {
            values[dependence] = _.get(fields, dependence);
            return values;
        }, {});
        entity.loadPropertyOptions(path, source, params);
    }
    _.forEach(property.properties, (subProperty, subPropertyName) => {
        reloadPropertyOptions(`${path}.${subPropertyName}`, subProperty, entity, fields);
    });
}