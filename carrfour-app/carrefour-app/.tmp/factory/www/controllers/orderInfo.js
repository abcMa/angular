angular.module('app.controllers').controller('orderInfoCtrl', ["$scope", "$state", "$stateParams", "loadDataMixin", "orderService", "stateUtils", "payService", "globalService", "$ionicScrollDelegate", "modals", "messageCenter", "$translate", "$timeout", "loading", "$interval", "errorHandling", "$ionicHistory", function (
    $scope, $state, $stateParams, loadDataMixin, orderService, stateUtils, payService, globalService,
    $ionicScrollDelegate, modals, messageCenter, $translate, $timeout, loading, $interval, errorHandling, $ionicHistory

) {

    var ctrl = this;

    // 禁止重复点击
    var lock = false;

    // 根据user session，
    var userSession = $stateParams.userSession;

    if (APP_CONFIG.os == "weixin" && !$scope.isWeixinBrowser) {
        APP_USER.userSession = userSession;
    }

    // 还原语言
    var lang = $stateParams.lang;

    if (APP_CONFIG.os == "weixin" && !$scope.isWeixinBrowser && lang && APP_CONFIG.language !== lang) {
        globalService.toggleLanguage(lang);
    }


    angular.extend(ctrl, loadDataMixin, stateUtils, {

        $scope: $scope,

        // 是否显示全部商品
        isShowAllItem: false,

        // 是否显示运费详情
        isShowFreightDetails: false,

        historyPrevPage: !!$ionicHistory.backView(),

        // 获取订单类型名称
        getOrderStatusName: function (orderStatus) {
            return $translate.instant('orderStatus.' + orderStatus);
        },

        // 点击切换展示运费详情
        toggleFreight: function () {
            ctrl.isShowFreightDetails = !ctrl.isShowFreightDetails;
            $timeout(function () {
                $ionicScrollDelegate.$getByHandle('orderInfoScroll').scrollBottom(true);
            }, 100);
        },

        //是否显示查询提货码按钮
        isFetchSinceCode: undefined,

        // 立即支付
        payNow: $stateParams.payNow === "true",

        // 下面两个参数是回调构造的？
        goPayment: $stateParams.goPayment ? $stateParams.goPayment : false,

        showPayInfo: $stateParams.showPayInfo ? $stateParams.showPayInfo : 0,

        // 查询我的提货码 点击后切换按钮
        params: {

            // 切换按钮
            lockSend: true,

            // 发送验证码倒计时
            timeDown: undefined,

            // 定时器ID
            interval: undefined

        },

        //查询提货码
        sedMessage: function() {

            //防止重复点击
            if(lock){
                return;
            }
            lock = true;

            //获取参数中的订单ID
            var orderId = $stateParams.id;

            if(!ctrl.params.timeDown){
                orderService.fetchSinceCode(orderId).success(function (data) {
                    if(!data.stateCode){
                        ctrl.params.timeDown = data;
                        ctrl.readySendTip();
                    }
                }).error(errorHandling).finally(function() {
                    lock = false;
                });
            }
        },

        // 查询我的提货码
        readySendTip: function() {

            // 切换按钮
            this.params.lockSend = false;

            //发送短信 启动倒计时
            checkSendTime();

            //查询我的提货码倒计时,倒计时结束解锁按钮
            function checkSendTime () {

                //开启定时器
                ctrl.params.interval = $interval(function () {

                    //判断剩余时间
                    if (ctrl.params.timeDown > 0) {
                        ctrl.params.timeDown--;
                    } else {

                        //取消定时器
                        $interval.cancel(ctrl.params.interval);

                        //倒计时结束解锁重新获取按钮 隐藏倒计时
                        ctrl.params.timeDown = undefined;
                        ctrl.params.interval = 0;

                        // 重置发送状态
                        resetSendSMS();

                    }
                }, 1000);
            }

            // 重置查询我的提货码发送状态
            function resetSendSMS() {

                //取消计时器
                $interval.cancel(ctrl.params.interval);

                //重置按钮
                ctrl.params.lockSend = true;

                // 解锁按钮
                lock = false;

                //重置倒计时
                ctrl.params.timeDown = undefined;

            }

        },

        /** 加载订单详情 */
        loadData: function () {

            // 判断是否是支付返回，showPayInfo 1，表示支付成功，跳到支付成功页，0表示支付失败，跳到支付中心
            var isShowPayInfo = parseInt(ctrl.showPayInfo);

            //获取参数中的订单ID
            var orderId = $stateParams.id;
            //订单Id不为空 加载订单
            if (orderId) {
                return orderService.info(orderId).success(function (data) {

                    // //订单状态名称
                    // data.orderStatusName = $translate.instant('orderStatus.' + data.orderStatus);
                    //
                    // //默认流程图 下单
                    // var step = 1;
                    //
                    // // 把后台状态'已复核'从前台隐藏掉
                    // if (data.orderStatus == 3) {
                    //     if (data.payType == 1) {
                    //         data.orderStatus = 1;
                    //     } else {
                    //         data.orderStatus = 2;
                    //     }
                    // }
                    //
                    // //处理流程图步骤
                    // switch (data.orderStatus) {
                    //     case 2:
                    //         step = 2;
                    //         break;
                    //     case 3:
                    //         //强制设定为4
                    //         //把后台状态'已复核'从前台隐藏掉
                    //         // data.orderStatusName = $translate.instant('orderStatus.' + 2);
                    //         if (data.payType == 1) {
                    //             step = 1;
                    //         } else if (data.payType == 2) {
                    //             step = 2;
                    //         }
                    //         break;
                    //     case 4:
                    //         if (data.payType == 1) {
                    //             step = 2;
                    //         } else if (data.payType == 2) {
                    //             step = 3;
                    //         }
                    //         break;
                    //     case 5:
                    //         if (data.payType == 1) {
                    //             step = 3;
                    //         } else if (data.payType == 2) {
                    //             step = 4;
                    //         }
                    //         break;
                    // }
                    // //已关闭订单处理
                    // if ((data.orderStatus == 7 || data.orderStatus == 6) && !data.payedTime) {
                    //     step = 2;
                    // }
                    //
                    // data.step = step;

                    // selected为已完成的进度点
                    _.forEach(data.processBarList, function (process) {
                        process.isFinish = process.selected;
                    });

                    // 找到当前进度点
                    var currentNode = _.findLast(data.processBarList, 'selected');
                    if (currentNode) {
                        currentNode.isCurrent = true;
                    }

                    // 如果是第一个并且为当前进行，那么他就不是完成状态
                    var firstNode = _.first(data.processBarList);
                    if (firstNode && firstNode.isCurrent) {
                        firstNode.isFinish = false;
                    }

                    // 如果是最后一个并且为当前进行，那么他就不是当前状态
                    var lastNode = _.last(data.processBarList);
                    if (lastNode && lastNode.isFinish) {
                        lastNode.isCurrent = false;
                    }


                    //是否点处于倒计时
                    if(data.sinceCodeRestTime){
                        ctrl.params.timeDown = data.sinceCodeRestTime;
                        ctrl.readySendTip();
                    }

                    // WAP支付返回后
                    if (ctrl.goPayment) {

                        if (isShowPayInfo) {
                            var params = {
                                orderId: orderId,
                                orderNumber: data.orderNumber,
                                price: data.payableAmount
                            };
                            modals.paymentOrderSuccess.open({
                                params: params
                            });

                        }else if(!isShowPayInfo) {
                            // 支付失败，返回支付中心
                            modals.onlinePayment.open({
                                params: {
                                    orderId: data.id,
                                    orderNumber: data.orderNumber,
                                    price: data.payableAmount,
                                    isOverseaseOrder: data.isOverseasShop,
                                    payNow: false
                                }
                            });
                        }
                    }

                }).error(errorHandling)
                .finally(function () {});
            }
        },

        // 支付订单
        paymentOrder: function () {
            modals.onlinePayment.open({
                params: {
                    orderId: ctrl.data.id,
                    orderNumber: ctrl.data.orderNumber,
                    price: ctrl.data.payableAmount,
                    isOverseaseOrder: ctrl.data.isOverseasShop,
                    newUrl: window.location.href,
                    payNow: false
                }
            });
        }
    });

    //直接打开onlinePayment
    if(ctrl.payNow && !ctrl.goPayment){
       orderService.info($stateParams.id).success(function (data) {
         if(data.isPayable === true){
           modals.onlinePayment.open({
               params: {
                   orderId: data.id,
                   orderNumber: data.orderNumber,
                   price: data.payableAmount,
                   isOverseaseOrder: data.isOverseasShop,
                   newUrl: window.location.href
               }
           });
         }
       });
    }

    $timeout(function () {
        $scope.$broadcast('$ionicHeader.align');
    });

    $scope.$on('$ionicView.afterEnter',function () {
        // 广播页面Tag
        messageCenter.publishMessage('AT.screen', {
            pageName: 'tunnel::step8_order_details'
        });
    });

    var deregistration = $scope.$on('$ionicView.afterEnter', function () {
        ctrl.init();
        deregistration();

        $scope.$on('$ionicView.afterEnter', function () {
            ctrl.init();
        });
    });

    //订阅支付成功消息 刷新页面
    messageCenter.subscribeMessage('pay.success', function () {
        ctrl.refresh();
    }, $scope);
}]);
