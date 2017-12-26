import React, { Component } from 'react';
import * as _ from 'lodash';

import { Button as AntButton } from 'antd';

import { dynamicRenderer } from '../dynamic-renderer';

export class ButtonBar extends Component {
    render() {
        const { className, style } = this.props;

        return (
            <AntButton.Group className={className} style={style}>
                {this.renderButtonBarItems()}
            </AntButton.Group>
        );
    }

    renderButtonBarItems() {
        return this.props.buttons.map((itemConfig, index) => {
            const ButtonBarItem = dynamicRenderer.createDynamicComponent(itemConfig);

            return (
                <ButtonBarItem key={index} />
            );
        });
    }
}
