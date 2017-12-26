angular.module('app.controllers').controller('articlePromptCtrl', function(
    $scope, $params, activityService, loadDataMixin, stateUtils
) {

    var ctrl = this;

    _.assign(ctrl, loadDataMixin, stateUtils, {
        $scope: $scope,

        title: $params.title,

        id: $params.id,

        loadData: function() {

            return activityService.getActivityInfo(ctrl.id)
                .then(function(response) {
                    var $html = $('<div>' + response.data + '</div>');

                    $html.find('script').remove();
                    response.data = $html[0].outerHTML;

                    return  response;
                });
        }

    });

    ctrl.init();

});
