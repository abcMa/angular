angular.module('app.controllers').controller('customerServiceArticleListCtrl', function (
    $scope, errorHandling, customerService, $state, $stateParams, modals
) {

    var ctrl = this;

    angular.extend(ctrl, {
        $scope: $scope,

        title: $stateParams.title,

        articles: [],

        init: function () {
            customerService.getArticleListByChannelId($stateParams.channelId)
                .then(function (articles) {
                    ctrl.articles = articles;
                });
        },

        openArticle: function (articleId, title) {
            modals.article.open({
                params: {
                    articleId: articleId,
                    title: title
                }
            });
        }

    });

    ctrl.init();
});
