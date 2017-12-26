import React from 'react';

import { OptionFormat } from './option';
import { SelectAutoComplete } from '../../components/select-auto-complete';

/**
 * 字符串类型
 */
export class OptionAutoFormat extends OptionFormat {

    /**
     * 获取输入组件
     */
    getControlComponent(controlInfo) {
        return (
            <SelectAutoComplete {...controlInfo} />
        );
    }
}