/**
 * 封装收货人信息相关接口
 */
angular.module('app.services').factory('consigneeService', ["api", "$rootScope", "messageCenter", function (
    api, $rootScope, messageCenter) {

    var localData = null;

    var consigneeService = {
        /**
         * 获取所有提货人信息
         */
        all: function () {
            return api.get('/consignee/list').success(function (response) {
                if (_.isUndefined(response.validAddress)) {
                    response.validAddress = [];
                }
                if (_.isUndefined(response.invalidAddress)) {
                    response.invalidAddress = [];
                }
                var valid = response.validAddress.map(function (item) {
                    item.valid = true;
                    return item;
                });
                var invalid = response.invalidAddress.map(function (item) {
                    item.valid = false;
                    return item;
                });

                response.allAddress = valid.concat(invalid);
            });
        },

        /**
         * 保存或修改一条提货人信息
         *
         * @param id {String} 提货人信息 ID，如果是修改一条信息，则传入
         * @param data {String} 提货人信息
         *
         *   - name      {String}  收货人姓名
         *   - address   {String}  收货人地址
         *   - mobile    {String}  收货人手机
         *   - regionId  {String}  地区ID
         *   - postcode  {String}  邮政编码
         *   - phone     {String}  固定电话
         *
         * @example
         * // 添加一条提货人信息
         * consigneeService.addOrEdit({
         *     name: "Bios Sun"
         * });
         *
         * // 修改一条提货人信息
         * consigneeService.addOrEdit("108377", {
         *     name: "Bios Sun"
         * });
         *
         * // 修改一条提货人信息，与上面的修改操作相同，只是将 id 放在了数据集合中
         * consigneeService.addOrEdit({
         *     id: "108377",
         *     name: "Bios Sun"
         * });
         */
        addOrEdit: function (id, data) {
            if (typeof id === 'object') {
                data = id;
                id = undefined;
            }
            if (id) {
                data = angular.extend({}, data, {
                    id: id
                });
            }
            // 北京站版本兼容
            // 克隆一份避免对视图造成影响
            var dataClone = _.cloneDeep(data);
            var fullAddress = dataClone.address;
            dataClone.address = {
                road: fullAddress
            };
            return !dataClone.id ? consigneeService.add(dataClone) : consigneeService.edit(dataClone);
        },

        /**
         * 添加一条提货人信息
         *
         * @param data {Object} 提货人信息
         *
         *   - name      {String}  收货人姓名
         *   - address   {String}  收货人地址
         *   - mobile    {String}  收货人手机
         *   - regionId  {String}  地区ID
         *   - postcode  {String}  邮政编码
         *   - phone     {String}  固定电话
         */
        add: function (data) {
            return api.post('/consignee/add', data)
                .success(function (data) {
                    messageCenter.publishMessage('consignee.add');
                });
        },

        /**
         * 更新提货人信息
         *
         * @param data {Object} 提货人信息
         *
         *   - id        {String}  收货人信息 ID
         *   - name      {String}  收货人姓名
         *   - address   {String}  收货人地址
         *   - mobile    {String}  收货人手机
         *   - regionId  {String}  地区ID
         *   - postcode  {String}  邮政编码
         *   - phone     {String}  固定电话
         */
        edit: function (data) {
            return api.post('/consignee/update', data)
                .success(function () {
                    messageCenter.publishMessage('consignee.edit');
                });
        },

        /**
         * 删除某条收货人信息
         * @param id {String} 收货人信息 ID
         * @param type 1 新参数, 接口向下兼容
         */
        remove: function (id) {
            var params = {
                id: id
            };

            return api.post('/consignee/remove', params)
                .success(function () {
                    messageCenter.publishMessage('consignee.remove', id);
                });
        },

        /**
         * 获取所选择的地址数据
         * @param id {String} 地区信息 ID
         */
        region: function (id) {
            return api.get('/consignee/region', {
                id: id || 0,
                type: 1
            });
        },

        //地址库更新, 获取更新地址提示
        getTips: function() {
            return api.post('/checkout/addressTipNew');
        }
    };

    return consigneeService;
}]);
