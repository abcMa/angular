import React from 'react';
import classNames from 'classnames';

import { Type } from '../type';
import { Numberbox } from '../../components/numberbox';

/**
 * 数字类型
 */
export class NumberType extends Type {
    /**
     * 获取展示组件
     */
    getAvailableDisplayComponent(value, displayInfo) {
        const { className } = displayInfo;
        displayInfo = {
            ...displayInfo,
            className: classNames('type-number', className)
        };
        return super.getAvailableDisplayComponent(value, displayInfo);
    }

    /**
     * 获取输入组件
     */
    getControlComponent(controlInfo) {
        return (
            <Numberbox {...controlInfo} />
        );
    }

    /**
     * 对数据进行校验
     */
    validate(rule, value, callback) {
        if (value && typeof value !== 'number' && !Number.isFinite(value)) {
            callback('The input is not valid Number!');
        }else {
            callback();
        }
    }

    /**
     * 将数据格式化为 number 类型的值
     */
    format(value) {
        if (typeof value !== 'number') {
            value = parseFloat(value, 10);
        }

        // NaN, +Infinity, -Infinity
        if (Number.isFinite(value) === false) {
            value = undefined;
        }

        return value;
    }
}
