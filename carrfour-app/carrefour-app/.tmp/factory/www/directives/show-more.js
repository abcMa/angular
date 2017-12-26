/**
 * 商品清单列表收起时的处理
 */
angular.module('app.directives').directive('showMore', ["$ionicScrollDelegate", function factory($ionicScrollDelegate) {

    //是否收起更多
    var hideMore = false;

    return {
        restrict: 'A',
        scope: false,
        link: function($scope, $el, $attrs) {
            hideMore = JSON.parse($attrs.hideMore);
            //操作元素隐藏显示
            showMoreOption($el);
            //添加展开、收起点击事件
            $el.find('.info-list-more').on('click',function() {

                //修改状态
                hideMore = !hideMore;
                //操作元素隐藏显示
                showMoreOption($el);
            });
        }
    };

    /**
     * 隐藏、显示元素
     */
    function showMoreOption(el) {
        var $infolist = el.find('.info-list');
        if(hideMore) {
            if($infolist.hasClass('max-list')) {
                $infolist.removeClass('max-list')
            }
            el.find('.list-down').hide();
            el.find('.list-up').show();
        }else {
            $infolist.addClass('max-list');
            offsetTop = $infolist.offset().top;
            el.find('.list-down').show();
            el.find('.list-up').hide();
        }

        $(window).resize();
    }
}]);
