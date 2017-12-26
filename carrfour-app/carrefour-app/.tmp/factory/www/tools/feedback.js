/**
 * app引导好评去appstore、意见反馈页面
 */
angular.module('app.services').factory('feedbackService', ["$rootScope", "localStorage", "messageCenter", "$state", "modals", "$translate", "errorHandling", "globalService", "api", function(
    $rootScope, localStorage, messageCenter, $state, modals, $translate, errorHandling, globalService, api
) {

    // 初始化数据
    var feedback;
    var initalization = function() {
        feedback = localStorage.get('feedback', {
            version: APP_CONFIG.appVersion, // 版本号
            startingTotal: 1, // 启动次数
            payOrderTotal: 0, // 支付次数
            isAlreadyAlert: true, // 是否允许弹窗
            lastOpenTime: moment()
        });
        localStorage.set('feedback', feedback);
    };

    var isAlertIndexPage = false;

    /**
     * 判断是否记录有效启动次数
     */
    var getOpenTimeTotal = function() {

        // 是否大于24小时
        var isGreaterDate = moment(feedback.lastOpenTime).add(24, 'h').isBefore();

        // 记录当前时间为最后的时间
        if (isGreaterDate) {

            // 累计启动次数
            feedback.startingTotal++;

            // 记录最后次访问时间
            feedback.lastOpenTime = moment();

            // 记录到localStory
            localStorage.set('feedback', feedback);

        }

    };

    /**
     * 记录成功支付订单次数
     */
    var successPayOrder = function() {

        // 累计成功支付订单次数
        feedback.payOrderTotal++;

        // 记录到localStory
        localStorage.set('feedback', feedback);

        if(feedback.payOrderTotal >= 2){
            isAlertAssessAlert();
        }

    };

    /**
     * 检测是否弹窗
     */
     var isAlertAssessAlert = function () {

         // 是否弹出了热部署,是的话不弹出引导好评
         if(isAlertIndexPage){
             return;
         }

         // 已经弹出过时跳出
         if (!feedback.isAlreadyAlert) {
             return;
         }

         // 当有效启动数大于等于5或成功致富订单次数大于等于2时弹出
         if (feedback.startingTotal >= 5 || feedback.payOrderTotal >= 2) {

             // 检测此版本后台是否允许弹窗，并获取弹出文本信息
             var isAlertVersions = globalService.isAlertVersions().success(function(response) {

                 if (response.open) {

                     // 如果允许弹出，弹出app评价弹框，并传入弹出文本信息
                     alertAssessAlert(response);

                     // 重置数据
                     feedback = {
                         version: APP_CONFIG.appVersion, // 版本号
                         startingTotal: 0, // 启动次数
                         payOrderTotal: 0, // 支付次数
                         isAlreadyAlert: false, // 是否允许弹窗
                         lastOpenTime: ''
                     };
                     localStorage.set('feedback', feedback);

                 } else {

                     // 如果不允许弹，跳出
                     return;

                 }

             }).error(errorHandling);
         }

     };

    /**
     * 弹出引导评价弹框
     */
    var alertAssessAlert = function(alertData) {
        document.addEventListener("deviceready", onDeviceReady, false);

        function onDeviceReady() {

            function onConfirm(buttonIndex) {

                // 统计去appStore的数量
                api.get('/appComment/statistics/open');

                switch (buttonIndex) {
                    case 1:

                        // 统计去appStore的数量
                        api.get('/index/getComeIndex');

                        // 跳转appstore评价
                        window.open("http://itunes.apple.com/WebObjects/MZStore.woa/wa/viewContentsUserReviews?id=1062816186&pageNumber=0&sortOrdering=2&type=Purple+Software&mt=8");
                        break;

                    case 3:

                        // 统计去吐槽，意见反馈页面的数量
                        api.get('/appComment/statistics/bad ');

                        // 关闭订单成功支付页
                        modals.paymentOrderSuccess.close();

                        // 跳转意见反馈
                        $state.go('tabs.feedbackOptions');
                        break;

                    default:
                        break;
                }
            }

            navigator.notification.confirm(
                '',
                onConfirm,
                alertData.title, [
                    alertData.goodComment,
                    alertData.againUsed,
                    alertData.recommend
                ]
            );

        }
    };

    return {
        init: function() {

            /**
             * 非ios跳出
             */
            if (APP_CONFIG.os !== 'ios') {
                return;
            }

            /**
             * 加载初始化数据
             */
            initalization();

            /**
             * 监听是否弹出了热部署
             */
            messageCenter.subscribeMessage('alert.indexPage', function(){
                isAlertIndexPage = true;
            });

            /**
             * 判断是否同一个版本，不是同一版本则重置当前数据
             */
            if (feedback.version !== APP_CONFIG.appVersion) {
                initalization();
            }

            /**
             * 监听清除缓存，清除缓存后初始化数据
             */
            messageCenter.subscribeMessage('localStorage.clean', initalization);

            /**
             * 运行启动次数
             */
            getOpenTimeTotal();

            /**
             * 监听启动时点
             */
            document.addEventListener("deviceready", function() {
                setTimeout(getOpenTimeTotal, 0);
            }, false);

            /**
             * 当设备从后台唤起时，重新检测是否需要弹框
             */
            document.addEventListener("resume", function() {
                setTimeout(getOpenTimeTotal, 0);
            }, false);

            /**
             * 监听成功支付
             */
            messageCenter.subscribeMessage('pay.success', successPayOrder);

            /**
             * 监听进入用户中心
             */
            messageCenter.subscribeMessage('enter.userPage', isAlertAssessAlert);

        }
    };
}]);
