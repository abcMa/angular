/**
 * 会员中心
 */
angular.module('app.controllers').controller('memberCenterCtrl', ["$scope", "loadDataMixin", "stateUtils", "errorHandling", "memberCenterService", "popup", "$state", "modals", "loading", "messageCenter", "$translate", function (
    $scope, loadDataMixin, stateUtils, errorHandling, memberCenterService, popup, $state, modals, loading, messageCenter, $translate
) {
    var ctrl = this;

    _.assign(ctrl, loadDataMixin, stateUtils, {
        $scope: $scope,

        // 条形码配置项
        barCodeOption: {
            width: 2,
            fontSize: 16,
            lineColor: "#000",
            height: 45,
            displayValue: false,
            background: "transparent"
        },

        isShowJsBarcode: !window.JsBarcode,

        loadData: function () {
            return memberCenterService.getInfo()
                .error(errorHandling).finally(function(){
                    loading.close();
                });
        },

        isShowMenu: false,
        onShowMoreClick: function (event) {
            event.stopImmediatePropagation();
            event.preventDefault();
            ctrl.isShowMenu = !ctrl.isShowMenu;
        },

        onViewClick: function () {
            if (ctrl.isShowMenu) {
                ctrl.isShowMenu = false;
            }
        },

        onUnbindClick: function () {
            popup.confirm('memberCenter.unbindAlert')
                .then(function (res) {
                    if (!res) {
                        return;
                    }
                    // 跳转解绑页面
                    var params = {
                        cardNumber: ctrl.data.cardNumber
                    };
                    $state.go("tabs.unbindMemberCard", params);
                });
        },

        onRegisterClick: function () {
            modals.registerMemberCard.open();
        },

        onBindClick: function () {
            $state.go("tabs.bindMemberCard");
        },

        onMemberInfoClick: function () {

            //会员卡信息
            $state.go("tabs.memberInfo");

        },

        onFreezedClick: function () {
            // 冻结积分规则
            $scope.modals.promptInfo.open({
                params: {
                    title: $translate.instant('freezedRuler.title'),
                    content: $translate.instant('freezedRuler.content')
                }
            });
        },

        onExpireClick: function () {
            // 过期积分说明
            $scope.modals.promptInfo.open({
                params: {
                    title: $translate.instant('expireRuler.title'),
                    content: $translate.instant('expireRuler.content')
                }
            });
        }
    });

    var deregistration = $scope.$on('$ionicView.afterEnter', function () {

        ctrl.init({
            showLoading: false
        });
        deregistration();

        // $scope.$on('$ionicView.afterEnter', function () {
        //     ctrl.refresh({
        //         emptyData: false,
        //         showLoading: false
        //     });
        // });

    });

    // 刷新会员中心
    messageCenter.subscribeMessage('memberCenter.refresh', function(){
        ctrl.refresh();
    });

}]);
