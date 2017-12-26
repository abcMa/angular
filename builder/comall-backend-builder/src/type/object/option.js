import React, { Component } from 'react';
import * as _ from 'lodash';
import classNames from 'classnames';

import { ObjectType } from './object';
import { Select } from '../../components/select';

/**
 * 字符串类型
 */
export class OptionFormat extends ObjectType {
    /**
     * 获取展示组件
     */
    getAvailableDisplayComponent(value, displayInfo) {
        const { className } = displayInfo;
        displayInfo = {
            ...displayInfo,
            className: classNames('format-option', className)
        };
        return super.getAvailableDisplayComponent(value.name, displayInfo);
    }

    /**
     * 获取输入组件
     */
    getControlComponent(controlInfo) {
        return (
            <ObjectSelect {...controlInfo} />
        );
    }

    /**
     * 对数据进行校验
     */
    validate(rule, value, callback) {
        callback();
    }
}

class ObjectSelect extends Component {
    render() {
        const { onChange, value, options } = this.props;
        const control = Object.assign({}, this.props, {
            value: value ? value.id + '' : null,
            onChange: (value, name) => {
                onChange(_.find(options, {id: value}), name);
            }
        });
        return (
            <Select {...control} />
        );
    }
}