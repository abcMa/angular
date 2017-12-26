import React from 'react';
import classNames from 'classnames';

import { Type } from '../type';
import { Icon } from '../../components/icon';
import { Switch } from '../../components/switch';

/**
 * 数字类型
 */
export class BooleanType extends Type {
    /**
     * 获取展示组件
     */
    getDisplayComponent(value, displayInfo) {
        const { className, style } = displayInfo;
        return (
            <Icon className={classNames('type-boolean', className)}
                style={style} type={value ? 'check' : 'close'} />
        );
    }

    /**
     * 获取输入组件
     */
    getControlComponent(controlInfo) {
        return (
            <Switch {...controlInfo} />
        );
    }

    /**
     * 对数据进行校验
     */
    validate(rule, value, callback) {
        if (value && typeof value !== 'boolean') {
            callback('The input is not valid Boolean');
        }else {
            callback();
        }
    }

    /**
     * 将数据转换为 boolean 类型的值
     * 对于非 boolean 值，遵循如下规则：
     * - undefined, null - 转换为 undefined
     * - 任何其它值，都转换为 true
     */
    format(value) {
        if (typeof value === 'boolean') {
            return value;
        }
        else if (value == null) {
            return undefined;
        }
        else {
            return true;
        }
    }
}
