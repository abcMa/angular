import React from 'react';
import moment from 'moment';

import { StringType } from './string';
import { DatePicker } from '../../components/date-picker';
import { globalConfig } from '../../services';

export class DateFormat extends StringType {

    /**
     * 获取展示组件
     */
    getAvailableDisplayComponent(value, displayInfo) {
        if (displayInfo.format) {
            value = moment(value, globalConfig.get('format.date'))
                .format(displayInfo.format);
        }
        return super.getAvailableDisplayComponent(value, displayInfo);
    }

    /**
     * 获取输入组件，日期选择
     */
    getControlComponent(controlInfo) {
        return (
            <DatePicker {...controlInfo} />
        );
    }

    /**
     * 对数据进行校验
     */
    validate(rule, value, callback) {
        callback();
    }
}
