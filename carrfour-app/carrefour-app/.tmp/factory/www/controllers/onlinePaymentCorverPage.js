angular.module('app.controllers').controller('onlinePaymentCorverPageCtrl', ["$scope", "$params", "$stateParams", "modals", function(
    $scope, $params, $stateParams, modals)
{
    var ctrl = this;
    angular.extend(ctrl, {
        $scope: $scope,
        close: function(){
          modals.onlinePaymentCorverPage.close();
        }
    });

}]);
