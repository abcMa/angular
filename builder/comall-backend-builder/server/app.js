var koa = require('koa');
var router = require('koa-router')();
var body = require('koa-bodyparser');
var staticServe = require('koa-static');
var _ = require('lodash');
var fs = require('fs');

var databseFilePath = __dirname + '/database.json';

var database = require(databseFilePath);

console.info(database);

var app = koa();

function write() {
    fs.writeFileSync(databseFilePath, JSON.stringify(database, null, "    "));
}

router
    .get('/products', function *() {
        var query = this.request.query;
        var data = _.merge(database);

        if (query.name) {
            data = _.filter(data, function(item) {
                return item.name.indexOf(query.name) !== -1;
            });
        }

        if (query.min_price) {
            var minPrice = parseFloat(query.min_price);

            data = _.filter(data, function(item) {
                return item.price >= minPrice;
            });
        }

        if (query.max_price) {
            var maxPrice = parseFloat(query.max_price);

            data = _.filter(data, function(item) {
                return item.price <= maxPrice;
            });
        }

        switch(query.order) {
            case 'ascend':
                data.sort(function(l1, l2) {
                    return l1[query.field] - l2[query.field];
                });
                break;
            case 'descend':
                data.sort(function(l1, l2) {
                    return l2[query.field] - l1[query.field];
                });
                break;
            default:
        }

        var totalNum = data.length;
        var page = parseInt(query.page, 10) || 1;
        var perPage = parseInt(query.per_page, 10) || 4;

        data = data.slice( (page - 1) * perPage, page * perPage );

        var response = {
            result: data,
            totalNum: totalNum,
            page: page,
            perPage: perPage
        };

        this.body = JSON.stringify(response);
    })
    .get('/products/:id', function *() {
        var query = this.params;

        var data = _.filter(database, function(item) {
            return item.id == query.id;
        });

        data = data.length ? data[0] : null;

        if (data) {
            this.body = JSON.stringify(data);
        }
    })
    .post('/products', function *() {
        var query = this.request.body;

        var item = {
            id: (new Date()).getTime() + '',
            name: query.name,
            image: query.image,
            price: parseFloat(query.price, 10),
            brand: query.brand,
            state: query.state,
            description: query.description,
            style: query.style,
            pack: query.pack
        };

        database.unshift(item);
        write();

        this.response.status = 201;
    })
    .put('/products/:id', function *() {
        var id = this.params.id;
        var query = this.request.body;

        var targetIndex = _.findIndex(database, ['id', id]),
            target = database[targetIndex];

        if (target) {
            target = _.merge({id: target.id}, {
                name: query.name,
                image: query.image,
                price: parseFloat(query.price, 10),
                brand: query.brand,
                state: query.state,
                description: query.description,
                style: query.style,
                pack: query.pack
            });

            database[targetIndex] = target;

            write();

            this.response.status = 202;
        }
    })
    .delete('/products/:id', function *() {
        var id = this.params.id;

        var targetIndex = _.findIndex(database, ['id', id]),
            target = database[targetIndex];

        if (target) {
            database.splice(targetIndex, 1);
            write();

            this.response.status = 200;
        }
    })
    .get('/brands', function *() {
        this.body = JSON.stringify([
            {
                id: '1',
                name: '舒肤佳'
            },
            {
                id: '2',
                name: '立白'
            },
            {
                id: '3',
                name: '飘柔'
            }
        ]);
    })
    .get('/regions/:id', function *() {
        var id = this.params.id;
        var dataObj = {};
        if(id === '0'){
            dataObj = {
                "id": "0",
                "name": "中国",
                "children": [
                    {
                        "id": "611",
                        "name": "北京市",
                        "children": null,
                        "is_leaf": false
                    },
                    {
                        "id": "630",
                        "name": "上海市",
                        "children": null,
                        "is_leaf": false
                    },
                    {
                        "id": "650",
                        "name": "天津市",
                        "children": null,
                        "is_leaf": false
                    }
                ],
                "is_leaf": false
            };
        }else if(id ==='611'){
            dataObj = {
                "id": "611",
                "name": "北京市",
                "children": [
                    {
                        "id": "6111",
                        "name": "朝阳区",
                        "children": null,
                        "is_leaf": true
                    },
                    {
                        "id": "6301",
                        "name": "海淀区",
                        "children": null,
                        "is_leaf": true
                    },
                    {
                        "id": "6501",
                        "name": "昌平区",
                        "children": null,
                        "is_leaf": true
                    }
                ],
                "is_leaf": false
            };
        }else if(id === '630'){
            dataObj = {
                "id": "630",
                "name": "上海市",
                "children": [
                    {
                        "id": "63011",
                        "name": "上海市1区",
                        "children": null,
                        "is_leaf": true
                    },
                    {
                        "id": "63022",
                        "name": "上海市2区",
                        "children": null,
                        "is_leaf": true
                    },
                    {
                        "id": "63033",
                        "name": "上海市3区",
                        "children": null,
                        "is_leaf": true
                    }
                ],
                "is_leaf": false
            };
        }else if(id === '650'){
            dataObj = {
                "id": "650",
                "name": "天津市",
                "children": [
                    {
                        "id": "65011",
                        "name": "天津1区",
                        "children": null,
                        "is_leaf": true
                    },
                    {
                        "id": "65022",
                        "name": "天津2区",
                        "children": null,
                        "is_leaf": true
                    },
                    {
                        "id": "65033",
                        "name": "天津3区",
                        "children": null,
                        "is_leaf": true
                    }
                ],
                "is_leaf": false
            };
        }
        this.body = JSON.stringify(dataObj);
    });

app
    // 解析请求体参数
    .use(body())
    // 静态资源文件
    .use(staticServe('.'))
    // 设置接的响应内容类型
    .use(function *(next) {
        yield next;
        this.set('content-type', 'application/json; charset=utf-8');
        this.set('Access-Control-Allow-Credentials', true);
        this.set('Access-Control-Allow-Headers', 'authorization, content-type, request-id');
        this.set('Access-Control-Allow-Methods', 'OPTIONS,HEAD,GET,PUT,POST,DELETE,PATCH');
        this.set('Access-Control-Allow-Origin', '*');
    })
    // 处理接口路由
    .use(router.routes())
    .use(router.allowedMethods())
    // 其余请求
    .use(function *() {
        this.body = 'Hello World';
    });

var port = 4000;

app.listen(port);
console.log('\n\nrun in http://localhost:' + port + ' \n\n');
