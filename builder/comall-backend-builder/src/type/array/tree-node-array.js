import React from 'react';

import { ArrayType } from './array';
import { TreeNodeCascader } from '../../components/tree-node-cascader';
import * as _ from 'lodash';
import classNames from 'classnames';
/**
 * 名值对数组类型
 */
export class TreeNodeArrayFormat extends ArrayType {
    /**
     * 获取展示组件
     */
    getDisplayComponent(array, displayInfo) {
        const { className, style } = displayInfo;
        let namesArr = _.map(array, ({ name }) => {
            return name;
        });
        if (array && array.length) {
            return (<span className = { classNames('string-type', className) } style = { style }>
                { namesArr.join('/') }</span>);
        } else {
            return super.getNotAvailableDisplayComponent(displayInfo);
        }
    }
    /**
     * 获取输入组件
     */
    getControlComponent(controlInfo) {
        return (
            <TreeNodeCascader { ...controlInfo }/>
        );
    }

    /**
     * 对数据进行校验
     */
    validate(rule, value, callback) {
        callback();
    }
}