import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Switch as AntSwitch } from 'antd';

import { basicPropTypes, controlPropTypes } from '../component-props';

export class Switch extends Component {
    static propTypes = {
        ...basicPropTypes,
        ...controlPropTypes,

        value: PropTypes.bool
    };

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(checked) {
        const { name, onChange } = this.props;

        if (onChange) {
            onChange(checked, name);
        }
    }

    render() {
        const { className, style, name, value, disabled, checkedChildren, unCheckedChildren } = this.props;

        const switchProps = {
            // basicPropTypes
            className,
            style,

            // controlPropTypes
            name,
            checked: value,
            disabled,
            onChange: this.handleChange,

            // custom
            checkedChildren,
            unCheckedChildren
        };

        return ( <AntSwitch {...switchProps} /> );
    }
}
