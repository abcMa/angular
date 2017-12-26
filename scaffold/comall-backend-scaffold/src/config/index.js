export let config = {

    // API 根地址
    apiRoot: 'http://localhost:4000',

    // 定义所有实体及其操作
    // 所有的权限也都以实体为目标进行定义，比如：
    //   - 无法获取实体数据
    //   - 无法获取实体的某个属性
    //   - 无法调用实体的某个操作
    entities: {
        info: {
            apiPath: '/loader/info',

            properties: {
                title: {
                    type: 'string',
                    format: 'title'
                },
                content: {
                    type: 'string'
                }
            }
        }
    },

    // 定义所有组件，组件是实体的映射，
    // 用于展示实体数据，并通过各种事件调用实体方法。
    components: {
        SideNavFrame: {
            component: 'Frame',
            type: 'side-nav',
            style: {
                minHeight: '100%'
            },

            sider: {
                items: [
                    {
                        component: 'Link',
                        url: '/#/',
                        imageurl: 'logo-dark.png',
                        text: 'logo',
                        className: 'flex-layout align-center justify-start',
                        style: {
                            margin: '0 17px',
                            height: '50px',
                            overflow: 'hidden'
                        }
                    },
                    {
                        component: 'Nav',
                        mode: 'inline',
                        theme: 'dark',

                        items: [
                            {
                                type: 'item',
                                key: 'home',
                                title: 'Home',
                                icon: 'home',
                                route: '/home'
                            }
                        ]
                    }
                ]
            },
            content: {
                items: [
                    {
                        component: 'Viewport',
                        style: {
                            backgroundColor: '#fff'
                        }
                    }
                ]
            },
            footer: {
                items: [
                    {
                        component: 'Text',
                        text: 'Powered by Co-Mall'
                    }
                ]
            }
        },

        Home: {
            component: 'Card',
            entity: 'info',
            loaderType: 'search',
            content: {
                component: 'InfoContainer'
            }
        }
    },

    // 路由定义
    router: [{
        path: '/',
        component: 'SideNavFrame',
        index: '/home',
        breadcrumbName: 'Home',
        routers: [
            {
                path:'/home',
                component:'Home',
                breadcrumbName: ''
            }
        ]
    }]
};
