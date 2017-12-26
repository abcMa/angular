/**
 * 热部署
 */
angular.module('app.services').factory('networkStatus', ["api", function(
    api
) {

    var newworkStatus = null;


    var networkStatusService = {

        // 初始化服务
        getNetType: function() {
            newworkStatus = window.navigator ? window.navigator.connection : null;

            if (newworkStatus && window.Connection) {
                var networkState = newworkStatus.type;

                if (networkState == Connection.CELL_4G || networkState == Connection.CELL_3G || networkState == Connection.CELL_2G || networkState == Connection.CELL) {
                    return 1;
                }else if(networkState == Connection.NONE) {
                    return 2;
                }

                return 0;
            }
        }
    };

    return networkStatusService;
}]);
