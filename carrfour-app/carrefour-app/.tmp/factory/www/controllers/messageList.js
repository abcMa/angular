angular.module('app.controllers').controller('messageListCtrl', ["$scope", "stateUtils", "$translate", "$stateParams", "localStorage", "messageCenterService", "loadDataMixin", "messageCenter", function (
    $scope, stateUtils, $translate, $stateParams, localStorage, messageCenterService, loadDataMixin, messageCenter
) {

    var ctrl = this,

        type = $stateParams.type || messageCenterService.channelMap.activity,
        typeName = messageCenterService.channelMap[type];

    _.assign(ctrl, stateUtils, loadDataMixin, {
        $scope: $scope,

        type: type,
        typeName: typeName,

        itemsPerPage: 8,

        //分页加载数据
        loadPage: function(page, pageCount) {
            return messageCenterService.getMessagePage(ctrl.type, page, pageCount);
        }
    });

    $scope.$on('$ionicView.afterEnter', function () {
        var name;
        switch (parseInt(type)) {
            case 1:
                name = "notifications::promotion_message::promotion_landing";
                break;
            case 2:
                name = "system_message::system_landing";
                break;
        }

        if (name) {
            // 广播页面Tag
            messageCenter.publishMessage('AT.screen', {
                pageName: 'notifications::' + name
            });
        }
    });

    ctrl.init();

}]);
