import React, { Component, createElement } from 'react';
import { Row as AntRow, Col as AntCol } from 'antd';

import { parser } from '../../parser';

export class GridLayout extends Component {

    render() {
        const { className, style } = this.props;

        const rowProps = {
            className, style
        };

        return (
            <AntRow {...rowProps}>
                {this.renderItems()}
            </AntRow>
        );
    }

    /**
     * 渲染 col
     */
    renderItems() {
        return this.props.items.map((itemDesc, index) => {
            const ItemComponent = parser.getComponent(itemDesc.component);
            const props = this.getItemProps(itemDesc, index);
            const { children } = this.props;

            const { span } = itemDesc;

            const colProps = {
                span
            };

            return (
                <AntCol {...colProps} key={index}>
                    { createElement(ItemComponent, props, children) }
                </AntCol>
            );
        });
    }

    /**
     * 生成 col 的 props 对象
     */
    getItemProps(itemDesc, key) {
        const { entity, entities, routes, params } = this.props;
        const props = Object.assign( { key, entity, entities, routes, params }, itemDesc );

        return props;
    }
}
