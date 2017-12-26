import React from 'react';
import * as _ from 'lodash';
import classNames from 'classnames';

import { CheckboxGroup } from '../../components/checkbox-group';

import { Type } from '../type';

export class ArrayType extends Type {
    /**
     * 获取展示组件
     */
    getDisplayComponent(array, displayInfo) {
        const { className, style } = displayInfo;
        if (array && array.length) {
            return (
                <ul className={classNames('type-array', className)} style={style}>{
                    _.map(array, (item, index) => {
                        return (
                            <li key={index} className="string-type">{item}</li>
                        );
                    })
                }</ul>
            );
        } else {
            return super.getNotAvailableDisplayComponent(displayInfo);
        }
    }

    /**
     * 获取输入组件
     */
    getControlComponent(controlInfo) {
        return (
            <CheckboxGroup {...controlInfo} />
        );
    }

    /**
     * 对数据进行校验
     */
    validate(rule, value, callback) {
        if (value && value.length && !_.every(value, item => typeof item === 'string')) {
            callback('The input is not valid Array!');
        }else {
            callback();
        }
    }
}
