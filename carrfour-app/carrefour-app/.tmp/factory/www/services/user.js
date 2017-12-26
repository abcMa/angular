/**
 * 封装用户相关业务操作
 */
angular.module('app.services').factory('userService', ["$http", "api", "messageCenter", "localStorage", function (
    $http, api, messageCenter, localStorage
) {
    return {
        /**
         * 获取当前用户的信息
         */
        info: function () {
            return api.get('/user/info')
                .success(function (data) {
                    // 计算用户年龄区间
                    // 1=<25, 2=25-34, 3=35-44, 4=>44
                    if(data.birthday){
                        var yearsago = moment(data.birthday).fromNow();
                        var age = yearsago.substring(0, yearsago.indexOf(" "));
                        data.age = age;
                        if (age <= 25) {
                            data.ageGroup = 1;
                        } else if (age <= 34) {
                            data.ageGroup = 2;
                        } else if (age <= 44) {
                            data.ageGroup = 3;
                        } else {
                            data.ageGroup = 4;
                        }
                    }

                    // 这字段定义的真智障
                    // 转成正常人思维
                    data.newCustomer = !data.oldNew;
                    delete data.oldNew;

                    messageCenter.publishMessage('user.info', data);
                });
        },

        /**
         * 修改用户信息
         *
         * ## 接口参数
         * - sex {integer} 性别
         * - birthday {string} 生日
         * - nickname {string} 昵称
         * - pic {string} 图片地址
         */
        update: function (params) {
            return api.post('/user/update', params);
        },

        /**
         * 获取用户服务信息
         */
        serviceInfo: function () {
            return api.get('/user/service');
        },

        /**
         * 登录操作
         *
         * ## 接口参数
         * - loginName {String} 帐号登录名称
         * - password {String} 密码
         * - imageVerifyCode(?) {String} 图片验证码
         *
         * @param params {Object} 接口参数
         */
        login: function (params) {
            return api.post('/user/login', params)
                .success(function (data) {
                    messageCenter.publishMessage('login', data);
                });
        },

        /**
         * 登出操作
         */
        logout: function () {
            return api.post('/user/logout')
                .success(function (data) {
                    messageCenter.publishMessage('logout');
                });
        },

        /**
         * 注册
         *
         * ## 接口参数
         * - loginName {String} 帐号登录名称，必须为手机号码
         * - password {String} 密码
         * - smsVerifyCode(?) {String} 短信验证码
         */
        register: function (params) {
            return api.post('/user/register', params)
                .success(function (data) {
                    messageCenter.publishMessage('register', data);
                    messageCenter.publishMessage('login', data);
                });
        },

        /**
         * 验证登录名是否已被注册使用
         * @param loginName {String} 待验证的登录名
         */
        verifyUniqueUser: function (loginName) {
            return api.get('/user/verifyUniqueUser', {
                loginName: loginName
            });
        },

        /**
         * 用户是否登录
         */
        hasLogined: function () {
            return !!APP_USER.id;
        },
        /**
         * 验证用户名称是否存在
         */
        validateLoginName: function (loginName) {
            return api.post('/user/verifyExitsUser', {
                loginName: loginName
            });
        },
        /**
         * 找回密码-修改密码
         */
        changePassword: function (phoneNumber, smsVerifyCode, newPassword) {
            return api.post('/user/changePassword', {
                phoneNumber: phoneNumber,
                smsVerifyCode: smsVerifyCode,
                newPassword: newPassword,
                changeWay: 'find'
            });
        },

        /**
         * 上传头像接口
         * @param  {[type]} pic [description]
         * @return {[type]}     [description]
         */
        uploadAvatar: function(pic) {
            return api.post('/user/uploadAvatar', {
                pic: pic
            });
        },
    };
}]);
