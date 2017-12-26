import React, { Component } from 'react';
import classNames from 'classnames';

import { Type } from '../type';
import { Textbox } from '../../components/textbox';

/**
 * 对象类型
 */
export class ObjectType extends Type {
    /**
     * 获取展示组件
     */
    getAvailableDisplayComponent(value, displayInfo) {
        const { className } = displayInfo;
        displayInfo = {
            ...displayInfo,
            className: classNames('type-object', className)
        };
        if (typeof value === 'object') {
            value = JSON.stringify(value);
        }
        return super.getAvailableDisplayComponent(value, displayInfo);
    }

    /**
     * 获取输入组件
     */
    getControlComponent(controlInfo) {
        return <ObjectTextBox {...controlInfo} />;
    }

    /**
     * 对数据进行校验
     */
    validate(rule, value, callback) {
        try {
            if (typeof value !== 'object') {
                JSON.parse(value);
            }
            callback();
        } catch(error) {
            callback('The input is not valid JSON format!');
        }
    }

    /**
     * 将数据格式化为请求参数
     */
    formatParams(key, value) {
        try {
            return {
                [key]: typeof value === 'object' ? value : JSON.parse(value)
            };
        } catch (e) {
            return { [key]: null };
        }

    }
}

class ObjectTextBox extends Component {
    render() {
        let { value } = this.props;
        if (typeof value === 'object') {
            value = JSON.stringify(value);
        }
        return <Textbox {...this.props}
            value={value}
            type="text" />;
    }
}