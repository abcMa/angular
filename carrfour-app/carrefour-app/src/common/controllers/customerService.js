angular.module('app.controllers').controller('customerServiceCtrl', function (
    $scope, loadDataMixin, errorHandling, customerService, $state, stateUtils, messageCenter
) {

    var ctrl = this;

    angular.extend(ctrl, loadDataMixin, {
        $scope: $scope,

        loadData: function () {
            return customerService.getChannels()
                .error(errorHandling);
        },
        goArticleList: function (channel) {
            $state.go('tabs.customerServiceArticleList', {
                channelId: channel.id,
                title: channel.name
            });
        }

    });

    $scope.$on('$ionicView.afterEnter', function () {
        // 广播页面Tag
        messageCenter.publishMessage('AT.screen', {
            pageName: 'personal_space::customer_service'
        });
    });

    var deregistration = $scope.$on('$ionicView.afterEnter', function () {
        ctrl.init();
        deregistration();
    });
});
