/**
 *
 */
angular.module('app.directives')

    .directive('onDrag', function () {

        var slider = {
            init: function (element, callback) {

                var touchStartEvent, touchMoveEvent, touchEndEvent;
                if (window.navigator.pointerEnabled) {
                    touchStartEvent = 'pointerdown';
                    touchMoveEvent = 'pointermove';
                    touchEndEvent = 'pointerup';
                } else if (window.navigator.msPointerEnabled) {
                    touchStartEvent = 'MSPointerDown';
                    touchMoveEvent = 'MSPointerMove';
                    touchEndEvent = 'MSPointerUp';
                } else {
                    touchStartEvent = 'touchstart';
                    touchMoveEvent = 'touchmove';
                    touchEndEvent = 'touchend';
                }

                var mouseStartEvent = 'mousedown';
                var mouseMoveEvent = 'mousemove';
                var mouseEndEvent = 'mouseup';


                var start = {};
                var delta = {};

                var events = {
                    handleEvent: function (event) {
                        switch (event.type) {
                            case touchStartEvent:
                            case mouseStartEvent:
                                this.start(event);
                                break;
                            case touchMoveEvent:
                            case mouseMoveEvent:
                                this.move(event);
                                break;
                            case touchEndEvent:
                            case mouseEndEvent:
                                this.end(event);
                                break;
                        }
                    },
                    start: function (event) {
                        if (!event.touches) {
                            return;
                        }

                        var touches = event.touches[0];

                        start = {
                            x: touches.pageX,
                            y: touches.pageY,
                            time: +new Date()
                        };

                        delta = {};

                        element.addEventListener(touchMoveEvent, this, false);
                        element.addEventListener(mouseMoveEvent, this, false);

                        element.addEventListener(touchEndEvent, this, false);
                        element.addEventListener(mouseEndEvent, this, false);

                        document.addEventListener(touchEndEvent, this, false);
                        document.addEventListener(mouseEndEvent, this, false);
                    },
                    move: function (event) {
                        if (!event.touches ||
                            event.touches.length > 1 ||
                            event.scale && event.scale !== 1) {
                            return;
                        }

                        var touches = event.touches[0];

                        delta = {
                            x: touches.pageX - start.x,
                            y: touches.pageY - start.y
                        };

                        callback(start, delta);
                    },
                    end: function (event) {
                        element.removeEventListener(touchMoveEvent, events, false);
                        element.removeEventListener(mouseMoveEvent, events, false);

                        element.removeEventListener(touchEndEvent, events, false);
                        element.removeEventListener(mouseEndEvent, events, false);

                        document.removeEventListener(touchEndEvent, events, false);
                        document.removeEventListener(mouseEndEvent, events, false);
                    }
                };

                element.addEventListener(touchStartEvent, events, false);
                element.addEventListener(mouseStartEvent, events, false);
            }
        };

        return {
            restrict: 'A',
            scope: false,
            link: function ($scope, $element, $attr) {
                slider.init($element[0], $scope.$eval($attr.onDrag));
            }
        };
    });
