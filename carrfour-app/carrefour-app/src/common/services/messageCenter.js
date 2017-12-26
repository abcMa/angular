/**
 * 封装用户相关业务操作
 */
angular.module('app.services').factory('messageCenterService', function (
    $http, api, messageCenter, localStorage, $translate, $timeout
) {
    var

    localdataKey = 'messages',

    // 最大缓存数量
    maxCacheCount = 200,

    // 存储所有支持的渠道 ID
    channelIds = [1, 2],

    // 渠道 ID 与渠道名称之间的映射
    channelMap = {
        1: 'activity',
        2: 'system',
        activity: 1,
        system: 2
    },

    defaultLocaldata = {
        1: {               // 活动消息
            messages: []
        },
        2: {
            messages: []   // 系统通知
        },
        info: {            // 消息中心相关信息
            total: 0,      // - 总消息条目数
            idCount: 0     // - 缓存 id 计数器
        }
    },

    localdata = localStorage.get(localdataKey, _.cloneDeep(defaultLocaldata), true);

    messageCenterService = {
        channelIds: channelIds,
        channelMap: channelMap,

        unreadCount: 0,

        channelUnreadCounts: {},

        /**
         * 缓存一条消息
         */
        cacheMessage: function(message) {
            if ( !(message && message.id && localdata[message.typeId]) ) {
                return;
            }

            var channelMessages = localdata[message.typeId].messages,
                messageIndex = _.findIndex(channelMessages, 'id', message.id);

            if (messageIndex > -1) {
                return;
            }
            else {
                message = {
                    id: message.id,
                    typeId: message.typeId,
                    isRead: false,
                    cacheId: localdata.info.idCount++
                };

                localdata[message.typeId].messages.unshift(message);
                localdata.info.total++;

                if (localdata.info.total > maxCacheCount) {
                    removeLastMessage();
                }
            }

            writeLocalStorage();

            messageCenter.publishMessage("message.cache");
        },

        /**
         * 获取所传入的消息 ID 所对应的消息数据，若该 ID 对应的消息不存在，会在所返回的 promise 中抛出一个异常。
         */
        getMessage: function(id) {
            var self = this;

            if (!id) {
                return api.reject(APP_STATE_CODE.messageNotFound);
            }
            else {
                return this._getMessageList([id])
                    .then(function(response) {
                        var messages = response.data;

                        if (messages && messages.length) {
                            response.data = messages[0];
                            return response;
                        }
                        else {
                            return api.reject(APP_STATE_CODE.messageNotFound);
                        }
                    });
            }
        },

        //分页，获得某个分类下的消息列表，根据分类信息获得当前分页的ids数组
        getMessagePage: function(channelId, page, pageCount) {
            var channel = localdata[channelId],
                channelMessages = channel.messages;

            var startIndex = (page - 1) * pageCount,
                messages = channelMessages.slice(startIndex, startIndex + pageCount);

            var messageIds = _.map(messages, 'id');

            return this._getMessageList(messageIds).then(function(response) {
                var items = response.data;

                response.data = {
                    items: items,
                    totalItems: channelMessages.length,
                    pageIndex: page
                };

                _.forEach(messages, function(message) {
                    message.isRead = true;
                });

                writeLocalStorage();

                return response;
            });
        },

        /**
         * 获取所指定渠道下的第一条消息数据
         */
        getFirstMessageByChannelId: function(channelId) {
            var channelMessages = localdata[channelId].messages,
                firstMessage = channelMessages[0];

            return this.getMessage(firstMessage && firstMessage.id);
        },

        /**
         * 返回指定渠道中的未读消息数量
         */
        getUnreadCountByChannelId: function(channelId) {
            var channelMessages = localdata[channelId].messages;
            return _.filter(channelMessages, 'isRead', false).length;
        },

        /**
         * 返回所有渠道中的未读消息数量
         */
        getUnreadCount: function() {
            var self = this,
                total = 0;

            _.forEach(channelIds, function(channelId) {
                total += self.getUnreadCountByChannelId(channelId);
            });

            return total;
        },

        /**
         * 调用后台接口，获取所传入的 id 对应的消息
         * @params {array<number>} messageIds - 消息 id 数组
         */
        _getMessageList: function(messageIds) {
            var params = {
                messageIds: messageIds
            };

            return api.get('/message/getInfoList', params);
        },

        setReadByMessageId: function(channelId, messageId) {
            var channelMessages = localdata[channelId].messages,
                isChange;

            _.forEach(channelMessages, function(message) {
                // NOTE: 接口所返回的消息数据中，id 是 number 类型，而极光推送过来的消息中，是字符串类类型，
                // 因此这里用相等判断，而不是全等判断。
                if (message.id == messageId && message.isRead !== true) {
                    message.isRead = true;
                    isChange = true;
                }
            });

            if (isChange) {
                writeLocalStorage();
            }
        }

    };

    refreshUnreadCount();

    messageCenter.subscribeMessage('localStorage.clean', function() {
        localdata = _.cloneDeep(defaultLocaldata);
        writeLocalStorage();
    });

    return messageCenterService;

    /**
     * 移除最早缓存的一条消息
     */
    function removeLastMessage() {
        var messages = localdata[channelIds[0]].messages, m;

        // 找到拥有最早缓存的一条消息的渠道
        for (var i = 1; i < channelIds.length; i++) {
            m = localdata[channelIds[i]].messages;

            if (!messages.length) {
                messages = m;
            }
            else if (m.length && messages[messages.length - 1].cacheId > m[m.length - 1].cacheId) {
                messages = m;
            }
        }

        messages.pop();
        localdata.info.total--;

        writeLocalStorage();
    };

    function writeLocalStorage() {
        refreshUnreadCount();
        localStorage.set(localdataKey, localdata);
    }

    function refreshUnreadCount() {
        var total = 0;

        _.forEach(channelIds, function(channelId) {
            var channelUnreadCount = messageCenterService.getUnreadCountByChannelId(channelId);

            messageCenterService.channelUnreadCounts[channelId] = channelUnreadCount;

            total += channelUnreadCount;
        });

        messageCenterService.unreadCount = total;

        $timeout(function() {});
    }
});
