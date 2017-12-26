import React, { Component, createElement } from 'react';
import * as _ from 'lodash';
import { Tabs as AntTabs, Icon } from 'antd';

import { parser } from '../../parser';

const AntTabPane = AntTabs.TabPane;

export class Tabs extends Component {

    render() {
        const { className, style, items, animated, defaultActiveKey,
            size, tabBarStyle, tabPosition } = this.props;
        let props = {
            className,
            style,
            animated,
            size,
            tabBarStyle,
            tabPosition
        };

        if (defaultActiveKey) {
            props.defaultActiveKey = defaultActiveKey;
        }

        return (
            <AntTabs {...props}>
                {_.map(items, (item, index) => this.renderItem(item, index))}
            </AntTabs>
        );
    }

    renderItem(item, index) {
        const { entity, entities, routes, params, children } = this.props;
        const { className, style, title, icon, forceRender, params: tabParams, content} = item;
        let itemProps = {
            key: index,
            className,
            style,
            forceRender,
            tab: <span>{icon ? <Icon type={icon} /> : undefined}{title}</span>
        };
        const ContentComponent = parser.getComponent(content.component);
        let contentProps = {
            ...content,
            entity,
            entities,
            routes,
            params: {...params, ...tabParams}
        };
        delete contentProps.component;

        return (
            <AntTabPane {...itemProps}>
                {createElement(ContentComponent, contentProps, children)}
            </AntTabPane>
        );
    }
}
