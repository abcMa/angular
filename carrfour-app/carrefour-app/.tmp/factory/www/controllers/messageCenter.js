angular.module('app.controllers').controller('messageCenterCtrl', ["$scope", "stateUtils", "$state", "localStorage", "messageCenterService", "$translate", "loadDataMixin", "messageCenter", function (
    $scope, stateUtils, $state, localStorage, messageCenterService, $translate, loadDataMixin, messageCenter
) {

    var ctrl = this;

    _.assign(ctrl, stateUtils, loadDataMixin, {
        $scope: $scope,

        // 渠道数据
        channels: undefined,

        //初始化消息中心数据
        init: function() {
            ctrl.channels = [];

            _.forEach(messageCenterService.channelIds, function(channelId) {
                var channelData = {
                    id: channelId,
                    name: messageCenterService.channelMap[channelId],
                    firstMessage: undefined,
                    unreadCount: messageCenterService.channelUnreadCounts[channelId]
                };

                ctrl.channels.push(channelData);

                messageCenterService.getFirstMessageByChannelId(channelId).success(function(message) {
                    channelData.firstMessage = message;
                });
            });
        },

        refreshUnreadCount: function() {
            _.forEach(ctrl.channels, function(channel) {
                channel.unreadCount = messageCenterService.channelUnreadCounts[channel.id];
            });
        },

        refreshFirstMessage: function() {
            _.forEach(ctrl.channels, function(channel) {
                messageCenterService.getFirstMessageByChannelId(channel.id).success(function(message) {
                    channel.firstMessage = message;
                });
            });
        },

        goList: function (channelId) {
            var params = {
                type: channelId
            };

            stateUtils.goMessageList(params);
        }
    });

    $scope.$on('$ionicView.afterEnter', function() {
        if (!ctrl.channels) {
            ctrl.init();
        }
        else {
            ctrl.refreshUnreadCount();
        }
    });

    $scope.$on('$ionicView.afterEnter', function () {
        // 广播页面Tag
        messageCenter.publishMessage('AT.screen', {
            pageName: 'notifications::notifications_landing'
        });
    });

    //监听 收到新消息
    messageCenter.subscribeMessage('message.cache', function () {
        ctrl.refreshUnreadCount();
        ctrl.refreshFirstMessage();
    }, $scope);
}]);
