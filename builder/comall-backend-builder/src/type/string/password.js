import React from 'react';

import { StringType } from './string';
import { Textbox } from '../../components/textbox';

/**
 * 图片地址类型
 */
export class PasswordFormat extends StringType {
    /**
     * 获取输入组件
     */
    getControlComponent(controlInfo) {
        return (
            <Textbox {...controlInfo} type="password" />
        );
    }
}
