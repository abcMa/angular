angular.module('app.services').provider('viewHistory', function() {
    var provider = this;

    /**
     * 最多存储多少个商品，当超出该指定数量时若继续添加，则会移除最早添加的商品
     * 若为 undefined, 则不做限制
     * 默认为 200
     */
    provider.maxStorageNumber = 200;

    // @ngInject
    provider.$get = function(localStorage, api) {
        var LOCAL_STORAGE_KEY = 'history-view-product',
            productList = localStorage.get(LOCAL_STORAGE_KEY, [], true);

        return {
            /**
             * 获取所有本地存储的历史浏览商品
             */
            getAll: function() {
                return productList;
            },

            /**
             * 存储的记录数量
             */
            getCount: function() {
                return productList.length;
            },

            /**
             * 分页加载
             */
            getPage: function(page, pageCount) {
                // -1 因为计数是从1开始的而不是0
                var startIndex = (page - 1) * pageCount;
                var items = _.slice(productList, startIndex, startIndex + pageCount);
                var result = {
                    pageIndex: page,
                    totalItems: productList.length,
                    items: items
                };
                return api.when(result);
            },

            /**
             * 存储一个浏览商品
             */
            add: function(product) {
                if (!product) return;

                // 若待添加的商品已存在，则视为修改其顺序，将其放到最上面
                for (var index in productList) {
                    if (productList[index].productId == product.productId) {
                        productList.splice(index, 1);
                        break;
                    }
                }

                // 若为新添加商品，且当前已超出最大存储数量，则移除最早添加的商品
                if (provider.maxStorageNumber && productList.length >= provider.maxStorageNumber) {
                    productList.pop();
                }

                productList.unshift(product);
                this._storage();
            },

            /**
             * 更新一个商品
             */
            update: function(product) {
                if (!product) return;

                // 找到对应的商品，更新数据
                for (var index in productList) {
                    if (productList[index].productId == product.productId) {
                        productList[index] = product;
                        break;
                    }
                }

                this._storage();
            },

            /**
             * 清空浏览历史记录
             */
                clear: function() {
                productList.splice(0, productList.length);
                this._storage();
            },

            /**
             * 存储当前所有浏览商品
             */
            _storage: function() {
                localStorage.set(LOCAL_STORAGE_KEY, productList);
            }
        };
    };
    provider.$get.$inject = ["localStorage", "api"];
});
