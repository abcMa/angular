import React from 'react';
import classNames from 'classnames';

import { StringType } from './string';

/**
 * 图片地址类型
 */
export class ImageURLFormat extends StringType {
    /**
     * 获取展示组件
     */
    getAvailableDisplayComponent(value, displayInfo) {
        const { className, style, alt } = displayInfo;
        return (
            <img className={classNames('type-string format-image-url', className)}
                style={style} src={value} alt={alt} />
        );
    }

    /**
     * 将数据格式化为 number 类型的值
     */
    format(value) {
        const stringValue = super.format(value);
        return stringValue.trim();
    }
}
