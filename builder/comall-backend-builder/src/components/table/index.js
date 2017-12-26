import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import * as _ from 'lodash';
import { Table as AntTable } from 'antd';

import { FlexLayout } from '../flex-layout';
import { getTypeSystem } from '../../type';
import { TableActionColumn } from './table-action-column';
import { throttle } from '../../services';
import './index.scss';

const DEFAULT_ACTION_COLUMN = {
    title: '',
    key: 'action',
    dataIndex: 'action',
    className: 'column-center'
};

export class Table extends Component {
    componentWillMount() {
        const onInit = this.props.onInit;
        if (onInit) {
            onInit();
        }
    }

    componentWillReceiveProps(nextProps) {
        const { result: prevResult, requestStatus: prevStatus,
            selectedRowKeys: prevSelected } = this.props;
        const { result: nextResult, submitType,
            requestStatus: nextStatus, selectedRowKeys: nextSelected,
            onSubmitSuccess, onSubmitError, onSubmitFinish,
            rowSelection, onRowSelectionChange } = nextProps;
        // 处理条目选择状态变更
        if (rowSelection && !_.isEqual(prevSelected, nextSelected)) {
            rowSelection.onChange(nextSelected);
        }
        // 表格内容改变时清除所有行的选中状态
        if (rowSelection && onRowSelectionChange && submitType !== 'loadNextPage'
            && !_.isEqual(prevResult, nextResult)) {
            onRowSelectionChange([]);
        }
        if (prevStatus === 'pending' && nextStatus === 'success') {
            if (submitType && onSubmitSuccess) {
                onSubmitSuccess(nextProps.result, submitType);
            }
            if (submitType && onSubmitFinish) {
                onSubmitFinish();
            }
            if (submitType !== 'modify' && nextProps.infiniteScroll &&
                _.get(nextProps, 'entity.paging.page') === 1) {
                this.scrollTo('top')();
            }
        }
        if (submitType && prevStatus === 'pending' && nextStatus === 'error') {
            if (onSubmitError) {
                onSubmitError(nextProps.result, submitType);
            }
            if (onSubmitFinish) {
                onSubmitFinish();
            }
        }
    }

    setWrappedInstance = (ref) => {
        this.wrappedInstance = ref;
    }

    componentDidMount() {
        const { infiniteScroll, entity} = this.props;
        if (infiniteScroll && this.wrappedInstance) {
            // 处理滚动加载
            const tableBody = ReactDOM.findDOMNode(this.wrappedInstance)
                .querySelector('.ant-table-body');
            tableBody.addEventListener('scroll', throttle((event) => {
                if (this.props.requestStatus === 'pending') {
                    return;
                }
                let table = tableBody.querySelector('.ant-table-fixed');
                if (!table) {
                    return;
                }
                let distance = table.scrollHeight - tableBody.scrollTop - tableBody.clientHeight;
                if (distance < (infiniteScroll.distance || 100)) {
                    const { page, totalPage } = entity.paging || {};
                    if (page && totalPage && page >= totalPage) {
                        return;
                    }
                    this.props.onChange({}, null, {});
                    this.props.onLoadNextPage();
                }
            }, 50, 100));
        }
    }

    render() {
        const {
            className,
            style,
            result,
            requestStatus,
            selectedRowKeys,
            columns: columnConfigs,
            bordered = true,
            title,
            showHeader = true,
            footer,
            onChange,
            rowSelection,
            rowKey = 'id',
            rowClassName,
            scroll,
            sort,
            onRowSelectionChange
        } = this.props;

        const columns = this.convertColumns(columnConfigs, sort);
        const pagination = this.convertPagination();

        const tableProps = {
            columns,
            pagination,
            bordered,
            className,
            style,
            showHeader,
            rowKey,
            rowClassName,
            scroll,
            ref: this.setWrappedInstance
        };

        if (title) {
            tableProps.title = () => title;
        }

        if (rowSelection) {
            tableProps.rowSelection = {
                ...rowSelection,
                selectedRowKeys,
                onChange: onRowSelectionChange
            };
        }

        if (footer) {
            if (typeof footer === 'function') {
                tableProps.footer = footer.bind(this);
            } else {
                tableProps.footer = this.renderFooter;
            }
        }

        return (
            <AntTable dataSource={result} {...tableProps}
                loading={requestStatus === 'pending'}
                onChange={onChange} />
        );
    }

    /**
     * 获取匹配当前表格组件的列配置
     * @param {object} columnsConfig - 原始的列配置
     * @param {object} sort - 排序信息
     * @return {object} - 处理后的列配置
     */
    convertColumns(columnConfigs, sort) {
        const { entity, params } = this.props;
        const columns = columnConfigs.map((columnConfig, index) => {
            const column = {};

            // 实体属性
            let property;
            let entityProperties = this.props.entity.metainfo.properties;
            let configProperties = columnConfig.property.split('.');

            if (configProperties.length > 1) {
                let parent = entityProperties;
                for (let configProperty of configProperties) {
                    property = parent[configProperty];
                    if (!property) {
                        throw new Error(`Property ${columnConfig.property} not found` +
                            ` in Entity ${this.props.entity.metainfo.name}`);
                    }
                    parent = property.properties;
                }
            } else {
                property = entityProperties[columnConfig.property];
            }

            if (!property) {
                throw new Error(`Property ${columnConfig.property} not found` +
                    ` in Entity ${this.props.entity.metainfo.name}`);
            }

            // 列名称：取title；无title，则取displayName；无displayName，则取property
            column.title = columnConfig.title || property.displayName || columnConfig.property;

            column.key = columnConfig.key || columnConfig.property;

            if (columnConfig.property) {
                column.dataIndex = columnConfig.property;
            }

            // 渲染column
            column.render = (text, record) => {
                let typeSystem = getTypeSystem(property.type, property.format);
                if (record._modify && columnConfig.modifiable !== false &&
                    property.modifiable !== false) {
                    return typeSystem.getControlComponent({
                        ...property.controlConfig,
                        name: columnConfig.property,
                        entity,
                        params,
                        value: text,
                        disabled: property.disabled,
                        options: property.options,
                        onChange: (value, name) => {
                            this.props.onModifyChange(name, value, record);
                        }
                    });
                } else {
                    return typeSystem.getDisplayComponent(text, {
                        ...property.displayConfig,
                        name: columnConfig.property,
                        options: property.options
                    });
                }
            };

            // 设置列宽
            column.width = columnConfig.width ?
                (Number(columnConfig.width) > 0 ? columnConfig.width + 'px' : columnConfig.width) :
                '';
            column.colSpan = columnConfig.colSpan;

            // 设置排序
            if (property.orderBy) {
                column.sorter = property.orderBy ? true : false;
            } else if (columnConfig.sorter) {
                column.sorter = columnConfig.sorter;
            }
            column.sortOrder = sort && sort.field === columnConfig.property ? sort.order : false;

            if (columnConfig.fixed) {
                column.fixed = columnConfig.fixed;
            }

            // 设置列的对齐 class
            if (columnConfig.align) {
                column.className = `column-${columnConfig.align}`;
            }

            return column;
        });

        const { actionColumn: actionColumnConfig } = this.props;

        if (actionColumnConfig) {
            // 组件中添加 “操作” 列
            let actionColumn = Object.assign({}, DEFAULT_ACTION_COLUMN, actionColumnConfig);
            delete actionColumn.items;

            const { params, onDeleteItem, onModifyStart, onModifyConfirm, onModifyCancel, entity } = this.props;

            let actionColumnProps = {
                params,
                items: actionColumnConfig.items,
                onDeleteItem,
                onModifyStart,
                onModifyConfirm,
                onModifyCancel,
                entity
            };

            actionColumn.render = (action, row, index) => (
                <TableActionColumn row={row} {...actionColumnProps} />
            );

            columns.push(actionColumn);
        }

        return columns;
    }

    /**
     * 获取分页配置
     * @return {object} - ant 分页配置
     */
    convertPagination() {
        const { result, page, perPage, totalNum,
            pagination: paginationConfig } = this.props;
        let pagination;

        if (paginationConfig && result && result.length > 0) {
            pagination = {
                current: page,
                total: totalNum,
                pageSize: perPage
            };

            if (typeof paginationConfig === 'object') {
                _.defaults(pagination, paginationConfig);
            }
        } else {
            pagination = false;
        }

        return pagination;
    }

    /**
     * 渲染页脚
     * @return {object} - react component
     */
    renderFooter = (currentPageData) => {
        const { footer } = this.props;

        let footerProps = {
            direction: 'horizontal',
            items: []
        };

        if (footer.showInfo !== false) {
            let text = '';
            if (typeof footer.showInfo === 'function') {
                text = footer.showInfo(this.props);
            } else {
                const { entity, selectedRowKeys, rowSelection } = this.props;
                const { result, totalNum } =  _.get(entity, 'paging', {});
                if (rowSelection) {
                    text += `Selected ${selectedRowKeys.length}. `;
                }
                if (result) {
                    text += `Loaded ${result.length}/${totalNum}.`;
                }
            }
            footerProps.items.push({
                component: 'text',
                text,
                style: {
                    display: 'block',
                    lineHeight: '28px'
                }
            });
        } else {
            footerProps.items.push({
                component: 'text',
                style: {
                    display: 'block'
                }
            });
        }

        const buttonConfig = {
            component: 'button',
            flex: '0 0 auto',
            style: {
                marginRight: 5
            },
            type: 'primary'
        };

        if (footer.scrollLeftButton) {
            footerProps.items.push(Object.assign({}, buttonConfig, {
                icon: 'left',
                tooltip: 'Scroll Left',
                onClick: this.scrollTo('left')
            }));
        }

        if (footer.scrollTopButton) {
            footerProps.items.push(Object.assign({}, buttonConfig, {
                icon: 'up',
                tooltip: 'Scroll Top',
                onClick: this.scrollTo('top')
            }));
        }

        if (footer.scrollBottomButton) {
            footerProps.items.push(Object.assign({}, buttonConfig, {
                icon: 'down',
                tooltip: 'Scroll bottom',
                onClick: this.scrollTo('bottom')
            }));
        }

        if (footer.scrollRightButton) {
            footerProps.items.push(Object.assign({}, buttonConfig, {
                icon: 'right',
                tooltip: 'Scroll Right',
                onClick: this.scrollTo('right')
            }));
        }

        return <FlexLayout {...footerProps} />;
    }

    scrollTo = (type) => {
        return () => {
            if (this.wrappedInstance) {
                const tableBody = ReactDOM.findDOMNode(this.wrappedInstance)
                    .querySelector('.ant-table-body');
                const table = tableBody.querySelector('.ant-table-fixed');
                switch(type) {
                    case 'top':
                        tableBody.scrollTop = 0;
                        break;
                    case 'bottom':
                        tableBody.scrollTop = table.scrollHeight - tableBody.clientHeight;
                        break;
                    case 'left':
                        tableBody.scrollLeft = 0;
                        break;
                    case 'right':
                        tableBody.scrollLeft = table.scrollWidth - tableBody.clientWidth;
                        break;
                    default:
                }

            }
        };
    }
}
