import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input as AntInput } from 'antd';

import { basicPropTypes, controlPropTypes } from '../component-props';

const AntTextArea = AntInput.TextArea;

/**
 * 文本输入框
 */
export class Textbox extends Component {
    static defaultProps = {
        type: 'text'
    };

    static propTypes = {
        ...basicPropTypes,
        ...controlPropTypes,

        // 文本框类型
        type: PropTypes.oneOf(['text', 'password', 'textarea']),

        // 自适应内容高度，只对 type="textarea" 有效，可设置为 true|false 或对象：{ minRows: 2, maxRows: 6 }
        autosize: PropTypes.oneOfType([
            PropTypes.bool,
            PropTypes.shape({
                minRows: PropTypes.number,
                maxRows: PropTypes.number
            })
        ])
    }

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        const { name, onChange } = this.props;
        const { value } = e.target;

        if (onChange) {
            onChange(value, name);
        }
    }

    render() {
        const { className, style, name, value, placeholder, disabled, maxLength,
            type, autosize, addonBefore, addonAfter, prefix, suffix } = this.props;

        const inputProps = {
            // basicPropTypes
            className,
            style,

            // controlPropTypes
            name,
            value,
            placeholder,
            disabled,
            maxLength,
            onChange: this.handleChange,
        };

        if (type === 'textarea') {
            inputProps.autosize = autosize;
            return ( <AntTextArea {...inputProps} /> );
        } else {
            Object.assign(inputProps, {
                addonBefore,
                addonAfter,
                prefix,
                suffix
            });
            return ( <AntInput {...inputProps} /> );
        }

    }
}
