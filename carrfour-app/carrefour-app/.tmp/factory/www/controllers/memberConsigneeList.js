angular.module('app.controllers').controller('memberConsigneeListCtrl', ["$scope", "$stateParams", "$params", "$ionicPopup", "$ionicListDelegate", "loadDataMixin", "memberConsigneeService", "errorHandling", "messageCenter", "popup", "$translate", "$ionicScrollDelegate", "toast", "loading", function (
    $scope, $stateParams, $params, $ionicPopup, $ionicListDelegate, loadDataMixin,
    memberConsigneeService, errorHandling, messageCenter, popup, $translate, $ionicScrollDelegate, toast, loading
) {

    var self = this,
        isSelectMode = !_.isEmpty($params);

    $params = $params || $stateParams;

    $params = _.defaults({}, $params, {
        selectedId: undefined,
        successCallback: _.noop,
        title: undefined
    });

    angular.extend(self, loadDataMixin, {
        $scope: $scope,

        // 操作模式：
        // 1: 浏览
        // 2: 选择
        mode: isSelectMode ? 2 : 1,

        // 地址管理的title
        title: $params.title,

        /**
         * 加载提货人信息列表的相关数据
         */
        loadData: function () {
            return memberConsigneeService.all()
                .success(function (response) {
                    // 拼接regions
                    _.each(response.allAddress, function (address) {
                        address.regionName = _.map(address.region, function (region) {
                            return region.name;
                        }).join("");
                    });
                });
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

            $scope.modals.memberEditConsigneeInfo.open({
                params: {
                    data: consignee
                }
            });
        },

        /**
         * 删除某个提货人数据
         */
        remove: function (addressData, $event) {
            $event && $event.stopImmediatePropagation();
            popup.confirm($translate.instant('consignee.removeTip'))
                .then(function (res) {
                    if (res) {
                        memberConsigneeService.remove(addressData.id);
                    }
                })
                .finally(function () {
                    $ionicScrollDelegate.resize();
                });
        },

        /**
         * 修改默认地址
         * @params consignee {Object} 地址对象
         */
        editDefault: function(consignee, $event){
            $event && $event.stopImmediatePropagation();
            loading.open();
            memberConsigneeService.editDefault(consignee.id,!consignee.isDefault)
                .finally(function() {
                    loading.close();
                })
                .success(function() {
                    toast.open($translate.instant('consignee.changeSuc'));
                })
                .error(errorHandling);
        }
    });

    self.init();

    // 广播页面Tag
    messageCenter.publishMessage('AT.screen', {
        pageName: 'personal_space::address_management'
    });

    // 处理添加，编辑及删除联系人事件
    messageCenter.subscribeMessage(
        [
            'consignee.add',
            'consignee.edit',
            'consignee.remove',
            'consignee.isDefault'
        ],
        function () {
            self.refresh();
        },
        $scope
    );
}]);
