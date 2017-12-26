/**
 * 极光推送
 */
angular.module('app.services')
    .factory('jPushService', function (jPushManager, jPushReceiver, $ionicPlatform) {
        return {
            init: function () {
                $ionicPlatform.ready(function () {
                    var jPush = window.plugins ? window.plugins.jPushPlugin : null;
                    if (!jPush) {
                        return;
                    }
                    jPush.setDebugMode(false);
                    // 插件
                    jPush.init();
                    // 监听
                    jPushReceiver.init();
                    // 配置
                    jPushManager.init();
                });
            }
        };
    });
/**
 * 极光推送 - 接收器
 */
angular.module('app.services')
    .factory('jPushReceiver', function (messageCenterService) {

        // 处理打开通知数据
        function handleOpenNotificationData(event) {
            if (ionic.Platform.isAndroid()) {
                return handleAndroidData(window.plugins.jPushPlugin.openNotification);
            }
            if (ionic.Platform.isIOS()) {
                return handleiOSData(event);
            }
        }

        // 处理接收通知数据
        function handleReceiveNotificationData(event) {
            if (ionic.Platform.isAndroid()) {
                return handleAndroidData(window.plugins.jPushPlugin.receiveNotification);
            }
            if (ionic.Platform.isIOS()) {
                return handleiOSData(event);
            }
        }

        // 处理接收自定义消息数据
        // function handleReceiveMessageData(event) {
        //     if (ionic.Platform.isAndroid()) {
        //         return handleAndroidData(window.plugins.jPushPlugin.receiveMessage);
        //     }
        //     if (ionic.Platform.isIOS()) {
        //         return handleiOSData(event);
        //     }
        // }

        // 处理android推送信息数据
        function handleAndroidData(data) {
            var result = {
                alert: data.alert || data.message
            };
            if (data.extras) {
                result.params = data.extras['cn.jpush.android.EXTRA'];
            }
            return result;
        }

        // 处理ios推送信息数据
        function handleiOSData(data) {
            var result = {
                alert: data.aps ? data.aps.alert : data.content,
                params: data
            };
            return result;
        }

        //处理接收到的消息
        function cacheData(data) {
            var message = data && data.params;
            messageCenterService.cacheMessage(message);
        }

        // 处理状态转换
        // function handleStateChange(data) {
        //     var params = data ? data.params : {};
        //
        //     if (params.state) {
        //         switch (params.state.toLowerCase()) {
        //             case 'productinfo':
        //                 if (params.id && !params.productId) {
        //                     params.productId = params.id;
        //                 }
        //                 stateUtils.goProductInfo(params.productId, params.goodsId, params.title, 'jPush');
        //                 break;
        //             case 'productlist':
        //                 stateUtils.goProductList({
        //                     url: params.url
        //                 }, params.title);
        //                 break;
        //                 // case 'flashsale':
        //                 //     stateUtils.goFlashSale();
        //                 //     break;
        //                 // case 'article':
        //                 //     stateUtils.goAdvRedirect(params.id, params.title);
        //                 //     break;
        //             case 'activity':
        //                 if (params.id && !params.articleId) {
        //                     params.articleId = params.id;
        //                 }
        //                 stateUtils.goActivity(params.articleId, params.title);
        //                 break;
        //             case 'index':
        //                 stateUtils.goIndex();
        //                 break;
        //         }
        //     } else if (params.id && params.typeId) {
        //         messageCenterService.getMessage(params.id).success(function (message) {
        //             if (message.content && message.content.isExpired) {
        //                 modals.activityClosedAlert.open();
        //             } else {
        //                 stateUtils.goByNewMessage(message);
        //             }
        //
        //             messageCenterService.setReadByMessageId(message.typeId, message.id);
        //         });
        //     }
        // }

        return {
            init: function () {

                var jPush = window.plugins ? window.plugins.jPushPlugin : null;
                if (!jPush) {
                    return;
                }

                // 清空角标
                // jPush.resetBadge();
                jPush.setApplicationIconBadgeNumber(0);

                // 当点击通知时触发
                // iOS, Android
                document.addEventListener("jpush.openNotification", function (event) {
                    console.debug("openNotification:", event);
                    var data = handleOpenNotificationData(event);
                    cacheData(data);
                    // jPush.resetBadge();
                    jPush.setApplicationIconBadgeNumber(0);
                }, false);

                // 当接收到自定义消息事触发
                // iOS, Android
                // document.addEventListener("jpush.receiveMessage", function (event) {
                //     console.debug("receiveMessage:", event);
                //     var data = handleReceiveMessageData(event);
                //     cacheData(data);
                //     // jPush.resetBadge();
                //     jPush.setApplicationIconBadgeNumber(0);
                // }, false);

                // 当接收到通知时触发
                // iOS: 当应用在前台接收到推送时触发
                // Android: 当应用接收到推送时触发
                document.addEventListener("jpush.receiveNotification", function (event) {
                    console.debug("receiveNotification:", event);
                    var data = handleReceiveNotificationData(event);
                    cacheData(data);
                }, false);

                // 当启动Background Remote Notification后，应用在后台接收到推送时触发
                // iOS
                document.addEventListener("jpush.backgroundNotification", function (event) {
                    console.debug("backgroundNotification:", event);
                    var data = handleReceiveNotificationData(event);
                    cacheData(data);
                }, false);

                // 设置标签别名的回调
                document.addEventListener("jpush.setTagsWithAlias", function (event) {
                    try {
                        console.log("onTagsWithAlias");
                        var result = "result code:" + event.resultCode + " ";
                        result += "tags:" + event.tags + " ";
                        result += "alias:" + event.alias + " ";
                        console.debug(result);
                    } catch (exception) {
                        console.log(exception);
                    }
                }, false);
            }
        };
    });

/**
 * 极光推送 - 控制器
 */
angular.module('app.services').factory('jPushManager', function ($rootScope, messageCenter, utils) {
    var tagContainer = {};
    var alias = "";
    var updateLock = false;

    // 过滤容易出问题的字符
    function tagsValuefilter(value) {
        if (_.isEmpty(value)) {
            return "";
        }
        return value.toLowerCase().replace(/-/g, "");
    }

    return {
        init: function () {

            // 如果有语言信息
            if (APP_CONFIG) {
                this.setTag("language", APP_CONFIG.language);
            }

            // 如果有cityName
            if (APP_USER && APP_USER.cityName) {
                this.setTag("cityName", APP_USER.cityName);
            }

            // 如果有id
            if (APP_USER && APP_USER.id) {
                this.setAlias(APP_USER.id);
            }

            messageCenter.subscribeMessage('user.info', (function (event, userInfo) {
                if (!userInfo) {
                    return;
                }
                this.setTag("cityName", userInfo.cityName);
                this.setAlias(userInfo.id);
            }).bind(this), $rootScope);

            messageCenter.subscribeMessage('logout', (function (event) {
                this.deleteTag('cityName');
                this.setAlias('');
            }).bind(this), $rootScope);

            messageCenter.subscribeMessage('language.change', (function (event, langKey) {
                this.setTag("language", langKey);
            }).bind(this), $rootScope);

            messageCenter.subscribeMessage('resume', (function (event) {
                var jPush = window.plugins ? window.plugins.jPushPlugin : null;
                if (!jPush) {
                    return;
                }
                jPush.resetBadge();
                jPush.setApplicationIconBadgeNumber(0);
            }).bind(this), $rootScope);
        },
        setAlias: function (value) {
            var newAlias = "app_" + value;

            if (alias == newAlias) {
                return;
            }

            if (!value) {
                alias = "";
            } else {
                alias = newAlias;
            }
            // 有变动时需要更新
            this.checkUpdateTagsAndAlias();
        },
        getAlias: function () {
            return alias;
        },
        setTag: function (key, value) {
            var newValue = tagsValuefilter(value);

            if (tagContainer[key] == newValue) {
                return;
            }

            if (!newValue) {
                return this.deleteTag(key);
            }
            tagContainer[key] = newValue;
            // 有变动时需要更新
            this.checkUpdateTagsAndAlias();
        },
        getTag: function (key) {
            return tagContainer[key];
        },
        deleteTag: function (key) {
            if (!this.getTag(key)) {
                return false;
            }
            delete tagContainer[key];
            // 有变动时需要更新
            this.checkUpdateTagsAndAlias();
            return true;
        },
        getTagsArray: function () {
            return _.sortBy(_.values(tagContainer));
        },
        getAllTags: function () {
            return utils.combination(this.getTagsArray());
        },
        checkUpdateTagsAndAlias: function () {
            if (updateLock) {
                return;
            }
            var jPush = window.plugins ? window.plugins.jPushPlugin : null;
            if (!jPush) {
                return;
            }
            updateLock = true;
            setTimeout((function () {
                jPush.setTagsWithAlias(this.getAllTags(), this.getAlias());
                console.debug("set tags:", this.getAllTags().join(','));
                console.debug("set alias:", this.getAlias());
                updateLock = false;
            }).bind(this), 30 * 1000);

        }
    };
});
