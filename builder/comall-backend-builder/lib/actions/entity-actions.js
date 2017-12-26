'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.filtersChangeAction = filtersChangeAction;
exports.pageChangeAction = pageChangeAction;
exports.loadNextPageAction = loadNextPageAction;
exports.loadNextPageSuccessAction = loadNextPageSuccessAction;
exports.loadNextPageFailedAction = loadNextPageFailedAction;
exports.searchAction = searchAction;
exports.searchSuccessAction = searchSuccessAction;
exports.searchFailedAction = searchFailedAction;
exports.addAction = addAction;
exports.addSuccessAction = addSuccessAction;
exports.addFailedAction = addFailedAction;
exports.deleteAction = deleteAction;
exports.deleteSuccessAction = deleteSuccessAction;
exports.deleteFailedAction = deleteFailedAction;
exports.getAction = getAction;
exports.getSuccessAction = getSuccessAction;
exports.getFailedAction = getFailedAction;
exports.modifyAction = modifyAction;
exports.modifySuccessAction = modifySuccessAction;
exports.modifyFailedAction = modifyFailedAction;
exports.setEntityMetaAction = setEntityMetaAction;
exports.setEntityFieldsAction = setEntityFieldsAction;
exports.loadPropertyOptionsAction = loadPropertyOptionsAction;
exports.loadPropertyOptionsSuccessAction = loadPropertyOptionsSuccessAction;
exports.loadPropertyOptionsFailedAction = loadPropertyOptionsFailedAction;
exports.loadFilterOptionsAction = loadFilterOptionsAction;
exports.loadFilterOptionsSuccessAction = loadFilterOptionsSuccessAction;
exports.loadFilterOptionsFailedAction = loadFilterOptionsFailedAction;
exports.unmountEntityAction = unmountEntityAction;
var FILTERS_CHANGE = exports.FILTERS_CHANGE = 'entity.filters.change';

var PAGE_CHANGE = exports.PAGE_CHANGE = 'entity.page.change';
var LOAD_NEXT_PAGE = exports.LOAD_NEXT_PAGE = 'entity.page.next';
var LOAD_NEXT_PAGE_SUCCESS = exports.LOAD_NEXT_PAGE_SUCCESS = 'entity.page.next.success';
var LOAD_NEXT_PAGE_FAILED = exports.LOAD_NEXT_PAGE_FAILED = 'entity.page.next.failed';

var SEARCH = exports.SEARCH = 'entity.search';
var SEARCH_SUCCESS = exports.SEARCH_SUCCESS = 'entity.search.success';
var SEARCH_FAILED = exports.SEARCH_FAILED = 'entity.search.failed';

var ADD = exports.ADD = 'entity.add';
var ADD_SUCCESS = exports.ADD_SUCCESS = 'entity.add.success';
var ADD_FAILED = exports.ADD_FAILED = 'entity.add.failed';

var DELETE = exports.DELETE = 'entity.delete';
var DELETE_SUCCESS = exports.DELETE_SUCCESS = 'entity.delete.success';
var DELETE_FAILED = exports.DELETE_FAILED = 'entity.delete.failed';

var GET = exports.GET = 'entity.get';
var GET_SUCCESS = exports.GET_SUCCESS = 'entity.get.success';
var GET_FAILED = exports.GET_FAILED = 'entity.get.failed';

var MODIFY = exports.MODIFY = 'entity.modify';
var MODIFY_SUCCESS = exports.MODIFY_SUCCESS = 'entity.modify.success';
var MODIFY_FAILED = exports.MODIFY_FAILED = 'entity.modify.failed';

var ENTITY_SET_META = exports.ENTITY_SET_META = 'entity.set.meta';
var ENTITY_SET_FIELDS = exports.ENTITY_SET_FIELDS = 'entity.set.fields';

var LOAD_PROPERTY_OPTIONS = exports.LOAD_PROPERTY_OPTIONS = 'entity.load.property.options';
var LOAD_PROPERTY_OPTIONS_SUCCESS = exports.LOAD_PROPERTY_OPTIONS_SUCCESS = 'entity.load.property.options.success';
var LOAD_PROPERTY_OPTIONS_FAILED = exports.LOAD_PROPERTY_OPTIONS_FAILED = 'entity.load.property.options.failed';

var LOAD_FILTER_OPTIONS = exports.LOAD_FILTER_OPTIONS = 'entity.load.filter.options';
var LOAD_FILTER_OPTIONS_SUCCESS = exports.LOAD_FILTER_OPTIONS_SUCCESS = 'entity.load.filter.options.success';
var LOAD_FILTER_OPTIONS_FAILED = exports.LOAD_FILTER_OPTIONS_FAILED = 'entity.load.filter.options.failed';

var ENTITY_UNMOUNT = exports.ENTITY_UNMOUNT = 'entity.unmount';

/**
 * 将过滤条件filters放入实体中
 */
function filtersChangeAction(entity, filters) {
    return {
        type: FILTERS_CHANGE,
        entity: entity,
        payload: filters
    };
}

/**
 * 切换分页
 * paging 作用：为了在reducer中把paging，放到实体中
 */
function pageChangeAction(entity, paging) {
    return {
        type: PAGE_CHANGE,
        entity: entity,
        payload: paging
    };
}

/**
 * 加载下一页数据 action
 */
function loadNextPageAction(entity, params, successBehavior, errorBehavior) {
    return {
        type: LOAD_NEXT_PAGE,
        entity: entity,
        params: params,
        successBehavior: successBehavior,
        errorBehavior: errorBehavior
    };
}

/**
 * 加载下一页数据成功 action
 */
function loadNextPageSuccessAction(entity, response) {
    return {
        type: LOAD_NEXT_PAGE_SUCCESS,
        entity: entity,
        payload: response
    };
}

/**
 * 加载下一页数据失败 action
 */
function loadNextPageFailedAction(entity, error) {
    return {
        type: LOAD_NEXT_PAGE_FAILED,
        entity: entity,
        payload: error
    };
}

/**
 * 提交搜索action，获取当前参数下的列表信息
 */
function searchAction(entity, params, successBehavior, errorBehavior) {

    return {
        type: SEARCH,
        entity: entity,
        params: params,
        successBehavior: successBehavior,
        errorBehavior: errorBehavior
    };
}

/**
 * 搜索成功action
 */
function searchSuccessAction(entity, response) {
    return {
        type: SEARCH_SUCCESS,
        entity: entity,
        payload: response
    };
}

/**
 * 搜索失败action
 */
function searchFailedAction(entity, error) {
    return {
        type: SEARCH_FAILED,
        entity: entity,
        payload: error
    };
}

/**
 * 提交新增action
 */
function addAction(entity, fields, params, successBehavior, errorBehavior) {

    return {
        type: ADD,
        entity: entity,
        fields: fields,
        params: params,
        successBehavior: successBehavior,
        errorBehavior: errorBehavior
    };
}

/**
 * 新增成功action
 */
function addSuccessAction(entity, id) {
    return {
        type: ADD_SUCCESS,
        entity: entity,
        payload: id
    };
}

/**
 * 新增失败action
 */
function addFailedAction(entity, error) {
    return {
        type: ADD_FAILED,
        entity: entity,
        payload: error
    };
}

/**
 * 提交删除action
 */
function deleteAction(entity, params, successBehavior, errorBehavior) {

    return {
        type: DELETE,
        entity: entity,
        params: params,
        successBehavior: successBehavior,
        errorBehavior: errorBehavior
    };
}

/**
 * 删除成功action
 */
function deleteSuccessAction(entity) {
    return {
        type: DELETE_SUCCESS,
        entity: entity
    };
}

/**
 * 删除失败action
 */
function deleteFailedAction(entity, error) {
    return {
        type: DELETE_FAILED,
        entity: entity,
        payload: error
    };
}

/**
 * 获取某一纪录action，用于编辑前展示当前纪录的信息
 */
function getAction(entity, params, successBehavior, errorBehavior) {

    return {
        type: GET,
        entity: entity,
        params: params,
        successBehavior: successBehavior,
        errorBehavior: errorBehavior
    };
}

/**
 * 获取某一纪录成功action
 */
function getSuccessAction(entity, fields) {
    return {
        type: GET_SUCCESS,
        entity: entity,
        payload: fields
    };
}

/**
 * 获取某一纪录失败action
 */
function getFailedAction(entity, error) {
    return {
        type: GET_FAILED,
        entity: entity,
        payload: error
    };
}

/**
 * 提交修改action
 */
function modifyAction(entity, fields, params, successBehavior, errorBehavior) {

    return {
        type: MODIFY,
        entity: entity,
        fields: fields,
        params: params,
        successBehavior: successBehavior,
        errorBehavior: errorBehavior
    };
}

/**
 * 修改成功action
 */
function modifySuccessAction(entity) {
    return {
        type: MODIFY_SUCCESS,
        entity: entity
    };
}

/**
 * 修改失败action
 */
function modifyFailedAction(entity, error) {
    return {
        type: MODIFY_FAILED,
        entity: entity,
        payload: error
    };
}

/**
 * 设置实体元数据actions
 */
function setEntityMetaAction(entity, metainfo) {
    return {
        type: ENTITY_SET_META,
        entity: entity,
        payload: metainfo
    };
}

/**
 * 设置实体的fields
 */
function setEntityFieldsAction(entity, fields) {
    return {
        type: ENTITY_SET_FIELDS,
        entity: entity,
        payload: fields
    };
}

/**
 * 获取属性候选项action
 */
function loadPropertyOptionsAction(entity, fieldName, source) {
    return {
        type: LOAD_PROPERTY_OPTIONS,
        entity: entity,
        fieldName: fieldName,
        source: source
    };
}

/**
 * 获取属性候选项成功action
 */
function loadPropertyOptionsSuccessAction(entity, fieldName, options) {
    return {
        type: LOAD_PROPERTY_OPTIONS_SUCCESS,
        entity: entity,
        fieldName: fieldName,
        payload: options
    };
}

/**
 * 获取属性候选项失败action
 */
function loadPropertyOptionsFailedAction(entity, error) {
    return {
        type: LOAD_PROPERTY_OPTIONS_FAILED,
        entity: entity,
        payload: error
    };
}

/**
 * 获取属性候选项action
 */
function loadFilterOptionsAction(entity, fieldName, source) {
    return {
        type: LOAD_FILTER_OPTIONS,
        entity: entity,
        fieldName: fieldName,
        source: source
    };
}

/**
 * 获取属性候选项成功action
 */
function loadFilterOptionsSuccessAction(entity, fieldName, options) {
    return {
        type: LOAD_FILTER_OPTIONS_SUCCESS,
        entity: entity,
        fieldName: fieldName,
        payload: options
    };
}

/**
 * 获取属性候选项失败action
 */
function loadFilterOptionsFailedAction(entity, error) {
    return {
        type: LOAD_FILTER_OPTIONS_FAILED,
        entity: entity,
        payload: error
    };
}

/**
 * 卸载组件同时卸载绑定的实体
 */
function unmountEntityAction(entity) {
    return {
        type: ENTITY_UNMOUNT,
        entity: entity
    };
}