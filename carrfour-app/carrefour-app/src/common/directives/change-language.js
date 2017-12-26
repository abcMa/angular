/**
 * 切换中英文指令 检测到当前为英文时 添加一个class 解决样式问题
 */
angular.module('app.directives').directive('changeLanguage',function($translate) {

    return {
        restrict: 'A',
        link: function($scope, $el, $attrs, m) {

            // 检测当前语言是否添加class
            toggleClass();

            // 切换语言检测是否需要添加class
            $el.find('.toggle-language').on('click',function() {
                toggleClass();
            });

            function toggleClass() {
                if(APP_CONFIG.language == 'en') {
                    $el.addClass('lang-en');
                }else {
                    if($el.hasClass('lang-en')) {
                        $el.removeClass('lang-en');
                    }
                }
                $('title').text($translate.instant('title'));
            }
        }
    }


});
