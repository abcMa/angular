import React from 'react';
import * as _ from 'lodash';
import classNames from 'classnames';

import { NumberType } from './number';
import { Select } from '../../components/select';
import { Numberbox } from '../../components/numberbox';

/**
 * 整数类型
 */
export class IntegerFormat extends NumberType {
    /**
     * 获取展示组件
     */
    getAvailableDisplayComponent(value, displayInfo) {
        const { className, options } = displayInfo;
        displayInfo = {
            ...displayInfo,
            className: classNames('format-integer', className)
        };

        if (options) {
            value = _.result(_.find(options, function(option) {
                return option.id === Number(value);
            }), 'name');
        }

        return super.getAvailableDisplayComponent(value, displayInfo);
    }

    /**
     * 获取输入组件
     */
    getControlComponent(controlInfo) {
        if (controlInfo.options) {
            // 下拉选择框
            return (
                <Select {...controlInfo} />
            );
        } else {
            return (
                <Numberbox {...controlInfo} />
            );
        }
    }

    /**
     * 将数据格式化为请求参数
     */
    formatParams(key, value) {
        return {[key]: +value};
    }

    /**
     * 对数据进行校验
     */
    validate(rule, value, callback) {
        if (value && typeof value !== 'number' && Number.isInteger(value) && !Number.isFinite(value)) {
            callback('The input is not valid Integer');
        }else {
            callback();
        }
    }
}
