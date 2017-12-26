/**
 * 店面相关接口
 */
angular.module('app.services').factory('storeService', ["api", "utils", function (
    api, utils
) {
    // 对照后台映射顺序
    var storeServiceEnum = ["atm", "bus", "card", "charge",
        "food", "onlinepay", "parking", "wifi",
        "luggage", "cash", "baby", "toyHouse",
        "gasStation", "petCare", "nursery", "disabledOnly",
        "electric"
    ];

    var storeService = {
        // 缓存列表
        cacheList: {},

        /**
         * 获取并缓存所有店面列表
         */
        init: function (city, type, currentCoords) {
            var self = this;
            return api.post('/storeInformation/storeInformationList').then(function (response) {
                var list = _.filter(response.data.storeInformationMap[city], {
                    "storeInformationTypeId": type
                });
                _.each(list, function (item) {
                    item.splitLabels = item.storesLabel.split(',');
                    if (currentCoords) {
                        var storeCoords = {
                            lat: parseFloat(item.storesCoordinatesVO.latitude),
                            lng: parseFloat(item.storesCoordinatesVO.longitude)
                        };
                        var distance = utils.getFlatternDistance(
                            utils.transformFromWGSToGCJ(currentCoords), storeCoords
                        );
                        // 距离 用来排序
                        item.distance = distance;

                        // 展示的距离文本
                        if (distance > 1000) {
                            var tmp = (distance / 1000).toFixed(1);
                            item.distanceStr = (tmp.indexOf(".0") > 0 ? tmp.slice(0, tmp.length - 2) : tmp) + "KM";
                        }
                        if (distance < 1000) {
                            item.distanceStr = distance.toFixed(0) + "M";
                        }
                    }
                });

                self.cacheList = list.sort(function (a, b) {
                    if (!(a.distance > 0 || a.distance < 0)) {
                        return 1;
                    }
                    if (!(b.distance > 0 || b.distance < 0)) {
                        return -1;
                    }
                    return a.distance - b.distance;
                });
                return api.when(self.cacheList);
            });

        },

        /**
         * 分页加载
         */
        getPage: function (page, pageCount) {
            var deferred = api.defer();
            var startIndex = (page - 1) * pageCount;
            var items = _.slice(this.cacheList, startIndex, startIndex + pageCount);
            var result = {
                pageIndex: page,
                totalItems: this.cacheList.length,
                items: items
            };
            setTimeout(function () {
                deferred.resolve({
                    data: result
                });
            });
            return deferred.promise;
        },

        /**
         * 根据店面id获取详细信息
         */
        info: function (id) {
            var deferred = api.defer();
            var params = {
                id: id
            };
            var store;
            api.post('/storeInformation/storeInformationDetails', params).success(function (response) {
                var store = response.storeInformationVO;
                var service = store.storesTagList.split(',');
                store.serviceTags = [];
                _.each(service, function (item) {
                    store.serviceTags.push(storeServiceEnum[item - 1]);
                });
                deferred.resolve({
                    data: store
                });
            });

            return deferred.promise;
        },

        /**
         * 根据店面id获取详细信息
         */
        getCityIdByCoords: function (coords) {
            var params = {
                latitude: coords.lat,
                longitude: coords.lng
            };
            return api.post('/storeInformation/getUserCityId', params).success(function (response) {
                response.coords = coords;
                return response;
            });
        }
    };

    return storeService;
}]);
