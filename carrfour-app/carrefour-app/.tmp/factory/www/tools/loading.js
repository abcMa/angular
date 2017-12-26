/**
 * 等待消息的提示框
 */
angular.module('app.services').factory('loading', ["toast", function(
    toast
) {
    var LOADING_ICON = '<ion-spinner icon="ios"></ion-spinner>',

        loadingToast = new toast();

    return {
        /**
         * 打开等待提示框
         *
         * @param text {String} 提示文本
         */
        open: function(customOptions) {
            customOptions = loadingToast.processingOptions.apply(loadingToast, arguments);

            var template = angular.element('<div class="toast-loading"></div>');

            // add loading icon
            template.append('<div class="toast-loading-icon">' + LOADING_ICON + '</div>');

            // add text
            if (customOptions && customOptions.template) {
                template.append('<div class="toast-loading-text">' + customOptions.template + '</div>');
            }

            var loadingOptions = {
                template: template,
                position: 'center',
                offset: 0,
                duration: -1,
                delay: 300,
                penetrate: false
            };

            loadingToast.open(customOptions, loadingOptions);
        },

        /**
         * 关闭等待提示框
         */
        close: function() {
            loadingToast.close();
        }
    };
}]);
