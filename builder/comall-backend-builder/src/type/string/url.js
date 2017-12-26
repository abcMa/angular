import React from 'react';
import xssFilters from 'xss-filters';
import { Tooltip as AntTooltip } from 'antd';
import classNames from 'classnames';

import { StringType } from './string';

/**
 * 地址类型
 */
export class URLFormat extends StringType {
    /**
     * 获取展示组件
     */
    getAvailableDisplayComponent(value, displayInfo) {
        const { className, style, text = '[link]', target = '_blank' } = displayInfo;
        value = xssFilters.uriInDoubleQuotedAttr(value);
        return (
            <AntTooltip title={value}>
                <a className={classNames('type-string format-url', className)}
                    style={style} href={value} target={target}>{text}</a>
            </AntTooltip>
        );
    }

    /**
     * 对数据进行校验
     */
    validate(rule, value, callback) {
        // var url = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
        if (value && typeof value !== 'string') {
        // if (value && typeof value !== 'string' && !url.test(value)) {
            callback('The input is not valid Url!');
        }else {
            callback();
        }
    }
}
