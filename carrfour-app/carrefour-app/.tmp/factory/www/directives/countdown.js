/**
 * 倒计时，最高支持天单位。
 *
 * 该指令会替换所在元素为如下结构：
 *
 * ```HTML
 * <div class="countdown">
 *   <span class="countdown-item countdown-item-text countdown-is-end">已结束</span>
 *   <span class="countdown-item countdown-item-text countdown-not-started">未开始</span>
 *   <div class="countdown-time-cont">
 *     <span class="countdown-item countdown-item-day">10</span>
 *     <span class="countdown-item countdown-item-day-text">天</span>
 *     <span class="countdown-item countdown-item-hour">10</span>
 *     <span class="countdown-item countdown-item-colon countdown-item-colon-hour">:</span>
 *     <span class="countdown-item countdown-item-minute">10</span>
 *     <span class="countdown-item countdown-item-colon">:</span>
 *     <span class="countdown-item countdown-item-second">10</span>
 *   </div>
 * </div>
 * ```
 *
 * @param starttime(?) {String<Date>} 倒计时开始时间
 * @param endtime(?) {String<Date>} 倒计时结束时间
 * @param duration(?) {Integer} 倒计时时长，以毫秒为单位。如果只设置开始时间而没有结束时间，则根据该参数计算出结束时间；如果也没有开始时间，则以当前时间为开始时间。
 * @param autoHideDay(?) {Boolean} 是否在天数为 0 时自动隐藏相关元素
 * @param autoHideHour(?) {Boolean} 是否在小时数为 0 时自动隐藏相关元素
 * @param hideState(?) {Boolean} 是否显示状态文本
 * @param onlyHour(?) {Boolean} 是否只按小时显示倒计时, 当剩余时间超过1天时，不显示天，以24+小时展示
 *
 * @example
 * <!-- 设置一个立即开始的二十秒倒计时 -->
 * <cm-countdown duration="20000"></div>
 * <!-- 设置一个自指定时间开始的二十秒倒计时 -->
 * <cm-countdown starttime="2015-05-17 20:47:23" duration="20000"></div>
 * <!-- 设置一个自指定时间开始并在指定时间结束的倒计时 -->
 * <cm-countdown starttime="2015-05-17 20:47:23" endtime="2015-05-17 20:47:43"></div>
 */
angular.module('app.directives')
    .directive('cmCountdown', ["$interval", function factory($interval) {
        var SECONDS = 1000,
            MINUTES = SECONDS * 60,
            HOURS   = MINUTES * 60,
            DAYS    = HOURS * 24;

        return {
            restrict: 'EA',

            replace: true,
            transclude: true,
            template: [
                '<div class="countdown">',
                    '<span class="countdown-item countdown-item-text countdown-is-end">已结束</span>',
                    '<span class="countdown-item countdown-item-text countdown-not-started">未开始</span>',
                    '<div class="countdown-time-cont">',
                        '<span class="countdown-item countdown-item-day"></span>',
                        '<span class="countdown-item countdown-item-day-text">天</span>',
                        '<span class="countdown-item countdown-item-hour"></span>',
                        '<span class="countdown-item countdown-item-colon countdown-item-colon-hour">:</span>',
                        '<span class="countdown-item countdown-item-minute"></span>',
                        '<span class="countdown-item countdown-item-colon">:</span>',
                        '<span class="countdown-item countdown-item-second"></span>',
                    '</div>',
                '</div>'
            ].join(''),

            scope: {
                onEnd: '&'
            },

            link: function($scope, el, attrs) {
                var isEndEl = el.find('.countdown-is-end'),
                    notStartedEl = el.find('.countdown-not-started'),
                    timeContEl = el.find('.countdown-time-cont'),

                    dayEl = el.find('.countdown-item-day'),
                    dayTextEl = el.find('.countdown-item-day-text'),
                    hourEl = el.find('.countdown-item-hour'),
                    hourColonEl = el.find('.countdown-item-colon-hour'),
                    minuteEl = el.find('.countdown-item-minute'),
                    secondEl = el.find('.countdown-item-second'),

                    isShowIsEndEl = true,
                    isShowNotStartedEl = true,
                    isShowDayEl = true,
                    isShowHourEl = true,
                    isRunEndEvent = false,

                    duration = parseInt(attrs.duration, 10),

                    start = parseTime(attrs.starttime),
                    end = parseTime(attrs.endtime),

                    isAutoHideDay = attrs.autoHideDay === 'true',
                    isAutoHideHour = attrs.autoHideHour === 'true',
                    isHideState = attrs.hideState === 'true',
                    isOnlyHour = attrs.onlyHour === 'true',

                    interval;

                if ( !(start && start.isValid()) ) {
                    start = moment();
                }

                if ( duration && !(end && end.isValid()) ) {
                    end = moment(start + duration);
                }

                hideNotStartedEl();
                hideIsEndEl();

                refresh();

                interval = setInterval(refresh, 1000);

                $scope.$on('$destroy', function() {
                    clearInterval(interval);
                });

                function parseTime(timeStr) {
                    var parser = [
                        function(timeStr) {
                            return moment(timeStr, 'YYYY-MM-DD HH:mm:ss', true);
                        },
                        function(timeStr) {
                            return moment(timeStr, 'YYYY-MM-DD HH:mm', true);
                        },
                        function(timeStr) {
                            return moment(timeStr, 'YYYY-MM-DD', true);
                        },
                        function(timeStr) {
                            return moment(Number(timeStr));
                        }
                    ];

                    for (var i = 0; i < parser.length; i++) {
                        var m = parser[i](timeStr);
                        if (m.isValid()) {
                            return m;
                        }
                    }

                    return undefined;
                }

                function refresh() {
                    var now = moment();

                    // 未开始
                    if (now < start) {
                        ionic.requestAnimationFrame(function() {
                          showNotStartedEl();
                        });
                    }
                    // 已结束
                    else if (now > end) {
                        ionic.requestAnimationFrame(function() {
                          showIsEndEl();
                        });

                        if (!isRunEndEvent) {
                            $scope.onEnd();
                            isRunEndEvent = true;
                        }

                        clearInterval(interval);
                    }
                    // 进行中
                    else {
                        var diff = end.diff(now);
                        var day;
                        if(!isOnlyHour){
                            day = Math.floor(diff / DAYS);
                            diff = diff % DAYS;
                        }

                        var hour = Math.floor(diff / HOURS);
                        diff = diff % HOURS;
                        var minute = Math.floor(diff / MINUTES);
                        diff = diff % MINUTES;
                        var second = Math.floor(diff / SECONDS);

                        diff = diff % HOURS;

                        ionic.requestAnimationFrame(function() {
                            hideIsEndEl();
                            hideNotStartedEl();

                            if(!isOnlyHour){ dayEl.text(day); }

                            hourEl.text(hour < 10 ? '0' + hour : hour);
                            minuteEl.text(minute < 10 ? '0' + minute : minute);
                            secondEl.text(second < 10 ? '0' + second : second);

                            if (day > 0) { if (day === 1) { showDayEl(); } }
                            else if(isAutoHideDay) {
                                hideDayEl();
                            }

                            if (hour > 0) { if (hour === 1) { showHourEl(); } }
                            else if(isAutoHideHour) { hideHourEl(); }
                        });
                    }
                }

                function hideDayEl() {
                    if (isShowDayEl === true) {
                        dayEl.hide();
                        dayTextEl.hide();
                        isShowDayEl = false;
                    }
                }

                function showNotStartedEl() {
                    if (isHideState) return;
                    if (isShowNotStartedEl === false) {
                        notStartedEl.show();
                        timeContEl.hide();
                        isShowNotStartedEl = true;
                    }
                }

                function showIsEndEl() {
                    if (isHideState) return;
                    if (isShowIsEndEl === false) {
                        isEndEl.show();
                        timeContEl.hide();
                        isShowIsEndEl = true;
                    }
                }

                function hideIsEndEl() {
                    if (isShowIsEndEl === true) {
                        isEndEl.hide();
                        timeContEl.show();
                        isShowIsEndEl = false;
                    }
                }

                function hideNotStartedEl() {
                    if (isShowNotStartedEl === true) {
                        notStartedEl.hide();
                        timeContEl.show();
                        isShowNotStartedEl = false;
                    }
                }

                function showDayEl() {
                    if (isShowDayEl === false) {
                        dayEl.show();
                        dayTextEl.show();
                        isShowDayEl = true;
                    }
                }

                function hideHourEl() {
                    if (isShowHourEl === true) {
                        hourEl.hide();
                        hourColonEl.hide();
                        isShowHourEl = false;
                    }
                }

                function showHourEl() {
                    if (isShowHourEl === false) {
                        hourEl.show();
                        hourColonEl.show();
                        isShowHourEl = true;
                    }
                }
            }
        };
    }]);
