angular.module('app.controllers').controller('consigneeListCtrl', ["$scope", "$stateParams", "$params", "$ionicPopup", "$ionicListDelegate", "loadDataMixin", "consigneeService", "errorHandling", "messageCenter", "popup", "$translate", "$ionicScrollDelegate", "toast", function (
    $scope, $stateParams, $params, $ionicPopup, $ionicListDelegate, loadDataMixin,
    consigneeService, errorHandling, messageCenter, popup, $translate, $ionicScrollDelegate, toast
) {

    var self = this,
        isSelectMode = !_.isEmpty($params);

    $params = $params || $stateParams;

    $params = _.defaults({}, $params, {
        selectedId: undefined,
        successCallback: _.noop,
        title: undefined
    });

    angular.extend(self, loadDataMixin, messageCenter, {
        $scope: $scope,

        // 操作模式：
        // 1: 浏览
        // 2: 选择
        mode: isSelectMode ? 2 : 1,

        // 所选择的提货人 ID
        selectedConsigneeId: $params.selectedId,

        // 地址管理的title
        title: $params.title,

        //地址库更新提示
        addressTips: '',

        /**
         * 加载提货人信息列表的相关数据
         */
        loadData: function () {
            consigneeService.getTips().success(function(response){
                self.addressTips = response;
            });

            return consigneeService.all()
                .success(function (response) {
                    // 拼接regions
                    _.each(response.allAddress, function (address) {
                        address.regionName = _.map(address.region, function (region) {
                            return region.name;
                        }).join("");
                    });
                });
        },

        // 选择收货地址
        selected: function (consignee) {
            //当地址已失效
            if(!consignee.effective) {
                return;
            }
            if (!consignee.valid) {
                toast.open($translate.instant('checkout.consignee.unavailable'));
                return;
            }

            // 当前选中，则为active
            self.selectedConsigneeId = consignee.id;

            // 把当前选中的consignee返回到confirmOrder中展示
            $params.successCallback(consignee);
            messageCenter.publishMessage('consignee.change');
            $scope.modals.selectConsignee.close();
        },

        /**
         * 打开编辑功能
         * @param consignee {Object} 待编辑的提货人信息
         */
        toEdit: function (consignee, $event) {
            $event && $event.stopImmediatePropagation();

            var addressLength = self.data.allAddress.length;

            if (addressLength >= 30 && !consignee) {
                toast.open($translate.instant('checkout.consignee.limits'));
                return;
            }

            $scope.modals.editConsigneeInfo.open({
                params: {
                    data: consignee,
                    successCallback: function (address) {
                        // 只有有效的地址才能选中
                        if(address.isValid){
                            self.selectedConsigneeId = address.id;
                            $params.successCallback(address);
                        }
                    }
                }
            });
        },

        /**
         * 删除某个提货人数据
         */
        remove: function (addressData, $event) {
            $event && $event.stopImmediatePropagation();
            popup.confirm($translate.instant('checkout.consignee.removeTip'))
                .then(function (res) {
                    if (res) {
                        consigneeService.remove(addressData.id);
                    }
                })
                .finally(function () {
                    $ionicScrollDelegate.resize();
                });
        }
    });

    self.init();

    // 处理添加，编辑及删除联系人事件
    self.subscribeMessage(
        [
            'consignee.add',
            'consignee.edit',
            'consignee.remove',
            'consignee.isDefault'
        ],
        function () {
            self.init();
        },
        $scope
    );
}]);
