/**
 * 上传图片
 * 支持本地文件路径和DATA_URI
 */
angular.module('app.services')
    .factory('uploadImage', ["api", function (api) {

        return {

            // 选择图片 返回base64数据
            upload: function (serviceUrl, imageDataURI, params) {
                if (!FileTransfer) {
                    return api.reject(false, "FileTransfer is undefined");
                }
                var deferred = api.defer();
                var transfer = new FileTransfer();
                var options = new FileUploadOptions();
                options.fileKey = 'file';
                options.fileName = 'upload.jpg';
                options.mimeType = 'image/jpeg';
                options.params = params || {};
                options.headers = {
                    appkey: APP_CONFIG.appkey,
                    os: APP_CONFIG.os,
                    osVersion: APP_CONFIG.osVersion,
                    appVersion: APP_CONFIG.appVersion,
                    unique: APP_CONFIG.unique,
                    channel: APP_CONFIG.channel,
                    subsiteId: APP_CONFIG.subsiteId,
                    language: APP_CONFIG.language,
                    userid: APP_USER.id,
                    userSession: APP_USER.userSession
                };

                transfer.upload(imageDataURI, serviceUrl.replace("https", "http"),
                    function (data) {
                        var response = JSON.parse(data.response);
                        if (response.stateCode !== 0) {
                            deferred.reject(false, response);
                        } else {
                            deferred.resolve(response);
                        }
                    },
                    function (data) {
                        var response = JSON.parse(data.response);
                        deferred.reject(false, response);
                    }, options);

                return deferred.promise;
            }
        };
    }]);
