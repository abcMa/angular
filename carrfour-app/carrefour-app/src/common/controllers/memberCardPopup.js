angular.module('app.controllers').controller('memberCardPopupCtrl', function(
    $scope, $params, activityService, loadDataMixin, stateUtils, modals, $state
) {

    var ctrl = this;

    _.assign(ctrl, loadDataMixin, stateUtils, {
        $scope: $scope,

        title: $params.title,
        content: $params.content,
        selectA: $params.selectA,
        selectB: $params.selectB,
        cancel: $params.cancel,
        selectFunA: function(){
            modals.memberCardPopup.close();
            modals.registerMemberCard.open();
        },

        selectFunB: function(){
            modals.memberCardPopup.close();
            $state.go("tabs.bindMemberCard");
        }

    });

});