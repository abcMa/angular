import React, { Component } from 'react';
import * as _ from 'lodash';
import classNames from 'classnames';

import { ArrayType } from './array';
import { Select } from '../../components/select';

/**
 * 名值对数组类型
 */
export class OptionsArrayFormat extends ArrayType {
    /**
     * 获取展示组件
     */
    getDisplayComponent(array, displayInfo) {
        const { className, style } = displayInfo;
        if (array && array.length) {
            return (
                <ul className={classNames('type-array format-options-array', className)} style={style}>{
                    _.map(array, ({ id, name, value }) => {
                        return (
                            <li key={id} className="string-type">{ name }</li>
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
        return <OptionsArraySelect {...controlInfo} />;
    }

    /**
     * 对数据进行校验
     */
    validate(rule, value, callback) {
        callback();
    }

}

class OptionsArraySelect extends Component {
    render() {
        const { onChange, value, options } = this.props;
        const control = Object.assign({}, this.props, {
            mode: 'multiple',
            value: value ? value.map(({ id }) => id) : null,
            onChange: (value, name) => {
                onChange(value.map(id => _.find(options, { id })), name);
            }
        });
        return (
            <Select {...control} />
        );
    }
}