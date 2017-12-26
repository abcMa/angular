angular.module('app.controllers').controller('onlinePaymentCorverPageCtrl', function(
    $scope, $params, $stateParams, modals)
{
    var ctrl = this;
    angular.extend(ctrl, {
        $scope: $scope,
        close: function(){
          modals.onlinePaymentCorverPage.close();
        }
    });

});
