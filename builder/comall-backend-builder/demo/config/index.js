export let config = {

    // API 根地址
    apiRoot: 'http://localhost:4000',

    // 定义所有实体及其操作
    // 所有的权限也都以实体为目标进行定义，比如：
    //   - 无法获取实体数据
    //   - 无法获取实体的某个属性
    //   - 无法调用实体的某个操作
    entities: {
        products: {
            apiPath: '/products',

            properties: {
                name: {
                    type: 'string',
                    displayName: '名称',
                    rules: [
                        { required: true }
                    ],
                },
                image: {
                    type: 'string',
                    format: 'imageUrl',
                    displayName: '图片',
                    rules: [
                        { type: 'url', message: 'invalid!' }
                    ],
                    displayConfig: {
                        style: {
                            width: 50
                        }
                    }
                },
                price: {
                    type: 'number',
                    format: 'price',
                    displayName: '价格'
                },
                brand: {
                    type: 'object',
                    format: 'option',
                    displayName: '品牌',
                    options: [],
                    source: {
                        apiPath: '/brands',
                        paramsFilter: []
                    },
                    controlConfig: {
                        showSearch: true,
                        optionFilterProp: 'children'
                    }
                },
                description: {
                    type: 'string',
                    displayName: '描述'
                },
                pack: {
                    type: 'array',
                    format: 'optionsArrayAuto',
                    displayName: '组合商品',
                    options: [],
                    source: {
                        apiPath: '/products?per_page=10',
                        loadOnInit: false,
                        dataType: 'paging'
                    }
                },
                style: {
                    type: 'object',
                    format: 'subForm',
                    displayName: '款式',
                    properties: {
                        color: {
                            type: 'string',
                            displayName: '颜色'
                        },
                        size: {
                            type: 'string',
                            displayName: '尺码'
                        },
                        time: {
                            type: 'string',
                            format: 'time',
                            displayName: '上架时间',
                            defaultValue: '05:20:00',
                            displayConfig: {
                                format: 'hh:mm'
                            },
                            controlConfig: {
                                range: {
                                    start: '05:10',
                                    end: '08:12'
                                },
                                format: 'hh:mm'
                            }
                        },
                        city: {
                            type: 'array',
                            format: 'treeNodeArray',
                            displayName: '地址',
                            options: [],
                            source: {
                                apiPath: '/regions/:id',
                                loadOnInit: false,
                                dataType: 'treeNode'
                            },
                            controlConfig: {
                                rootId: 0
                            }
                        }
                    }
                }
            },
            filters: {
                name: {
                    type: 'string',
                    displayName: '关键字'
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
                                type: 'menu',
                                key: 'table',
                                title: 'Table Component',
                                icon: 'bars',
                                items: [
                                    {
                                        type: 'item',
                                        key: 'data-table',
                                        title: 'Data Table',
                                        route: '/data-table'
                                    }
                                ]
                            },
                            {
                                type: 'menu',
                                key: 'form',
                                title: 'Form Component',
                                icon: 'solution',
                                items: [
                                    {
                                        type: 'item',
                                        key: 'create-form',
                                        title: 'Create Form',
                                        route: '/create-form'
                                    },
                                    {
                                        type: 'item',
                                        key: 'modify-form',
                                        title: 'Modify Form',
                                        route: '/modify-form/1'
                                    },
                                    {
                                        type: 'item',
                                        key: 'filter-form',
                                        title: 'Filter Form',
                                        route: '/filter-form'
                                    }
                                ]
                            },
                            {
                                type: 'menu',
                                key: 'layout',
                                title: 'Layout Component',
                                icon: 'layout',
                                items: [
                                    {
                                        type: 'item',
                                        key: 'tabs',
                                        title: 'Tabs',
                                        route: '/tabs'
                                    }
                                ]
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

        TopNavFrame: {
            component: 'Frame',
            type: 'top-nav',
            style: {
                minHeight: '100%'
            },

            header: {
                items: [
                    {
                        component: 'Link',
                        flex: '0 0 auto',
                        url: '/#/',
                        imageurl: 'logo-light.png',
                        text: 'logo',
                        className: 'flex-layout align-center justify-start',
                        style: {
                            marginRight: '8px',
                            height: '100%',
                        }
                    },
                    {
                        component: 'Nav',
                        mode: 'horizontal',
                        theme: 'light',

                        items: [
                            {
                                type: 'menu',
                                key: 'table',
                                title: 'Table Component',
                                icon: 'bars',
                                items: [
                                    {
                                        type: 'item',
                                        key: 'data-table',
                                        title: 'Data Table',
                                        route: '/data-table'
                                    }
                                ]
                            },
                            {
                                type: 'menu',
                                key: 'form',
                                title: 'Form Component',
                                icon: 'solution',
                                items: [
                                    {
                                        type: 'item',
                                        key: 'create-form',
                                        title: 'Create Form',
                                        route: '/create-form'
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        component: 'Nav',
                        className: 'nav-header',
                        flex: '0 0 auto',
                        mode: 'horizontal',
                        theme: 'light',

                        items: [
                            {
                                type: 'menu',
                                key: 'notifications',
                                title: 'User',
                                icon: 'user',
                                items: [
                                    {
                                        type: 'item',
                                        key: 'exit',
                                        title: 'Exit',
                                        icon: 'logout',
                                        action: {type: 'logout'}
                                    }
                                ]
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

        TableDemo: {
            component: 'Card',
            entity: 'products',
            content: {
                component: 'ProductTable'
            }
        },

        ProductTable: {
            component: 'DataTable',
            loadFirstPage: true,
            pagination: {
                pageSize: 5
            },

            columns: [
                {
                    property: 'name'
                },
                {
                    property: 'image'
                },
                {
                    property: 'price'
                },
                {
                    property: 'brand'
                },
                {
                    property: 'pack'
                },
                {
                    property: 'style.color'
                },
                {
                    property: 'style.size'
                },
                {
                    property: 'style.time'
                },
                {
                    property: 'description'
                },
                {
                    width: 100,
                    property: 'style.city'
                }
            ],

            actionColumn: {
                title: '',
                width: 350,
                items: [
                    {
                        text: 'Modify',
                        type: 'link',
                        path: '/modify-form/{{row.id}}'
                    },
                    {
                        text: 'Modify',
                        type: 'modify'
                    },
                    {
                        text: 'Confirm',
                        type: 'modifyConfirm'
                    },
                    {
                        text: 'Cancel',
                        type: 'modifyCancel'
                    },
                    {
                        text: 'Delete',
                        type: 'delete'
                    }
                ]
            }
        },

        CreateFormDemo: {
            component: 'Card',
            content: {
                component: 'ProductCreateForm'
            }
        },

        ProductCreateForm: {
            component: 'CreateForm',
            entity: 'products',
            labelCol: 4,
            submit: true,
            submitSuccessBehavior: {
                route: '/data-table'
            },
            style: {
                width: '400px'
            }
        },

        ModifyFormDemo: {
            component: 'Card',
            content: {
                component: 'ProductModifyForm'
            }
        },

        ProductModifyForm: {
            component: 'ModifyForm',
            entity: 'products',
            loaderType: 'get',
            direction: 'vertical',
            labelCol: 4,
            submit: true,
            submitSuccessBehavior: {
                route: '/data-table'
            },
            style: {
                width: '400px'
            }
        },

        FilterFormDemo: {
            component: 'Card',
            entity: 'products',
            content: {
                component: 'FlexLayout',
                direction: 'vertical',

                items: [
                    {
                        component: 'ProductFilterForm'
                    },
                    {
                        component: 'ProductTable'
                    }
                ]
            }
        },

        ProductFilterForm: {
            component: 'FilterForm',
            direction: 'inline',
            submit: {
                icon: 'search',
                text: ''
            },
            style: {
                marginBottom: 16
            }
        },

        TabsDemo: {
            component: 'Card',
            content: {
                component: 'Tabs',

                items: [
                    {
                        title: '全部',
                        icon: 'folder',
                        content: {
                            component: 'TabContent'
                        }
                    },
                    {
                        title: '价格小于100',
                        icon: 'filter',
                        params: {
                            maxPrice: 100
                        },
                        content: {
                            component: 'TabContent'
                        }
                    },
                    {
                        title: '价格大于100',
                        icon: 'filter',
                        params: {
                            minPrice: 100
                        },
                        content: {
                            component: 'TabContent'
                        }
                    }
                ]
            }
        },

        TabContent: {
            component: 'ProductTable',
            entity: 'products'
        }
    },

    // 路由定义
    router: [{
        path: '/',
        component: 'SideNavFrame',
        index: '/data-table',
        breadcrumbName: 'Home Page',
        routers: [
            {
                path:'/data-table',
                component:'TableDemo',
                breadcrumbName: 'Data Table Demo'
            },
            {
                path:'/create-form',
                component:'CreateFormDemo',
                breadcrumbName: 'Create Form Demo'
            },
            {
                path:'/modify-form/:id',
                component:'ModifyFormDemo',
                breadcrumbName: 'Modify Form Demo'
            },
            {
                path:'/filter-form',
                component:'FilterFormDemo',
                breadcrumbName: 'Filter Form Demo'
            },
            {
                path:'/tabs',
                component:'TabsDemo',
                breadcrumbName: 'Tabs Demo'
            }
        ],
    }]
};
