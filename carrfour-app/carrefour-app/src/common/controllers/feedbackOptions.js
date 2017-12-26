angular.module('app.controllers').controller('feedbackOptionsCtrl', function (
    $rootScope, $scope, camera, loadDataMixin, modals, validator, toast, $translate, errorHandling, feedbackOptionsServers, api, loading
) {

    var ctrl = this;

    angular.extend(ctrl, loadDataMixin, {

        $scope: $scope,

        // 用户选择的base64图片组
        picturesAry: [],

        // 用户选择上传图片数量
        picturesTotal: 0,

        // 详细原因字长
        reasonsTotal: 0,

        picTotal: 0,

        // 提交数据信息
        feedbackData: {

            // 原因类型
            reason: '',

            // 详细原因
            reasons: '',

            // 联系电话
            mobile: '',

            // 上传图片
            picturesId: []

        },

        // 获取后台反馈原因
        feedbackReasons: [],

        // 初始化数据
        loadData: function(){

            // 获取原因类型数据
            return feedbackOptionsServers.feedbackOptions().success(function(response){

                // 排序
                response = _.sortBy(response.reasons, 'sort');

                // 初始化下拉框
                ctrl.feedbackReasons = response;

                // 设置下拉默认展示
                ctrl.feedbackData.reason = ctrl.feedbackReasons[0].id;

                // 记录图片数组数字
                ctrl.picturesTotal = ctrl.picturesAry.length;

            }).error(errorHandling);
        },

        // 同步字数
        changeReasonsTotal: function(){

            if (ctrl.feedbackData.reasons){
                ctrl.reasonsTotal = ctrl.feedbackData.reasons.length;
            } else {

                // 解决文本框字数为0时 ，ctrl.reasonsTotal=0;
                ctrl.reasonsTotal = 0;

            }
        },

        // 获取图片
        getPictures: function(){
            // 剩余上传照片数量
            var totalPhoto = 3 - ctrl.picTotal;
            if (totalPhoto === 0) {
                return;
            }
            camera.getPicture(320, 320, 'feedbackPhoto', totalPhoto).success(function (imageData) {

                // 上传图片时，打开loading
                loading.open();

                if(Object.prototype.toString.call(imageData) !== '[object Array]'){
                    imageData = [imageData];
                }
                ctrl.picTotal = ctrl.picTotal + imageData.length;

                api.post('/appComment/uploadRecommendMultiplePicture', {param: imageData}).success(function (response) {

                    // 上传成功后返回的图片ID
                    ctrl.picturesAry = ctrl.picturesAry.concat(imageData);

                    // 上传成功后记录图片数组数字
                    ctrl.picturesTotal = ctrl.picturesAry.length;

                    // 记录上传后图片id
                    ctrl.feedbackData.picturesId = ctrl.feedbackData.picturesId.concat(response.pictureId);

                    // 关闭loading
                    loading.close();

                }).error(errorHandling).error(function(){
                    loading.close();
                    ctrl.picTotal = ctrl.picTotal - imageData.length;
                });

            }).error(errorHandling);

        },

        // 删除缩略图
        removeResizeImg: function(index){

            // 删除图片数组中对应的base64数据
            ctrl.picturesAry.splice(index, 1);

            // 删除图片数组中对应的base64数据中对应的id
            ctrl.feedbackData.picturesId.splice(index, 1);

            // 修改图片数量
            ctrl.picturesTotal = ctrl.picturesAry.length;

            ctrl.picTotal = ctrl.picTotal - 1;
        },

        submit: function(){

            loading.open();

            var parm = {
                reasonId: ctrl.feedbackData.reason,
                content: ctrl.feedbackData.reasons,
                mobile: ctrl.feedbackData.mobile,
                pics: ctrl.feedbackData.picturesId
            };

            // 校验手机号是否合法
            if(!validator.isMobile(parm.mobile) && parm.mobile !== '') {
                loading.close();
                toast.open($translate.instant('validator.mobile'));
                return;
            }

            // 提交反馈信息
            feedbackOptionsServers.submitFeedOpinion(parm).success(function(){

                // 提示成功
                toast.open($translate.instant("settings.successNotes"));
                $rootScope.goBack();

                // 清除已成功反馈的数据
                ctrl.feedbackData.reasons = '';
                ctrl.feedbackData.mobile = '';
                ctrl.feedbackData.picturesId = [];
                ctrl.picturesAry = [];
            })
            .error(errorHandling)
            .finally(function(){
                loading.close();
            });
        }
    });

    // 判断登录状态
    if (!APP_USER.id) {
        modals.login.open({
            params: {
                successCallback: function () {
                    ctrl.init();
                },
                cancelCallback: function () {
                    $rootScope.goBack();
                }
            }
        });
        return;
    }

    var deregistration = $scope.$on('$ionicView.beforeEnter', function () {

        ctrl.init();
        deregistration();

        $scope.$on('$ionicView.beforeEnter', function () {
            ctrl.refresh();
        });
    });

});
