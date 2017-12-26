import React from 'react';

import { OptionsArrayFormat } from './options-array';
import { SelectAutoComplete } from '../../components/select-auto-complete';

/**
 * 名值对数组类型
 */
export class OptionsArrayAutoFormat extends OptionsArrayFormat {

    /**
     * 获取输入组件
     */
    getControlComponent(controlInfo) {
        let props = {
            ...controlInfo,
            mode: 'multiple'
        };
        return <SelectAutoComplete {...props} />;
    }

}

