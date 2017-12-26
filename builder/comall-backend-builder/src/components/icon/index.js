import React, { Component } from 'react';

import { Icon as AntIcon } from 'antd';

export class Icon extends Component {
    render() {
        const { type, style } = this.props;

        return (
            <AntIcon type={type} style={style}/>
        );
    }
}
