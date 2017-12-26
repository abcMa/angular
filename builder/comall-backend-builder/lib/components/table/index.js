'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Table = undefined;

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _css = require('antd/lib/table/style/css');

var _table = require('antd/lib/table');

var _table2 = _interopRequireDefault(_table);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

var _flexLayout = require('../flex-layout');

var _type = require('../../type');

var _tableActionColumn = require('./table-action-column');

var _services = require('../../services');

require('./index.scss');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var DEFAULT_ACTION_COLUMN = {
    title: '',
    key: 'action',
    dataIndex: 'action',
    className: 'column-center'
};

var Table = exports.Table = function (_Component) {
    (0, _inherits3['default'])(Table, _Component);

    function Table() {
        var _ref;

        var _temp, _this, _ret;

        (0, _classCallCheck3['default'])(this, Table);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = (0, _possibleConstructorReturn3['default'])(this, (_ref = Table.__proto__ || Object.getPrototypeOf(Table)).call.apply(_ref, [this].concat(args))), _this), _this.setWrappedInstance = function (ref) {
            _this.wrappedInstance = ref;
        }, _this.renderFooter = function (currentPageData) {
            var footer = _this.props.footer;


            var footerProps = {
                direction: 'horizontal',
                items: []
            };

            if (footer.showInfo !== false) {
                var text = '';
                if (typeof footer.showInfo === 'function') {
                    text = footer.showInfo(_this.props);
                } else {
                    var _this$props = _this.props,
                        entity = _this$props.entity,
                        selectedRowKeys = _this$props.selectedRowKeys,
                        rowSelection = _this$props.rowSelection;

                    var _$get = _.get(entity, 'paging', {}),
                        result = _$get.result,
                        totalNum = _$get.totalNum;

                    if (rowSelection) {
                        text += 'Selected ' + selectedRowKeys.length + '. ';
                    }
                    if (result) {
                        text += 'Loaded ' + result.length + '/' + totalNum + '.';
                    }
                }
                footerProps.items.push({
                    component: 'text',
                    text: text,
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

            var buttonConfig = {
                component: 'button',
                flex: '0 0 auto',
                style: {
                    marginRight: 5
                },
                type: 'primary'
            };

            if (footer.scrollLeftButton) {
                footerProps.items.push((0, _extends3['default'])({}, buttonConfig, {
                    icon: 'left',
                    tooltip: 'Scroll Left',
                    onClick: _this.scrollTo('left')
                }));
            }

            if (footer.scrollTopButton) {
                footerProps.items.push((0, _extends3['default'])({}, buttonConfig, {
                    icon: 'up',
                    tooltip: 'Scroll Top',
                    onClick: _this.scrollTo('top')
                }));
            }

            if (footer.scrollBottomButton) {
                footerProps.items.push((0, _extends3['default'])({}, buttonConfig, {
                    icon: 'down',
                    tooltip: 'Scroll bottom',
                    onClick: _this.scrollTo('bottom')
                }));
            }

            if (footer.scrollRightButton) {
                footerProps.items.push((0, _extends3['default'])({}, buttonConfig, {
                    icon: 'right',
                    tooltip: 'Scroll Right',
                    onClick: _this.scrollTo('right')
                }));
            }

            return _react2['default'].createElement(_flexLayout.FlexLayout, footerProps);
        }, _this.scrollTo = function (type) {
            return function () {
                if (_this.wrappedInstance) {
                    var tableBody = _reactDom2['default'].findDOMNode(_this.wrappedInstance).querySelector('.ant-table-body');
                    var table = tableBody.querySelector('.ant-table-fixed');
                    switch (type) {
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
        }, _temp), (0, _possibleConstructorReturn3['default'])(_this, _ret);
    }

    (0, _createClass3['default'])(Table, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
            var onInit = this.props.onInit;
            if (onInit) {
                onInit();
            }
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            var _props = this.props,
                prevResult = _props.result,
                prevStatus = _props.requestStatus,
                prevSelected = _props.selectedRowKeys;
            var nextResult = nextProps.result,
                submitType = nextProps.submitType,
                nextStatus = nextProps.requestStatus,
                nextSelected = nextProps.selectedRowKeys,
                onSubmitSuccess = nextProps.onSubmitSuccess,
                onSubmitError = nextProps.onSubmitError,
                onSubmitFinish = nextProps.onSubmitFinish,
                rowSelection = nextProps.rowSelection,
                onRowSelectionChange = nextProps.onRowSelectionChange;
            // 处理条目选择状态变更

            if (rowSelection && !_.isEqual(prevSelected, nextSelected)) {
                rowSelection.onChange(nextSelected);
            }
            // 表格内容改变时清除所有行的选中状态
            if (rowSelection && onRowSelectionChange && submitType !== 'loadNextPage' && !_.isEqual(prevResult, nextResult)) {
                onRowSelectionChange([]);
            }
            if (prevStatus === 'pending' && nextStatus === 'success') {
                if (submitType && onSubmitSuccess) {
                    onSubmitSuccess(nextProps.result, submitType);
                }
                if (submitType && onSubmitFinish) {
                    onSubmitFinish();
                }
                if (submitType !== 'modify' && nextProps.infiniteScroll && _.get(nextProps, 'entity.paging.page') === 1) {
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
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            var _this2 = this;

            var _props2 = this.props,
                infiniteScroll = _props2.infiniteScroll,
                entity = _props2.entity;

            if (infiniteScroll && this.wrappedInstance) {
                // 处理滚动加载
                var tableBody = _reactDom2['default'].findDOMNode(this.wrappedInstance).querySelector('.ant-table-body');
                tableBody.addEventListener('scroll', (0, _services.throttle)(function (event) {
                    if (_this2.props.requestStatus === 'pending') {
                        return;
                    }
                    var table = tableBody.querySelector('.ant-table-fixed');
                    if (!table) {
                        return;
                    }
                    var distance = table.scrollHeight - tableBody.scrollTop - tableBody.clientHeight;
                    if (distance < (infiniteScroll.distance || 100)) {
                        var _ref2 = entity.paging || {},
                            page = _ref2.page,
                            totalPage = _ref2.totalPage;

                        if (page && totalPage && page >= totalPage) {
                            return;
                        }
                        _this2.props.onChange({}, null, {});
                        _this2.props.onLoadNextPage();
                    }
                }, 50, 100));
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _props3 = this.props,
                className = _props3.className,
                style = _props3.style,
                result = _props3.result,
                requestStatus = _props3.requestStatus,
                selectedRowKeys = _props3.selectedRowKeys,
                columnConfigs = _props3.columns,
                _props3$bordered = _props3.bordered,
                bordered = _props3$bordered === undefined ? true : _props3$bordered,
                title = _props3.title,
                _props3$showHeader = _props3.showHeader,
                showHeader = _props3$showHeader === undefined ? true : _props3$showHeader,
                footer = _props3.footer,
                onChange = _props3.onChange,
                rowSelection = _props3.rowSelection,
                _props3$rowKey = _props3.rowKey,
                rowKey = _props3$rowKey === undefined ? 'id' : _props3$rowKey,
                rowClassName = _props3.rowClassName,
                scroll = _props3.scroll,
                sort = _props3.sort,
                onRowSelectionChange = _props3.onRowSelectionChange;


            var columns = this.convertColumns(columnConfigs, sort);
            var pagination = this.convertPagination();

            var tableProps = {
                columns: columns,
                pagination: pagination,
                bordered: bordered,
                className: className,
                style: style,
                showHeader: showHeader,
                rowKey: rowKey,
                rowClassName: rowClassName,
                scroll: scroll,
                ref: this.setWrappedInstance
            };

            if (title) {
                tableProps.title = function () {
                    return title;
                };
            }

            if (rowSelection) {
                tableProps.rowSelection = (0, _extends3['default'])({}, rowSelection, {
                    selectedRowKeys: selectedRowKeys,
                    onChange: onRowSelectionChange
                });
            }

            if (footer) {
                if (typeof footer === 'function') {
                    tableProps.footer = footer.bind(this);
                } else {
                    tableProps.footer = this.renderFooter;
                }
            }

            return _react2['default'].createElement(_table2['default'], (0, _extends3['default'])({ dataSource: result }, tableProps, {
                loading: requestStatus === 'pending',
                onChange: onChange }));
        }

        /**
         * 获取匹配当前表格组件的列配置
         * @param {object} columnsConfig - 原始的列配置
         * @param {object} sort - 排序信息
         * @return {object} - 处理后的列配置
         */

    }, {
        key: 'convertColumns',
        value: function convertColumns(columnConfigs, sort) {
            var _this3 = this;

            var _props4 = this.props,
                entity = _props4.entity,
                params = _props4.params;

            var columns = columnConfigs.map(function (columnConfig, index) {
                var column = {};

                // 实体属性
                var property = void 0;
                var entityProperties = _this3.props.entity.metainfo.properties;
                var configProperties = columnConfig.property.split('.');

                if (configProperties.length > 1) {
                    var parent = entityProperties;
                    var _iteratorNormalCompletion = true;
                    var _didIteratorError = false;
                    var _iteratorError = undefined;

                    try {
                        for (var _iterator = configProperties[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                            var configProperty = _step.value;

                            property = parent[configProperty];
                            if (!property) {
                                throw new Error('Property ' + columnConfig.property + ' not found' + (' in Entity ' + _this3.props.entity.metainfo.name));
                            }
                            parent = property.properties;
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
                } else {
                    property = entityProperties[columnConfig.property];
                }

                if (!property) {
                    throw new Error('Property ' + columnConfig.property + ' not found' + (' in Entity ' + _this3.props.entity.metainfo.name));
                }

                // 列名称：取title；无title，则取displayName；无displayName，则取property
                column.title = columnConfig.title || property.displayName || columnConfig.property;

                column.key = columnConfig.key || columnConfig.property;

                if (columnConfig.property) {
                    column.dataIndex = columnConfig.property;
                }

                // 渲染column
                column.render = function (text, record) {
                    var typeSystem = (0, _type.getTypeSystem)(property.type, property.format);
                    if (record._modify && columnConfig.modifiable !== false && property.modifiable !== false) {
                        return typeSystem.getControlComponent((0, _extends3['default'])({}, property.controlConfig, {
                            name: columnConfig.property,
                            entity: entity,
                            params: params,
                            value: text,
                            disabled: property.disabled,
                            options: property.options,
                            onChange: function onChange(value, name) {
                                _this3.props.onModifyChange(name, value, record);
                            }
                        }));
                    } else {
                        return typeSystem.getDisplayComponent(text, (0, _extends3['default'])({}, property.displayConfig, {
                            name: columnConfig.property,
                            options: property.options
                        }));
                    }
                };

                // 设置列宽
                column.width = columnConfig.width ? Number(columnConfig.width) > 0 ? columnConfig.width + 'px' : columnConfig.width : '';
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
                    column.className = 'column-' + columnConfig.align;
                }

                return column;
            });

            var actionColumnConfig = this.props.actionColumn;


            if (actionColumnConfig) {
                // 组件中添加 “操作” 列
                var actionColumn = (0, _extends3['default'])({}, DEFAULT_ACTION_COLUMN, actionColumnConfig);
                delete actionColumn.items;

                var _props5 = this.props,
                    _params = _props5.params,
                    onDeleteItem = _props5.onDeleteItem,
                    onModifyStart = _props5.onModifyStart,
                    onModifyConfirm = _props5.onModifyConfirm,
                    onModifyCancel = _props5.onModifyCancel,
                    _entity = _props5.entity;


                var actionColumnProps = {
                    params: _params,
                    items: actionColumnConfig.items,
                    onDeleteItem: onDeleteItem,
                    onModifyStart: onModifyStart,
                    onModifyConfirm: onModifyConfirm,
                    onModifyCancel: onModifyCancel,
                    entity: _entity
                };

                actionColumn.render = function (action, row, index) {
                    return _react2['default'].createElement(_tableActionColumn.TableActionColumn, (0, _extends3['default'])({ row: row }, actionColumnProps));
                };

                columns.push(actionColumn);
            }

            return columns;
        }

        /**
         * 获取分页配置
         * @return {object} - ant 分页配置
         */

    }, {
        key: 'convertPagination',
        value: function convertPagination() {
            var _props6 = this.props,
                result = _props6.result,
                page = _props6.page,
                perPage = _props6.perPage,
                totalNum = _props6.totalNum,
                paginationConfig = _props6.pagination;

            var pagination = void 0;

            if (paginationConfig && result && result.length > 0) {
                pagination = {
                    current: page,
                    total: totalNum,
                    pageSize: perPage
                };

                if ((typeof paginationConfig === 'undefined' ? 'undefined' : (0, _typeof3['default'])(paginationConfig)) === 'object') {
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

    }]);
    return Table;
}(_react.Component);