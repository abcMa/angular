angular.module('app.controllers').controller('storeMapCtrl', function (
    $scope, $params, toast, $translate, $timeout, loading
) {
    var ctrl = this;

    var amapUrl = "http://webapi.amap.com/maps?v=1.3&key=" + APP_CONFIG.amapAppKey + "&callback=AMapInitFunc";

    angular.extend(ctrl, {
        $scope: $scope,
        title: $params.storesName,
        name: $params.storesName,
        address: $params.storesAddress,
        openNavigation: function () {
            if (!window.launchnavigator) {
                toast.open($translate.instant('storeInfo.navigatorError'));
                return;
            }
            var lat = $params.storesCoordinatesVO.latitude;
            var lng = $params.storesCoordinatesVO.longitude;
            var naviParams = {
                app: launchnavigator.APP.USER_SELECT,
                appSelectionDialogHeader: $translate.instant('storeInfo.chooseNavigator'),
                appSelectionCancelButton: $translate.instant('storeInfo.cancel')
            };
            if ($params.start) {
                naviParams.start = $params.start;
            }
            launchnavigator.navigate([lat, lng], naviParams);
        },
    });

    var lat = $params.storesCoordinatesVO.latitude;
    var lng = $params.storesCoordinatesVO.longitude;
    var storeCoords = [lng, lat];

    // 初始化方法，用于amap回调
    window.AMapInitFunc = function () {
        // 创建地图
        var map = new AMap.Map('map-content', {
            resizeEnable: true,
            zoom: 18,
            center: storeCoords
        });

        // 增加标记
        var marker = new AMap.Marker({
            position: storeCoords,
            map: map
        });

        // 创建弹窗
        var panel = $(".map-info-panel");
        // 摘除原体
        // panel.remove();
        // 取消隐藏
        panel.show();
        var infoWindow = new AMap.InfoWindow({
            isCustom: true,
            content: panel[0],
            offset: new AMap.Pixel(0, -50)
        });
        infoWindow.open(map, marker.getPosition());
        loading.close();
        window.AMapInitFunc = undefined;
    };

    if (!window.AMap) {
        loading.open();
        $.ajax({
            url: amapUrl,
            type: "get",
            dataType: "script",
            timeout: 10000,
            error: function () {
                loading.close();
                toast.open($translate.instant('storeInfo.mapUnavailable'));
            }
        });
    } else {
        // 已经加载过了就手动init
        $timeout(function () {
            window.AMapInitFunc();
        }, 100);
    }

});
