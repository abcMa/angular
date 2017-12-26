import React, { Component, createElement } from 'react';
import * as _ from 'lodash';
import { Link } from 'react-router';
import classNames from 'classnames';

import { Popconfirm as AntPopconfirm } from 'antd';

import { interpolate, navigation } from '../../services';
import { parser } from '../../parser';

import { Button } from '../button';

const ITEM_CLASS_NAME = 'table-action-column-item';

const DEFAULT_MODIFY_PROPS = {
    type: 'primary',
    icon: 'edit',
    tooltip: 'Modify'
};

const DEFAULT_MODIFY_CONFIRM_PROPS = {
    type: 'primary',
    icon: 'check',
    tooltip: 'Save'
};

const DEFAULT_MODIFY_CANCEL_PROPS = {
    type: 'primary',
    icon: 'close',
    tooltip: 'Cancel'
};

const DEFAULT_DELETE_CONFIRM_PROPS = {
    title: 'Are you sure ?',
    okText: 'Yes',
    cancelText: 'No'
};

const DEFAULT_DELETE_BUTTON_PROPS = {
    type: 'primary',
    icon: 'delete',
    tooltip: 'Delete'
};

const DEFAULT_LINK_BUTTON_PROPS = {
    type: 'primary',
    icon: 'link',
    tooltip: 'Link'
};

export class TableActionColumn extends Component {

    render() {
        return (
            <div>
                { this.generateColumnItems() }
            </div>
        );
    }

    generateColumnItems() {
        const { row, items, onDeleteItem, onModifyStart,
            onModifyConfirm, onModifyCancel, entity } = this.props;

        return items.map((item, index) => {
            const { type, text, config, params } = item;
            const context = { row, params };
            const disabled = !_.get(context, item.statusKey, true);
            let props, confirmProps, actionComponent;
            switch (type) {
                case 'modify':
                    props = {
                        ...DEFAULT_MODIFY_PROPS,
                        ...config,
                        text,
                        disabled,
                        key: index,
                        onClick: () => onModifyStart(row)
                    };
                    props.className = classNames(props.className, ITEM_CLASS_NAME);

                    if (row._modify) {
                        return undefined;
                    } else {
                        return (
                            <Button {...props} />
                        );
                    }
                case 'modifyConfirm':
                    props = {
                        ...DEFAULT_MODIFY_CONFIRM_PROPS,
                        ...config,
                        text,
                        disabled,
                        key: index,
                        onClick: () => onModifyConfirm(row)
                    };
                    props.className = classNames(props.className, ITEM_CLASS_NAME);

                    if (row._modify) {
                        return (
                            <Button {...props} />
                        );
                    } else {
                        return undefined;
                    }
                case 'modifyCancel':
                    props = {
                        ...DEFAULT_MODIFY_CANCEL_PROPS,
                        ...config,
                        text,
                        disabled,
                        key: index,
                        onClick: () => onModifyCancel(row)
                    };
                    props.className = classNames(props.className, ITEM_CLASS_NAME);

                    if (row._modify) {
                        return (
                            <Button {...props} />
                        );
                    } else {
                        return undefined;
                    }
                case 'delete':
                    confirmProps = {
                        ...DEFAULT_DELETE_CONFIRM_PROPS,
                        ...config,
                        key: index,
                        onConfirm: () => onDeleteItem(row.id, row)
                    };
                    props = {
                        ...DEFAULT_DELETE_BUTTON_PROPS,
                        ...config,
                        text,
                        disabled
                    };
                    props.className = classNames(props.className, ITEM_CLASS_NAME);

                    if (row._modify) {
                        return undefined;
                    } else {
                        return (
                            <AntPopconfirm {...confirmProps} >
                                <Button {...props} ></Button>
                            </AntPopconfirm>
                        );
                    }
                case 'link':
                    props = {
                        ...config,
                        to: interpolate(item.path, context),
                        key: index
                    };
                    props.className = classNames(props.className, ITEM_CLASS_NAME);
                    return (
                        disabled ? null : <Link {...props} >{ text }</Link>
                    );
                case 'linkButton':
                    props = {
                        ...DEFAULT_LINK_BUTTON_PROPS,
                        ...config,
                        text,
                        disabled,
                        key: index,
                        onClick: () => navigation.goto(interpolate(item.path, context))
                    };
                    props.className = classNames(props.className, ITEM_CLASS_NAME);
                    return <Button {...props} />;
                case 'component':
                    actionComponent = parser.getComponent(item.component);
                    props = {
                        ...config,
                        text,
                        row,
                        key: index,
                        entity,
                        disabled
                    };
                    props.className = classNames(props.className, ITEM_CLASS_NAME);
                    return createElement(actionComponent, props);
                default:
                    return null;
            }
        });
    }

}
