import React from 'react';
import * as _ from 'lodash';
import classNames from 'classnames';

import { Type } from '../type';
import { Select } from '../../components/select';
import { Textbox } from '../../components/textbox';

/**
 * 字符串类型
 */
export class StringType extends Type {

    /**
     * 获取展示组件
     */
    getAvailableDisplayComponent(value, displayInfo) {
        const { className, options } = displayInfo;
        displayInfo = {
            ...displayInfo,
            className: classNames('type-string', className)
        };

        if (options) {
            // 下拉选择框，通过key，查找显示的value值
            value = _.result(_.find(options, function(option) {
                return option.id === String(value);
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
                <Textbox {...controlInfo} type="text" />
            );
        }
    }

    /**
     * 对数据进行校验
     */
    validate(rule, value, callback) {
        if (value && typeof value !== 'string') {
            callback('The input is not valid String!');
        }else {
            callback();
        }
    }
}