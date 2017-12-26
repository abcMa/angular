import React, { Component } from 'react';
import { Progress as AntProgress } from 'antd';

export class Progress extends Component {

    render() {
        let { percent, status, showInfo } = this.props;

        const progressProps = {
            percent: parseFloat(Math.min(percent, 100)),
            status,
            showInfo,
            format: () => percent + '%'
        };

        return (
            <AntProgress {...progressProps}/>
        );
    }
}
