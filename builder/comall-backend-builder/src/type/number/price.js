import React from 'react';
import classNames from 'classnames';

import { NumberType } from './number';
import { Numberbox } from '../../components/numberbox';

/**
 * 全局默认类型系统呈现，其余类型或格式通过继承该类并覆盖相应方法以实现内容。
 */
export class PriceFormat extends NumberType {
    /**
     * 获取展示组件
     */
    getAvailableDisplayComponent(value, displayInfo) {
        const { className } = displayInfo;
        displayInfo = {
            ...displayInfo,
            className: classNames('format-price', className)
        };

        const str = value.toFixed(2) + '';

        const integerPart = str.slice(0, -3).replace( /\B(?=(?:\d{3})+$)/g, ',' );
        const decimalPart = str.slice(-3);

        const priceStr = integerPart + decimalPart;

        return super.getAvailableDisplayComponent(priceStr, displayInfo);
    }

    /**
     * 获取输入组件
     */
    getControlComponent(controlInfo) {
        return (
            <Numberbox {...controlInfo} min={0} />
        );
    }

    /**
     * 对数据进行校验
     */
    validate(rule, value, callback) {
        if (value && typeof value !== 'number' && Number.isInteger(value)) {
            callback('The input is not valid Price');
        }else {
            callback();
        }
    }

    /**
     * 将数据格式化为符合 price 格式的 number 类型的值
     * 即最多保留小数点后两位（直接截去，而非四舍五入）
     */
    format(value) {
        value = super.format(value);

        if (value !== undefined) {
            value = Math.floor(value * 100) / 100; // 只保留小数点后两位的值
        }

        return value;
    }
}
