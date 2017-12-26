'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends3 = require('babel-runtime/helpers/extends');

var _extends4 = _interopRequireDefault(_extends3);

exports.entityReducer = entityReducer;

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

var _actions = require('../actions');

var actions = _interopRequireWildcard(_actions);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function assignDataToEntity(state, entityId, data) {
    var entity = state[entityId] || {};
    entity = (0, _extends4['default'])({}, entity, data);
    if (entity.paging === null) {
        delete entity.paging;
    }
    if (entity.error === null) {
        delete entity.error;
    }
    return (0, _extends4['default'])({}, state, (0, _defineProperty3['default'])({}, entityId, entity));
}

/**
 * 获取目标节点
 * @param {array} options - 整个数据源的options
 * @param {array} payload - 新请求回的数据
 * @returns {object|null} 返回目标节点item或者null
 */
function getTargetItem(options, payload) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = options[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var item = _step.value;

            if (item.id === payload.id) {
                return item;
            }
            if (item.children) {
                var deepItem = getTargetItem(item.children, payload);
                if (deepItem) {
                    return deepItem;
                }
            }
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator['return']) {
                _iterator['return']();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    return null;
}

function entityReducer() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var action = arguments[1];
    var entity = action.entity,
        payload = action.payload;

    var entityId = entity && entity.id;
    var metainfo = void 0;

    if (entityId === undefined) {
        return state;
    }

    switch (action.type) {

        case actions.SEARCH:
            state = assignDataToEntity(state, entityId, { requestStatus: 'pending', error: null });
            break;

        case actions.LOAD_NEXT_PAGE:
            state = assignDataToEntity(state, entityId, { requestStatus: 'pending', error: null });
            break;

        case actions.ADD:
            state = assignDataToEntity(state, entityId, { requestStatus: 'pending', created: null, error: null });
            break;

        case actions.GET:
            state = assignDataToEntity(state, entityId, { requestStatus: 'pending', error: null });
            break;

        case actions.MODIFY:
            state = assignDataToEntity(state, entityId, { requestStatus: 'pending', error: null });
            break;

        case actions.DELETE:
            state = assignDataToEntity(state, entityId, { requestStatus: 'pending', error: null });
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
            var result = _.get(entity, 'result', []).concat(payload.result);
            var page = payload.page,
                perPage = payload.perPage,
                totalNum = payload.totalNum,
                totalPage = payload.totalPage;

            state = assignDataToEntity(state, entityId, {
                requestStatus: 'success',
                result: result,
                paging: { page: page, perPage: perPage, totalNum: totalNum, totalPage: totalPage }
            });
            break;

        case actions.ADD_SUCCESS:
            // 创建资源成功后，将 id 设置到 created 中
            state = assignDataToEntity(state, entityId, { requestStatus: 'success', created: payload });
            break;

        case actions.GET_SUCCESS:
            // 获取目标资源成功后，把获取的对象放到当前的实体中
            state = assignDataToEntity(state, entityId, { requestStatus: 'success', fields: payload });
            break;

        case actions.MODIFY_SUCCESS:
            state = assignDataToEntity(state, entityId, { requestStatus: 'success' });
            break;

        case actions.DELETE_SUCCESS:
            state = assignDataToEntity(state, entityId, { requestStatus: 'success' });
            break;

        case actions.SEARCH_FAILED:
            // 请求失败
            state = assignDataToEntity(state, entityId, { requestStatus: 'failed', paging: null, error: payload });
            break;

        case actions.LOAD_NEXT_PAGE_FAILED:
            state = assignDataToEntity(state, entityId, { requestStatus: 'failed' });
            break;

        case actions.ADD_FAILED:
            state = assignDataToEntity(state, entityId, { requestStatus: 'failed', error: payload });
            break;

        case actions.GET_FAILED:
            state = assignDataToEntity(state, entityId, { requestStatus: 'failed', fields: null, error: payload });
            break;

        case actions.MODIFY_FAILED:
            state = assignDataToEntity(state, entityId, { requestStatus: 'failed', error: payload });
            break;

        case actions.DELETE_FAILED:
            state = assignDataToEntity(state, entityId, { requestStatus: 'failed', error: payload });
            break;

        case actions.ENTITY_SET_META:
            // 修改实体的配置信息
            state = assignDataToEntity(state, entityId, { metainfo: payload });
            break;

        case actions.ENTITY_SET_FIELDS:
            // 修改实体的表单信息
            state = assignDataToEntity(state, entityId, { fields: payload });
            break;

        case actions.LOAD_PROPERTY_OPTIONS_SUCCESS:
            // 修改设置属性候选项
            metainfo = _.cloneDeep(entity.metainfo);
            var fieldName = action.fieldName;

            var path = fieldName.split('.').join('.properties.');
            var propertiesItem = (0, _extends4['default'])({}, entity.metainfo.properties);
            _.forEach(path.split('.'), function (val) {
                propertiesItem = propertiesItem[val];
            });
            var _propertiesItem = propertiesItem,
                source = _propertiesItem.source,
                options = _propertiesItem.options;

            var optionsData = [];
            switch (source.dataType) {
                case 'treeNode':
                    var targetItem = getTargetItem(options, payload);
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
            _.set(metainfo.properties, path + '.options', optionsData);
            state = assignDataToEntity(state, entityId, { metainfo: metainfo });
            break;

        case actions.LOAD_FILTER_OPTIONS_SUCCESS:
            // 修改设置属性候选项
            metainfo = _.cloneDeep(entity.metainfo);
            metainfo.filters[action.fieldName].options = _.isArray(payload) ? payload : payload.result;

            state = assignDataToEntity(state, entityId, { metainfo: metainfo });
            break;

        case actions.PAGE_CHANGE:
            // 设置分页信息，此时paging为分页条件
            state = assignDataToEntity(state, entityId, { paging: payload });
            break;

        case actions.FILTERS_CHANGE:
            // 将过滤条件filters放入实体中
            state = assignDataToEntity(state, entityId, { filters: payload });
            break;

        case actions.ENTITY_UNMOUNT:
            // 清空实体信息
            state = (0, _extends4['default'])({}, state);
            delete state[entityId];
            break;

        default:
        // do nothing
    }

    return state;
}