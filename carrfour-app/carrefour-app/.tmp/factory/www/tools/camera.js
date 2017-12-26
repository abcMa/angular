/**
 * 摄像头辅助
 * 返回的图片都是base64 DATA_URL
 * 因为这样可以兼容所有设备
 */
angular.module('app.services')
    .factory('camera', ["api", "$ionicActionSheet", "$translate", function (api, $ionicActionSheet, $translate) {

        return {
            // 上传用户头像
            getPicture: function (width, height, buttonsType, totalPhoto) {
                if (!navigator.camera) {
                    return api.reject(false, $translate.instant("camera.openCameraFailure"));
                }
                var deferred = api.defer();
                var buttons = [{
                    type: Camera.PictureSourceType.CAMERA,
                    text: '<span class="action-sheet-text">' +
                        $translate.instant("camera.shoot") +
                        '</span>'
                }, {
                    type: Camera.PictureSourceType.PHOTOLIBRARY,
                    text: '<span class="action-sheet-text">' +
                        $translate.instant("camera.uploadByPhoto") +
                        '</span>'
                }];
                $ionicActionSheet.show({
                    buttons: buttons,
                    titleText: $translate.instant('camera.title'),
                    cancelText: $translate.instant('camera.cancel'),
                    buttonClicked: function (index) {
                        var options = {
                            quality: 50,
                            destinationType: Camera.DestinationType.DATA_URL,
                            encodingType: Camera.EncodingType.JPEG,
                            targetWidth: width,
                            targetHeight: height,
                            correctOrientation: true,
                            allowEdit: true,
                            sourceType: buttons[index].type
                        };

                        if(buttonsType === 'feedbackPhoto' && options.sourceType === 0){
                            CMPickPhoto.takePicture(320, 4, totalPhoto, false, onSuccessTakePicture);
                        } else {
                            navigator.camera.getPicture(onSuccess, onError, options);
                        }

                        // 头像上传
                        function onSuccess(imageData) {
                            var imageDataURI = "data:image/jpeg;base64," + imageData;
                            deferred.resolve({
                                data: imageDataURI
                            });
                        }

                        // 多张上传
                        function onSuccessTakePicture(imageData) {
                            var imageDataURI = [];
                            _(imageData).forEachRight(function(n) {
                                imageDataURI.push("data:image/jpeg;base64," + n);
                            }).value();

                            deferred.resolve({
                                data: imageDataURI
                            });
                        }

                        function onError(data) {
                            // deferred.reject(false, data);
                            deferred.reject(false, $translate.instant("camera.photoCancelled"));
                        }

                        return true;
                    }
                });

                return deferred.promise;
            }
        };
    }]);
