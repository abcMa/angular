/**
 * 编辑提货人信息
 *
 * ## params
 * - successCallback {Function} 当添加或修改成功后，将调用该回调函数，并传入修改后的数据
 * - data {Object} 默认数据
 *   - id {String} 地址数据 ID
 *   - name {String} 收货人姓名
 *   - address {String} 收货人详细地址
 *   - mobile {String} 手机号码
 *   - phone {String} 固定电话号码
 *   - postcode {String} 邮政编码
 *   - region {Array<Object>} 地区信息数组，数组元素为对象，有两个属性：id 为地区 ID，name 为地区显示名称
 *
 * @example
 * modals.editConsigneeInfo.open({
 *     params: {
 *         successCallback: function(consigneeInfoData) { ... },
 *         data: {
 *             id: '123348',    // 如果提供该数据，则视为编辑已有提货人数据，否则视为新增
 *             name: 'Bios Sun'
 *         }
 *     }
 * });
 */
angular.module('app.controllers').controller('editConsigneeInfoCtrl', ["$scope", "$params", "consigneeService", "toast", "loading", "errorHandling", "messageCenter", "validator", "$translate", function(
    $scope, $params, consigneeService, toast, loading, errorHandling, messageCenter,validator,$translate
) {

    $params = _.defaults({}, $params, {
        successCallback: _.noop,
        data: {}
    });

    var toEditData = $params.data;

    angular.extend(this, messageCenter, {

        $scope: $scope,

        data: {
            // 地址 ID，如果是编辑一个已存在的地址，则该处有值，否则为空。
            id: toEditData.id,

            // 姓名
            name: toEditData.name,

            // 详细地址
            address: toEditData.address,

            // 手机号码
            mobile: toEditData.mobile,

            // 邮政编码
            // postcode: toEditData.postcode,

            // 固定电话
            // phone: toEditData.phone,

            // 地区 ID
            regionId: _.get(_.last(toEditData.region), 'id'),

            // 每个新增加的地址都认为是默认地址
            isDefault: true,

            //是否为有效地址
            isValid: toEditData.valid
        },

        // 页面展示的区域名
        regionName: '',

        // 编辑/新增已选中的省份、市区、地区
        selectedRegion: toEditData.region,

        changeRegion: function() {
            // 只能选中有效的区域，所以改变之后必然是有效地址
            this.data.regionId = _.get(_.last(this.selectedRegion), 'id');
            this.data.isValid = true;
        },
        // 提交表单
        submit: function() {
            var self = this;

            // 校验手机号是否合法
            if(!validator.isMobile(this.data.mobile)) {
                toast.open($translate.instant('validator.mobile'));
                return;
            }
            loading.open();

            consigneeService.addOrEdit(this.data)
                .success(function(data) {

                    // 新增时，返回data为对象，包含id
                    if (!self.data.id) {
                        self.data.id = data.id;
                    }

                    self.data.region = self.selectedRegion;
                    $params.successCallback(self.data);
                    self.close();
                })
                .finally(function() { loading.close(); });
        },

        close: function() {
            $scope.modals.editConsigneeInfo.close();
        }
    });

}]);
