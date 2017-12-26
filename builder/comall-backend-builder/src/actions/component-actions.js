export const COMPONENT_UNMOUNT           = 'component.unmount';
export const COMPONENT_SUBMIT            = 'component.submit';
export const COMPONENT_SUBMIT_FINISH     = 'component.submit.finish';

export const COMPONENT_FORM_INIT         = 'component.form.init';
export const COMPONENT_FORM_CHANGE       = 'component.form.change';

export const COMPONENT_TABLE_MODIFY_START    = 'component.table.modify.start';
export const COMPONENT_TABLE_MODIFY_CHANGE   = 'component.table.modify.change';
export const COMPONENT_TABLE_MODIFY_FINISH   = 'component.table.modify.finish';
export const COMPONENT_TABLE_ROW_SELECTION_CHANGE    = 'component.table.row.selection.change';
export const COMPONENT_TABLE_SORT_CHANGE     = 'component.table.sort.change';

/**
 * 卸载组件同时卸载组件状态
 */
export function unmountComponentAction(componentId) {
    return {
        type: COMPONENT_UNMOUNT,
        componentId
    };
}

/**
 * 表单初始化
 */
export function formInitAction(componentId, state) {
    return {
        type: COMPONENT_FORM_INIT,
        componentId,
        payload: state
    };
}

/**
 * 表单项改变
 */
export function formChangeAction(componentId, name, value) {
    return {
        type: COMPONENT_FORM_CHANGE,
        componentId,
        payload: {
            [name]: value
        }
    };
}

/**
 * 组件提交请求事件
 */
export function componentSubmitAction(componentId, type) {
    return {
        type: COMPONENT_SUBMIT,
        componentId,
        payload: type
    };
}

/**
 * 组件提交成功事件
 */
export function componentSubmitFinishAction(componentId) {
    return {
        type: COMPONENT_SUBMIT_FINISH,
        componentId
    };
}

/**
 * 初始化表格行的编辑状态时间
 */
export function tableModifyStartAction(componentId, entity, row) {
    return {
        type: COMPONENT_TABLE_MODIFY_START,
        componentId,
        entity,
        payload: row
    };
}

/**
 * 初始化表格行的编辑状态时间
 */
export function tableModifyChangeAction(componentId, entity, row) {
    return {
        type: COMPONENT_TABLE_MODIFY_CHANGE,
        componentId,
        entity,
        payload: row
    };
}

/**
 * 结束表格行的编辑状态事件
 */
export function tableModifyFinishAction(componentId, entity) {
    return {
        type: COMPONENT_TABLE_MODIFY_FINISH,
        componentId,
        entity
    };
}

/**
 * 表格选中列改变事件
 */
export function tableRowSelectionChangeAction(componentId, selectedRowKeys) {
    return {
        type: COMPONENT_TABLE_ROW_SELECTION_CHANGE,
        componentId,
        payload: selectedRowKeys
    };
}

/**
 * 表格列排序改变事件
 */
export function tableSortChangeAction(componentId, sort) {
    return {
        type: COMPONENT_TABLE_SORT_CHANGE,
        componentId,
        payload: sort
    };
}