import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as _ from 'lodash';
import { Select as AntSelect } from 'antd';

import { basicPropTypes, controlPropTypes } from '../component-props';

export class Select extends Component {
    static defaultProps = {
        placeholder: '请选择'
    };

    static propTypes = {
        ...basicPropTypes,
        ...controlPropTypes,

        value: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string,
            PropTypes.array
        ]),

        // 待选项
        options: PropTypes.array.isRequired
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

    componentWillMount() {
        const { name, value, options, onChange, defaultValueIndex } = this.props;
        if (defaultValueIndex !== undefined && !value && defaultValueIndex < options.length) {
            onChange(options[defaultValueIndex].id, name);
        }
    }

    componentWillReceiveProps(nextProps) {
        const { name, value, options, onChange, defaultValueIndex } = nextProps;

        if (value && options.length) {
            if (_.isArray(value)) {
                if (_.some(value, id => !_.find(options, { id }))) {
                    onChange([], name);
                }
            } else {
                if (!_.some(options, option => option.id + '' === value + '')) {
                    onChange(undefined, name);
                }
            }
        }

        if (defaultValueIndex !== undefined && !value && !_.isEqual(this.props.options, options)) {
            onChange(options[defaultValueIndex].id, name);
        }
    }

    render() {
        const { className, style, mode, name, value, placeholder, disabled, options,
            allowClear, showSearch, optionFilterProp, onSelect, onDeselect } = this.props;

        const selectProps = {
            // basicPropTypes
            className,
            style,

            // controlPropTypes
            mode,
            name,
            placeholder,
            disabled,
            showSearch,
            allowClear,
            optionFilterProp,
            onChange: this.handleChange,
            onSelect,
            onDeselect
        };

        if (value !== undefined && value !== null) {
            selectProps.value = _.isArray(value) ? value : value + '';
        }

        const children = _.map(options, (option) => (
            <AntSelect.Option key={option.id}>
                {option.name}
            </AntSelect.Option>
        ));

        return (
            <AntSelect {...selectProps}>
                { children }
            </AntSelect>
        );
    }
}
