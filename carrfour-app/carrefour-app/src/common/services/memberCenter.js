/**
 * 商品收藏服务
 */
angular.module('app.services').factory('memberCenterService', function (
    api, messageCenter
) {

    var memberInfoData;
    return {
        /**
         * 绑卡 获取手机验证码
         * @param  {String} mobile 手机号
         * @return {Boolean}       是否成功
         */
        getBindByMobileVerifyCode: function (mobile) {
            return api.get('/offlineMember/getBindVerifyCode', {
                mobile: mobile
            });
        },

        /**
         * 三选二绑卡
         * @param  {Object} params 参数组
         * @return {Boolean}           是否成功
         *
         * formData: {
         *     nationality: "中国",
         *     idType: 0,
         *     idNumber: "",
         *     mobile: "",
         *     cardNumber: "",
         *     verifyCode: "",
         * },
         */
        bind: function (params) {
            params = _.defaults({}, params, {
                nationality: "中国",
                idType: 0,
                idNumber: "",
                mobile: "",
                cardNumber: "",
                verifyCode: "",
            });
            return api.post('/offlineMember/bind', params);
        },

        /**
         * 获取解绑验证码
         * @return {Boolean}       是否成功
         */
        getUnbindMobile: function () {
            return api.get('/offlineMember/findUnbindMenberPhone');
        },


        /**
         * 获取解绑验证码
         * @return {Boolean}       是否成功
         */
        getUnbindVerifyCode: function () {
            return api.get('/offlineMember/getUnbindVerifyCode');
        },

        /**
         * 解绑
         * @param  {String} verifyCode   验证码
         * @return {Boolean}             是否成功
         */
        unbind: function (verifyCode) {
            return api.post('/offlineMember/unbind', {
                verifyCode: verifyCode
            });
        },

        /**
        * 获取联级地区
        *
        * params:
        * {
        *   regionId: '',
        * }
        *
        * result:
        * [{
        *  regionId: "0",
        *  name: ""
        * }]
        */
        region: function(regionId){
            return api.get('/offlineMember/getAddressProvince', {
                regionId: regionId
            });
        },

        /**
         * 注册会员卡 - 获取默认地址
         */
        getRegionRegister: function () {
            return api.get('/offlineMember/findDefaultProvince');
        },

        /**
         * 注册会员卡 - 获取验证码
         * @param  {String} mobile 手机号
         * @return {Boolean}       是否成功
         */
        getRegisterVerifyCode: function (mobile) {
            return api.get('/offlineMember/getRegisterVerifyCode', {
                mobile: mobile
            });
        },

        /**
         * 注册会员卡 - 验证手机
         * @param  {String} mobile     手机号
         * @param  {String} verifyCode 验证码
         * @param  {String} idType     证件类型
         * @param  {String} nationality 国家
         * @param  {String} idNumber    证件号
         * @return {Boolean}           是否成功
         */
        registerMemberCardCheckMobile: function (mobile, verifyCode, nationality, idType, idNumber) {
            var params = {
                nationality: nationality,
                idType: idType,
                idNumber: idNumber,
                mobile: mobile,
                verifyCode: verifyCode
            };
            return api.post('/offlineMember/registerMemberCardCheckMobile', params);
        },

        /**
         * 注册会员卡
         * @param  {Object} params  参数组
         * @return {Boolean}        是否成功
         *
         * params:
         * {
         *     nationality: "",
         *     idType: 0,
         *     idNumber: "",
         *     name: "",
         *     sex: 0,
         *     birthday: "",
         *     mobile: "",
         *     email: "",
         *     province: "",
         *     district: "",
         *     city: "",
         *     address: ""
         * }
         */
        registerMemberCard: function (params) {

            var param = {
                nationality: params.nationality,
                idType: params.idType,
                idNumber: params.idNumber,
                mobile: params.mobile,
                name: params.name,
                sex: params.sex,
                birthday: params.birthday + " 00:00:00",
                email: params.email,
                province: params.regionIds[0].name,
                district: params.regionIds[2].name,
                city: params.regionIds[1].name,
                address: params.address,
                verifyCode: params.verifyCode
            };

            params = _.defaults({}, param, {
                nationality: "",
                idType: 0,
                idNumber: "",
                name: "",
                sex: 0,
                birthday: "",
                mobile: "",
                email: "",
                province: "",
                district: "",
                city: "",
                address: ""
            });

            return api.post('/offlineMember/registerMemberCard', params)
                .success(function (response) {
                    messageCenter.publishMessage('memberCenter.register', response);
                });
        },

        /**
         * 获取会员卡信息
         * @return {Object} 会员卡信息
         *
         * result:
         * {
         *  nationality: "",
         *  idType: 0,
         *  idNumber: "",
         *  cardNumber: "",
         *  name: "",
         *  sex: 0,
         *  censoredMobile: "186****1350",
         *  birthday: "",
         *  email: "",
         *  regionIds: [],
         *  address: "",
         *  freezePoints: "",  冻结积分
         *  pointBalance: "0", 当前积分
         *  expiredDate: "2000-01-01", 过期时间
         *  nextExpiredPoints: "0" 即将过期积分
         * }
         */
        getInfo: function () {
            memberInfoData = api.get('/offlineMember/getInfo');
            return memberInfoData;
        },

        /**
        * 获取会员信息
        */
        getMemberInfo: function () {
            return memberInfoData;
        },

        /**
         * 获取修改会员信息手机号的验证码
         * @param  {String} mobile 手机号
         * @return {Boolean}       是否成功
         */
        getModifyMemberInfoMobileVerifyCode: function (mobile) {
            return api.get('/offlineMember/getModifyMemberInfoMobileVerifyCode', {
                mobile: mobile
            });
        },

        /**
         * 修改会员信息手机号
         * @param  {String} mobile     手机号
         * @param  {String} verifyCode 验证码
         * @return {Boolean}           是否成功
         */
        modifyMemberInfoMobile: function (mobile, verifyCode) {
            return api.post('/offlineMember/modifyMemberInfoMobile', {
                mobile: mobile,
                verifyCode: verifyCode
            });
        },

        /**
         * 修改会员信息
         * @param  {Object} params 参数组
         * @return {Boolean}       是否成功
         *
         * params:
         * {
         *     name: "",
         *     sex: 0,
         *     birthday: "",
         *     email: "",
         *     district: "",
         *     province: ""
         *     city: "",
         *     address: ""
         * }
         */
        modifyMemberInfo: function (params) {

            var param = {
                name: params.name,
                sex: params.sex,
                birthday: params.birthday + " 00:00:00",
                email: params.email,
                province: params.regionIds[0].name,
                district: params.regionIds[2].name,
                city: params.regionIds[1].name,
                address: params.address
            };

            params = _.defaults({}, param, {
                name: "",
                sex: 0,
                birthday: "",
                email: "",
                city: "",
                district: "",
                province: "",
                address: ""
            });
            return api.post('/offlineMember/modifyMemberInfo', params);
        }

    };
});
