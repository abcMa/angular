angular.module('app.controllers').controller('carrefourCardInstructionCtrl', function (
    $scope, $state, $params, errorHandling, modals, payService, loadDataMixin, $timeout
) {

    var ctrl = this;

    $params = _.defaults({}, $params, {
        goNextStep: _.noop
    });

    _.assign(ctrl, {
        $scope: $scope,

        nextStep: function () {
            modals.carrefourCardInstruction.close();
            $params.goNextStep();
        }
    });
});
