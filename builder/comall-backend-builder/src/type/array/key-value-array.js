import React, { Component } from 'react';
import * as _ from 'lodash';
import { Input as AntInput } from 'antd';
import classNames from 'classnames';

import { ArrayType } from './array';

/**
 * 名值对数组类型
 */
export class KeyValueArrayFormat extends ArrayType {
    /**
     * 获取展示组件
     */
    getDisplayComponent(array, displayInfo) {
        const { className, style } = displayInfo;
        if (array && array.length) {
            return (
                <ul className={classNames('type-array format-key-value-array', className)} style={style}>{
                    _.map(array, ({ id, name, value }) => {
                        return (
                            <li key={id} className="string-type">{ `${name}: ${value}` }</li>
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
            <MultiInput {...controlInfo} />
        );
    }

    /**
     * 将数据格式化为请求参数
     */
    formatParams(key, value) {
        return {[key]: _.map(value, (item) => ({id:item.id, value: item.value}))};
    }

    /**
     * 对数据进行校验
     */
    validate(rule, value, callback) {
        callback();
    }

}

class MultiInput extends Component {

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(value, index) {
        const { value: array, name, onChange } = this.props;
        let cloneArray = _.cloneDeep(array);
        value = parseInt(value, 10);
        cloneArray[index].value = isNaN(value) ? undefined : value;

        if (onChange) {
            onChange(cloneArray, name);
        }
    }

    render() {
        const array = this.props.value;

        return (
            <div className={'multi-input-wrapper'}>{
                _.map(array, (item, index) => {
                    let { id, name, value } = item;
                    return (
                        <AntInput key={id} value={value} addonBefore={name}
                            onChange={(e) => {
                                this.handleChange(e.target.value, index);
                            }}/>
                    );
                })
            }</div>
        );
    }
}
