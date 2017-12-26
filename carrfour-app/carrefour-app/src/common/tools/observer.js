/**
 * 模块监察器
 *
 * 当绑定的DOM元素进入视口时触发广播
 *
 */
angular.module('app.directives')

.factory('observer', function ($document, throttle) {

    // 指令自增索引
    var count = 0;

    // 所有需要监听的滚动区
    var scrollMap = {};

    var clientHeight = $document[0].documentElement.clientHeight;
    var clientWidth = $document[0].documentElement.clientWidth;
    window.addEventListener('resize', function () {
        clientHeight = $document[0].documentElement.clientHeight;
        clientWidth = $document[0].documentElement.clientWidth;
    });

    // 添加滚动监听
    function addScrollHandler(scrollPanel, params) {
        var key = scrollPanel[0].$$hashKey;
        if (!key) {
            console.warn('scrollPanel dosen\' have $$hashKey , will use timeStamp.');
            key = scrollPanel[0].$$hashKey = new Date().getTime();
        }
        var scrollDelegate = scrollMap[key];
        if (scrollDelegate) {
            scrollDelegate.attributes[params.id] = params;
            scrollDelegate.length++;
        } else {
            // 滚动处理
            var scrollHandler = function () {
                for (var id in scrollDelegate.attributes) {
                    var params = scrollDelegate.attributes[id];
                    if (isInView(params.$element, params.preLoadHorizon, params.preLoadVertical)) {
                        delete scrollDelegate.attributes[id];
                        scrollDelegate.length--;

                        publish(params.$element);

                        // 滚动区内所有图片已加载时，不再监听滚动
                        if (scrollDelegate.length === 0) {
                            scrollPanel.off('scroll', scrollDelegate.handler);
                            delete scrollMap[key];
                        }
                    }
                }
            };

            scrollDelegate = {
                scrollPanel: scrollPanel,
                attributes: [params],
                length: 1,
                handler: throttle.createHandler(scrollHandler, 100, 200)
            };
            scrollPanel.on('scroll', scrollDelegate.handler);
            scrollMap[key] = scrollDelegate;
        }
    }

    // // 检查元素是否在可视区垂直高度内
    function isInView($element, preLoadHorizon, preLoadVertical) {
        var imageRect = $element[0].getBoundingClientRect();
        var imagePos = {};
        imagePos.top = imageRect.top - preLoadVertical;
        imagePos.bottom = imageRect.bottom + preLoadVertical;
        imagePos.left = imageRect.left - preLoadHorizon;
        imagePos.right = imageRect.right + preLoadHorizon;
        // 在视口上面
        if (imagePos.bottom <= 0) {
            return false;
        }

        // 在视口下面
        if (imagePos.top >= clientHeight) {
            return false;
        }

        // 在视口左边
        if (imagePos.right <= 0) {
            return false;
        }

        // 在视口右边
        if (imagePos.left >= clientWidth) {
            return false;
        }

        return true;

    }

    function publish($element) {
        for (var i = 0; i < $element.$observer.length; i++) {
            $element.$observer[i].apply(null);
        }
        // 触发完成后全部清理
        $element.$observer = [];
    }

    return {
        subscribe: function ($element, listener) {
            var scrollPanel = $element.parents('.ionic-scroll').eq(0);
            // 载入区为一倍屏幕范围
            var preLoadHorizon = clientWidth;
            var preLoadVertical = clientHeight;

            if (!$element.$observer) {
                $element.$observer = [];
            }
            $element.$observer.push(listener);

            if (isInView($element, preLoadHorizon, preLoadVertical)) {
                publish($element);
            } else {
                addScrollHandler(scrollPanel, {
                    id: count++,
                    $element: $element,
                    preLoadHorizon: preLoadHorizon,
                    preLoadVertical: preLoadVertical
                });
            }

            // 元素上绑定的事件会在触发一次之后清理
            // 如需手动删除事件可使用这个方法。
            return function () {
                var indexOfListener = $element.$observer.indexOf(listener);
                if (indexOfListener !== -1) {
                    $element.$observer.splice(indexOfListener, 1);
                }
            };
        }
    };
});
