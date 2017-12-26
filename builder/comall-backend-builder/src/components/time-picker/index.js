import React, { Component } from 'react';
import * as _ from 'lodash';
import moment from 'moment';
import { TimePicker as AntTimePicker } from 'antd';

import { globalConfig } from '../../services/global-config';

export class TimePicker extends Component {

    constructor(props) {
        super(props);
        this.format = globalConfig.get('format.time');
    }

    onChange = (value) => {
        const format = this.format;
        const { name, onChange, range } = this.props;

        if (range) {
            const { start, end } = range;

            if (moment(start, format) > value || moment(end, format) < value) {
                value = undefined;
            }
        }

        value = value ? value.format(format) : undefined;

        if (onChange) {
            onChange(value, name);
        }
    }

    disabledHours = (date) => {
        const format = this.format;
        const { range } = this.props;

        if (range) {
            const { start, end } = range;
            let startHour = start ? moment(start, format).hour() : 0;
            let endHour = end ? moment(end, format).hour() : 23;

            return _.range(0, startHour).concat(_.range(endHour + 1, 24));
        } else {
            return _.range(0, 24);
        }
    }

    disabledMinutes = (selectedHour) => {
        const format = this.format;
        const { range } = this.props;

        if (range) {
            const { start, end } = range;
            let startMinute = 0;
            let endMinute = 59;

            if (start) {
                const startTime = moment(start, format);

                if (selectedHour === startTime.hour()) {
                    startMinute = startTime.minute();
                }
            }

            if (end) {
                const endTime = moment(end, format);

                if (selectedHour === endTime.hour()) {
                    endMinute = endTime.minute();
                }
            }


            return _.range(0, startMinute).concat(_.range(endMinute + 1, 60));
        } else {
            return _.range(0, 60);
        }
    }

    disabledSeconds = (selectedHour, selectedMinute) => {
        const format = this.format;
        const { range } = this.props;

        if (range) {
            const { start, end } = range;
            let startSecond = 0;
            let endSecond = 59;

            if (start) {
                const startTime = moment(start, format);

                if (selectedHour === startTime.hour() && selectedMinute === startTime.minute()) {
                    startSecond = startTime.second();
                }
            }

            if (end) {
                const endTime = moment(end, format);

                if (selectedHour === endTime.hour() && selectedMinute === endTime.minute()) {
                    endSecond = endTime.second();
                }
            }


            return _.range(0, startSecond).concat(_.range(endSecond + 1, 60));
        } else {
            return _.range(0, 60);
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
            disabledHours: this.disabledHours,
            disabledMinutes: this.disabledMinutes,
            disabledSeconds: this.disabledSeconds
        };

        return (
            <AntTimePicker {...props} />
        );
    }
}
