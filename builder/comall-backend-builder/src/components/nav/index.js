import React, { Component, createElement } from 'react';
import * as _ from 'lodash';
import { Menu as AntMenu } from 'antd';

import { Image } from '../image';
import { Icon } from '../icon';
import { Text } from '../text';

import { parser } from '../../parser';
import { navigation, behaviorHandle, privilege } from '../../services';

export class Nav extends Component {

    constructor(props) {
        super(props);

        this.defaultOpenKeys = [];
        this.handleClick = this.handleClick.bind(this);
    }

    /**
     * 根据当前路由来确定当前需要展开的submenu和active状态的menuItem
     */
    getSelectedKeys() {
        const { items, mode } = this.props;
        let selectedKeys;

        _.forEach(items, item => {
            if (item.type === 'menu') {
                _.forEach(item.items, subMenuItem => {
                    if (this.isMatched(subMenuItem.route)) {
                        selectedKeys = subMenuItem.key.toString();
                        // inline 模式下设置默认展开的子菜单
                        if (mode === 'inline') {
                            this.defaultOpenKeys = [item.key.toString()];
                        }
                        return false;
                    }
                });
            } else {
                if (this.isMatched(item.route)) {
                    selectedKeys = item.key.toString();
                    return false;
                }
            }
        });

        return selectedKeys;
    }

    /**
     * 用来匹配路由是否处于激活状态
     * @param {string} pathStr - 需要匹配的路由
     */
    isMatched(pathStr) {
        let pathname = navigation.getPathname();
        if (pathname === '/') {
            pathname = parser.getRouterConfig().index;
        }
        return pathname.indexOf(pathStr) > -1;
    }

    /**
     * 点击 menuItem 时调用，可获得当前选中的menuItem，用来展示当前active状态的menuItem
     */
    handleClick(menuItem) {
        const { item } = menuItem;
        // 路由跳转
        behaviorHandle(item.props);
    }

    render() {
        const selectedKeys = this.getSelectedKeys();

        const {
            className,
            style,
            mode = 'inline',
            theme = 'light',
            defaultSelectedKeys
        } = this.props;

        let props = {
            className,
            style,
            mode,
            theme,
            defaultSelectedKeys: [defaultSelectedKeys],
            defaultOpenKeys: this.defaultOpenKeys
        };

        if (selectedKeys) {
            props.selectedKeys = [selectedKeys];
        } else {
            props.selectedKeys = [];
        }

        return (
            <AntMenu {...props} onClick={this.handleClick} >
                { this.renderSubMenu() }
            </AntMenu>
        );
    }

    renderSubMenu() {
        const { items } = this.props;

        return items.map((item) => {

            if (item.privilege) {
                const { path, level } = item.privilege;
                if (!privilege.check(path, level)) {
                    return undefined;
                }
            }

            if (item.type === 'menu') {
                return (
                    <AntMenu.SubMenu key={item.key} title={this.renderItem(item)}>
                        {item.items.map(menuItem => this.renderMenuItem(menuItem))}
                    </AntMenu.SubMenu>
                );
            } else {
                return this.renderMenuItem(item);
            }
        });
    }

    renderMenuItem(item) {
        if (item.privilege) {
            const { path, level } = item.privilege;
            if (!privilege.check(path, level)) {
                return undefined;
            }
        }

        return (
            <AntMenu.Item key={item.key} route={item.route} action={item.action}>
                {this.renderItem(item)}
            </AntMenu.Item>
        );
    }

    renderItem(item) {
        let components = [];
        if (item.imageurl) {
            components.push(<Image key="image" className="img" text={item.title} imageurl={item.imageurl} />);
        }
        if (item.icon) {
            components.push(<Icon key="icon" type={item.icon} />);
        }
        if (item.component) {
            components.push(this.renderComponent(item));
        }
        components.push(<Text key="text" text={item.title} />);
        return components;
    }

    renderComponent(item) {
        if (item.component) {
            const { entity, routes, params } = this.props;
            const props = Object.assign( { entity, routes, params }, item.component );
            delete props.name;
            return createElement(parser.getComponent(item.component.name), props);
        }
    }
}
