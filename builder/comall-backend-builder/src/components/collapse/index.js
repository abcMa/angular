import React, { Component, createElement } from 'react';

import { Collapse as AntCollapse } from 'antd';

import { parser } from '../../parser';

export class Collapse extends Component {


    render() {

        const { items, style, className, activeKey, defaultActiveKey } = this.props;

        const props = {
            style,
            className,
            defaultActiveKey
        };

        if (activeKey) {
            props.activeKey = activeKey;
        }

        return (
            <AntCollapse {...props}>
                {
                    items.map((item, index) => (
                        <AntCollapse.Panel key={index} header={ item.name }>
                            {this.renderPanels(item)}
                        </AntCollapse.Panel>
                    ))
                }
            </AntCollapse>
        );
    }

    renderPanels(panel) {
        const { entity, entities, routes, params, children } = this.props;
        let content = panel.content;
        const props = Object.assign( { entity, entities, routes, params }, content );
        delete props.component;

        const component = parser.getComponent(content.component);

        return createElement(component, props, children);
    }

}
