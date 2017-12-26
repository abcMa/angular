export const FILTERS_CHANGE         = 'entity.filters.change';

export const PAGE_CHANGE            = 'entity.page.change';
export const LOAD_NEXT_PAGE         = 'entity.page.next';
export const LOAD_NEXT_PAGE_SUCCESS = 'entity.page.next.success';
export const LOAD_NEXT_PAGE_FAILED  = 'entity.page.next.failed';

export const SEARCH                 = 'entity.search';
export const SEARCH_SUCCESS         = 'entity.search.success';
export const SEARCH_FAILED          = 'entity.search.failed';

export const ADD                    = 'entity.add';
export const ADD_SUCCESS            = 'entity.add.success';
export const ADD_FAILED             = 'entity.add.failed';

export const DELETE                 = 'entity.delete';
export const DELETE_SUCCESS         = 'entity.delete.success';
export const DELETE_FAILED          = 'entity.delete.failed';

export const GET                    = 'entity.get';
export const GET_SUCCESS            = 'entity.get.success';
export const GET_FAILED             = 'entity.get.failed';

export const MODIFY                 = 'entity.modify';
export const MODIFY_SUCCESS         = 'entity.modify.success';
export const MODIFY_FAILED          = 'entity.modify.failed';

export const ENTITY_SET_META        = 'entity.set.meta';
export const ENTITY_SET_FIELDS      = 'entity.set.fields';

export const LOAD_PROPERTY_OPTIONS           = 'entity.load.property.options';
export const LOAD_PROPERTY_OPTIONS_SUCCESS   = 'entity.load.property.options.success';
export const LOAD_PROPERTY_OPTIONS_FAILED    = 'entity.load.property.options.failed';

export const LOAD_FILTER_OPTIONS             = 'entity.load.filter.options';
export const LOAD_FILTER_OPTIONS_SUCCESS     = 'entity.load.filter.options.success';
export const LOAD_FILTER_OPTIONS_FAILED      = 'entity.load.filter.options.failed';

export const ENTITY_UNMOUNT         = 'entity.unmount';

/**
 * 将过滤条件filters放入实体中
 */
export function filtersChangeAction(entity, filters) {
    return {
        type: FILTERS_CHANGE,
        entity,
        payload: filters
    };
}

/**
 * 切换分页
 * paging 作用：为了在reducer中把paging，放到实体中
 */
export function pageChangeAction(entity, paging) {
    return {
        type: PAGE_CHANGE,
        entity,
        payload: paging
    };
}

/**
 * 加载下一页数据 action
 */
export function loadNextPageAction(entity, params, successBehavior, errorBehavior) {
    return {
        type: LOAD_NEXT_PAGE,
        entity,
        params,
        successBehavior,
        errorBehavior
    };
}

/**
 * 加载下一页数据成功 action
 */
export function loadNextPageSuccessAction(entity, response) {
    return {
        type: LOAD_NEXT_PAGE_SUCCESS,
        entity,
        payload: response
    };
}

/**
 * 加载下一页数据失败 action
 */
export function loadNextPageFailedAction(entity, error) {
    return {
        type: LOAD_NEXT_PAGE_FAILED,
        entity,
        payload: error
    };
}

/**
 * 提交搜索action，获取当前参数下的列表信息
 */
export function searchAction(entity, params, successBehavior, errorBehavior) {

    return {
        type: SEARCH,
        entity,
        params,
        successBehavior,
        errorBehavior
    };
}

/**
 * 搜索成功action
 */
export function searchSuccessAction(entity, response) {
    return {
        type: SEARCH_SUCCESS,
        entity,
        payload: response
    };
}

/**
 * 搜索失败action
 */
export function searchFailedAction(entity, error) {
    return {
        type: SEARCH_FAILED,
        entity,
        payload: error
    };
}

/**
 * 提交新增action
 */
export function addAction(entity, fields, params, successBehavior, errorBehavior) {

    return {
        type: ADD,
        entity,
        fields,
        params,
        successBehavior,
        errorBehavior
    };
}

/**
 * 新增成功action
 */
export function addSuccessAction(entity, id) {
    return {
        type: ADD_SUCCESS,
        entity,
        payload: id
    };
}

/**
 * 新增失败action
 */
export function addFailedAction(entity, error) {
    return {
        type: ADD_FAILED,
        entity,
        payload: error
    };
}

/**
 * 提交删除action
 */
export function deleteAction(entity, params, successBehavior, errorBehavior) {

    return {
        type: DELETE,
        entity,
        params,
        successBehavior,
        errorBehavior
    };
}

/**
 * 删除成功action
 */
export function deleteSuccessAction(entity) {
    return {
        type: DELETE_SUCCESS,
        entity
    };
}

/**
 * 删除失败action
 */
export function deleteFailedAction(entity, error) {
    return {
        type: DELETE_FAILED,
        entity,
        payload: error
    };
}

/**
 * 获取某一纪录action，用于编辑前展示当前纪录的信息
 */
export function getAction(entity, params, successBehavior, errorBehavior) {

    return {
        type: GET,
        entity,
        params,
        successBehavior,
        errorBehavior
    };
}

/**
 * 获取某一纪录成功action
 */
export function getSuccessAction(entity, fields) {
    return {
        type: GET_SUCCESS,
        entity,
        payload: fields
    };
}

/**
 * 获取某一纪录失败action
 */
export function getFailedAction(entity, error) {
    return {
        type: GET_FAILED,
        entity,
        payload: error
    };
}

/**
 * 提交修改action
 */
export function modifyAction(entity, fields, params, successBehavior, errorBehavior) {

    return {
        type: MODIFY,
        entity,
        fields,
        params,
        successBehavior,
        errorBehavior
    };
}

/**
 * 修改成功action
 */
export function modifySuccessAction(entity) {
    return {
        type: MODIFY_SUCCESS,
        entity
    };
}

/**
 * 修改失败action
 */
export function modifyFailedAction(entity, error) {
    return {
        type: MODIFY_FAILED,
        entity,
        payload: error
    };
}

/**
 * 设置实体元数据actions
 */
export function setEntityMetaAction(entity, metainfo) {
    return {
        type: ENTITY_SET_META,
        entity,
        payload: metainfo
    };
}

/**
 * 设置实体的fields
 */
export function setEntityFieldsAction(entity, fields) {
    return {
        type: ENTITY_SET_FIELDS,
        entity,
        payload: fields
    };
}

/**
 * 获取属性候选项action
 */
export function loadPropertyOptionsAction(entity, fieldName, source) {
    return {
        type: LOAD_PROPERTY_OPTIONS,
        entity,
        fieldName,
        source
    };
}

/**
 * 获取属性候选项成功action
 */
export function loadPropertyOptionsSuccessAction(entity, fieldName, options) {
    return {
        type: LOAD_PROPERTY_OPTIONS_SUCCESS,
        entity,
        fieldName,
        payload: options
    };
}

/**
 * 获取属性候选项失败action
 */
export function loadPropertyOptionsFailedAction(entity, error) {
    return {
        type: LOAD_PROPERTY_OPTIONS_FAILED,
        entity,
        payload: error
    };
}

/**
 * 获取属性候选项action
 */
export function loadFilterOptionsAction(entity, fieldName, source) {
    return {
        type: LOAD_FILTER_OPTIONS,
        entity,
        fieldName,
        source
    };
}

/**
 * 获取属性候选项成功action
 */
export function loadFilterOptionsSuccessAction(entity, fieldName, options) {
    return {
        type: LOAD_FILTER_OPTIONS_SUCCESS,
        entity,
        fieldName,
        payload: options
    };
}

/**
 * 获取属性候选项失败action
 */
export function loadFilterOptionsFailedAction(entity, error) {
    return {
        type: LOAD_FILTER_OPTIONS_FAILED,
        entity,
        payload: error
    };
}

/**
 * 卸载组件同时卸载绑定的实体
 */
export function unmountEntityAction(entity) {
    return {
        type: ENTITY_UNMOUNT,
        entity
    };
}
