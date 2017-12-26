import React, { Component } from 'react';

import { interpolate } from '../../services';

/**
 * 文本组件，text 属性支持使用 {{}} 表达式从 props 进行插值
 */
export class Text extends Component {
    render() {
        const { style, text, className } = this.props;

        let result = interpolate(text, this.props);

        return (
            <span style={style} className={className}>{result}</span>
        );
    }
}
