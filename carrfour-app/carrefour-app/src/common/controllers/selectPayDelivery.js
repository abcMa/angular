angular.module('app.controllers').controller('selectPayDeliveryCtrl', function(
    $scope, $params, stateUtils, modals, checkoutService, loading, errorHandling, $translate, $timeout, $q,
    messageCenter, $ionicScrollDelegate
) {
    var ctrl = this;

    // 预定义配送方式
    var DELIVERY = {

        EXPRESSAGE: 13, // 快递
        PICKUP: 18, // 自提
        FASTER: 250000013 // 极速达
    };

    // var atEnum = {
    //     payment: {
    //         0: "online_payment",
    //         1: "payment_on_delivery"
    //     },
    //     delivery: {
    //         0: "home_delivery",
    //         1: "self_pick_up"
    //     }
    // };

    angular.extend(ctrl, stateUtils, {

        $scope: $scope,

        // atEnum: atEnum,

        DELIVERY: DELIVERY,

        consigneeId: $params.consigneeId,

        payMode: $params.payModeTypes,

        deliveryModes: $params.deliveryModes,

        selectedConsigneeId: $params.selectedConsigneeId,

        // 当前所选择配送方式是否是极速达
        // isFasterDelivery: false,

        // 当前所选择配送方式是否是快递
        // isExpressageDelivery: false,

        pickupes: {},

        pickupId: undefined,

        // 判断是否点击选则自提时间
        showTime: false,

        // 所选择的准时达数据项
        deliveryOntime: (function() {
            var selectedDeliveryMode = _.find($params.deliveryModes, {
                "selected": true
            });
            if (!selectedDeliveryMode) {
                return undefined;
            }
            return selectedDeliveryMode.id == DELIVERY.EXPRESSAGE ? $params.selectedDeliveryOntime : undefined;
        })(),

        // 所选择的自提数据项
        pickupTime: (function() {
            var selectedDeliveryMode = _.find($params.deliveryModes, {
                "selected": true
            });
            if (!selectedDeliveryMode) {
                return undefined;
            }
            return selectedDeliveryMode.id == DELIVERY.PICKUP ? $params.selectedDeliveryOntime : undefined;
        })(),

        // 处理后的供用户选择的准时达数据
        deliveryOntimeData: undefined,

        // 处理后的供用户选择的自提时间数据
        pickupOntimeData: undefined,

        // 缓存已选择的准时达数据链，当再一次打开时间选择器时，将其传入。
        deliveryOntimeSelecteds: undefined,

        // 缓存已选择的自提数据链，当再一次打开时间选择器时，将其传入。
        pickuptimeSelecteds: undefined,

        //pickview 防止多次出现
        pickviewLock: false,

        // 是否选择了支付方式
        isPaymodesSelected: function() {
            return _.some(ctrl.payMode, {
                'selected': true
            });
        },

        // 是否选择了配送方式
        isDeliveryModesSelected: function() {
            return _.some(ctrl.deliveryModes, {
                'selected': true
            });
        },

        // 选择的配送方式
        // 仅用于展示
        getCurrentDeliveryMode: function() {
            return _.find(ctrl.deliveryModes, {
                'selected': true
            });
        },

        //准时达的生鲜或非生鲜不可用
        deliveryModeUnused: 2,

        init: function() {

            // 初始化配送类型状态值
            // _.forEach(ctrl.deliveryModes, function (modeItem) {
            //     if (modeItem.selected) {
            //
            //         switch (modeItem.id) {
            //             case DELIVERY.EXPRESSAGE:
            //                 ctrl.isExpressageDelivery = true;
            //                 break;
            //             case DELIVERY.FASTER:
            //                 ctrl.isFasterDelivery = true;
            //                 break;
            //         }
            //     }
            // });

            // 加载 pickupes 数据
            var pickupesPromise = checkoutService.getPickupes(ctrl.selectedConsigneeId).success(function(data) {
                if (!data.length) {
                    var dm = _.find(ctrl.deliveryModes, {
                        "id": DELIVERY.PICKUP
                    });
                    if (dm) {
                        dm.status = 2;
                    }
                }
                ctrl.pickupes = data;
                ctrl.pickupId = $params.selectedPickupId;
            });

            // 加载准时达数据
            var deliveryOntimePromise = checkoutService.findDeliveryOntimes(ctrl.consigneeId)
                .success(function(ontimeData) {

                    _.forEach(ctrl.deliveryModes, function(modeItem) {
                        if (modeItem.id === DELIVERY.EXPRESSAGE && typeof ontimeData === "number") {
                            ctrl.deliveryModeUnused = ontimeData;
                            modeItem.deliveryModeUnused = ontimeData;
                            return;
                        } else {
                            modeItem.deliveryModeUnused = 2;
                        }

                        if (!_.isArray(ontimeData)) {
                            return;
                        } else {
                            ctrl.deliveryOntimeData = ctrl.analyticDeliveryTimes(ontimeData, DELIVERY.EXPRESSAGE);

                            //避免刷新已选准时达时间
                            if (!ctrl.deliveryOntime) {
                                ctrl.deliveryOntime = _.first(_.first(ontimeData).deliveryOntimeServerDetailVOs);
                            }
                        }
                    });
                });

            loading.open();
            $q.all([pickupesPromise, deliveryOntimePromise]).finally(function() {
                loading.close();
            });
        },

        //选择时间
        onClickSelect: function() {
            ctrl.showTime = true;
            ctrl.lastSelectedpickupId = ctrl.pickupId;
            ctrl.loadPickupTimesBySelectedId(DELIVERY.PICKUP);
        },
        //切换自提点
        onSelectChanged: function() {
            ctrl.showTime = false;
            if (ctrl.lastSelectedpickupId != ctrl.pickupId) {
                ctrl.loadPickupTimesBySelectedId(DELIVERY.PICKUP);
            }
        },

        // 加载\更新自提时间
        loadPickupTimesBySelectedId: _.throttle(function(deliveryId, pickViewShow) {
            loading.open();
            checkoutService.getPickupesTime(ctrl.pickupId)
                .success(function(ontimeData) {
                    // 计算滚动条高度
                    $ionicScrollDelegate.$getByHandle('confirmOrderScroll').scrollBottom(true);
                    ctrl.pickupOntimeData = ctrl.analyticDeliveryTimes(ontimeData, deliveryId);
                    if (!ctrl.pickupTime || ctrl.lastSelectedpickupId != ctrl.pickupId) {
                        ctrl.pickupTime = _.first(_.first(ontimeData).deliveryOntimeServerDetailVOs);
                        ctrl.pickuptimeSelecteds = undefined;
                    }
                    if (pickViewShow) {
                        return;
                    }
                    ctrl.goSelectpickuptime();
                }).finally(function() {
                    loading.close();
                });
        }, 1000),

        // pickview
        analyticDeliveryTimes: function(ontimeData, deliveryId) {
            if (!ontimeData) {
                return [];
            }
            // 将数据处理为可以交给 pickview 展示用的数据结构
            var showData = [],
                leftParenthesesText = $translate.instant('leftParentheses'),
                rightParenthesesText = $translate.instant('rightParentheses'),
                freightServiceFeeText = $translate.instant('checkout.freightServiceFee'),
                colonText = $translate.instant("colon");

            ontimeData.forEach(function(ontimeItem, index) {

                var weekName = '';

                if (ontimeItem.weekDayName) {
                    weekName = leftParenthesesText + ontimeItem.weekDayName + rightParenthesesText;
                }

                var subOntimesItemListData = ontimeItem.deliveryOntimeServerDetailVOs,
                    showItem = {
                        id: index,
                        text: window.PickerView ? ontimeItem.date + weekName : ontimeItem.date,
                        subtext: ontimeItem.weekDayName,
                        subItems: []
                    };

                if (subOntimesItemListData && subOntimesItemListData.length) {
                    subOntimesItemListData.forEach(function(subOntimesItemData, index) {

                        // 创建日期显示文本，用于在页面中展示
                        subOntimesItemData.showDate = ontimeItem.date + weekName + " ";

                        // 调整显示具体时间还是"任意时间"
                        subOntimesItemData.showDate +=
                            subOntimesItemData.showText ||
                            subOntimesItemData.fromTime + " - " + subOntimesItemData.thruTime;

                        // 将服务费用格式化为小数点后两位
                        subOntimesItemData.serverFee = parseFloat(subOntimesItemData.serverFee).toFixed(2);

                        // 加入配送日期
                        subOntimesItemData.date = ontimeItem.date;

                        // if (!ctrl.deliveryOntime) {
                        //     ctrl.deliveryOntime = subOntimesItemData;
                        // }

                        showItem.subItems.push({
                            id: subOntimesItemData.id,

                            // example："08:00 - 10:00"
                            text: subOntimesItemData.fromTime + " - " + subOntimesItemData.thruTime,

                            // example："服务费：2.00"
                            subtext: (function(deliveryId) {
                                if (deliveryId == DELIVERY.PICKUP) {
                                    return '';
                                } else if (deliveryId !== DELIVERY.PICKUP) {
                                    return freightServiceFeeText + colonText + subOntimesItemData
                                        .serverFee;
                                }
                            })(deliveryId),

                            // 保存原始数据
                            originalData: subOntimesItemData
                        });
                    });
                    showData.push(showItem);
                }
            });

            return showData;

        },

        onChangePayMode: function(mode) {
            ctrl.pickupId = undefined;
            // ctrl.isFasterDelivery = false;
            // ctrl.isExpressageDelivery = false;

            loading.open();

            checkoutService.getDeliverys(ctrl.consigneeId, mode.paymentModeType)
                .success(function(response) {
                    ctrl.deliveryModes = response.deliveryModes;

                    if (mode.paymentModeType == 2) {
                        checkoutService.getPickupes(ctrl.selectedConsigneeId).success(function(data) {
                            if (!data.length) {
                                var dm = _.find(ctrl.deliveryModes, {
                                    "id": DELIVERY.PICKUP
                                });
                                if (dm) {
                                    dm.status = 2;
                                }
                            }
                        });
                    }

                    checkoutService.findDeliveryOntimes(ctrl.consigneeId)
                        .success(function(ontimeData) {

                            _.forEach(ctrl.deliveryModes, function(modeItem) {
                                if (modeItem.id === DELIVERY.EXPRESSAGE && typeof ontimeData === "number") {
                                    ctrl.deliveryModeUnused = ontimeData;
                                    modeItem.deliveryModeUnused = ontimeData;
                                    return;
                                } else {
                                    modeItem.deliveryModeUnused = 2;
                                }
                            });

                        });

                })
                .finally(function() {
                    loading.close();
                });

            angular.forEach(ctrl.payMode, function(data, index, array) {
                data.selected = data === mode;
            });
        },

        onChangeDeliveryModes: function(mode) {
            if (mode.status !== 1 || mode.deliveryModeUnused !== 2) {
                return;
            }

            _.forEach(ctrl.deliveryModes, function(item) {
                item.selected = false;
            });

            mode.selected = true;
            switch (mode.id) {
                case DELIVERY.EXPRESSAGE: // 快递
                    // ctrl.isExpressageDelivery = true;
                    ctrl.pickupId = undefined;
                    ctrl.goSelectDeliveryOntime();
                    break;

                case DELIVERY.PICKUP: // 自提
                    // 给select设定一个默认值，避免出现ng-option的空行问题
                    if (!ctrl.pickupId) {
                        ctrl.pickupId = ctrl.pickupes[0].id;
                    }
                    ctrl.loadPickupTimesBySelectedId(DELIVERY.PICKUP, true);
                    break;

                case DELIVERY.FASTER: // 极速达
                    ctrl.pickupId = undefined;
                    // ctrl.isFasterDelivery = true;
                    break;
            }

            // if (currentMode != DELIVERY.PICKUP) {
            //     ctrl.pickupId = undefined;
            // }

            // if (currentMode != DELIVERY.FASTER) {
            //     ctrl.isFasterDelivery = false;
            // }
            //
            // if (currentMode != DELIVERY.EXPRESSAGE) {
            //     ctrl.isExpressageDelivery = false;
            // }

            // var payModeSelected = false;
            //
            // angular.forEach(ctrl.payMode, function (data) {
            //     if (data.selected) {
            //         payModeSelected = true;
            //     }
            // });

            // angular.forEach(ctrl.deliveryModes, function (data, index, array) {
            //     data.selected = data === mode;
            //
            //     //选择了一种配送方式
            //     if (data.selected && payModeSelected) {
            //         ctrl.isDeliveryModesSelected = true;
            //     }
            // });
        },

        getPickupNames: _.memoize(function(pickupId) {
            if (!pickupId) {
                return undefined;
            }

            var pickup = _.find(ctrl.pickupes, {
                id: pickupId
            });

            return pickup.name + ' ' + pickup.regoinName + pickup.address;
        }),

        onSumbit: function() {
            // 只有在快递配送方式和极速达下，才传入准时达数据
            var selectedTimes;
            switch (ctrl.getCurrentDeliveryMode().id) {
                case DELIVERY.EXPRESSAGE:
                    selectedTimes = ctrl.deliveryOntime;
                    break;
                case DELIVERY.PICKUP:
                    selectedTimes = ctrl.pickupTime;
                    break;
            }
            $params.selectedCallBack(ctrl.deliveryModes, ctrl.payMode, ctrl.pickupId, selectedTimes);
            modals.selectPayDelivery.close();
        },

        /**
         * 前往选择准时达（或生鲜达）
         */
        goSelectDeliveryOntime: _.throttle(function() {

            function successCallback(selecteds) {
                if (!selecteds || selecteds === 'cancel') {
                    return;
                }
                ctrl.deliveryOntimeSelecteds = selecteds;

                $timeout(function() {
                    ctrl.deliveryOntime = selecteds[selecteds.length - 1].originalData;
                });
            }

            function errorCallback(error) {
                console.info('PickerView: error', error);
            }

            var data = ctrl.deliveryOntimeData;

            if (data && data.length) {

                // 广播页面Tag
                messageCenter.publishMessage('AT.screen', {
                pageName: 'tunnel::step4_select_delivery_time'
                });

                if (window.PickerView) {
                    var options = {
                        level: 2,
                        doneButton: {
                            text: $translate.instant('popup.done')
                        },
                        cancelButton: {
                            text: $translate.instant('popup.cancel')
                        }
                    };

                    window.PickerView.show(data, options).then(successCallback, errorCallback);
                } else {
                    modals.selecter.open({
                        params: {
                            data: data,
                            selecteds: ctrl.deliveryOntimeSelecteds,
                            successCallback: successCallback,
                            options: {
                                title: $translate.instant('selectExpressageTime')
                            }
                        }
                    });
                }

            }
        }, 1000),

        /**
         * 前往选择自提
         */
        goSelectpickuptime: _.throttle(function() {

            // 防止多次出发pickview
            if (ctrl.pickviewLock) {
                return;
            }

            function successCallback(selecteds) {
                if (!selecteds || selecteds === 'cancel') {
                    ctrl.pickviewLock = false;
                    return;
                }
                ctrl.pickuptimeSelecteds = selecteds;

                $timeout(function() {
                    ctrl.pickupTime = selecteds[selecteds.length - 1].originalData;
                });
                ctrl.pickviewLock = false;
            }

            function errorCallback(error) {
                console.info('PickerView: error', error);
                ctrl.pickviewLock = false;
            }

            if (!ctrl.pickupOntimeData) {
                return;
            }
            var data = ctrl.pickupOntimeData;

            // 判断是否弹出pickview
            if (ctrl.showTime) {
                // pickview 上锁
                ctrl.pickviewLock = true;
                ctrl.showTime = false;

                // 广播页面Tag
                messageCenter.publishMessage('AT.screen', {
                    pageName: 'tunnel::step4_select_delivery_time'
                });

                if (window.PickerView) {
                    var options = {
                        level: 2,
                        doneButton: {
                            text: $translate.instant('popup.done')
                        },
                        cancelButton: {
                            text: $translate.instant('popup.cancel')
                        }
                    };

                    window.PickerView.show(data, options).then(successCallback, errorCallback);
                } else {
                    // pickview 解锁
                    ctrl.pickviewLock = false;
                    modals.selecter.open({
                        params: {
                            data: data,
                            selecteds: ctrl.pickuptimeSelecteds,
                            successCallback: successCallback,
                            options: {
                                title: $translate.instant('selectExpressageTime')
                            }
                        }
                    });
                }
            }

        }, 1000),

        onCancel: function() {
            modals.selectPayDelivery.close();
        },


        /**
         * 打开极速达文章
         */
        openFasterArticle: function() {
            modals.article.open({
                params: {
                    articleId: 250000030,
                    title: $translate.instant('checkout.selectPayDelivery.express')
                }
            });
        }
    });

    ctrl.init();
});
