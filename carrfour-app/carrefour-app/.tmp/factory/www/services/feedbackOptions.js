/**
 * 封装app引导好评接口
 */
angular.module('app.services').factory('feedbackOptionsServers', ["$http", "api", "$translate", "localStorage", "messageCenter", function(
    $http, api, $translate, localStorage, messageCenter
) {
    return {

        /**
         * 获取反馈原因列表
         */
        feedbackOptions: function() {
            
            return api.get('/appComment/findFeedbackReason');
        },

        /**
         * 意见反馈提交
         * @param id	{num}	反馈类型id
         * @param name	{String}	反馈类型名称
         * @param sort	{num}	排序(排序1为默认展示)
         * @param pics	{num}	图片id
         */
         submitFeedOpinion: function(param) {
             return api.post('/appComment/addMemberRecommend', param);
         }
    };
}]);
