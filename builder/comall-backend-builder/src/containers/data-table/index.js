import { connect } from 'react-redux';
import * as _ from 'lodash';

import { Table } from '../../components/table';
import * as actions from '../../actions';

const DEFAULT_PAGE_INDEX = 1;
const DEFAULT_STATE = {
    result: [],
    selectedRowKeys: [],
    sort: {}
};

function mapStateToProps(state, props) {
    const { entity, componentId } = props;
    const component = state.components[componentId];
    const fields = component && component.fields;

    let componentState = {
        requestStatus: entity.requestStatus,
        selectedRowKeys: _.get(component, 'selectedRowKeys'),
        submitType: component && component.submitType,
        result: entity.result,
        ...entity.paging
    };

    if (fields) {
        componentState.result = _.map(componentState.result, row => {
            if (row.id === fields.id) {
                return { ...fields, _modify: true };
            } else {
                return row;
            }
        });
    }

    componentState.sort = component && component.sort;

    return _.defaults(componentState, DEFAULT_STATE);
}

function mapDispatchToProps(dispatch, props) {
    const { componentId, entity, params, onDeleteItem, onSubmitSuccess } = props;
    return _.defaults({onDeleteItem, onSubmitSuccess}, {
        // 设置初始分页
        onInit: () => {
            const { loaderType } = props;

            if (loaderType) {
                return;
            }

            if (props.pagination) {
                const page = _.get(props, 'pagination.defaultCurrent', DEFAULT_PAGE_INDEX);
                const perPage = _.get(props, 'pagination.pageSize');
                entity.pageChange({ page, perPage });
            }

            if (props.infiniteScroll) {
                const page = _.get(props, 'infiniteScroll.defaultCurrent', DEFAULT_PAGE_INDEX);
                const perPage = _.get(props, 'infiniteScroll.pageSize');
                entity.pageChange({ page, perPage });
            }

            if (props.loadFirstPage) {
                dispatch(actions.componentSubmitAction(componentId, 'paging'));
                entity.search(params);
            }
        },

        onModifyStart: (row) => {
            dispatch(actions.tableModifyStartAction(componentId, entity, row));
        },

        onModifyConfirm: (row) => {
            let fields = {};
            _.forEach(props.columns, column => {
                const { modifiable, property } = column;
                if (modifiable !== false) {
                    _.set(fields, property, _.get(row, property));
                }
            });
            let requestParams = { ...params, id: row.id };
            dispatch(actions.componentSubmitAction(componentId, 'modify'));
            entity.modify(fields, requestParams,
                {action: actions.tableModifyFinishAction(componentId, entity)});
        },

        onModifyCancel: (row) => {
            dispatch(actions.tableModifyFinishAction(componentId, entity));
        },

        onModifyChange: (name, value, row) => {
            let fields = _.cloneDeep(row);
            _.set(fields, name, value);
            if (props.convertModifyFields) {
                fields = props.convertModifyFields(fields);
            }
            dispatch(actions.tableModifyChangeAction(componentId, entity, fields));
        },

        onRowSelectionChange: (selectedRowKeys) => {
            dispatch(actions.tableRowSelectionChangeAction(componentId, selectedRowKeys));
        },

        // 删除条目
        onDeleteItem: (itemId) => {
            dispatch(actions.componentSubmitAction(componentId, 'delete'));
            entity.delete({ ...params, id: itemId });
        },

        // 筛选条件改变
        onChange: (pagination, filters, sorter) => {
            const { current: page, pageSize: perPage } = pagination;
            const paging = entity.paging;

            if (page && perPage && (page !== paging.page || perPage !== paging.perPage)) {
                dispatch(actions.componentSubmitAction(componentId, 'paging'));
                entity.pageChange(_.defaults({ page, perPage }, paging));
                entity.search(params);
            } else {
                const { field, order } = sorter;
                const sorterFilter = { ...entity.filters, field, order };
                const column = _.find(props.columns, { property: field });
                dispatch(actions.tableSortChangeAction(componentId, { field, order }));

                if (column && typeof column.sorter !== 'function') {
                    dispatch(actions.componentSubmitAction(componentId, 'paging'));
                    entity.filtersChange(sorterFilter);
                    entity.search(params);
                }
            }
        },

        onLoadNextPage: () => {
            dispatch(actions.componentSubmitAction(componentId, 'loadNextPage'));
            entity.loadNextPage();
        },

        onSubmitSuccess: (result, submitType) => {
            if (submitType === 'modify' || submitType === 'delete') {
                entity.search(params);
            }
        },

        onSubmitFinish: () => {
            dispatch(actions.componentSubmitFinishAction(componentId));
        }
    });
}

export const DataTable = connect(mapStateToProps, mapDispatchToProps)(Table);
