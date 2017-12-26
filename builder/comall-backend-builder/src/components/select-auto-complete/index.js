import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as _ from 'lodash';
import { Select as AntSelect } from 'antd';

import { basicPropTypes, controlPropTypes } from '../component-props';

export class SelectAutoComplete extends Component {
    static defaultProps = {
        placeholder: '请选择'
    };

    static propTypes = {
        ...basicPropTypes,
        ...controlPropTypes,

        value: PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.array
        ]),

        // 待选项
        options: PropTypes.array.isRequired
    }

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSearch = _.throttle(this.handleSearch.bind(this), 1000);
    }

    handleChange(value) {
        const { name, onChange } = this.props;

        if (onChange) {
            if (_.isArray(value)) {
                value = _.map(value, ({ key, label}) => ({ id: key, name: label }));
            } else if (value !== null && value !== undefined) {
                value = { id: value.key, name: value.label };
            }
            onChange(value, name);
        }
    }

    handleSearch(value) {
        const { entity, name, params } = this.props;

        const property = _.get(entity.metainfo.properties, name.split('.').join('.properties.'));
        entity.loadPropertyOptions(name, property.source, {...params, name: value});
    }

    render() {
        const { className, style, mode, name, value, placeholder, disabled, options,
            allowClear, onSelect, onDeselect } = this.props;

        const selectProps = {
            // basicPropTypes
            className,
            style,

            // controlPropTypes
            mode,
            name,
            placeholder,
            disabled,
            allowClear,
            labelInValue: true,
            showSearch: true,
            filterOption: false,
            onChange: this.handleChange,
            onSearch: this.handleSearch,
            onSelect,
            onDeselect
        };

        if (_.isArray(value)) {
            selectProps.value = value.map(({ id, name }) => ({ key: id, label: name }));
        } else if (_.isObject(value)) {
            selectProps.value = { key: value.id, label: value.name };
        }

        const children = _.map(options, ({ id, name }) => (
            <AntSelect.Option key={id}>
                {name}
            </AntSelect.Option>
        ));

        return (
            <AntSelect {...selectProps}>
                { children }
            </AntSelect>
        );
    }
}
