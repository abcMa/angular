import React from 'react';

import { Textbox } from '../../components/textbox';

import { StringType } from './string';

export class LongTextFormat extends StringType {
    /**
     * 获取输入组件
     */
    getControlComponent(controlInfo) {
        return (
            <Textbox {...controlInfo} type="textarea" autosize={{ minRows: 3, maxRows: 6 }} />
        );
    }
}
