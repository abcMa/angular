'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DataTable = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _reactRedux = require('react-redux');

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

var _table = require('../../components/table');

var _actions = require('../../actions');

var actions = _interopRequireWildcard(_actions);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var DEFAULT_PAGE_INDEX = 1;
var DEFAULT_STATE = {
    result: [],
    selectedRowKeys: [],
    sort: {}
};

function mapStateToProps(state, props) {
    var entity = props.entity,
        componentId = props.componentId;

    var component = state.components[componentId];
    var fields = component && component.fields;

    var componentState = (0, _extends3['default'])({
        requestStatus: entity.requestStatus,
        selectedRowKeys: _.get(component, 'selectedRowKeys'),
        submitType: component && component.submitType,
        result: entity.result
    }, entity.paging);

    if (fields) {
        componentState.result = _.map(componentState.result, function (row) {
            if (row.id === fields.id) {
                return (0, _extends3['default'])({}, fields, { _modify: true });
            } else {
                return row;
            }
        });
    }

    componentState.sort = component && component.sort;

    return _.defaults(componentState, DEFAULT_STATE);
}

function mapDispatchToProps(dispatch, props) {
    var componentId = props.componentId,
        entity = props.entity,
        params = props.params,
        onDeleteItem = props.onDeleteItem,
        onSubmitSuccess = props.onSubmitSuccess;

    return _.defaults({ onDeleteItem: onDeleteItem, onSubmitSuccess: onSubmitSuccess }, {
        // 设置初始分页
        onInit: function onInit() {
            var loaderType = props.loaderType;


            if (loaderType) {
                return;
            }

            if (props.pagination) {
                var page = _.get(props, 'pagination.defaultCurrent', DEFAULT_PAGE_INDEX);
                var perPage = _.get(props, 'pagination.pageSize');
                entity.pageChange({ page: page, perPage: perPage });
            }

            if (props.infiniteScroll) {
                var _page = _.get(props, 'infiniteScroll.defaultCurrent', DEFAULT_PAGE_INDEX);
                var _perPage = _.get(props, 'infiniteScroll.pageSize');
                entity.pageChange({ page: _page, perPage: _perPage });
            }

            if (props.loadFirstPage) {
                dispatch(actions.componentSubmitAction(componentId, 'paging'));
                entity.search(params);
            }
        },

        onModifyStart: function onModifyStart(row) {
            dispatch(actions.tableModifyStartAction(componentId, entity, row));
        },

        onModifyConfirm: function onModifyConfirm(row) {
            var fields = {};
            _.forEach(props.columns, function (column) {
                var modifiable = column.modifiable,
                    property = column.property;

                if (modifiable !== false) {
                    _.set(fields, property, _.get(row, property));
                }
            });
            var requestParams = (0, _extends3['default'])({}, params, { id: row.id });
            dispatch(actions.componentSubmitAction(componentId, 'modify'));
            entity.modify(fields, requestParams, { action: actions.tableModifyFinishAction(componentId, entity) });
        },

        onModifyCancel: function onModifyCancel(row) {
            dispatch(actions.tableModifyFinishAction(componentId, entity));
        },

        onModifyChange: function onModifyChange(name, value, row) {
            var fields = _.cloneDeep(row);
            _.set(fields, name, value);
            if (props.convertModifyFields) {
                fields = props.convertModifyFields(fields);
            }
            dispatch(actions.tableModifyChangeAction(componentId, entity, fields));
        },

        onRowSelectionChange: function onRowSelectionChange(selectedRowKeys) {
            dispatch(actions.tableRowSelectionChangeAction(componentId, selectedRowKeys));
        },

        // 删除条目
        onDeleteItem: function onDeleteItem(itemId) {
            dispatch(actions.componentSubmitAction(componentId, 'delete'));
            entity['delete']((0, _extends3['default'])({}, params, { id: itemId }));
        },

        // 筛选条件改变
        onChange: function onChange(pagination, filters, sorter) {
            var page = pagination.current,
                perPage = pagination.pageSize;

            var paging = entity.paging;

            if (page && perPage && (page !== paging.page || perPage !== paging.perPage)) {
                dispatch(actions.componentSubmitAction(componentId, 'paging'));
                entity.pageChange(_.defaults({ page: page, perPage: perPage }, paging));
                entity.search(params);
            } else {
                var field = sorter.field,
                    order = sorter.order;

                var sorterFilter = (0, _extends3['default'])({}, entity.filters, { field: field, order: order });
                var column = _.find(props.columns, { property: field });
                dispatch(actions.tableSortChangeAction(componentId, { field: field, order: order }));

                if (column && typeof column.sorter !== 'function') {
                    dispatch(actions.componentSubmitAction(componentId, 'paging'));
                    entity.filtersChange(sorterFilter);
                    entity.search(params);
                }
            }
        },

        onLoadNextPage: function onLoadNextPage() {
            dispatch(actions.componentSubmitAction(componentId, 'loadNextPage'));
            entity.loadNextPage();
        },

        onSubmitSuccess: function onSubmitSuccess(result, submitType) {
            if (submitType === 'modify' || submitType === 'delete') {
                entity.search(params);
            }
        },

        onSubmitFinish: function onSubmitFinish() {
            dispatch(actions.componentSubmitFinishAction(componentId));
        }
    });
}

var DataTable = exports.DataTable = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(_table.Table);