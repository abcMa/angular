import React from 'react';
import moment from 'moment';

import { MonthRangePicker } from '../../components/month-range-picker';
import { StringType } from './string';
import { globalConfig } from '../../services';

export class MonthRangeFormat extends StringType {

    /**
     * 获取展示组件
     */
    getDisplayComponent(value, displayInfo) {
        let { startDate, endDate } = value || {};
        if (startDate && endDate) {
            const format = displayInfo.format;
            if (format) {
                const dateFormat = globalConfig.get('format.date');
                startDate = moment(startDate, dateFormat).format(format);
                endDate = moment(endDate, dateFormat).format(format);
            }
            return super.getAvailableDisplayComponent(`${startDate} ~ ${endDate}`, displayInfo);
        } else {
            return super.getNotAvailableDisplayComponent(displayInfo);
        }
    }

    /**
     * 获取输入组件，日期的选择区间
     */
    getControlComponent(controlInfo) {
        return (
            <MonthRangePicker {...controlInfo} />
        );
    }

    /**
     * 将数据格式化为请求参数
     */
    formatParams(key, value) {
        let format = globalConfig.get('format.date');
        return {
            startDate: moment(value.startDate).startOf('month').format(format),
            endDate: moment(value.endDate).add(1, 'months').startOf('month').format(format)
        };
    }

    /**
     * 对数据进行校验
     */
    validate(rule, value, callback) {
        callback();
    }
}
