import * as _ from 'lodash';
import * as actions from '../actions';

function assignDataToEntity(state, entityId, data) {
    let entity = state[entityId] || {};
    entity = { ...entity, ...data };
    if (entity.paging === null) {
        delete entity.paging;
    }
    if (entity.error === null) {
        delete entity.error;
    }
    return { ...state, [entityId]: entity };
}

/**
 * 获取目标节点
 * @param {array} options - 整个数据源的options
 * @param {array} payload - 新请求回的数据
 * @returns {object|null} 返回目标节点item或者null
 */
function getTargetItem(options, payload) {
    for (let item of options) {
        if (item.id === payload.id) {
            return item;
        }
        if (item.children) {
            let deepItem = getTargetItem(item.children, payload);
            if (deepItem) {
                return deepItem;
            }
        }
    }
    return null;
}

export function entityReducer(state = {}, action) {
    const { entity, payload } = action;
    let entityId = entity && entity.id;
    let metainfo;

    if (entityId === undefined) {
        return state;
    }

    switch(action.type) {

        case actions.SEARCH:
            state = assignDataToEntity(state, entityId, {requestStatus: 'pending', error: null});
            break;

        case actions.LOAD_NEXT_PAGE:
            state = assignDataToEntity(state, entityId, {requestStatus: 'pending', error: null});
            break;

        case actions.ADD:
            state = assignDataToEntity(state, entityId, {requestStatus: 'pending', created: null, error: null});
            break;

        case actions.GET:
            state = assignDataToEntity(state, entityId, {requestStatus: 'pending', error: null});
            break;

        case actions.MODIFY:
            state = assignDataToEntity(state, entityId, {requestStatus: 'pending', error: null});
            break;

        case actions.DELETE:
            state = assignDataToEntity(state, entityId, {requestStatus: 'pending', error: null});
            break;

        case actions.SEARCH_SUCCESS:
            // 搜索资源成功后，设置分页数据
            state = assignDataToEntity(state, entityId, {
                requestStatus: 'success',
                result: payload.result || payload,
                paging: {
                    page: payload.page,
                    perPage: payload.perPage,
                    totalNum: payload.totalNum,
                    totalPage: payload.totalPage
                }
            });
            break;

        case actions.LOAD_NEXT_PAGE_SUCCESS:
            // 下一页加载成功后，设置分页数据
            let result = _.get(entity, 'result', []).concat(payload.result);
            let { page, perPage, totalNum, totalPage } = payload;
            state = assignDataToEntity(state, entityId, {
                requestStatus: 'success',
                result,
                paging: { page, perPage, totalNum, totalPage }
            });
            break;

        case actions.ADD_SUCCESS:
            // 创建资源成功后，将 id 设置到 created 中
            state = assignDataToEntity(state, entityId, {requestStatus: 'success', created: payload});
            break;

        case actions.GET_SUCCESS:
            // 获取目标资源成功后，把获取的对象放到当前的实体中
            state = assignDataToEntity(state, entityId, {requestStatus: 'success', fields: payload});
            break;

        case actions.MODIFY_SUCCESS:
            state = assignDataToEntity(state, entityId, {requestStatus: 'success'});
            break;

        case actions.DELETE_SUCCESS:
            state = assignDataToEntity(state, entityId, {requestStatus: 'success'});
            break;

        case actions.SEARCH_FAILED:
            // 请求失败
            state = assignDataToEntity(state, entityId, {requestStatus: 'failed', paging: null, error: payload});
            break;

        case actions.LOAD_NEXT_PAGE_FAILED:
            state = assignDataToEntity(state, entityId, {requestStatus: 'failed'});
            break;

        case actions.ADD_FAILED:
            state = assignDataToEntity(state, entityId, {requestStatus: 'failed', error: payload});
            break;

        case actions.GET_FAILED:
            state = assignDataToEntity(state, entityId, {requestStatus: 'failed', fields: null, error: payload});
            break;

        case actions.MODIFY_FAILED:
            state = assignDataToEntity(state, entityId, {requestStatus: 'failed', error: payload});
            break;

        case actions.DELETE_FAILED:
            state = assignDataToEntity(state, entityId, {requestStatus: 'failed', error: payload});
            break;

        case actions.ENTITY_SET_META:
            // 修改实体的配置信息
            state = assignDataToEntity(state, entityId, {metainfo: payload});
            break;

        case actions.ENTITY_SET_FIELDS:
            // 修改实体的表单信息
            state = assignDataToEntity(state, entityId, {fields: payload});
            break;

        case actions.LOAD_PROPERTY_OPTIONS_SUCCESS:
            // 修改设置属性候选项
            metainfo = _.cloneDeep(entity.metainfo);
            const { fieldName } = action;
            let path = fieldName.split('.').join('.properties.');
            let propertiesItem = { ...entity.metainfo.properties };
            _.forEach(path.split('.'), val => {
                propertiesItem = propertiesItem[ val ];
            });
            const { source, options } = propertiesItem;
            let optionsData = [];
            switch (source.dataType) {
                case 'treeNode':
                    const targetItem = getTargetItem(options, payload);
                    if (targetItem) {
                        targetItem.children = payload.children;
                        optionsData = options;
                    } else {
                        optionsData = payload.children;
                    }
                    break;
                case 'paging':
                    optionsData = payload.result;
                    break;
                default:
                    optionsData = payload;
                    break;
            }
            _.set(metainfo.properties, `${ path }.options`, optionsData);
            state = assignDataToEntity(state, entityId, { metainfo: metainfo });
            break;

        case actions.LOAD_FILTER_OPTIONS_SUCCESS:
            // 修改设置属性候选项
            metainfo = _.cloneDeep(entity.metainfo);
            metainfo.filters[action.fieldName].options = _.isArray(payload) ? payload : payload.result;

            state = assignDataToEntity(state, entityId, {metainfo: metainfo});
            break;

        case actions.PAGE_CHANGE:
            // 设置分页信息，此时paging为分页条件
            state = assignDataToEntity(state, entityId, {paging: payload});
            break;

        case actions.FILTERS_CHANGE:
            // 将过滤条件filters放入实体中
            state = assignDataToEntity(state, entityId, {filters: payload});
            break;

        case actions.ENTITY_UNMOUNT:
            // 清空实体信息
            state = { ...state };
            delete state[entityId];
            break;

        default:
            // do nothing
    }

    return state;
}
