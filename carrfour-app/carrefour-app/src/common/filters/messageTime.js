/**
 * 消息中心所显示的消息日期格式化过滤器
 */
angular.module('app.filters').filter('messageTime',function() {
	  return function(time) {
        var nowDay = moment().startOf('day'),
            timeDay = moment(time).startOf('day');

        time = moment(time);

        if (timeDay.valueOf() === nowDay.valueOf()) {
            return time.format('HH:mm');
        }
        else {
            return time.format('YYYY-MM-DD');
        }
	  };
});
