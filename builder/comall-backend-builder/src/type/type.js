import React from 'react';
import * as _ from 'lodash';
import classNames from 'classnames';

import { Textbox } from '../components/textbox';

/**
 * 全局默认类型系统呈现，其余类型或格式通过继承该类并覆盖相应方法以实现内容。
 */
export class Type {
    /**
     * 获取无数据状态展示组件
     */
    getNotAvailableDisplayComponent(displayInfo) {
        const { className, style } = displayInfo;
        return (
            <span className={classNames('type-not-available', className)}
                style={style}>NA</span>
        );
    }

    /**
     * 获取有数据状态展示组件
     */
    getAvailableDisplayComponent(value, displayInfo) {
        const { className, style } = displayInfo;
        return (
            <span className={className} style={style}>{ value }</span>
        );
    }

    /**
     * 获取展示组件
     */
    getDisplayComponent(value, displayInfo) {
        if (value === undefined || value === null) {
            return this.getNotAvailableDisplayComponent(displayInfo);
        } else {
            return this.getAvailableDisplayComponent(value, displayInfo);
        }
    }

    /**
     * 获取输入组件
     */
    getControlComponent(controlInfo) {
        return (
            <Textbox {...controlInfo} type="text" />
        );
    }

    /**
     * 对数据进行校验
     */
    validate(rule, value, callback) {
        callback();
    }

    /**
     * 对数据进行格式化
     */
    format(value) {
        if (_.isNil(value) || _.isNaN(value)) {
            return value.toString();
        } else {
            return '';
        }
    }

    /**
     * 将数据格式化为请求参数
     */
    formatParams(key, value) {
        return { [key]: value };
    }
}
