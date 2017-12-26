import React, { Component } from 'react';
import { Input as AntInput } from 'antd';

import { basicPropTypes, controlPropTypes } from '../component-props';

/**
 * 文本输入框
 */
export class Searchbox extends Component {
    static defaultProps = {
        type: 'text'
    };

    static propTypes = {
        ...basicPropTypes,
        ...controlPropTypes
    }

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
        const { className, style, name, placeholder, disabled } = this.props;

        const inputProps = {
            // basicPropTypes
            className,
            style,

            // controlPropTypes
            name,
            placeholder,
            disabled,
            onSearch: this.handleChange
        };

        return ( <AntInput.Search {...inputProps} /> );
    }
}
