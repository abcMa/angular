/**
 * 列表选择器，支持级联选择
 *
 * ## 部分自定义数据格式说明
 *
 * ### <Item>
 *
 * 数据项，包含如下属性：
 *
 * - {string|number} id - 数据项 ID，应至少保证在同级数据项中是唯一的
 * - {string} text - 呈现文本
 * - {string} subtext? - 附属文本，可选
 * - {Array<Item>} subItems? - 子数据项，可选
 *
 * ### <Options>
 *
 * 配置信息，支持如下配置项：
 *
 * - {String} title? - 页面标题，默认值为「选择」
 *
 * ## params
 * - {Function(Array<Item> selectedItems)} successCallback - 当选择完毕后，将调用该回调函数，并传入将所选项。
 * - {Array<Item>} data - 供选择的数据
 * - {Array<Item>} selecteds - 默认已选项
 * - {Options} options - 配置项
 */
angular.module('app.controllers').controller('selecterCtrl', ["$scope", "$params", "modals", function(
    $scope, $params, modals
) {

    angular.extend(this, {
        // {Array<Item>} - 所有数据项的集合
        data: undefined,

        // {Array<Item>} - 当前可选项
        items: undefined,

        // {Array<Item>} - 当前已选项
        selecteds: undefined,

        // {Array<Item>} - 默认已选项，在调用该 modal 时传入
        defaultSelecteds: undefined,

        // <Array<Array<Item>> - 每一次变更可选项时，都会将被变更的可选项集合放入该历史集合中，以用于回退
        itemsHistory: undefined,

        // {Options} - 配置
        options: undefined,

        // {function(<Array<Item> selecteds)} - 完成选择后的回调函数
        successCallback: undefined,

        init: function() {
            this.data = $params.data || [];
            this.defaultSelecteds = $params.selecteds;
            this.options = $params.options || {};
            this.successCallback = $params.successCallback || _.noop;

            this.items = this.data;
            this.selecteds = [];
            this.itemsHistory = [];

            _.forEach(this.items, function(item) {
                item.status = false;

                if (item.subItems && item.subItems.length > 0) {
                
                    _.forEach(item.subItems, function(subItem) {

                        if (subItem.originalData) {
                           
                            if(subItem.originalData.status === 2) {
                                subItem.status = true;
                            }else {
                                subItem.status = false;
                            }

                        }

                    });
                }

            });

        },

        /**
         * 选择某一数据项
         */
        select: function(item) {
            this.selecteds.push(item);

            if (item.subItems && item.subItems.length > 0) {
                if (this.items) {
                    this.itemsHistory.push(this.items);
                }

                this.items = item.subItems;
            }
            else {
                this.done();
            }
        },

        /**
         * 回退选择
         */
        backspace: function() {
            if (this.selecteds.length > 0) {
                this.selecteds.pop();
                this.items = this.itemsHistory.pop();
            }
        },

        /**
         * 获取当前已选项的文本
         */
        getSelectedsText: function() {
            if (this.selecteds && this.selecteds.length > 0) {
                return _.map(this.selecteds, 'text').join(', ');
            }
            else {
                return '';
            }
        },

        getDefaultSelectedsText: function() {
            if (this.defaultSelecteds && this.defaultSelecteds.length > 0) {
                return _.map(this.defaultSelecteds, 'text').join(', ');
            }
            else {
                return '';
            }
        },

        /**
         * 完成选择
         */
        done: function() {
            this.successCallback(this.selecteds);
            this.close();
        },

        /**
         * 取消选择
         */
        cancel: function() {
            this.close();
        },

        /**
         * 关闭该选择器
         */
        close: function() {
            modals.selecter.close();
        }
    });

    this.init();

}]);
