import React, { Component, createElement } from 'react';
import { Card as AntCard} from 'antd';

import { parser } from '../../parser';

export class Card extends Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    /**
     * 处理按钮的点击事件
     */
    handleClick(event) {
        if (this.props.onClick) {
            this.props.onClick(event);
        }
    }

    render() {

        const { title, style, className, bordered, loading, bodyStyle} = this.props;

        const props = {title, style, className, bordered, loading, bodyStyle, onClick: this.handleClick};

        return (
            <AntCard {...props}>
                { this.renderContent() }
            </AntCard>
        );
    }

    renderContent() {
        const { content, entity, entities, routes, params } = this.props;
        const props = Object.assign( { entity, entities, routes, params }, content);
        delete props.component;

        let component = parser.getComponent(content.component);

        return createElement(component, props);
    }
}
