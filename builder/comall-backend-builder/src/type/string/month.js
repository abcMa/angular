import React from 'react';
import moment from 'moment';

import { MonthPicker } from '../../components/month-picker';
import { StringType } from './string';
import { globalConfig } from '../../services';

export class MonthFormat extends StringType {

    /**
     * 获取展示组件
     */
    getAvailableDisplayComponent(value, displayInfo) {
        if (displayInfo.format) {
            value = moment(value, globalConfig.get('format.month'))
                .format(displayInfo.format);
        }
        return super.getAvailableDisplayComponent(value, displayInfo);
    }

    /**
     * 获取输入组件，月份选择
     */
    getControlComponent(controlInfo) {
        return (
            <MonthPicker {...controlInfo} />
        );
    }

    /**
     * 将数据格式化为请求参数
     */
    formatParams(key, value) {
        let format = globalConfig.get('format.date');
        return {
            startDate: moment(value).startOf('month').format(format),
            endDate: moment(value).add(1, 'months').startOf('month').format(format)
        };
    }

    /**
     * 对数据进行校验
     */
    validate(rule, value, callback) {
        callback();
    }
}
