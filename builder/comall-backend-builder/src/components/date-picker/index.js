import React, { Component } from 'react';
import moment from 'moment';
import { DatePicker as AntDatePicker } from 'antd';

import { globalConfig } from '../../services/global-config';

export class DatePicker extends Component {

    constructor(props) {
        super(props);
        this.format = globalConfig.get('format.date');
    }

    onChange = (value) => {
        const format = this.format;
        const { name, onChange } = this.props;

        value = value ? value.format(format) : undefined;

        if (onChange) {
            onChange(value, name);
        }
    }

    disabledDate = (date) => {
        const format = this.format;
        let range = this.props.range;
        if (range) {
            const { start, end } = range;

            return (start ? date < moment(start, format) : false) ||
                (end ? date > moment(end, format) : false);
        } else {
            return false;
        }
    }

    render() {
        const format = this.format;
        let { value, format: renderFormat, placeholder, disabled, allowClear } = this.props;

        if (value) {
            value = moment(value, format);
        }

        let props = {
            value,
            format: renderFormat,
            placeholder,
            disabled,
            allowClear,
            onChange: this.onChange,
            disabledDate: this.disabledDate
        };

        return (
            <AntDatePicker {...props} />
        );
    }
}
