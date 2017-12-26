import React, { Component } from 'react';
import { Button as AntButton, Tooltip as AntTooltip } from 'antd';

import { behaviorHandle } from '../../services';

export class Button extends Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    /**
     * 处理按钮的点击事件
     */
    handleClick(event) {
        const { onClick } = this.props;

        if (onClick) {
            onClick(event);
        } else {
            behaviorHandle(this.props);
        }
    }

    render() {
        const {
            className,
            style,
            text,
            type,
            htmlType,
            children,
            icon,
            shape,
            disabled,
            size,
            tooltip,
            loading
        } = this.props;

        let btnStyle = style;

        const buttonProps = {
            type,
            htmlType,
            icon,
            shape,
            className,
            style: btnStyle,
            disabled,
            size,
            loading,

            onClick: this.handleClick
        };

        let button = <AntButton {...buttonProps}>{text || children}</AntButton>;

        return (
            tooltip ?
                <AntTooltip title={tooltip}>
                    {button}
                </AntTooltip> :
                button
        );
    }
}
