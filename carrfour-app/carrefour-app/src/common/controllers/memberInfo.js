angular.module('app.controllers').controller('memberInfoCtrl', function (
    $rootScope, $scope, loadDataMixin, memberCenterService, errorHandling, loading, modals, toast, $translate, dateFilter, messageCenter
) {

    var ctrl = this;

    _.assign(ctrl, loadDataMixin, {

        $scope: $scope,

        formData: {
            sex: "1",
            birthday: "1900-01-01"
        },

        // 加载数据
        loadData: function(){

            // 获取会员信息
            return memberCenterService.getMemberInfo().success(function(data){
                // 日期补0
                if(data.birthday){
                    var birthdayArry = data.birthday.split("-");
                    for(var i = 0; i <= birthdayArry.length; i++){
                        if(/^\d$/.test(birthdayArry[i])){
                            birthdayArry[i] = "0" + birthdayArry[i];
                        }
                    }
                    data.birthday = birthdayArry.join("-");
                }
                _.assign(ctrl.formData, data);
            }).error(errorHandling).error(function(){
                loading.close();
            });

        },

        isName: function(text){
            var regexp = /[\|\~|\~|\！|\@|\#|\￥|\%|\…|\&|\*|\（|\）|\—|\+|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\>|\/|\|1|2|3|4|5|6|7|8|9|0|！|@|#|¥|%|……|&|*|（|）|-|——|=|+|【|】|「|」|；|：|‘|“|”|，|。|／|《|》|？|～|·|\?]/g;
            if(text){
                ctrl.formData.name = text.replace(regexp, '');
            }
        },

        // 跳转更换手机号
        editMoblie: function(){
            angular.element(document).find('input').blur();
            modals.editMemberCardMoblie.open({
                params: {
                    callback: function () {
                        ctrl.refresh();
                    }
                }
            });
        },

        // 更改生日
        onSelectBirthday: function () {

            if (APP_CONFIG.os === 'weixin') {
                return;
            }
            loading.open();
            if (!window.plugins || !window.plugins.datePicker) {
                loading.close();
                toast.open("datePicker is not defined");
                return;
            }

            var options = {
                date: ctrl.formData.birthday,
                minDate: new Date('1900-01-01'),
                maxDate: new Date(),
                mode: 'date',
                doneButtonLabel: $translate.instant('datePicker.doneButtonLabel'),
                cancelButtonLabel: $translate.instant('datePicker.cancelButtonLabel'),
                titleText: $translate.instant('datePicker.titleText'),
                cancelText: $translate.instant('datePicker.cancelText'),
                todayText: $translate.instant('datePicker.todayText'),
                nowText: $translate.instant('datePicker.nowText'),
                okText: $translate.instant('datePicker.okText'),
                allowOldDates: false,
                allowFutureDates: false,
                is24Hour: true,
                locale: APP_CONFIG.language
            };

            window.datePicker.show(options, function (date) {
                if (!_.isDate(date)) {
                    loading.close();
                    return;
                }
                ctrl.formData.birthday = dateFilter(date, "yyyy-MM-dd");
                $scope.$apply();
            });
            loading.close();

        },

        // 保存会员信息
        onSubmit: function(){

            loading.open();
            memberCenterService.modifyMemberInfo(ctrl.formData).success(function(){
                $rootScope.goBack();
                loading.close();
                messageCenter.publishMessage('memberCenter.refresh');
                toast.open($translate.instant('memberInfo.success'));
            }).error(errorHandling).error(function(){
                loading.close();
            });

        }
    });

    var deregistration = $scope.$on('$ionicView.beforeEnter', function () {
        ctrl.init();
        deregistration();
    });

});
