import React, { Component } from 'react';
import moment from 'moment';
import { DatePicker as AntDatePicker } from 'antd';

import { globalConfig } from '../../services/global-config';

export class DateTimePicker extends Component {

    constructor(props) {
        super(props);
        this.dateTimeFormat = globalConfig.get('format.dateTime');
        this.timeFormat = globalConfig.get('format.time');
    }

    onChange = (value) => {
        const format = this.dateTimeFormat;
        const { name, onChange } = this.props;

        value = value ? value.format(format) : undefined;

        if (onChange) {
            onChange(value, name);
        }
    }

    disabledDate = (date) => {
        const format = this.dateTimeFormat;
        let range = this.props.range;
        if (range) {
            let { start, end } = range;

            return (start ? date < moment(start, format).startOf('date') : false) ||
                (end ? date > moment(end, format).endOf('date') : false);
        } else {
            return false;
        }
    }

    render() {
        const { dateTimeFormat, timeFormat } = this;
        let { value, format: renderFormat, placeholder = 'Select Time', showTime = true,
            disabled, allowClear } = this.props;

        if (value) {
            value = moment(value, dateTimeFormat);
        }

        let props = {
            value,
            format: renderFormat,
            placeholder,
            showTime,
            disabled,
            allowClear,
            onChange: this.onChange,
            disabledDate: this.disabledDate
        };

        if (showTime.defaultValue) {
            showTime = Object.assign({}, showTime, {defaultValue: moment(showTime.defaultValue, timeFormat)});
        }

        return (
            <AntDatePicker {...props} />
        );
    }
}
