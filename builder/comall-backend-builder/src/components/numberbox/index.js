import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { InputNumber as AntInputNumber } from 'antd';

import { basicPropTypes, controlPropTypes } from '../component-props';

import './index.scss';

export class Numberbox extends Component {
    static propTypes = {
        ...basicPropTypes,
        ...controlPropTypes,

        value: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number
        ]),

        // 最小值
        min: PropTypes.number,

        // 最大值
        max: PropTypes.number,

        // 累加/累减的步长，支持小数
        step: PropTypes.number,

        formatter: PropTypes.func
    };

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(value) {
        const { name, onChange } = this.props;

        if (onChange) {
            onChange(value, name);
        }
    }

    render() {
        const { className, style, name, value, placeholder, disabled, min, max, step, formatter } = this.props;

        const numberboxProps = {
            // basicPropTypes
            className,
            style,

            // controlPropTypes
            name,
            value,
            placeholder,
            disabled,
            onChange: this.handleChange,

            // custom
            min,
            max,
            step,
            formatter
        };

        return ( <AntInputNumber {...numberboxProps} /> );
    }
}
