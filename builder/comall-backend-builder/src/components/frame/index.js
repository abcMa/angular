import React, { Component, createElement } from 'react';
import { Layout, Breadcrumb } from 'antd';

import { FlexLayout } from '../flex-layout';
import { parser } from '../../parser';

let { Header, Footer, Sider, Content } = Layout;

const DEFAULT_PROPS = {
    'side-nav': {
        sider: {
            collapsible: true
        },
        breadcrumb: {
            style: {
                padding: '0 16px',
                lineHeight: '50px',
                backgroundColor: '#fff'
            }
        },
        content: {
            style: {
                padding: '16px 16px 0'
            }
        },
        footer: {
            style: {
                textAlign: 'center'
            }
        }
    },

    'top-nav': {
        header: {
            style: {
                position: 'fixed',
                left: 0,
                right: 0,
                zIndex: 10000,
                height: 48,
                backgroundColor: '#fff'
            }
        },
        breadcrumb: {
            style: {
                padding: '56px 50px 8px'
            }
        },
        content: {
            style: {
                padding: '0 58px'
            }
        },
        footer: {
            style: {
                textAlign: 'center'
            }
        }
    }
};

export class Frame extends Component {

    /**
     * 生成 item 的 props 对象
     * @param {object} itemDesc - item 的配置对象
     * @param {any} key - item 的 key 值
     * @param {object} props - item 的 props
     * @return {object} - 该 item 的 props
     */
    getItemProps(itemDesc, key, props) {
        const { entity, routes, params } = props;
        const itemProps = Object.assign({ key, entity, routes, params }, itemDesc);

        delete itemProps.component;

        return itemProps;
    }

    renderItems(props) {
        if (!props.items) {
            return;
        }
        const { children } = props;
        return props.items.map((itemDesc, index) => {
            const ItemComponent = parser.getComponent(itemDesc.component);
            const itemProps = this.getItemProps(itemDesc, index, props);

            return createElement(ItemComponent, itemProps, children);
        });
    }

    render() {

        const {
            type,
            className,
            style,
            header,
            sider,
            breadcrumb,
            content,
            footer,
            routes,
            params,
            children
        } = this.props;

        const headerProps = {
            ...DEFAULT_PROPS[type].header,
            ...header,
            children
        };
        delete headerProps.items;

        const siderProps = {
            ...DEFAULT_PROPS[type].sider,
            ...sider,
            children
        };
        const siderItems = this.renderItems(siderProps);
        delete siderProps.items;

        const breadcrumbProps = {
            ...DEFAULT_PROPS[type].breadcrumb,
            ...breadcrumb,
            routes,
            params,
            children
        };

        const contentProps = {
            ...DEFAULT_PROPS[type].content,
            ...content,
            children
        };
        const contentItems = this.renderItems(contentProps);
        delete contentProps.items;

        const footerProps = {
            ...DEFAULT_PROPS[type].footer,
            ...footer,
            children
        };
        const footerItems = this.renderItems(footerProps);
        delete footerProps.items;

        if (type === 'side-nav') {
            return (
                <Layout className={className} style={style}>
                    <Sider {...siderProps}>
                        {siderItems}
                    </Sider>
                    <Layout>
                        <Breadcrumb {...breadcrumbProps} />
                        <Content {...contentProps}>
                            {contentItems}
                        </Content>
                        <Footer {...footerProps}>
                            {footerItems}
                        </Footer>
                    </Layout>
                </Layout>
            );
        }

        if (type === 'top-nav') {

            let headerFlexProps = {
                direction: 'horizontal',
                align: 'center',
                justify: 'space-between',
                items: header.items,
                routes,
                params,
                children
            };

            return (
                <Layout className={className} style={style}>
                    <Header {...headerProps}>
                        <FlexLayout {...headerFlexProps} />
                    </Header>
                    <Layout>
                        <Breadcrumb {...breadcrumbProps} />
                        <Content {...contentProps}>
                            {contentItems}
                        </Content>
                        <Footer {...footerProps}>
                            {footerItems}
                        </Footer>
                    </Layout>
                </Layout>
            );
        }
    }

}