/**
 * 选择地区，目前只能固定选择三级区域。
 *
 * ## params
 *
 * - mode {String} 标记业务线 'checkout' 或者 'member'
 * - live {Nunber} 最顶级区域设定
 * - successCallback {Function} 当选择成功后，将调用该回调函数，并传入所选择地区的 ID 及该地区路径数据。
 * - regions {Array<Object>} 地区信息数组，数组元素为对象，有两个属性：id 为地区 ID，name 为地区显示名称
 *
 * @example
 * modals.selectRegion.open({
 *     params: {
 *         mode: 'checkout',
 *         live: 0,
 *         successCallback: function(selectedRegionId, selectedRegionsList) { ... },
 *         regions: [
 *             { id: '12384', 'name': '北京' },
 *             { id: '12385', 'name': '北京市' },
 *             { id: '12386', 'name': '朝阳区' }
 *         ]
 *     }
 * });
 */
angular.module('app.controllers').controller('selectAddressRegionCtrl', ["$scope", "$params", "consigneeService", "memberConsigneeService", "errorHandling", "loading", "api", "$ionicScrollDelegate", "$ionicHistory", "$timeout", "memberCenterService", function (
    $scope, $params, consigneeService, memberConsigneeService, errorHandling, loading, api, $ionicScrollDelegate, $ionicHistory,
    $timeout, memberCenterService
) {

    var ctrl = this;

    $params = _.defaults({}, $params, {
        mode: 'checkout',
        live: 0,
        successCallback: _.noop,
        regions: []
    });

    $params.regions = [].concat($params.regions);

    // 当前正在编辑的地区
    var modifiedRegion = $params.regions.pop();

    // 使用的services
    var services = undefined;
    switch ($params.mode) {
        case 'checkout':
            services = consigneeService;
            break;
        case 'member':
            services = memberConsigneeService;
            break;
        case 'memberCard':
            services = memberCenterService;
            break;
        default:
            services = consigneeService;
            break;

    }

    angular.extend(ctrl, {

        $scope: $scope,

        // 当前需要显示的地区数据
        currentRegions: {},

        // 所选择的地区数据
        selectedRegionsList: $params.regions,

        // 缓存数据
        cache: {},

        locked: false,

        // 是否还有下级?
        hasNextLevel: true,

        getLastRegion: function () {
            return _.last(ctrl.selectedRegionsList);
        },

        getLastRegionId: function () {
            return _.get(ctrl.getLastRegion, 'id');
        },

        /**
         * 加载地区集合
         * @param parentRegionId {String} 父级地区 ID，若提供该参数，将加载该地区的所有子地区数据
         */
        loadRegionItems: function (parentRegionId) {
            var cacheData = ctrl.cache[parentRegionId || '_def'];

            if (cacheData) {
                ctrl.currentRegions = cacheData;
                return api.when(cacheData)
                    .finally(function () {
                        resizeScroll();
                        updateSelected();
                    });
            } else {
                loading.open();
                return services.region(parentRegionId)
                    .error(errorHandling)
                    .success(function (data) {
                        ctrl.currentRegions = data;
                        ctrl.cache[parentRegionId || '__def'] = data;
                    }).finally(function () {
                        resizeScroll();
                        updateSelected();
                        loading.close();
                    });
            }
        },

        selectRegion: function (selectedRegion) {
            loading.open();
            if (ctrl.locked) {
                return;
            }
            ctrl.locked = true;
            ctrl.selectedRegionsList.push(selectedRegion);

            ctrl.hasNextLevel = false;
            ctrl.loadRegionItems(selectedRegion.id).success(function (data) {
                if (!data || !data.length) {
                    ctrl.quit();
                } else {
                    ctrl.hasNextLevel = true;
                }
                loading.close();
                ctrl.locked = false;
            });
        },

        getSiblingsRegions: function (region) {
            ctrl.selectedRegionsList = _.take(ctrl.selectedRegionsList, _.findIndex(ctrl.selectedRegionsList, region));
            modifiedRegion = region;
            ctrl.loadRegionItems(region.parentId);
        },

        quit: function () {
            $params.successCallback(ctrl.getLastRegionId(), ctrl.selectedRegionsList);
            $scope.modals.selectAddressRegion.close();
        }
    });

    function resizeScroll() {
        $timeout(function () {
            var oldHistoryId = $scope.$historyId;
            $scope.$historyId = $ionicHistory.currentHistoryId();
            var scrollDelegate = $ionicScrollDelegate.$getByHandle('selectAddressRegionScroll');
            scrollDelegate.resize();
            scrollDelegate.scrollTop(false);
            $scope.$historyId = oldHistoryId;
        });
    }

    function updateSelected() {
        if (!modifiedRegion) {
            return;
        }
        _.map(ctrl.currentRegions, function (region) {
            region.selected = region.id == modifiedRegion.id;
        });
    }

    ctrl.loadRegionItems(ctrl.getLastRegion() ? ctrl.getLastRegion().id : $params.live);
}]);
