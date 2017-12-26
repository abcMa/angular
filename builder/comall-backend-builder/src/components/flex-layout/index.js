import React, { Component, createElement } from 'react';
import classNames from 'classnames';
import * as _ from 'lodash';

import { parser } from '../../parser';

import './index.scss';

export class FlexLayout extends Component {
    constructor() {
        super();
        this.styleMap = {};
    }

    render() {
        let { direction, align, justify, className, style } = this.props;

        className = classNames(
            'layout',
            'flex-layout',
            {[`direction-${direction}`]: !!direction},
            {[`align-${align}`]: !!align},
            {[`justify-${justify}`]: !!justify},
            className
        );

        return (
            <div className={className} style={style}>
                {this.renderItems()}
            </div>
        );
    }

    /**
     * 渲染 flex item
     */
    renderItems() {
        return this.props.items.map((itemDesc, index) => {
            const ItemComponent = parser.getComponent(itemDesc.component);
            const props = this.getItemProps(itemDesc, index);
            const { children } = this.props;

            return createElement(ItemComponent, props, children);
        });
    }

    /**
     * 生成 flex item 的 props 对象
     * @param {object} itemDesc - item 的配置对象
     * @param {any} key - item 的 key 值
     * @return {object} - 该 item 的 props
     */
    getItemProps(itemDesc, key) {
        const { entity, entities, routes, params } = this.props;
        const props = Object.assign( { key, entity, entities, routes, params }, itemDesc );

        delete props.component;
        props.className = classNames('flex-layout-item', props.className);

        // 处理 flex item 的样式
        if (props.flex) {
            let mapKey = JSON.stringify(itemDesc);
            let cachedStyle = this.styleMap[mapKey];
            let style = _.assign({
                flex: props.flex,
                msFlex: props.flex
            }, props.style);

            if (!_.isEqual(style, cachedStyle)) {
                cachedStyle = style;
                this.styleMap[mapKey] = cachedStyle;
            }

            props.style = cachedStyle;
            delete props.flex;
        }

        return props;
    }
}
