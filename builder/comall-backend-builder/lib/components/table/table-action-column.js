'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.TableActionColumn = undefined;

var _css = require('antd/lib/popconfirm/style/css');

var _popconfirm = require('antd/lib/popconfirm');

var _popconfirm2 = _interopRequireDefault(_popconfirm);

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

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

var _reactRouter = require('react-router');

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _services = require('../../services');

var _parser = require('../../parser');

var _button = require('../button');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var ITEM_CLASS_NAME = 'table-action-column-item';

var DEFAULT_MODIFY_PROPS = {
    type: 'primary',
    icon: 'edit',
    tooltip: 'Modify'
};

var DEFAULT_MODIFY_CONFIRM_PROPS = {
    type: 'primary',
    icon: 'check',
    tooltip: 'Save'
};

var DEFAULT_MODIFY_CANCEL_PROPS = {
    type: 'primary',
    icon: 'close',
    tooltip: 'Cancel'
};

var DEFAULT_DELETE_CONFIRM_PROPS = {
    title: 'Are you sure ?',
    okText: 'Yes',
    cancelText: 'No'
};

var DEFAULT_DELETE_BUTTON_PROPS = {
    type: 'primary',
    icon: 'delete',
    tooltip: 'Delete'
};

var DEFAULT_LINK_BUTTON_PROPS = {
    type: 'primary',
    icon: 'link',
    tooltip: 'Link'
};

var TableActionColumn = exports.TableActionColumn = function (_Component) {
    (0, _inherits3['default'])(TableActionColumn, _Component);

    function TableActionColumn() {
        (0, _classCallCheck3['default'])(this, TableActionColumn);
        return (0, _possibleConstructorReturn3['default'])(this, (TableActionColumn.__proto__ || Object.getPrototypeOf(TableActionColumn)).apply(this, arguments));
    }

    (0, _createClass3['default'])(TableActionColumn, [{
        key: 'render',
        value: function render() {
            return _react2['default'].createElement(
                'div',
                null,
                this.generateColumnItems()
            );
        }
    }, {
        key: 'generateColumnItems',
        value: function generateColumnItems() {
            var _props = this.props,
                row = _props.row,
                items = _props.items,
                onDeleteItem = _props.onDeleteItem,
                onModifyStart = _props.onModifyStart,
                onModifyConfirm = _props.onModifyConfirm,
                onModifyCancel = _props.onModifyCancel,
                entity = _props.entity;


            return items.map(function (item, index) {
                var type = item.type,
                    text = item.text,
                    config = item.config,
                    params = item.params;

                var context = { row: row, params: params };
                var disabled = !_.get(context, item.statusKey, true);
                var props = void 0,
                    confirmProps = void 0,
                    actionComponent = void 0;
                switch (type) {
                    case 'modify':
                        props = (0, _extends3['default'])({}, DEFAULT_MODIFY_PROPS, config, {
                            text: text,
                            disabled: disabled,
                            key: index,
                            onClick: function onClick() {
                                return onModifyStart(row);
                            }
                        });
                        props.className = (0, _classnames2['default'])(props.className, ITEM_CLASS_NAME);

                        if (row._modify) {
                            return undefined;
                        } else {
                            return _react2['default'].createElement(_button.Button, props);
                        }
                    case 'modifyConfirm':
                        props = (0, _extends3['default'])({}, DEFAULT_MODIFY_CONFIRM_PROPS, config, {
                            text: text,
                            disabled: disabled,
                            key: index,
                            onClick: function onClick() {
                                return onModifyConfirm(row);
                            }
                        });
                        props.className = (0, _classnames2['default'])(props.className, ITEM_CLASS_NAME);

                        if (row._modify) {
                            return _react2['default'].createElement(_button.Button, props);
                        } else {
                            return undefined;
                        }
                    case 'modifyCancel':
                        props = (0, _extends3['default'])({}, DEFAULT_MODIFY_CANCEL_PROPS, config, {
                            text: text,
                            disabled: disabled,
                            key: index,
                            onClick: function onClick() {
                                return onModifyCancel(row);
                            }
                        });
                        props.className = (0, _classnames2['default'])(props.className, ITEM_CLASS_NAME);

                        if (row._modify) {
                            return _react2['default'].createElement(_button.Button, props);
                        } else {
                            return undefined;
                        }
                    case 'delete':
                        confirmProps = (0, _extends3['default'])({}, DEFAULT_DELETE_CONFIRM_PROPS, config, {
                            key: index,
                            onConfirm: function onConfirm() {
                                return onDeleteItem(row.id, row);
                            }
                        });
                        props = (0, _extends3['default'])({}, DEFAULT_DELETE_BUTTON_PROPS, config, {
                            text: text,
                            disabled: disabled
                        });
                        props.className = (0, _classnames2['default'])(props.className, ITEM_CLASS_NAME);

                        if (row._modify) {
                            return undefined;
                        } else {
                            return _react2['default'].createElement(
                                _popconfirm2['default'],
                                confirmProps,
                                _react2['default'].createElement(_button.Button, props)
                            );
                        }
                    case 'link':
                        props = (0, _extends3['default'])({}, config, {
                            to: (0, _services.interpolate)(item.path, context),
                            key: index
                        });
                        props.className = (0, _classnames2['default'])(props.className, ITEM_CLASS_NAME);
                        return disabled ? null : _react2['default'].createElement(
                            _reactRouter.Link,
                            props,
                            text
                        );
                    case 'linkButton':
                        props = (0, _extends3['default'])({}, DEFAULT_LINK_BUTTON_PROPS, config, {
                            text: text,
                            disabled: disabled,
                            key: index,
                            onClick: function onClick() {
                                return _services.navigation.goto((0, _services.interpolate)(item.path, context));
                            }
                        });
                        props.className = (0, _classnames2['default'])(props.className, ITEM_CLASS_NAME);
                        return _react2['default'].createElement(_button.Button, props);
                    case 'component':
                        actionComponent = _parser.parser.getComponent(item.component);
                        props = (0, _extends3['default'])({}, config, {
                            text: text,
                            row: row,
                            key: index,
                            entity: entity,
                            disabled: disabled
                        });
                        props.className = (0, _classnames2['default'])(props.className, ITEM_CLASS_NAME);
                        return (0, _react.createElement)(actionComponent, props);
                    default:
                        return null;
                }
            });
        }
    }]);
    return TableActionColumn;
}(_react.Component);