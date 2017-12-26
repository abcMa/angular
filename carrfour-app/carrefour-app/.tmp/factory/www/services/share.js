/**
 * 分享服务
 */
angular.module('app.services').factory('shareService', ["api", "$state", "defaultStates", "loading", "userService", "modals", "errorHandling", "$ionicPlatform", function(
    api, $state, defaultStates, loading, userService, modals, errorHandling, $ionicPlatform
) {
    var isSupportWechatShare = !!(window.wx);

    var shareService =  {
        SHARE_PLATFORM: {
            WECHAT: "wxsession",
            WECHAT_MOMENTS: "wxtimeline",
            QQ: "qq",
            QQ_ZONE: "qzone",
            WEIBO: "sina"
        },
        SHARE_PLATFORM_TYPE: {
            WECHAT: 0,
            WECHAT_MOMENTS: 1,
            QQ: "qq",
            QQ_ZONE: "qzone",
            WEIBO: "sina"
        },

        isSupportWechatShare: isSupportWechatShare,

        /**
         * 设置为默认分享信息
         */
        defaultShareInfo: function() {
            shareService.wechatShareInfo('index', 0);
        },

        /**
         * 设置微信分享信息
         */
        wechatShareInfo: function(type, id) {
            if (!isSupportWechatShare) {
                return;
            }

            shareService.getShareInfo(type, id, shareService.SHARE_PLATFORM.WECHAT)
            .success(function(data) {
                var title = data.title;
                var desc = data.content;
                var imgUrl = data.pic;
                var link = data.url;
                var noop = _.noop;

                // 处理分享功能
                wx.ready(function() {
                    // 分享到朋友圈
                    wx.onMenuShareTimeline({
                        link: link,
                        title: title,
                        imgUrl: imgUrl,
                        success: noop,
                        cancel: noop
                    });

                    // 分享给微信好友
                    wx.onMenuShareAppMessage({
                        link: link,
                        title: title,
                        desc: desc,
                        imgUrl: imgUrl,
                        type: 'link',
                        success: noop,
                        cancel: noop
                    });

                    // 分享到 QQ
                    wx.onMenuShareQQ({
                        link: link,
                        title: title,
                        desc: desc,
                        imgUrl: imgUrl,
                        success: noop,
                        cancel: noop
                    });

                    // 分享到微博
                    wx.onMenuShareWeibo({
                        link: link,
                        title: title,
                        desc: desc,
                        imgUrl: imgUrl,
                        success: noop,
                        cance: noop
                    });

                    // 分享到 QQ 空间
                    wx.onMenuShareQZone({
                        link: link,
                        title: title,
                        desc: desc,
                        imgUrl: imgUrl,
                        success: noop,
                        cancel: noop
                    });
                });
            })
        },
        /**
         * 检查分享app功能是否可以分享
         */
        checkAppShare: function() {
            return api.get('/share/checkAppShare');
        },
        /**
         * 分享
         * @param  {string} type     [分享类型]
         * @param  {number} id       [分享数据]
         * @param  {string} platform [分享渠道]
         */
        shareByType: function(type, id, platform) {
            loading.open();
            shareService.getShareInfo(type, id, platform)
                .success(function(data) {
                    // 过滤html标签
                    data.content =  _.unescape(data.content).replace(/<p>/g, '').replace(/<[^<>]+>/g, '\n');
                    data.type = platform;
                    var deferred = api.defer();
                    var backButton = $ionicPlatform.registerBackButtonAction(function (e) {
                        backButton();
                    }, 201);
                    shareService.share(data).then(function() {
                        // 成功调用后台埋点
                        //shareSuccess(type, id, platform);
                        deferred.resolve();
                    }).error(function() {
                        deferred.reject();
                    });
                    return deferred.promise;
                })
                .error(errorHandling)
                .finally(function() {
                    loading.close();
                    modals.share.close();
                });
        },
        /**
         * 获取分享信息
         * @param  {string} type     [分享类型]
         * @param  {number} id       [分享数据]
         * @param  {string} platform [分享渠道]
         */
        getShareInfo: function(type, data, platform) {
            var config = {};
            config.type = type;
            config.data = data;
            config.platform = platform;
            return api.get('/share/info', config);
        },
        /**
         * 分享成功回调
         * @param  {string} type     [分享类型]
         * @param  {number} id       [分享数据]
         * @param  {string} platform [分享渠道]
         */
        shareSuccess: function(type, data, platform) {
            if (userService.hasLogined()) {
                var promise = api.post('/share/success', {
                    type: type,
                    data: data,
                    platform: platform
                });
                return promise;
            }
        },
        /**
         * 调用原生组件分享
         * @param  {object} data [分享对象]
         */
        share: function(data) {
            var deferred = api.defer();
            if (data.type === shareService.SHARE_PLATFORM.WECHAT ||
                data.type === shareService.SHARE_PLATFORM.WECHAT_MOMENTS){
                if (window.wechatPay && APP_CONFIG.wechat_installed) {
                    if (data.type === shareService.SHARE_PLATFORM.WECHAT) {
                        data.type = shareService.SHARE_PLATFORM_TYPE.WECHAT;
                    }else {
                        data.type = shareService.SHARE_PLATFORM_TYPE.WECHAT_MOMENTS;
                    }
                    window.wechatPay.share({
                        type: data.type,
                        title: data.title,
                        content: data.content,
                        pic: data.pic,
                        url: data.url
                    }, function() {
                        deferred.resolve();
                    }, function() {
                        deferred.reject();
                    });
                }
            }else if (data.type === shareService.SHARE_PLATFORM.QQ ||
                data.type === shareService.SHARE_PLATFORM.QQ_ZONE){
                if (window.CMShare && APP_CONFIG.QQ_installed) {
                    if (data.type === shareService.SHARE_PLATFORM.QQ) {
                        data.type = shareService.SHARE_PLATFORM_TYPE.QQ;
                    }else {
                        data.type = shareService.SHARE_PLATFORM_TYPE.QQ_ZONE;
                    }
                    window.CMShare.shareToPlatform(data.title, data.content,
                        data.pic, data.url, data.type, function() {
                            deferred.resolve();
                        }
                    );
                }
            }else if (data.type === shareService.SHARE_PLATFORM.WEIBO){
                if (window.CMShare) {
                    data.type = shareService.SHARE_PLATFORM_TYPE.WEIBO;
                    window.CMShare.shareToPlatform(data.title, data.content,
                        data.pic, data.url, data.type, function() {
                            deferred.resolve();
                        }
                    );
                }
            }
            return deferred.promise;
        }
    };

    return shareService;
}]);
