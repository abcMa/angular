/**
 * 结算中心--增值税发票开具说明
 */
angular.module('app.controllers').controller('invoiceCtrl', ["$scope", "$params", "modals", "toast", "globalService", "$translate", "messageCenter", "utils", "$timeout", function (
    $scope, $params, modals, toast, globalService, $translate, messageCenter, utils, $timeout
) {

    var lastInput = $params.data.taxpayerCode;
    _.assign(this, {

        data: angular.extend({
            // 是否需要发票
            status: 0,
            // 发票类型
            type: 1,
            // 发票抬头
            title: '',
            // 纳税人编号
            taxpayerCode: '',
            // 发票类别
            invoiceCategory: 0,
        }, $params.data),

        // 发票类别
        invoiceCategorys: $params.invoiceCategorys,

        placeholder: {
            1: {
                title: $translate.instant('checkout.invoice.placeholder.person'),
                taxpayerCode: $translate.instant('checkout.invoice.placeholder.taxpayerCode')
            },
            2: {
                title: $translate.instant('checkout.invoice.placeholder.company'),
                taxpayerCode: $translate.instant('checkout.invoice.placeholder.taxpayerCode')
            }
        },

        // 48~57  0~9
        // 65~90  A~Z
        onTaxpayerCodeChange: function () {
            this.data.taxpayerCode = this.data.taxpayerCode.toUpperCase();
            if (_.some(this.data.taxpayerCode, function (char) {
                    var code = char.charCodeAt(0);
                    return !((code >= 48 && code <= 57) || (code >= 65 && code <= 90));
                })) {
                this.data.taxpayerCode = lastInput;
            }
            lastInput = this.data.taxpayerCode;
        },

        //选择是否开发票
        chooseInvoice: function (status) {
            this.data.status = status;
            $timeout(function () {
                utils.getScrollDelegateByName('invoiceScroll').resize();
            });
        },
        //选择发票类型
        chooseInvoiceType: function (type) {
            this.data.type = type;
            $timeout(function () {
                utils.getScrollDelegateByName('invoiceScroll').resize();
            });
        },

        /**
         * 增值税发票开具说明
         */
        openInvoiceInstruction: function () {
            // 获取发票说明文章
            globalService.getArticleInfo('invoice').success(function (data) {
                modals.invoiceInstruction.articleInfo = data;
                modals.invoiceInstruction.title = $translate.instant('checkout.invoice.invoiceArticle');
                modals.invoiceInstruction.open();
            });

        },

        /**
         * 纳税人编号填写说明
         */
        openTaxcodeInstruction: function () {
            // 获取发票说明文章
            globalService.getArticleInfo('taxcode').success(function (data) {
                modals.invoiceInstruction.articleInfo = data;
                modals.invoiceInstruction.title = $translate.instant('checkout.invoice.invoiceArticle1');
                modals.invoiceInstruction.open();
            });
        },

        // 提交发票
        submit: function () {
            var data = this.data;

            // 数据清理
            data.title = _.trim(data.title);

            // 数据校验
            if (data.status == 1) {

                if (_.isEmpty(data.title)) {
                    toast.open($translate.instant('checkout.invoice.needTitle'));
                    return;
                }

                if (this.data.type == 2) {
                    var tpcLen = data.taxpayerCode.length;
                    if (tpcLen != 15 && tpcLen != 18 && tpcLen != 20) {
                        toast.open($translate.instant('checkout.invoice.needTaxpayCode'));
                        return;
                    }
                } else {
                    this.data.taxpayerCode = "";
                }

                // 类别
                // 只有在存在可选发票类别时才判断
                if (data.invoiceCategory === 0 && this.invoiceCategorys.length > 0) {
                    toast.open($translate.instant('checkout.invoice.invoiceTips'));
                    return;
                }
            }


            // 提交数据
            $params.callback(data);
            $scope.modals.invoice.close();
        }
    });
    // 广播页面Tag
    messageCenter.publishMessage('AT.screen', {
        pageName: 'tunnel::step6_invoice'
    });
}]);
