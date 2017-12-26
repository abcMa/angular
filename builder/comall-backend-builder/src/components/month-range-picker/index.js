import React, { Component } from 'react';
import { DatePicker as AntDatePicker } from 'antd';
import moment from 'moment';

import { globalConfig } from '../../services/global-config';
import './index.scss';

const { MonthPicker } = AntDatePicker;

export class MonthRangePicker extends Component {

    constructor(props) {
        super(props);

        this.dateFormat = globalConfig.get('format.date');
        this.monthFormat = globalConfig.get('format.month');

        let state = this.generateState(props);
        state.endOpen = false;

        this.state = state;
    }

    generateState(props) {
        const format = this.dateFormat;
        const { startDate, endDate } = props.value || {};
        const { start: startLimit, end: endLimit } = props.range || {};

        let state = {
            startDate: (startDate ? moment(startDate, format) : moment()).startOf('month'),
            endDate: (endDate ? moment(endDate, format) : moment()).startOf('month')
        };

        if (startLimit) {
            state.startLimit = moment(startLimit, format);
        }
        if (endLimit) {
            state.endLimit = moment(endLimit, format);
        }

        return state;
    }

    componentWillReceiveProps(nextProps) {
        this.setState(this.generateState(nextProps));
    }

    disabledStartDate = (startDate) => {
        const { startLimit, endDate } = this.state;
        if (!startDate || !endDate) {
            return false;
        }
        let limitExceed = startLimit ? startDate < startLimit : false;
        return limitExceed || startDate > endDate;
    }

    disabledEndDate = (endDate) => {
        const { endLimit, startDate } = this.state;
        if (!endDate || !startDate) {
            return false;
        }
        let limitExceed = endLimit ? endDate > endLimit : false;
        return limitExceed || endDate < startDate;
    }

    onChange = (field, value) => {
        this.setState({
            [field]: value
        }, function() {
            const format = this.dateFormat;
            const { name, onChange } = this.props;

            let result = {
                startDate: this.state.startDate.format(format),
                endDate: this.state.endDate.format(format)
            };

            if (onChange) {
                onChange(result, name);
            }
        });
    }

    onStartChange = (value) => {
        this.onChange('startDate', value);
    }

    onEndChange = (value) => {
        this.onChange('endDate', value);
    }

    handleStartOpenChange = (open) => {
        if (!open) {
            this.setState({ endOpen: true });
        }
    }

    handleEndOpenChange = (open) => {
        this.setState({ endOpen: open });
    }

    render() {
        const { format, disabled } = this.props;
        const { startDate, endDate, endOpen } = this.state;

        return (
            <div className="month-range-picker">
                <MonthPicker
                    disabledDate={this.disabledStartDate}
                    format={format}
                    value={startDate}
                    placeholder="Start"
                    onChange={this.onStartChange}
                    onOpenChange={this.handleStartOpenChange}
                    defaultValue={startDate}
                    allowClear={false}
                    disabled={disabled}
                />
                <span className="spacing">~</span>
                <MonthPicker
                    disabledDate={this.disabledEndDate}
                    format={format}
                    value={endDate}
                    placeholder="End"
                    onChange={this.onEndChange}
                    open={endOpen}
                    onOpenChange={this.handleEndOpenChange}
                    defaultValue={endDate}
                    allowClear={false}
                    disabled={disabled}
                />
            </div>
        );
    }
}
