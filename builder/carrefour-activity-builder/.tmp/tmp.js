window._activityLoader(function($scope, stateUtils, toast, api, cartService, modals) {
    var ctrl = this;
    $scope.ctrl = ctrl;
    var pics = {
        "zh-CN": {
            url1: "http://www.carrefour.cn/assets/upload/appActivityPic/dalian_app/img_01.png",
            url2: "http://www.carrefour.cn/assets/upload/appActivityPic/dalian_app/img_02.png",
            url3: "http://www.carrefour.cn/assets/upload/appActivityPic/dalian_app/img_03.png",
            url4: "http://www.carrefour.cn/assets/upload/appActivityPic/dalian_app/img_04.png",
            url5: "http://www.carrefour.cn/assets/upload/appActivityPic/dalian_app/img_05.png",
            url6: "http://www.carrefour.cn/assets/upload/appActivityPic/dalian_app/img_06.png",
            url7: "http://www.carrefour.cn/assets/upload/appActivityPic/dalian_app/img_07.png",
            url8: "http://www.carrefour.cn/assets/upload/appActivityPic/dalian_app/img_08.png",
            url9: "http://www.carrefour.cn/assets/upload/appActivityPic/dalian_app/img_09.png"
        },
        en: {
            url1: "http://www.carrefour.cn/assets/upload/appActivityPic/dalian_app/img_en_01.png",
            url2: "http://www.carrefour.cn/assets/upload/appActivityPic/dalian_app/img_en_02.png",
            url3: "http://www.carrefour.cn/assets/upload/appActivityPic/dalian_app/img_en_03.png",
            url4: "http://www.carrefour.cn/assets/upload/appActivityPic/dalian_app/img_en_04.png",
            url5: "http://www.carrefour.cn/assets/upload/appActivityPic/dalian_app/img_en_05.png",
            url6: "http://www.carrefour.cn/assets/upload/appActivityPic/dalian_app/img_en_06.png",
            url7: "http://www.carrefour.cn/assets/upload/appActivityPic/dalian_app/img_en_07.png",
            url8: "http://www.carrefour.cn/assets/upload/appActivityPic/dalian_app/img_en_08.png",
            url9: "http://www.carrefour.cn/assets/upload/appActivityPic/dalian_app/img_en_09.png"
        }
    };
    _.assign(ctrl, stateUtils, {
        getPics: function() {
            return pics[APP_CONFIG.language]
        },
        goProductInfo: function(productsId, goodsId, name, fromLocation) {
            stateUtils.goProductInfo(productsId, goodsId, name, fromLocation)
        }
    })
});