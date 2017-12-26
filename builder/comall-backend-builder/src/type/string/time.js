import React from 'react';
import moment from 'moment';

import { TimePicker } from '../../components/time-picker';
import { StringType } from './string';
import { globalConfig } from '../../services';

export class TimeFormat extends StringType {

    /**
     * 获取展示组件
     */
    getAvailableDisplayComponent(value, displayInfo) {
        if (displayInfo.format) {
            value = moment(value, globalConfig.get('format.time'))
                .format(displayInfo.format);
        }
        return super.getAvailableDisplayComponent(value, displayInfo);
    }

    /**
     * 获取输入组件，日期选择
     */
    getControlComponent(controlInfo) {
        return (
            <TimePicker {...controlInfo} />
        );
    }

    /**
     * 对数据进行校验
     */
    validate(rule, value, callback) {
        callback();
    }
}
