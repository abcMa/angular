/**
 * 热部署
 */
angular.module('app.services').factory('appleAdvertising', function(
    api
) {
    
    var advertising = null;


    var appleAdvertising = {

        idfa: "",

        // 初始化服务
        gotIdfaString: function() {
            advertising = window.plugins ? window.plugins.AppleAdvertising : null;
           
            if (advertising) {
                advertising.getIDFA(function(res){
                    appleAdvertising.idfa = res;
                });
            }
            return appleAdvertising.idfa;
        }
    };

    return appleAdvertising;
});
