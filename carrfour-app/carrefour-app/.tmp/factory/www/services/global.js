/**
 * 封装全局通用业务操作
 */
angular.module('app.services').factory('globalService', ["$http", "api", "$translate", "localStorage", "messageCenter", function (
    $http, api, $translate, localStorage, messageCenter
) {
    return {
        /**
         * 获取图片验证码
         */
        imageVerifyCode: function () {
            return api.post('/global/createImageVerifyCode');
        },

        /**
         * 验证图片验证码
         */
        validateImageVerifyCode: function (imageVerifyCode) {
            return api.post('/global/validateImageVerifyCode', {
                imageVerifyCode: imageVerifyCode
            });
        },
        /**
         * 验证图片验证码
         */
        validateExitsUserAndImageVerifyCode: function (imageVerifyCode, loginName) {
            return api.post('/global/validateExitsUserAndImageVerifyCode', {
                imageVerifyCode: imageVerifyCode,
                loginName: loginName
            });
        },

        /**
         * 发送手机短信验证码
         * @param phoneNumber {string} 需要接收短信的验证码
         * @param type {integer} 短信类型
         */
        sendSMSVerifyCode: function (phoneNumber, type) {
            return api.post('/global/sendSMSVerifyCode', {
                phoneNumber: phoneNumber,
                type: type
            });
        },

        /**
         * 验证码短信验证码是否跟手机号码匹配
         */
        validateSMSVerifyCode: function (phoneNumber, smsVerifyCode) {
            return api.post('/global/validateSMSVerifyCode', {
                phoneNumber: phoneNumber,
                smsVerifyCode: smsVerifyCode
            });
        },

        /**
         * 发送邮件
         */
        sendMail: function (email, type) {
            return api.post('/global/sendEmail', {
                email: email,
                type: type
            });
        },

        /**
         * 获取地区list by 父regionId
         */
        getListByRegionId: function (id) {
            return api.get('/global/getHomePageRegionList', {
                cache: true,
                parentId: id
            });
        },

        /**
         * 用id数组换Name数组
         * @param  {Array} idArray 地区id数组
         * @return {Object}       {regionId:regionName, ...}
         */
        getRegionNamesByIdList: function (idArray) {
            return api.post('/global/getRegionNameByIdNew', idArray);
        },

        /**
         * 检查地区和分站关联是否发生变化
         */
        changeRegionalStore: function (regionId) {
            return api.get('/global/checkSubsiteNew', {
                regionId: regionId
            });
        },

        /**
         * 获取文章
         */
        getArticleInfo: function (type) {
            return api.post('/global/getArticleInfo', {
                type: type
            });
        },

        /**
         * 获取网站结构配置的文章
         */
        getArticleByStructure: function (type) {
            return api.post('/global/getArticleByStructureId', {
                type: type
            });
        },

        /**
         * 获取搜索热词
         */
        getKeywords: function (count) {
            return api.post('/keyword/list', {
                count: count
            }, {
                cache: true
            });
        },

        /**
         * 切换语言
         * @param  {[type]} langKey 语言key
         */
        toggleLanguage: function (langKey) {

            // 无需切换
            if (langKey == APP_CONFIG.language) {
                return;
            }
            //切换界面语言
            $translate.use(langKey);

            //切换header语言
            APP_CONFIG.language = langKey;

            // 存入缓存 记录选择的语言
            localStorage.set('language', langKey);

            // 切换语言 body检测class
            // $('.toggle-language').trigger('click');

            messageCenter.publishMessage('language.change', langKey);
        },
        // 检查更新
        checkUpdate: function () {
            return api.get('/global/checkUpdate');
        },

        // 获取是否允许弹窗、评价弹出信息
        isAlertVersions: function(){
            return api.get('/appComment/checkVershipEquipment');
        }

    };
}]);
