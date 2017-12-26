'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.COMPONENT_TABLE_SORT_CHANGE = exports.COMPONENT_TABLE_ROW_SELECTION_CHANGE = exports.COMPONENT_TABLE_MODIFY_FINISH = exports.COMPONENT_TABLE_MODIFY_CHANGE = exports.COMPONENT_TABLE_MODIFY_START = exports.COMPONENT_FORM_CHANGE = exports.COMPONENT_FORM_INIT = exports.COMPONENT_SUBMIT_FINISH = exports.COMPONENT_SUBMIT = exports.COMPONENT_UNMOUNT = undefined;

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

exports.unmountComponentAction = unmountComponentAction;
exports.formInitAction = formInitAction;
exports.formChangeAction = formChangeAction;
exports.componentSubmitAction = componentSubmitAction;
exports.componentSubmitFinishAction = componentSubmitFinishAction;
exports.tableModifyStartAction = tableModifyStartAction;
exports.tableModifyChangeAction = tableModifyChangeAction;
exports.tableModifyFinishAction = tableModifyFinishAction;
exports.tableRowSelectionChangeAction = tableRowSelectionChangeAction;
exports.tableSortChangeAction = tableSortChangeAction;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var COMPONENT_UNMOUNT = exports.COMPONENT_UNMOUNT = 'component.unmount';
var COMPONENT_SUBMIT = exports.COMPONENT_SUBMIT = 'component.submit';
var COMPONENT_SUBMIT_FINISH = exports.COMPONENT_SUBMIT_FINISH = 'component.submit.finish';

var COMPONENT_FORM_INIT = exports.COMPONENT_FORM_INIT = 'component.form.init';
var COMPONENT_FORM_CHANGE = exports.COMPONENT_FORM_CHANGE = 'component.form.change';

var COMPONENT_TABLE_MODIFY_START = exports.COMPONENT_TABLE_MODIFY_START = 'component.table.modify.start';
var COMPONENT_TABLE_MODIFY_CHANGE = exports.COMPONENT_TABLE_MODIFY_CHANGE = 'component.table.modify.change';
var COMPONENT_TABLE_MODIFY_FINISH = exports.COMPONENT_TABLE_MODIFY_FINISH = 'component.table.modify.finish';
var COMPONENT_TABLE_ROW_SELECTION_CHANGE = exports.COMPONENT_TABLE_ROW_SELECTION_CHANGE = 'component.table.row.selection.change';
var COMPONENT_TABLE_SORT_CHANGE = exports.COMPONENT_TABLE_SORT_CHANGE = 'component.table.sort.change';

/**
 * 卸载组件同时卸载组件状态
 */
function unmountComponentAction(componentId) {
    return {
        type: COMPONENT_UNMOUNT,
        componentId: componentId
    };
}

/**
 * 表单初始化
 */
function formInitAction(componentId, state) {
    return {
        type: COMPONENT_FORM_INIT,
        componentId: componentId,
        payload: state
    };
}

/**
 * 表单项改变
 */
function formChangeAction(componentId, name, value) {
    return {
        type: COMPONENT_FORM_CHANGE,
        componentId: componentId,
        payload: (0, _defineProperty3['default'])({}, name, value)
    };
}

/**
 * 组件提交请求事件
 */
function componentSubmitAction(componentId, type) {
    return {
        type: COMPONENT_SUBMIT,
        componentId: componentId,
        payload: type
    };
}

/**
 * 组件提交成功事件
 */
function componentSubmitFinishAction(componentId) {
    return {
        type: COMPONENT_SUBMIT_FINISH,
        componentId: componentId
    };
}

/**
 * 初始化表格行的编辑状态时间
 */
function tableModifyStartAction(componentId, entity, row) {
    return {
        type: COMPONENT_TABLE_MODIFY_START,
        componentId: componentId,
        entity: entity,
        payload: row
    };
}

/**
 * 初始化表格行的编辑状态时间
 */
function tableModifyChangeAction(componentId, entity, row) {
    return {
        type: COMPONENT_TABLE_MODIFY_CHANGE,
        componentId: componentId,
        entity: entity,
        payload: row
    };
}

/**
 * 结束表格行的编辑状态事件
 */
function tableModifyFinishAction(componentId, entity) {
    return {
        type: COMPONENT_TABLE_MODIFY_FINISH,
        componentId: componentId,
        entity: entity
    };
}

/**
 * 表格选中列改变事件
 */
function tableRowSelectionChangeAction(componentId, selectedRowKeys) {
    return {
        type: COMPONENT_TABLE_ROW_SELECTION_CHANGE,
        componentId: componentId,
        payload: selectedRowKeys
    };
}

/**
 * 表格列排序改变事件
 */
function tableSortChangeAction(componentId, sort) {
    return {
        type: COMPONENT_TABLE_SORT_CHANGE,
        componentId: componentId,
        payload: sort
    };
}