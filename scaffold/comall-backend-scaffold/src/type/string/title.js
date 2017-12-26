import React from 'react';
import { StringType } from 'comall-backend-builder/lib/type/string/string';

/**
 * 标题类型
 */
export class TitleFormat extends StringType {

    /**
     * 获取展示组件
     */
    getAvailableDisplayComponent(value, displayInfo) {
        return <h1 className="type-string format-title">{value}</h1>;
    }
}