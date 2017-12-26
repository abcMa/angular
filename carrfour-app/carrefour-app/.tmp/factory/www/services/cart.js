/**
 * 封装购物车接口
 * 其中，添加，修改及删除购物项接口支持批量处理，
 * 而选择及取消选择接口一次只能操作一个购物项，
 * 不过额外的提供了购物篮内的全部购物项的选择及取消选择接口。
 */
angular.module('app.services').factory('cartService', ["$rootScope", "api", "messageCenter", "utils", function(
    $rootScope, api, messageCenter, utils
) {

    var cartService = {
        initPromise: undefined,
        refreshPromise: undefined,

        /**
         * 购物车数据
         */
        data: undefined,

        /**
         * 清空购物车
         */
        clean: function() {
            return api.post('/cart/clean')
                .then((function() {
                    return this.refresh();
                }).bind(this));
        },

        /**
         * 购物车初始化
         */
        init: function() {
            var self = this;

            messageCenter.publishMessage('cart.initBefore');

            this.initPromise = this.info()
                .success(function(data) {
                    self.data = data;

                    // 当用户登录登出时，会修改购物车内容，此时需要刷新购物车
                    messageCenter.subscribeMessage('login', function() {
                        self.refresh();
                    }, $rootScope);
                    messageCenter.subscribeMessage('logout', function() {
                        self.refresh();
                    }, $rootScope);

                    messageCenter.publishMessage('cart.init');
                })
            .finally(function(data) {
                self.initPromise = undefined;
            });

            return this.initPromise;
        },

        /**
         * 刷新购物车数据
         */
        refresh: function() {
            var self = this;

            // 如果已完成购物车数据初始化
            if (self.data) {
                // 取消已经在执行的刷新操作
                if (self.refreshPromise) {
                    self.refreshPromise.cancel();
                }

                // 并开启一个新的刷新操作
                messageCenter.publishMessage('cart.refreshBefore');
                self.refreshPromise = self.info()
                    .then(function(response) {
                        utils.empty(self.data);
                        _.merge(self.data, response.data);
                        response.data = self.data;
                        messageCenter.publishMessage('cart.refresh');
                        return response;
                    })
                    .finally(function() {
                        self.refreshPromise = undefined;
                    });

                return self.refreshPromise;
            }
            // 如果还未完成数据初始化操作，则执行初始化操作
            else {
                if (self.initPromise) {
                    return self.initPromise;
                }
                else {
                    return self.init();
                }
            }
        },

        /**
         * 获取购物车信息
         */
        info: function() {
            var self = this;
            return api.post('/cart/info').then((function(response) {
                this.processingCartData(response.data);
                return response;
            }).bind(this));
        },

        /**
         * 添加货品到购物车中，支持一次添加多个，每一个添加项需要提供如下数据：
         *
         * - goodsId {String} 货品 ID
         * - flashSaleId {String} 促销 ID
         * - number {Integer} 添加数量，如果有提供 flashSaleId 时，该参数无效，后台不使用该参数
         *
         * @params
         * @param infos {Array<Object>} 多条添加项信息
         *
         * @params
         * @param info {Object} 一条添加项信息
         *
         * @params
         * @param goodsId {String} 需添加到购物车中的货品 ID
         * @param flashSaleId {String} 如果该货品正在促销，则需要提供促销 ID，否则传入 undefined
         * @param number {Integer} 添加数量
         */
        addGoods: function(goodsId, flashSaleId, number) {
            var infos, params;

            if (typeof goodsId === 'string' || typeof goodsId === 'number') {
                infos = [{
                    goodsId: goodsId,
                    flashSaleId: flashSaleId,
                    number: number
                }];
            }
            else if (angular.isArray(goodsId)) {
                infos = goodsId;
            }
            else {
                infos = [goodsId];
            }

            return api.post('/cart/addGoods', infos)
                .success(function(response) {
                    messageCenter.publishMessage('addGoods.success', response);
                })
                .then((function() {
                    return this.refresh();
                }).bind(this));
        },

        /**
         * 修改购物车中的购物项的购买数量，支持一次修改多个，每一个修改项需要提供如下数据：
         *
         * - basketId {String} 购物篮 ID
         * - basketItemId {String} 购物项 ID
         * - goodsId {String} 货品 ID
         * - number {Integer} 修改的数量
         *
         * @params
         * @param infos {Array<Object>} 多条修改项信息
         *
         * @params
         * @param info {Object} 一条修改项信息
         *
         * @params
         * @param basketId {String} 购物篮 ID
         * @param basketItemId {String} 购物项 ID
         * @param goodsId {String} 货品 ID
         * @param number {Integer} 修改的数量
         */
        editGoods: function(basketId, basketItemId, goodsId, number) {
            var infos;

            if (typeof basketId === 'string' || typeof basketId === 'number') {
                infos = [{
                    basketId: basketId,
                    basketItemId: basketItemId,
                    goodsId: goodsId,
                    number: number
                }];
            }
            else if (angular.isArray(basketId)) {
                infos = basketId;
            }
            else {
                infos = [basketId];
            }

            return api.post('/cart/changeGoodsNumber', infos)
                .then((function() {
                    return this.refresh();
                }).bind(this));
        },

        /**

         * 删除购物车中的购物项，支持一次删除多个，每一个删除项需要提供如下数据：
         *
         * - basketId {String} 购物篮 ID [UNUSED]
         * - basketItemId {String} 购物项 ID
         *
         * @params
         * @param infos {Array<Object>} 多条删除项信息
         *
         * @params
         * @param info {Object} 一条删除项信息
         *
         * @params
         * @param basketId {String} 购物篮 ID [UNUSED]
         * @param basketItemId {String} 购物项 ID
         * @param goodsId {String} 购物项内的货品的 ID [UNUSED]
         */
        removeGoods: function(basketItemId) {
            // var infos;
            //
            // if (typeof basketId === 'string' || typeof basketId === 'number') {
            //     infos = [{
            //         basketId: basketId,
            //         basketItemId: basketItemId
            //     }];
            // }
            // else if (angular.isArray(basketId)) {
            //     infos = basketId;
            // }
            // else {
            //     infos = [basketId];
            // }


            var itemIds = [];
            if (typeof basketItemId === 'string' || typeof basketItemId === 'number'){
                itemIds = [{
                    basketItemId: basketItemId
                }];
            }
            else if (angular.isArray(basketItemId)) {
                angular.forEach(basketItemId, function(data, index, array){
                    itemIds.push({
                        basketItemId: data
                    });
                });
            }

            return api.post('/cart/removeGoods', itemIds)
                .then((function() {
                    return this.refresh();
                }).bind(this));
        },

        /**
         * 选择购物项
         * @param basketId {String} 购物篮 ID
         * @param basketItemId {String} 购物项 ID
         */
        select: function(basketId, basketItemId) {
            var params = {
                basketId: basketId,
                basketItemId: basketItemId
            };

            return api.post('/cart/select', params)
                .then((function() {
                    return this.refresh();
                }).bind(this));
        },

        /**
         * 取消选择购物项
         * @param basketId {String} 购物篮 ID
         * @param basketItemId {String} 购物项 ID
         */
        unselect: function(basketId, basketItemId) {
            var params = {
                basketId: basketId,
                basketItemId: basketItemId
            };

            return api.post('/cart/unselect', params)
                .then((function() {
                    return this.refresh();
                }).bind(this));
        },


        /**
         * 选择一个或多个购物篮内的所有购物项
         *
         * @params
         * @param basketIds {Array<String>} 多个购物篮 ID
         *
         * @params
         * @param basketId {String} 一个购物篮 ID
         */
        selectAll: function(basketIds) {
            var params;

            if (typeof basketIds === 'string' || typeof basketIds === 'number') {
                basketIds = [basketIds];
            }

            params = {
                baskets: basketIds
            };

            return api.post('/cart/selectAll', params)
                .then((function() {
                    return this.refresh();
                }).bind(this));
        },


        /**
         * 取消选择一个或多个购物篮内的所有购物项
         *
         * @params
         * @param basketIds {Array<String>} 多个购物篮 ID
         *
         * @params
         * @param basketId {String} 一个购物篮 ID
         */
        unselectAll: function(basketIds) {
            var params;

            if (typeof basketIds === 'string' || typeof basketIds === 'number') {
                basketIds = [basketIds];
            }

            params = {
                baskets: basketIds
            };

            return api.post('/cart/unselectAll')
                .then((function() {
                    return this.refresh();
                }).bind(this));
        },

        /**
         * 添加赠品
         */
        addPresent: function(basketId, basketItemId, ruleId, presents) {
            var params;

            if (typeof basketId === 'string' || typeof basketId === 'number') {
                if (arguments.length === 3) {
                    presents = ruleId;
                    ruleId = basketItemId;
                    basketItemId = undefined;
                }

                params = {
                    basketId: basketId,
                    basketItemId: basketItemId,
                    ruleId: ruleId,
                    presents: presents
                };
            }
            else {
                params = basketId;
            }

            // presents 可以传入单个对象，或一个数组
            if (!_.isArray(params.presents)) {
                params.presents = [params.presents];
            }

            return api.post('/cart/addPresent', params)
                .then((function() {
                    return this.refresh();
                }).bind(this));
        },

        /**
         * 编辑赠品
         */
        editPresent: function(basketId, basketItemId, ruleId, presents) {
            var params;

            if (typeof basketId === 'string' || typeof basketId === 'number') {
                if (arguments.length === 3) {
                    presents = ruleId;
                    ruleId = basketItemId;
                    basketItemId = undefined;
                }

                params = {
                    basketId: basketId,
                    basketItemId: basketItemId,
                    ruleId: ruleId,
                    presents: presents
                };
            }
            else {
                params = basketId;
            }

            // presents 可以传入单个对象，或一个数组
            if (!_.isArray(params.presents)) {
                params.presents = [params.presents];
            }

            return api.post('/cart/changePresent', [params])
                .then((function() {
                    return this.refresh();
                }).bind(this));
        },

        /**
         * 删除赠品
         */
        removePresent: function(basketId, basketItemId, ruleId, presents) {
            var params;

            if (typeof basketId === 'string' || typeof basketId === 'number') {
                if (arguments.length === 3) {
                    presents = ruleId;
                    ruleId = basketItemId;
                    basketItemId = undefined;
                }

                params = {
                    basketId: basketId,
                    basketItemId: basketItemId,
                    ruleId: ruleId,
                    presents: presents
                };
            }
            else {
                params = basketId;
            }

            // presents 可以传入单个对象，或一个数组
            if (!_.isArray(params.presents)) {
                params.presents = [params.presents];
            }

            return api.post('/cart/removePresent', params)
                .then((function() {
                    return this.refresh();
                }).bind(this));
        },

        /**
         * 加工购物车数据
         */
        processingCartData: function(cart) {
            var self = this;

            cart.info = _.defaults({totalQuantity: 0}, cart.info);

            _.forEach(cart.baskets, function(basket, key) {
                self.processingBasketData(basket);



                if (basket.isOverseasShop === true) {
                    cart.baskets.overseasShop = basket;
                    delete cart.baskets[key];
                }
                else {
                    cart.baskets.common = basket;
                    delete cart.baskets[key];
                }

                cart.info.totalQuantity += basket.info.totalQuantity;
            });
        },

        /**
         * 加工购物篮数据
         */
        processingBasketData: function(basket) {
            // 首先默认购物篮为选中状态
            // basket.selected = true;
            basket.selectedAll = true;

            // 默认购物篮中不包含不支持七天无理由退货的商品
            basket.hasNoSeven = false;

            // 购物篮内将有如下四种购物项
            var commons = basket.items,         // 普通商品
                limits = basket.limits,         // 限时抢购商品
                promotions = basket.promotions, // 促销商品
                presells = basket.presells, // 预售商品
                presents = basket.presents;     // 赠品

            // 收集所有主购物项（普通商品，限时抢购，促销）
            var

            // 组合后的所有购物项
            mainItems = [],

            // 组合后的所有购物项集合，key 为购物项 ID，方便后续使用
            mainItemsMap = {},

            // 所有主购物项的购买数量
            mainItemsNumber = 0;

            // 将所有促销商品的销售价格类型改为促销价
            _.forEach(promotions, function(item) {
                item.salesPrice.type = 1;
            });

            // 将所有限时抢购商品的销售价格类型改为抢购价
            _.forEach(limits, function(item) {
                item.salesPrice.type = 2;
            });

            // 遍历所有的主购物项
            _.forEach(_.union(commons, limits, promotions, presells), (function(item) {
                mainItems.push(item);
                mainItemsMap[item.id] = item;

                mainItemsNumber += item.number;

                // 如果有一个主购物项为未选中状态，则整个购物篮都是未选中状态
                if (!item.selected && item.valid === true) {
                    basket.selectedAll = false;
                }

                // 给购物项添加一个用于存放编辑模式下使用的数据集合
                // item.editMode = {};

                // 把商品的重量转为公斤,保留两位小数
                item.weightKG = (item.weight / 1000).toFixed(3);

                // 加工购物项中的促销规则
                // this.processingBasketItemRuleData(basket, item);

                if (!item.isSupportSevenDayRefund) {
                    basket.hasNoSeven = true;
                }

                //对购物车中的特殊分类进行处理
                _.forEach(item.specialCategory, function(specialCategory, index){
                    if(!specialCategory.showOrNot) {
                        item.specialCategory.splice(index,1);
                    }else {
                        if(!specialCategory.chinese) {
                            specialCategory.name = specialCategory.nameEn;
                        }
                    }
                });
            }).bind(this));

            basket.mainItems = mainItems;
            basket.mainItemsMap = mainItemsMap;
            basket.mainItemsNumber = mainItemsNumber;

            // 如果有限时抢购，则在购物篮中放置最早加入购物篮的抢购购物项
            if (limits && limits.length) {
                _.forEach(limits, function(item) {
                    if (item.secondTime &&
                        (!basket.limitItem || item.secondTime < basket.limitItem.secondTime)) {
                        basket.limitItem = item;
                    }
                });
            }

            // 统计赠品数量
            var presentsNumber = 0;
            _.forEach(presents, function(presentItem) {
                presentsNumber += presentItem.numbe || 1;
            });
            _.forEach(basket.mainItems, function(item) {
                _.forEach(item.presents, function(presentItem) {
                    presentsNumber += presentItem.number || 1;
                });
            });
            basket.presentsNumber = presentsNumber;

            // 统计所有购物项的数量，包括主购物项及赠品数量
            basket.allItemsNumber = basket.mainItemsNumber + basket.presentsNumber;

            // 给购物篮添加一个用于存放编辑模式下使用的数据集合
            // basket.editMode = {};

            // 处理购物篮主线促销规则
            this.processingBasketMainRuleData(basket);
            // 处理购物篮非主线促销规则
            // this.processingBasketNotMainRuleData(basket);

            return basket;
        },

        /**
         * 加工购物篮中的主线促销规则数据
         */
        processingBasketMainRuleData: function(basket) {
            var mainRules = basket.mainRules;

            _.forEach(mainRules, (function(rule, ruleId) {
                // 处理加价购和赠赠品促销规则
                // if (rule.rewardType == 1 || rule.rewardType == 2) {
                //     this.processingPresentRuleData(basket, undefined, rule);
                // }

                if ( _.isEmpty(rule.basketItemId) ) { return; }

                // 获取到该主线规则中匹配的第一个购物车项的位置
                var firstItemId = _.first(rule.basketItemId),
                    firstItemIndex = _.findIndex(basket.items, 'id', firstItemId),
                    firstItem = basket.items[firstItemIndex];

                if (firstItemIndex === -1) { return; }

                // 创建一个主线规则类型的购物车项分组数据
                var itemsGroup = {
                    type: 'groupByMainRule',
                    items: [firstItem],
                    rule: rule
                };

                // 将主线规则匹配的剩余购物项从 items 中取出并放入分组中
                _.forEach(_.rest(rule.basketItemId), function(itemId) {
                    var item = _.remove(basket.items, 'id', itemId)[0];
                    itemsGroup.items.push(item);
                });

                // 将分组数据放入原先第一个购物车项的位置
                basket.items.splice(firstItemIndex, 1, itemsGroup);
            }).bind(this));
        },

        /**
         * 加工购物篮中的非主线促销规则数据
         */
        processingBasketNotMainRuleData: function(basket) {
            var notMainRules = basket.notMainRules;

            _.forEach(notMainRules, (function(rule, ruleId) {
                // 处理加价购和赠赠品促销规则
                if (rule.rewardType == 1 || rule.rewardType == 2) {
                    this.processingPresentRuleData(basket, undefined, rule);
                }
            }).bind(this));
        },

        /**
         * 加工购物项中的单品促销规则数据
         */
        processingBasketItemRuleData: function(basket, basketItem) {
            var rules = basketItem.rules;

            _.forEach(rules, (function(rule, ruleId) {
                // 处理加价购和赠赠品促销规则
                if (rule.rewardType == 1 || rule.rewardType == 2) {
                    this.processingPresentRuleData(basket, basketItem, rule);
                }
            }).bind(this));
        },

        /**
         * 加工赠品或加价购促销规则数据
         */
        processingPresentRuleData: function(presents, rule) {
            var rewardType = rule.rewardType,
                presentBasketItems;

            _.forEach(presents, function(present) {
                // 将库存量的属性名改为 count
                if (!present.count) {
                    present.count = present.number;
                }

                // 将选择数量改为默认值 1
                present.number = 1;
                present.origin = 0;

                // 根据赠品的库存数量判断赠品是否有效
                present.valid = !!present.count;
            });

            _.forEach(presents, function(present) {
                var presentBasketItem = _.find(rule.presentBasketItems, function(item) {
                        return present.presentId == item.goodsId;
                    });

                present.rewardType = rewardType;

                if (presentBasketItem) {
                    present.selected = true;
                    present.number = presentBasketItem.number;
                    present.origin = presentBasketItem.number;
                    present.presentItemId = presentBasketItem.id;
                }
            });
        },

        /**
         * 获取规则对应的赠品集合
         * @param ruleId {Integer} 规则 ID
         */
        getPresents: function(ruleId) {
            var params = { ruleId: ruleId };
            return api.post('/cart/getPresentByRule',params);
        },

        /**
         * 根据订单Id将订单中的货品重新加入购物车
         * @param id {Integer} 订单ID
         */
        rebuy: function(id) {
            var params = { orderId: id };

            return api.post('/cart/rebuy', params)
                .then((function() {
                    return this.refresh();
                }).bind(this));
        },
        /**
         * 获取购物车中选中的总数量 只有详情页会加载一次
         */
        getTotalQuantity: function() {
            return api.post('/cart/getSelectNum');
        }
    };


    return cartService;
}]);
