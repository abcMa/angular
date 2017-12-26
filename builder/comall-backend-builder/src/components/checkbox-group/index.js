import React, { Component } from 'react';
import * as _ from 'lodash';
import { Checkbox as AntCheckbox } from 'antd';

const AntCheckboxGroup = AntCheckbox.Group;

export class CheckboxGroup extends Component {

    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);
    }

    onChange(value) {
        const { name, onChange } = this.props;

        if (onChange) {
            onChange(value, name);
        }
    }

    componentWillReceiveProps(nextProps) {
        const { name, value, options, onChange } = nextProps;

        if (!value || _.isEqual(this.props.options, options)) {
            return;
        }

        let newValue = _.reduce(value, (newValue, item) => {
            if (_.some(options, option => option.id === item)) {
                newValue.push(item);
            }
            return newValue;
        }, []);

        if (!_.isEqual(value, newValue)) {
            onChange(newValue, name);
        }
    }

    render() {
        const { value, className, style, disabled, options } = this.props;

        const checkboxGroupProps = {
            value,
            className,
            style,
            disabled,
            options: options.map(option => {return {label: option.name, value: option.id};})
        };

        return (
            <AntCheckboxGroup {...checkboxGroupProps} onChange={this.onChange} />
        );
    }
}
