angular.module('app.services').factory('productService', ["api", function (
    api
) {
    var productService = {
        /**
         * 搜索商品
         *
         * 可设定检索条件及排序规则如下：
         *
         * - categoryId(?)   <String>  分类ID
         * - brandId(?)      <String>  品牌ID
         * - keyword(?)      <String>  搜索关键字
         * - beginPrice(?)   <String>  价格筛选起始价格
         * - endPrice(?)     <String>  价格筛选结束价格
         * - attributes(?)   [<属性>]   属性筛选条件
         *
         * @param config {Object} 检索条件
         * @param order {Integer} 排序方式
         * @param page {String} 分页
         * @param pageCount {Integer} 分页大小
         *
         */
        search: function (filterRule, order, page, pageCount) {
            var params = _.assign({}, filterRule, {
                order: order,
                page: page,
                pageCount: pageCount
            });

            return api.post('/product/search', params)
                .success(function (data) {

                    _.forEach(data.items, function (item) {
                        _.forEach(item.specialCategory, function (specialCategory, index) {
                            if (!specialCategory.showOrNot) {
                                item.specialCategory[index] = undefined;
                            } else {
                                if (!specialCategory.chinese) {
                                    specialCategory.name = specialCategory.nameEn;
                                }
                            }
                        });

                        // NOTE: 由于 lodash 的 foreach 在遍历数组时，是预先获取数组长度，并从 0 开始直到 数组长度-1 来循环索引以实现数组遍历功能，
                        //       因此不要在 foreach 中删除数组元素，否则会导致无法遍历到每一个元素，或者甚至出现索引溢出引发异常的问题，
                        //       这里采取的方案是在 foreach 中将需要抛弃的元素设置为 undefined，并在遍历结束后使用 compact 方法删除这些所有值为 undefined 的元素。
                        item.specialCategory = _.compact(item.specialCategory);
                    });

                    data.totalItems = data.total;
                    data.pageIndex = page;
                });
        },

        /**
         * 获取商品促销信息
         * goodsIds     <String>    货品id字符串（格式如下）：250001-250003-250006-250115
         *
         * return:
         * map  key: goodsId, value: <促销信息>
         *
         * <促销信息>
         * {
         *     description	<String>	促销具体描述
         *     type         <int>	    1:赠品,
         *                              2:加价购,
         *                              3:返券,
         *                              4:赠积分,
         *                              5:满减,
         *                              6:减运费,
         *                              7:多件折扣,
         *                              8:抢购
         *     typeName     <String>	促销信息
         * }
         */

        findListTagByGoodsId: function (goodsIdsArray) {
            var params = {
                goodsIds: goodsIdsArray.join('-')
            };

            return api.get('/product/findListTagByGoodsId', params);
        },

        /**
         * 获取商品筛选条件
         */
        filterCondition: function (filterRule) {
            return api.post('/product/filterCondition', filterRule);
        },

        /**
         * 获取商品详情
         * @param goodsId {String} 货品 ID，当提供该参数时，将忽略其余参数
         * @param productId {String} 商品 ID
         * @param styleId {String} 款式 ID，可选值，如果不提供，则返回默认款式
         */
        info: function (goodsId, productId, styleId) {
            var params = {
                goodsId: goodsId || undefined,
                productId: productId || undefined,
                styleId: styleId || undefined
            };

            return api.get('/product/info', params)
                .success(function (response) {
                    if (!response) {
                        return;
                    }

                    _.forEach(response.specialCategory, function (item, index) {
                        if (!item.showOrNot) {
                            response.specialCategory[index] = undefined;
                        }
                    });

                    // 商品轮播的第一张图片
                    var productPic = '';
                    _.forEach(response.pics, function(item, index) {
                        if(!index) {
                            productPic = item;
                        }
                    });

                    response.sharePicUrl = productPic;

                    response.specialCategory = _.compact(response.specialCategory);
                });
        },

        /**
         * 根据条码编码获取对应的商品 ID 及样式 ID
         * @param barCode {String} 条码编码
         */
        getProductIdByBarCode: function (barCode) {
            var params = {
                barCode: barCode
            };

            return api.get('/product/getProductIdByBarCode', params);
        },

        /**
         * 已废弃
         * 获取商品列表数据，基于商品 ID
         * @params ids {Array<String>}  多个商品 ID
         */
        // listByProductIds: function(ids) {
        //     var params = {
        //         products: ids
        //     };
        //     return api.get('/product/list', params);
        // },

        /** 获取商品评论 */
        discuss: function (productId, type, count, page) {
            return api.get('/product/discuss', {
                pid: productId,
                type: type,
                count: count,
                page: page
            });
        },

        // 商品排序常量
        productOrders: {
            DEFAULT: 0, // 默认
            PRICE_ASCENDING: 3, // 价格
            PRICE_DESCENDING: 4, // 价格降序
            SOLD: 1, // 销量
            REVIEWS: 2, // 评论数量

            is: function (name, val) {
                return name.toUpperCase() === this[val].split('_')[0];
            },

            get: function (name) {
                name = name.toUpperCase();
                return this[name] !== undefined ? this[name] : this[name + "_ASCENDING"];
            },

            getName: function (val) {
                return this[val].toLowerCase();
            },

            getSortType: function (val) {
                return this[val].toLowerCase().split('_')[1] || "";
            },

            getAntitone: function (val) {
                var name = this[val],
                    sortName = this.getSortType(val).toUpperCase();
                switch (sortName) {
                    case "ASCENDING":
                        name = name.replace('ASCENDING', 'DESCENDING');
                        break;
                    case "DESCENDING":
                        name = name.replace('DESCENDING', 'ASCENDING');
                        break;
                    default:
                        name += "_DESCENDING";
                }

                return this[name];

            }
        },

        //获取推荐商品
        getGoodsMatch: function (goodsId, productId) {
            var params = {
                goodsId: goodsId,
                productId: productId
            };
            return api.post('/product/getGoodsMatch', params);
        },

        /** 搜索商品二维码 */
        scancode: function (code) {
            return api.post('/scancode', {
                scancode: code
            });
        },

        /**
         * 获取门店信息
         */
        getStoreInfo: function () {
            return api.get('/product/siteInfo');
        },

        /**
         * 获取文描页脚
         */
        getProductFooter: function (productId) {
            var params = {
                productId: productId
            };
            return api.post('/product/getProductDetailAdv', params);
        }
    };


    _.forEach(productService.productOrders, function (value, key) {
        if (typeof value === 'number') {
            productService.productOrders[value] = key;
        }
    });

    return productService;
}]);
