import React from 'react';
import moment from 'moment';

import { DateTimePicker } from '../../components/date-time-picker';
import { StringType } from './string';
import { globalConfig } from '../../services';

export class DateTimeFormat extends StringType {

    /**
     * 获取展示组件
     */
    getAvailableDisplayComponent(value, displayInfo) {
        if (displayInfo.format) {
            value = moment(value, globalConfig.get('format.dateTime'))
                .format(displayInfo.format);
        }
        return super.getAvailableDisplayComponent(value, displayInfo);
    }

    /**
     * 获取输入组件，日期时间选择
     */
    getControlComponent(controlInfo) {
        return (
            <DateTimePicker {...controlInfo} />
        );
    }

    /**
     * 对数据进行校验
     */
    validate(rule, value, callback) {
        callback();
    }
}
